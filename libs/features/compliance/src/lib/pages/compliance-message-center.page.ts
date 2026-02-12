import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ComplianceResultsApi, ResidentialLocationsApi } from '@hhsc-compliance/data-access';
import { ComplianceResultDto, ResidentialLocationDto } from '@hhsc-compliance/shared-models';

type ModuleKey =
  | 'RESIDENTIAL'
  | 'PROGRAMMATIC'
  | 'FINANCES_RENT'
  | 'BEHAVIOR_SUPPORT'
  | 'ANE'
  | 'RESTRAINTS'
  | 'ENCLOSED_BEDS'
  | 'PROTECTIVE_DEVICES'
  | 'PROHIBITIONS'
  | 'ISS';

type StatusFilter = 'ALL' | 'NON_COMPLIANT' | 'UNKNOWN' | 'COMPLIANT';

type Vm = {
  loading: boolean;
  results: ComplianceResultDto[];
};

@Component({
  standalone: true,
  selector: 'lib-compliance-message-center-page',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mc">
      <header class="mc__head">
        <div class="mc__title">
          <h2>Compliance Message Center</h2>

          <div class="mc__meta" *ngIf="locationId || module">
            <span class="pill" *ngIf="locationId">locationId: {{ locationId }}</span>
            <span class="pill" *ngIf="module">module: {{ module }}</span>
            <span class="pill" *ngIf="statusFilter && statusFilter !== 'ALL'">status: {{ statusFilter }}</span>
          </div>
        </div>

        <div class="mc__filters">
          <label>
            <span>Location</span>
            <select
              [(ngModel)]="locationId"
              (ngModelChange)="onLocationChange($event)"
              [disabled]="(locations$ | async)?.length === 0"
            >
              <option *ngFor="let l of (locations$ | async) ?? []" [value]="l.id">
                {{ label(l) }}
              </option>
            </select>
          </label>

          <label>
            <span>Module</span>
            <select [(ngModel)]="module" (ngModelChange)="onModuleChange($event)">
              <option *ngFor="let m of modules" [value]="m">{{ m }}</option>
            </select>
          </label>

          <label>
            <span>Status</span>
            <select [(ngModel)]="statusFilter" (ngModelChange)="onStatusChange($event)">
              <option value="ALL">All</option>
              <option value="NON_COMPLIANT">Non-compliant</option>
              <option value="UNKNOWN">Unknown</option>
              <option value="COMPLIANT">Compliant</option>
            </select>
          </label>
        </div>
      </header>

      <div class="msg msg--warn" *ngIf="message">{{ message }}</div>

      <ng-container *ngIf="vm$ | async as vm">
        <div class="msg msg--info" *ngIf="vm.loading === true">Loading…</div>

        <div class="mc__list">
          <div class="empty" *ngIf="vm.results.length === 0 && vm.loading === false">
            No results found.
          </div>

          <article class="row" *ngFor="let r of vm.results" [class]="severityClass(r)">
            <div class="row__main">
              <div class="row__top">
                <strong class="rule">{{ r.ruleCode }}</strong>
                <span class="chip">{{ r.status }}</span>
                <span class="chip">{{ r.severity }}</span>
              </div>

              <div class="row__sub">
                <span>{{ r.module }}</span>
                <span *ngIf="r.subcategory">• {{ r.subcategory }}</span>
              </div>

              <p class="row__msg" *ngIf="r.message">{{ r.message }}</p>
            </div>

            <div class="row__actions">
              <button type="button" (click)="openDeepLink(r)" [disabled]="!r.routeCommands?.length">
                Go to item
              </button>
            </div>
          </article>
        </div>
      </ng-container>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .mc {
        padding: 16px;
        display: grid;
        gap: 12px;
      }

      .mc__head {
        display: grid;
        gap: 12px;
      }

      .mc__title {
        display: grid;
        gap: 6px;
      }

      .mc__filters {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: end;
      }

      label {
        display: grid;
        gap: 6px;
      }

      select {
        min-width: 220px;
        max-width: 100%;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        background: #fff;
        color: #111827;
      }

      .pill {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 999px;
        background: #eee;
        margin-right: 8px;
        font-size: 12px;
        color: #111827;
      }

      .msg {
        margin-top: 2px;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 14px;
        color: #111827;
      }

      .msg--warn {
        background: #fff3cd;
      }
      .msg--info {
        background: #eef2ff;
      }

      .mc__list {
        display: grid;
        gap: 10px;
        margin-top: 6px;
      }

      .row {
        position: relative;
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fff;
        color: #111827;
      }

      .row::before,
      .row::after {
        pointer-events: none !important;
      }

      .row.sev-critical {
        border-left: 4px solid #dc2626;
      }
      .row.sev-high {
        border-left: 4px solid #ef4444;
      }
      .row.sev-med {
        border-left: 4px solid #f59e0b;
      }
      .row.sev-low {
        border-left: 4px solid #16a34a;
      }

      .row__top {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }

      .rule {
        font-weight: 800;
      }

      .chip {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 999px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
      }

      .row__sub {
        color: #4b5563;
        font-size: 13px;
        margin-top: 4px;
      }

      .row__msg {
        margin: 8px 0 0;
      }

      .row__actions,
      .row__actions button {
        position: relative;
        z-index: 5;
      }

      .row__actions button {
        appearance: none;
        -webkit-appearance: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        padding: 8px 12px;
        border-radius: 10px;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        color: #111827 !important;
        font-weight: 700 !important;
        opacity: 1 !important;
        visibility: visible !important;
        cursor: pointer;
        line-height: 1.1;
      }

      .row__actions button:hover {
        background: #f3f4f6 !important;
      }

      .row__actions button:disabled {
        opacity: 0.55 !important;
        cursor: not-allowed;
      }

      .empty {
        margin-top: 8px;
        color: #6b7280;
      }
    `,
  ],
})
export class ComplianceMessageCenterPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly resultsApi = inject(ComplianceResultsApi);
  private readonly locationsApi = inject(ResidentialLocationsApi);
  private readonly destroyRef = inject(DestroyRef);

  modules: ModuleKey[] = [
    'RESIDENTIAL',
    'PROGRAMMATIC',
    'FINANCES_RENT',
    'BEHAVIOR_SUPPORT',
    'ANE',
    'RESTRAINTS',
    'ENCLOSED_BEDS',
    'PROTECTIVE_DEVICES',
    'PROHIBITIONS',
    'ISS',
  ];

  // ngModel bindings
  locationId = '';
  module: ModuleKey = 'RESIDENTIAL';
  statusFilter: StatusFilter = 'ALL';

  message = '';

  readonly locations$ = this.locationsApi.list().pipe(
    map((rows) => (Array.isArray(rows) ? rows : [])),
    shareReplay(1),
    catchError((err) => {
      console.error('[locations] failed', err);
      this.message = `Failed to load locations (${err?.status ?? 'unknown'}).`;
      return of([] as ResidentialLocationDto[]);
    }),
  );

  private readonly qp$ = this.route.queryParamMap.pipe(
    map((qp) => ({
      locationId: qp.get('locationId') ?? '',
      module: (qp.get('module') ?? '').toUpperCase(),
      status: (qp.get('status') ?? 'ALL').toUpperCase(),
    })),
    distinctUntilChanged(
      (a, b) => a.locationId === b.locationId && a.module === b.module && a.status === b.status,
    ),
    shareReplay(1),
  );

  readonly vm$ = combineLatest([this.locations$, this.qp$]).pipe(
    map(([locations, q]) => {
      const module = this.toModuleKey(q.module) ?? 'RESIDENTIAL';
      const status = this.toStatusFilter(q.status) ?? 'ALL';
      const locationId = q.locationId || (locations[0]?.id ?? '');
      return { locations, locationId, module, status };
    }),
    tap(({ locationId, module, status }) => {
      this.locationId = locationId;
      this.module = module;
      this.statusFilter = status;
      this.message = locationId ? '' : 'Select a location.';
    }),

    // ✅ FIX: build params WITHOUT undefined keys (prevents ?status=undefined / ?subcategory=undefined)
    switchMap(({ locationId, module, status }) => {
      if (!locationId) return of({ loading: false, results: [] } as Vm);

      const params: { locationId: string; module: string; status?: string } = {
        locationId,
        module,
      };
      if (status !== 'ALL') params.status = status;

      return this.resultsApi.list(params).pipe(
        map((rows) => ({ loading: false, results: Array.isArray(rows) ? rows : [] } as Vm)),
        catchError((err) => {
          console.error('[compliance-results] failed', err);
          this.message =
            err?.error?.message
              ? `Failed: ${err.error.message}`
              : `Failed to load results (${err?.status ?? 'unknown'}).`;
          return of({ loading: false, results: [] } as Vm);
        }),
        startWith({ loading: true, results: [] } as Vm),
      );
    }),

    shareReplay(1),
  );

  constructor() {
    combineLatest([this.locations$, this.qp$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([locations, q]) => {
        if (!q.locationId && locations.length) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              locationId: locations[0].id,
              module: this.toModuleKey(q.module) ?? 'RESIDENTIAL',
              status: this.toStatusFilter(q.status) ?? 'ALL',
            },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
      });
  }

  onLocationChange(v: string) {
    this.navigateParams({ locationId: v || '' });
  }

  onModuleChange(v: string) {
    this.navigateParams({ module: this.toModuleKey(v) ?? 'RESIDENTIAL' });
  }

  onStatusChange(v: string) {
    this.navigateParams({ status: this.toStatusFilter(v) ?? 'ALL' });
  }

  private navigateParams(patch: Partial<{ locationId: string; module: ModuleKey; status: StatusFilter }>) {
    const next = {
      locationId: patch.locationId ?? this.locationId,
      module: patch.module ?? this.module,
      status: patch.status ?? this.statusFilter,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: next,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  openDeepLink(r: ComplianceResultDto) {
  const commands = this.buildDeepLinkCommands(r);

  console.log('[deep-link click]', {
    rule: r.ruleCode,
    storedRouteCommands: r.routeCommands,
    computedRouteCommands: commands,
    queryParams: r.queryParams,
  });

  if (!commands?.length) {
    console.warn('[deep-link] Missing/invalid deep link for', r.ruleCode);
    return;
  }

  this.router
    .navigate(commands as any, { queryParams: r.queryParams ?? {} })
    .then((ok) => {
      if (!ok) console.error('[deep-link] Navigation failed (no matching route)', commands);
    })
    .catch((err) => console.error('[deep-link] Navigation error', err));
}

private buildDeepLinkCommands(r: ComplianceResultDto): (string | number)[] | null {
  // Only deep link residential rules here
  if (r.entityType !== 'RESIDENTIAL') return null;

  // You MUST have a locationId if your routes are location-scoped
  if (!r.locationId) return ['/', 'compliance', 'residential']; // safe fallback

  // Rule → route mapping
  switch (r.ruleCode) {
    case '565.23(b)(5)':
      // Your route is: /compliance/residential/location/:locationId/emergency/fire-drills
      return ['/', 'compliance', 'residential', 'location', r.locationId, 'emergency', 'fire-drills'];

    default:
      return ['/', 'compliance', 'residential', 'location', r.locationId, 'overview'];
  }
}



  private sanitizeQueryParams(qp: Record<string, any>): Record<string, any> {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(qp ?? {})) {
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' && v.trim() === '') continue;
      out[k] = v;
    }
    return out;
  }


  label(r: ResidentialLocationDto): string {
    const code = (r.locationCode || '').trim();
    const name = (r.name || '').trim();
    return code && name ? `${code} — ${name}` : name || code || 'Unnamed';
  }

  private toModuleKey(v: any): ModuleKey | null {
    const up = String(v ?? '').trim().toUpperCase() as ModuleKey;
    return (this.modules as string[]).includes(up) ? up : null;
  }

  private toStatusFilter(v: any): StatusFilter | null {
    const up = String(v ?? '').trim().toUpperCase();
    return up === 'ALL' || up === 'COMPLIANT' || up === 'NON_COMPLIANT' || up === 'UNKNOWN'
      ? (up as StatusFilter)
      : null;
  }



  severityClass(r: ComplianceResultDto): string {
    const sev = String((r as any).severity ?? '').toUpperCase();
    if (sev === 'CRITICAL') return 'sev-critical';
    if (sev === 'HIGH') return 'sev-high';
    if (sev === 'MED') return 'sev-med';
    if (sev === 'LOW') return 'sev-low';
    return '';
  }
}
