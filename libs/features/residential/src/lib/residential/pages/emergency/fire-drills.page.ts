import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
  catchError,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FireDrillsApi } from '@hhsc-compliance/data-access';
import { FireDrillLogDto } from '@hhsc-compliance/shared-models';

type TabKey = 'requirements' | 'logs' | 'evidence';

type FireDrillOutcome = 'SUCCESS' | 'ISSUES';



type CreateFireDrillLogInput = {
  locationId: string;
  occurredAt: string; // ISO
  sleepingHours: boolean;
  staffPresent: string;
  evacuationTimeSec?: number | null;
  outcome: FireDrillOutcome;
  issues?: string | null;
  correctiveAction?: string | null;
};

type DrillCheck = {
  ruleCode: string;
  title: string;
  description: string;
  ok: boolean;
  detail: string;
};

type Vm = {
  locationId: string;
  tab: TabKey;
  focus: string;

  loading: boolean;
  logs: FireDrillLogDto[];

  checks: DrillCheck[];
};

@Component({
  standalone: true,
  selector: 'lib-fire-drills-page',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="card head">
        <div>
          <div class="h2">Fire Drills</div>
          <div class="sub">TAC §565.23(e) — drill frequency, sleeping-hours drills, staff participation, corrective actions.</div>
          <div class="meta" *ngIf="(vm$ | async)?.locationId as id">
            <span class="pill">locationId: {{ id }}</span>
          </div>
        </div>

        <div class="tabs">
          <button type="button" class="tab" [class.tab--on]="tab === 'requirements'" (click)="setTab('requirements')">
            Requirements
          </button>
          <button type="button" class="tab" [class.tab--on]="tab === 'logs'" (click)="setTab('logs')">
            Logs
          </button>
          <button type="button" class="tab" [class.tab--on]="tab === 'evidence'" (click)="setTab('evidence')">
            Evidence
          </button>
        </div>
      </header>

      <div class="msg msg--warn" *ngIf="message">{{ message }}</div>

      <ng-container *ngIf="vm$ | async as vm">
        <div class="msg msg--info" *ngIf="vm.loading">Loading…</div>

        <!-- REQUIREMENTS -->
        <section class="card" *ngIf="vm.tab === 'requirements'">
          <div class="h3">Requirements (auto-evaluated from logs)</div>
          <div class="reqs">
            <article
              class="req"
              *ngFor="let c of vm.checks"
              [attr.data-focus-id]="focusId(c.ruleCode)"
              [id]="focusId(c.ruleCode)"
              [class.req--bad]="!c.ok"
              [class.req--ok]="c.ok"
            >
              <div class="req__top">
                <strong class="rule">{{ c.ruleCode }}</strong>
                <span class="chip" [class.chip--bad]="!c.ok" [class.chip--ok]="c.ok">
                  {{ c.ok ? 'Compliant' : 'Non-compliant' }}
                </span>
              </div>

              <div class="req__title">{{ c.title }}</div>
              <div class="req__desc">{{ c.description }}</div>
              <div class="req__detail">{{ c.detail }}</div>

              <div class="req__actions">
                <button type="button" class="btn" (click)="setTab('logs')">Go to logs</button>
              </div>
            </article>
          </div>
        </section>

        <!-- LOGS -->
        <section class="card" *ngIf="vm.tab === 'logs'">
          <div class="row">
            <div>
              <div class="h3">Fire Drill Log</div>
              <div class="sub">Add drills here to resolve compliance issues and produce survey-ready evidence.</div>
            </div>
            <button type="button" class="btn btn--primary" (click)="toggleCreate()">
              {{ showCreate ? 'Close' : '+ Add drill' }}
            </button>
          </div>

          <form class="form" *ngIf="showCreate" [formGroup]="form" (ngSubmit)="create(vm.locationId)">
            <div class="grid">
              <label>
                <span>Date/Time</span>
                <input type="datetime-local" formControlName="occurredAtLocal" />
              </label>

              <label class="check">
                <input type="checkbox" formControlName="sleepingHours" />
                <span>Sleeping hours drill</span>
              </label>

              <label>
                <span>Outcome</span>
                <select formControlName="outcome">
                  <option value="SUCCESS">Success</option>
                  <option value="ISSUES">Issues</option>
                </select>
              </label>

              <label>
                <span>Evacuation time (seconds)</span>
                <input type="number" formControlName="evacuationTimeSec" placeholder="Optional" />
              </label>

              <label class="wide">
                <span>Staff present (free text)</span>
                <input type="text" formControlName="staffPresent" placeholder="e.g., AM, JS, TK (or names)" />
              </label>

              <label class="wide">
                <span>Issues observed (optional)</span>
                <textarea rows="2" formControlName="issues"></textarea>
              </label>

              <label class="wide">
                <span>Corrective action (optional)</span>
                <textarea rows="2" formControlName="correctiveAction"></textarea>
              </label>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn--primary" [disabled]="form.invalid || saving">
                {{ saving ? 'Saving…' : 'Save drill' }}
              </button>
              <button type="button" class="btn" (click)="toggleCreate()" [disabled]="saving">Cancel</button>
            </div>
          </form>

          <div class="empty" *ngIf="!vm.loading && vm.logs.length === 0">
            No drills logged yet.
          </div>

          <div class="table" *ngIf="vm.logs.length">
            <div class="trow thead">
              <div>Date</div>
              <div>Sleeping</div>
              <div>Outcome</div>
              <div>Staff</div>
              <div>Notes</div>
            </div>

            <div class="trow" *ngFor="let d of vm.logs">
              <div>{{ d.occurredAt | date:'medium' }}</div>
              <div>{{ d.sleepingHours ? 'Yes' : 'No' }}</div>
              <div>
                <span class="chip" [class.chip--bad]="d.outcome === 'ISSUES'" [class.chip--ok]="d.outcome === 'SUCCESS'">
                  {{ d.outcome }}
                </span>
              </div>
              <div>{{ d.staffPresent || '—' }}</div>
              <div class="notes">
                <div *ngIf="d.issues"><strong>Issues:</strong> {{ d.issues }}</div>
                <div *ngIf="d.correctiveAction"><strong>Fix:</strong> {{ d.correctiveAction }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- EVIDENCE -->
        <section class="card" *ngIf="vm.tab === 'evidence'">
          <div class="h3">Evidence</div>
          <div class="sub">
            Next: uploads/binder tied to §565.23(e) rules and/or specific drill log entries.
          </div>
          <div class="msg msg--info">
            This placeholder exists so deep links can use &tab=evidence later without changing routing.
          </div>
        </section>
      </ng-container>

      <!-- hidden anchor -->
      <div #focusTop style="position:absolute; top:0;"></div>
    </section>
  `,
  styles: [
    `
      :host { display:block; width:100%; }
      .page { width:100%; max-width: 1100px; margin-inline:auto; display:grid; gap: var(--sp-4); position:relative; }
      .head { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-3); }
      .meta { margin-top: var(--sp-2); }
      .pill { padding:.25rem .6rem; border-radius: var(--radius-pill); border:1px solid var(--clr-line); }

      .tabs { display:flex; gap: 8px; flex-wrap: wrap; }
      .tab {
        padding: 8px 12px; border-radius: 999px; border: 1px solid var(--clr-line);
        background: transparent; cursor:pointer; font-weight:800;
      }
      .tab--on { background: rgba(0,0,0,.06); }

      .msg { padding: 10px 12px; border-radius: 12px; }
      .msg--warn { background: #fff3cd; }
      .msg--info { background: #eef2ff; }

      .reqs { display:grid; gap: 12px; margin-top: 10px; }
      .req { border: 1px solid var(--clr-line); border-radius: 14px; padding: 12px; }
      .req--bad { border-left: 4px solid #dc2626; }
      .req--ok { border-left: 4px solid #16a34a; }

      .req__top { display:flex; gap: 10px; align-items:center; flex-wrap:wrap; }
      .rule { font-weight: 900; }
      .chip { font-size: 12px; padding: 2px 8px; border-radius: 999px; border:1px solid var(--clr-line); background:#f3f4f6; }
      .chip--bad { border-color:#fecaca; background:#fee2e2; }
      .chip--ok { border-color:#bbf7d0; background:#dcfce7; }

      .req__title { margin-top: 8px; font-weight: 900; }
      .req__desc { margin-top: 4px; opacity:.9; }
      .req__detail { margin-top: 8px; font-size: 13px; opacity:.85; }
      .req__actions { margin-top: 10px; }

      .row { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-3); }
      .btn { padding: 8px 12px; border-radius: 12px; border:1px solid var(--clr-line); background: transparent; cursor:pointer; font-weight: 800; }
      .btn--primary { background: rgba(0,0,0,.06); }

      .form { margin-top: 12px; border-top: 1px solid var(--clr-line); padding-top: 12px; }
      .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      label { display:grid; gap: 6px; }
      .wide { grid-column: 1 / -1; }
      input, select, textarea {
        padding: 10px 12px; border-radius: 12px; border:1px solid var(--clr-line); background:#fff;
      }
      .check { display:flex; align-items:center; gap: 10px; margin-top: 26px; }
      .actions { display:flex; gap: 10px; margin-top: 12px; flex-wrap:wrap; }

      .empty { margin-top: 12px; opacity:.8; }

      .table { margin-top: 12px; display:grid; gap: 8px; }
      .trow { display:grid; grid-template-columns: 180px 90px 110px 160px 1fr; gap: 10px; align-items:start;
        border:1px solid var(--clr-line); border-radius: 12px; padding: 10px;
      }
      .thead { font-weight: 900; background: rgba(0,0,0,.04); }
      .notes { font-size: 13px; opacity:.95; }

      /* highlight on focus */
      .focus-on {
        outline: 3px solid rgba(59,130,246,.45);
        box-shadow: 0 0 0 6px rgba(59,130,246,.12);
        transition: outline 180ms ease;
      }

      @media (max-width: 900px) {
        .head { flex-direction: column; }
        .grid { grid-template-columns: 1fr; }
        .trow { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class FireDrillsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // TODO: replace with your real API client (data-access) when you add endpoints
private readonly drillsApi = inject(FireDrillsApi);

  @ViewChild('focusTop', { static: true }) focusTop!: ElementRef<HTMLElement>;

  message = '';
  saving = false;

  tab: TabKey = 'requirements';
  focus = '';

  showCreate = false;

  private readonly reload$ = new BehaviorSubject<void>(undefined);

  form = new FormGroup({
    occurredAtLocal: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    sleepingHours: new FormControl<boolean>(false, { nonNullable: true }),
    outcome: new FormControl<FireDrillOutcome>('SUCCESS', { nonNullable: true }),
    evacuationTimeSec: new FormControl<number | null>(null),
    staffPresent: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    issues: new FormControl<string>(''),
    correctiveAction: new FormControl<string>(''),
  });

  private readonly qp$ = this.route.queryParamMap.pipe(
    map((qp) => ({
      locationId: qp.get('locationId') ?? '',
      tab: (qp.get('tab') ?? 'requirements').toLowerCase(),
      focus: qp.get('focus') ?? '',
    })),
    map((q) => ({
      locationId: q.locationId,
      tab: (q.tab === 'logs' || q.tab === 'evidence' || q.tab === 'requirements'
        ? (q.tab as TabKey)
        : 'requirements') as TabKey,
      focus: q.focus,
    })),
    distinctUntilChanged((a, b) => a.locationId === b.locationId && a.tab === b.tab && a.focus === b.focus),
    shareReplay(1),
  );

  readonly vm$ = combineLatest([this.qp$, this.reload$]).pipe(
    switchMap(([q]) => {
      if (!q.locationId) {
        this.message = 'Missing locationId.';
        return of({
          locationId: '',
          tab: q.tab,
          focus: q.focus,
          loading: false,
          logs: [],
          checks: [],
        } as Vm);
      }

      this.tab = q.tab;
      this.focus = q.focus;

      return this.drillsApi.list({ locationId: q.locationId }).pipe(
        map((logs) => (Array.isArray(logs) ? logs : [])),
        map((logs) => {
          const checks = evaluateFireDrills(logs);
          return {
            locationId: q.locationId,
            tab: q.tab,
            focus: q.focus,
            loading: false,
            logs,
            checks,
          } as Vm;
        }),
        startWith({
          locationId: q.locationId,
          tab: q.tab,
          focus: q.focus,
          loading: true,
          logs: [],
          checks: [],
        } as Vm),
        catchError((err) => {
          console.error('[fire-drills] failed', err);
          this.message = `Failed to load drill logs (${err?.status ?? 'unknown'}).`;
          return of({
            locationId: q.locationId,
            tab: q.tab,
            focus: q.focus,
            loading: false,
            logs: [],
            checks: [],
          } as Vm);
        }),
        tap((vm) => {
          // Focus behavior only when we have something to focus
          if (vm.loading) return;
          if (!vm.focus) return;

          // Wait for DOM paint
          queueMicrotask(() => this.applyFocus(vm.focus));
        }),
      );
    }),
    shareReplay(1),
  );

  constructor() {
    // Keep local tab/focus variables aligned (for button state)
    this.qp$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => {
        this.tab = q.tab;
        this.focus = q.focus;
      });
  }

  setTab(tab: TabKey) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  toggleCreate() {
    this.showCreate = !this.showCreate;
  }

  create(locationId: string) {
    if (!locationId) return;
    if (this.form.invalid) return;

    this.saving = true;
    this.message = '';

    const occurredAtIso = toIsoFromLocal(this.form.controls.occurredAtLocal.value);

    const payload: CreateFireDrillLogInput = {
      locationId,
      occurredAt: occurredAtIso,
      sleepingHours: this.form.controls.sleepingHours.value,
      outcome: this.form.controls.outcome.value,
      evacuationTimeSec: this.form.controls.evacuationTimeSec.value,
      staffPresent: this.form.controls.staffPresent.value.trim(),
      issues: (this.form.controls.issues.value ?? '').trim() || null,
      correctiveAction: (this.form.controls.correctiveAction.value ?? '').trim() || null,
    };

    this.drillsApi.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showCreate = false;
        this.form.reset({
          occurredAtLocal: '',
          sleepingHours: false,
          outcome: 'SUCCESS',
          evacuationTimeSec: null,
          staffPresent: '',
          issues: '',
          correctiveAction: '',
        });
        this.reload$.next();
        // jump user to requirements after save (optional)
        this.setTab('requirements');
      },
      error: (err) => {
        console.error('[fire-drills] create failed', err);
        this.saving = false;
        this.message = err?.error?.message
          ? `Failed: ${err.error.message}`
          : `Failed to save drill (${err?.status ?? 'unknown'}).`;
      },
    });
  }

  /** Convert ruleCode to a stable DOM id */
  focusId(ruleCode: string): string {
    // 565.23(e)(1)(C) -> rule-565-23-e-1-c
    return (
      'rule-' +
      String(ruleCode || '')
        .toLowerCase()
        .replace(/\./g, '-')
        .replace(/[()]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    );
  }

  private applyFocus(focus: string) {
    const id = this.focusId(focus);

    // Remove prior highlights
    document.querySelectorAll('.focus-on').forEach((el) => el.classList.remove('focus-on'));

    const el = document.getElementById(id);
    if (!el) return;

    el.classList.add('focus-on');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Remove highlight after a bit
    window.setTimeout(() => el.classList.remove('focus-on'), 2400);
  }
}

/** --- PURE EVALUATION LOGIC (frontend) --- */
export function evaluateFireDrills(logs: FireDrillLogDto[]): DrillCheck[] {
  const now = new Date();
  const days90 = new Date(now);
  days90.setDate(days90.getDate() - 90);

  const months12 = new Date(now);
  months12.setFullYear(months12.getFullYear() - 1);

  const occurred = logs
    .map((l) => new Date(l.occurredAt))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  const last = occurred[0] ?? null;

  const inLast12 = logs.filter((l) => new Date(l.occurredAt) >= months12);
  const sleepingInLast12 = inLast12.filter((l) => !!l.sleepingHours);

  const ok90 = !!last && last >= days90;
  const ok4perYear = inLast12.length >= 4;
  const ok2sleep = sleepingInLast12.length >= 2;

  const fmt = (d: Date | null) => (d ? d.toLocaleDateString() : '—');

  return [
    {
      ruleCode: '565.23(e)(1)',
      title: 'Fire drills are conducted and documented',
      description: 'Fire drills must be conducted as required and used to validate safe evacuation.',
      ok: ok90,
      detail: `Last drill: ${fmt(last)}. Must have a drill within the last 90 days.`,
    },
    {
      ruleCode: '565.23(e)(1)(A)',
      title: 'At least 4 fire drills in the last 12 months',
      description: 'Maintain a minimum of four documented drills within a rolling 12-month window.',
      ok: ok4perYear,
      detail: `Drills in last 12 months: ${inLast12.length}. Required: 4.`,
    },
    {
      ruleCode: '565.23(e)(1)(C)',
      title: 'At least 2 sleeping-hours drills in the last 12 months',
      description: 'At least two drills must occur during sleeping hours in a rolling 12-month window.',
      ok: ok2sleep,
      detail: `Sleeping-hours drills in last 12 months: ${sleepingInLast12.length}. Required: 2.`,
    },
  ];
}

function toIsoFromLocal(local: string): string {
  // datetime-local gives "YYYY-MM-DDTHH:mm"
  // Treat as local time, convert to ISO
  const d = new Date(local);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/**
 * TEMP STUB so the page compiles immediately.
 * Replace this with a real @hhsc-compliance/data-access client once backend is added.
 */

