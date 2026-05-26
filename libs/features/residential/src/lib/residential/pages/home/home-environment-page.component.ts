import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';

import { HomeEnvironmentApi } from  '@hhsc-compliance/data-access';
import {
  CreateHomeEnvironmentEvidenceInput, 
  HomeEnvironmentRequirementReview,
  HomeEnvironmentRequirementViewModel,
  HomeEnvironmentRuleCode,
  HomeEnvironmentSummary,
  UpsertHomeEnvironmentReviewInput,
  HOME_ENVIRONMENT_REQUIREMENTS,
} from '@hhsc-compliance/shared-models';

import { HomeEnvironmentEvidenceSheetComponent } from './components/home-environment-evidence-sheet.component';
import { HomeEnvironmentSummaryComponent } from './components/home-environment-summary.component';
import { HomeEnvironmentRequirementCardComponent } from './components/home-environment-requirement-card.component';

@Component({
  standalone: true,
  selector: 'lib-home-environment-page',
  imports: [
    CommonModule,
    HomeEnvironmentEvidenceSheetComponent,
    HomeEnvironmentSummaryComponent,
    HomeEnvironmentRequirementCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="pageHead">
        <div>
          <h1>Home & Environment</h1>
          <p>
            TAC §565.23(b) — residence condition, hazards, furnishings, sanitation, and safety.
          </p>
          <div class="subtle">
            Location:
            <code>{{ locationId() || '—' }}</code>
          </div>
        </div>

        <div class="actions">
          <button type="button" (click)="reload()" [disabled]="loading()">
            Refresh
          </button>
        </div>
      </header>

      <div *ngIf="message()" class="message">
        {{ message() }}
      </div>

      <lib-home-environment-summary
        [total]="summary().total"
        [compliant]="summary().compliant"
        [warning]="summary().warning"
        [nonCompliant]="summary().noncompliant"
      />

      <div *ngIf="loading()" class="loading">Loading requirements...</div>

      <section *ngIf="!loading()" class="list">
        <lib-home-environment-requirement-card
          *ngFor="let item of items(); trackBy: trackByRuleCode"
          [locationId]="locationId()"
          [item]="item"
          (saveReview)="onSaveReview($event)"
          (addEvidence)="openEvidence($event)"
        />
      </section>

      <lib-home-environment-evidence-sheet
        *ngIf="evidenceRuleCode()"
        [locationId]="locationId()"
        [ruleCode]="evidenceRuleCode()!"
        (closed)="closeEvidence()"
        (submitted)="onCreateEvidence($event)"
      />
    </section>
  `,
  styles: [`
    .page {
      display: grid;
      gap: 16px;
    }

    .pageHead {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    h1 {
      margin: 0 0 4px;
      font-size: 24px;
      font-weight: 800;
      color: var(--clr-text-strong, #111827);
    }

    p {
      margin: 0 0 6px;
      color: var(--clr-text-muted, #4b5563);
    }

    .subtle {
      font-size: 12px;
      color: #6b7280;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #d1d5db;
      background: #fff;
      cursor: pointer;
    }

    .message {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #991b1b;
    }

    .loading {
      color: #6b7280;
    }

    .list {
      display: grid;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .pageHead {
        display: grid;
      }
    }
  `],
})
export class HomeEnvironmentPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(HomeEnvironmentApi);

  readonly locationId = signal<string>('');
  readonly loading = signal(false);
  readonly message = signal('');
  readonly reviews = signal<HomeEnvironmentRequirementReview[]>([]);
  readonly evidenceRuleCode = signal<HomeEnvironmentRuleCode | null>(null);

  readonly items = computed<HomeEnvironmentRequirementViewModel[]>(() => {
    const reviewsByRule = new Map(
      this.reviews().map((review) => [review.ruleCode, review] as const),
    );

    return HOME_ENVIRONMENT_REQUIREMENTS
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((definition) => ({
        definition,
        review: reviewsByRule.get(definition.ruleCode) ?? null,
      }));
  });

readonly summary = computed<HomeEnvironmentSummary>(() => {
  const items = this.items();

  const compliant = items.filter((x) => x.review?.status === 'COMPLIANT').length;
  const warning = items.filter((x) => x.review?.status === 'WARNING').length;
  const noncompliant = items.filter((x) => x.review?.status === 'NONCOMPLIANT').length;
  const notStarted = items.filter(
    (x) => !x.review || x.review.status === 'NOT_STARTED',
  ).length;

  const updatedValues = items
    .map((x) => x.review?.updatedAt ?? null)
    .filter((x): x is string => !!x)
    .sort();

  const lastUpdated =
    updatedValues.length > 0
      ? updatedValues[updatedValues.length - 1]
      : null;

  return {
    total: items.length,
    compliant,
    warning,
    noncompliant,
    notStarted,
    lastUpdated,
  };
});

  constructor() {
    const id = String(this.route.snapshot.paramMap.get('locationId') ?? '').trim();
    this.locationId.set(id);
    this.reload();
  }

  trackByRuleCode(_: number, item: HomeEnvironmentRequirementViewModel): string {
    return item.definition.ruleCode;
  }

  reload(): void {
    const locationId = this.locationId();

    if (!locationId) {
      this.message.set('Missing locationId in route.');
      this.reviews.set([]);
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.api
      .listReviews(locationId)
      .pipe(
        tap((reviews) => this.reviews.set(Array.isArray(reviews) ? reviews : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Failed to load Home & Environment reviews (${code}).`);
          this.reviews.set([]);
          return of([] as HomeEnvironmentRequirementReview[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  onSaveReview(input: UpsertHomeEnvironmentReviewInput): void {
    this.loading.set(true);
    this.message.set('');

    this.api
      .upsertReview(input)
      .pipe(
        switchMap(() => this.api.listReviews(this.locationId())),
        tap((reviews) => this.reviews.set(Array.isArray(reviews) ? reviews : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Failed to save review (${code}).`);
          return of([] as HomeEnvironmentRequirementReview[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  openEvidence(ruleCode: HomeEnvironmentRuleCode): void {
    this.evidenceRuleCode.set(ruleCode);
  }

  closeEvidence(): void {
    this.evidenceRuleCode.set(null);
  }

  onCreateEvidence(input: CreateHomeEnvironmentEvidenceInput): void {
    this.loading.set(true);
    this.message.set('');

    this.api
      .createEvidence(input)
      .pipe(
        tap(() => this.closeEvidence()),
        switchMap(() => this.api.listReviews(this.locationId())),
        tap((reviews) => this.reviews.set(Array.isArray(reviews) ? reviews : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Failed to create evidence (${code}).`);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}