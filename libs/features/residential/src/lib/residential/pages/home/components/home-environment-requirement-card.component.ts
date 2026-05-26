import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  HomeEnvironmentRequirementViewModel,
  HomeEnvironmentStatus,
  HomeEnvironmentSeverity,
  HomeEnvironmentRuleCode,
  UpsertHomeEnvironmentReviewInput,
} from '@hhsc-compliance/shared-models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'lib-home-environment-requirement-card',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <button type="button" class="summary" (click)="expanded.set(!expanded())">
        <div class="left">
          <div class="citation">{{ item.definition.citation }}</div>
          <div class="title">{{ item.definition.title }}</div>
          <div class="desc">{{ item.definition.description }}</div>
        </div>

        <div class="right">
          <span class="badge" [ngClass]="badgeClass(item.review?.status ?? 'NOT_STARTED')">
            {{ item.review?.status ?? 'NOT_STARTED' }}
          </span>
          <div class="meta">
            Evidence: {{ item.review?.evidenceCount ?? 0 }}
          </div>
        </div>
      </button>

      <div class="body" *ngIf="expanded()">
        <form [formGroup]="form" class="grid" (ngSubmit)="save()">
          <label>
            Status
            <select formControlName="status">
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="COMPLIANT">COMPLIANT</option>
              <option value="WARNING">WARNING</option>
              <option value="NONCOMPLIANT">NONCOMPLIANT</option>
            </select>
          </label>

          <label>
            Severity
            <select formControlName="severity">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </label>

          <label>
            Observed on
            <input type="date" formControlName="observedOn" />
          </label>

          <label>
            Reviewer
            <input type="text" formControlName="reviewerName" />
          </label>

          <label class="span2">
            Notes
            <textarea formControlName="notes"></textarea>
          </label>

          <label class="span2">
            Findings
            <textarea formControlName="findings"></textarea>
          </label>

          <label class="span2">
            Corrective action
            <textarea formControlName="correctiveAction"></textarea>
          </label>

          <label>
            Follow-up due
            <input type="date" formControlName="followUpDue" />
          </label>

          <label>
            Resolved on
            <input type="date" formControlName="resolvedOn" />
          </label>

          <div class="actions span2">
            <button type="button" (click)="addEvidence.emit(item.definition.ruleCode)">
              Add Evidence
            </button>
            <button type="submit">Save Review</button>
          </div>
        </form>
      </div>
    </article>
  `,
  styles: [`
    .card {
      border: 1px solid var(--clr-line, #e5e7eb);
      border-radius: 16px;
      background: var(--clr-card, #fff);
      overflow: hidden;
      margin-bottom: 12px;
    }

    .summary {
      width: 100%;
      border: 0;
      background: transparent;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 16px;
      text-align: left;
      cursor: pointer;
    }

    .left {
      min-width: 0;
    }

    .citation {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .desc {
      font-size: 13px;
      color: #4b5563;
    }

    .right {
      display: grid;
      gap: 8px;
      justify-items: end;
      min-width: 180px;
    }

    .badge {
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
    }

    .badge-ok { background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .badge-bad { background: #fee2e2; color: #991b1b; }
    .badge-none { background: #f3f4f6; color: #374151; }

    .meta {
      font-size: 12px;
      color: #6b7280;
    }

    .body {
      border-top: 1px solid #e5e7eb;
      padding: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .span2 {
      grid-column: span 2;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
      color: #6b7280;
    }

    input, select, textarea {
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 10px 12px;
    }

    textarea {
      min-height: 96px;
      resize: vertical;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .summary {
        display: grid;
      }

      .right {
        justify-items: start;
        min-width: 0;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .span2 {
        grid-column: auto;
      }
    }
  `],
})
export class HomeEnvironmentRequirementCardComponent {
  @Input({ required: true }) locationId!: string;
  @Input({ required: true }) item!: HomeEnvironmentRequirementViewModel;

  @Output() saveReview = new EventEmitter<UpsertHomeEnvironmentReviewInput>();
  @Output() addEvidence = new EventEmitter<HomeEnvironmentRuleCode>();

  readonly expanded = signal(false);

  readonly form = new FormGroup({
    status: new FormControl<HomeEnvironmentStatus>('NOT_STARTED', { nonNullable: true }),
    severity: new FormControl<HomeEnvironmentSeverity>('LOW', { nonNullable: true }),
    observedOn: new FormControl<string | null>(null),
    reviewerName: new FormControl<string | null>(null),
    notes: new FormControl<string | null>(null),
    findings: new FormControl<string | null>(null),
    correctiveAction: new FormControl<string | null>(null),
    followUpDue: new FormControl<string | null>(null),
    resolvedOn: new FormControl<string | null>(null),
  });

  ngOnChanges(): void {
    const review = this.item.review;
    this.form.patchValue({
      status: review?.status ?? 'NOT_STARTED',
      severity: review?.severity ?? this.item.definition.defaultSeverity,
      observedOn: review?.observedOn ?? null,
      reviewerName: review?.reviewerName ?? null,
      notes: review?.notes ?? null,
      findings: review?.findings ?? null,
      correctiveAction: review?.correctiveAction ?? null,
      followUpDue: review?.followUpDue ?? null,
      resolvedOn: review?.resolvedOn ?? null,
    }, { emitEvent: false });
  }

  badgeClass(status: HomeEnvironmentStatus): string {
    switch (status) {
      case 'COMPLIANT':
        return 'badge-ok';
      case 'WARNING':
        return 'badge-warn';
      case 'NONCOMPLIANT':
        return 'badge-bad';
      default:
        return 'badge-none';
    }
  }

  save(): void {
    const v = this.form.getRawValue();
    this.saveReview.emit({
      locationId: this.locationId,
      ruleCode: this.item.definition.ruleCode,
      status: v.status,
      severity: v.severity,
      observedOn: v.observedOn ?? null,
      reviewerName: v.reviewerName?.trim() || null,
      notes: v.notes?.trim() || null,
      findings: v.findings?.trim() || null,
      correctiveAction: v.correctiveAction?.trim() || null,
      followUpDue: v.followUpDue ?? null,
      resolvedOn: v.resolvedOn ?? null,
    });
  }
}