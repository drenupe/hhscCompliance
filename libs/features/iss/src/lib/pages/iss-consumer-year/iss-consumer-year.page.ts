// libs/features/iss/src/lib/pages/iss-consumer-year/iss-consumer-year.page.ts

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { WeekSummary } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

interface MonthBucket {
  /** First day of the month, used for label + sorting */
  monthStart: Date;
  /** All weeks that fall in this month (from backend) */
  weeks: WeekSummary[];
}

interface WeekChoice {
  /** 1-based index within the month (Week 1, Week 2, …) */
  index: number;
  /** Display label: "Week 1 (Oct 7)" */
  label: string;
  /** Week start date (Monday) in yyyy-MM-dd */
  startDate: string;
  /** Whether this week already has a log in weeksSnapshot */
  hasLog: boolean;
}

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-consumer-year-page',
  imports: [NgIf, NgForOf, NgClass, AsyncPipe, DatePipe, FormsModule],
  templateUrl: './iss-consumer-year.page.html',
  styleUrls: ['./iss-consumer-year.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssConsumerYearPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issFacade = inject(IssFacade);
  private readonly destroy$ = new Subject<void>();

  // Raw weeks from store (for this consumer)
  weeks$!: Observable<WeekSummary[]>;

  // Weeks grouped by month for the existing logs grid
  months$!: Observable<MonthBucket[]>;

  // Snapshot so we can compute "already has data?" for overlay
  private weeksSnapshot: WeekSummary[] = [];

  // Year used for the month/week generator
  private currentYear!: number;

  // For labeling the month rail in the overlay
  readonly monthOptions = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  // Overlay state
  isAddOverlayOpen = false;
  selectedAddMonth: number | null = null;
  addWeekChoices: WeekChoice[] = [];

  // Consumer display name in header
  consumerName$ = this.issFacade.selectedConsumer$.pipe(
    filter((c): c is NonNullable<typeof c> => !!c),
    map((c) => `${c.firstName} ${c.lastName}`),
  );

  providerId!: number;
  consumerId!: number;

  ngOnInit(): void {
    // Base stream from store – selector already keyed to selected consumer
    this.weeks$ = this.issFacade.weeks$;

    // Snapshot + currentYear
    this.weeks$.pipe(takeUntil(this.destroy$)).subscribe((weeks) => {
      this.weeksSnapshot = weeks ?? [];

      if (!this.currentYear) {
        const firstWithDate = this.weeksSnapshot.find((w) => !!w.serviceDate);
        if (firstWithDate?.serviceDate) {
          this.currentYear = new Date(firstWithDate.serviceDate).getFullYear();
        } else {
          this.currentYear = new Date().getFullYear();
        }
      }

      // If overlay is open and a month is selected, refresh week choices
      if (this.isAddOverlayOpen && this.selectedAddMonth !== null) {
        this.rebuildAddWeekChoices(this.selectedAddMonth);
      }
    });

    // Group weeks into months for the month cards grid
    this.months$ = this.weeks$.pipe(
      map((weeks) => {
        const buckets = new Map<string, MonthBucket>();

        for (const w of weeks) {
          if (!w?.serviceDate) continue;

          const d = new Date(w.serviceDate);
          if (Number.isNaN(d.getTime())) continue;

          const year = d.getFullYear();
          const month = d.getMonth(); // 0–11
          const key = `${year}-${month}`;

          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = {
              monthStart: new Date(year, month, 1),
              weeks: [],
            };
            buckets.set(key, bucket);
          }

          bucket.weeks.push(w);
        }

        const result = Array.from(buckets.values());

        // Sort months chronologically
        result.sort(
          (a, b) => a.monthStart.getTime() - b.monthStart.getTime(),
        );

        // Sort each month's weeks by date
        for (const m of result) {
          m.weeks.sort(
            (a, b) =>
              new Date(a.serviceDate).getTime() -
              new Date(b.serviceDate).getTime(),
          );
        }

        return result;
      }),
    );

    // Route binding + store hydration
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.providerId = Number(params.get('providerId')) || 0;
      this.consumerId = Number(params.get('consumerId')) || 0;

      if (this.consumerId) {
        this.issFacade.loadConsumers();
        this.issFacade.selectConsumer(this.consumerId);
        this.issFacade.loadWeeksForConsumer(this.consumerId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToHome(): void {
    this.router.navigate(['/iss']);
  }

  openWeek(serviceDate: string): void {
    this.issFacade.selectWeek(serviceDate);
    this.router.navigate([
      '/iss',
      'provider',
      this.providerId,
      'consumer',
      this.consumerId,
      'week',
      serviceDate,
    ]);
  }

  /* =========================
   * ADD WEEK OVERLAY BEHAVIOR
   * ========================= */

  openAddOverlay(): void {
    this.isAddOverlayOpen = true;
    this.selectedAddMonth = null;
    this.addWeekChoices = [];
  }

  closeAddOverlay(): void {
    this.isAddOverlayOpen = false;
  }

  /** Click on a month in the left rail */
  onAddMonthClick(month: number): void {
    if (this.isMonthFull(month)) {
      // month completely filled → no-op
      return;
    }
    this.selectedAddMonth = month;
    this.rebuildAddWeekChoices(month);
  }

  /** Click on a week in the right list */
  onAddWeekClick(choice: WeekChoice): void {
    if (choice.hasLog) return;
    this.isAddOverlayOpen = false;
    this.openWeek(choice.startDate);
  }

  /** For the orange "Start with current week" button in the empty state */
  startFirstLog(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();

    // Open overlay and auto-select current month (or first non-full month)
    this.openAddOverlay();

    const currentMonth = today.getMonth();
    const firstAvailableMonth =
      !this.isMonthFull(currentMonth)
        ? currentMonth
        : this.monthOptions.find((m) => !this.isMonthFull(m.value))?.value;

    if (firstAvailableMonth == null) {
      // No months with available weeks – nothing to start
      this.closeAddOverlay();
      return;
    }

    this.onAddMonthClick(firstAvailableMonth);

    const firstAvailableWeek = this.addWeekChoices.find((w) => !w.hasLog);
    if (!firstAvailableWeek) return;

    this.onAddWeekClick(firstAvailableWeek);
  }

  /** Status → CSS class for the existing pill grid */
  statusClass(week: WeekSummary): string {
    if (!week.hasLog) return 'week-pill--empty';
    if (week.status === 'approved') return 'week-pill--approved';
    if (week.status === 'submitted') return 'week-pill--submitted';
    if (week.status === 'draft') return 'week-pill--draft';
    return 'week-pill--filled';
  }

  /** Month is "full" if every Monday in that month already has a log */
  isMonthFull(month: number): boolean {
    if (!this.currentYear || !this.weeksSnapshot?.length) {
      return false;
    }

    const year = this.currentYear;

    // Logged week dates in this month/year (normalized)
    const loggedKeys = new Set(
      this.weeksSnapshot
        .filter((w) => {
          if (!w.serviceDate || !w.hasLog) return false;
          const d = new Date(w.serviceDate);
          if (Number.isNaN(d.getTime())) return false;
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .map((w) => this.normalizeDateStr(w.serviceDate)),
    );

    if (!loggedKeys.size) return false;

    // All Mondays in that month
    const firstOfMonth = new Date(year, month, 1);
    const day = firstOfMonth.getDay(); // 0 Sun..6 Sat

    const diffToMonday = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
    const firstMondayDate = firstOfMonth.getDate() + diffToMonday;
    let cursor = new Date(year, month, firstMondayDate);

    const allMondays: string[] = [];
    while (cursor.getMonth() === month) {
      allMondays.push(this.toYMD(cursor));
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 7);
    }

    if (!allMondays.length) return false;

    // Full only if every Monday has a logged week
    return allMondays.every((d) => loggedKeys.has(d));
  }

  /** Build list of week choices for the selected month (overlay right column) */
  private rebuildAddWeekChoices(month: number): void {
    if (!this.currentYear) {
      this.addWeekChoices = [];
      return;
    }

    const year = this.currentYear;
    const firstOfMonth = new Date(year, month, 1);
    const day = firstOfMonth.getDay(); // 0 Sun..6 Sat

    const diffToMonday = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
    const firstMondayDate = firstOfMonth.getDate() + diffToMonday;
    let cursor = new Date(year, month, firstMondayDate);

    const loggedKeys = new Set(
      (this.weeksSnapshot || [])
        .filter((w) => !!w.serviceDate && w.hasLog)
        .map((w) => this.normalizeDateStr(w.serviceDate)),
    );

    const choices: WeekChoice[] = [];
    let index = 1;

    while (cursor.getMonth() === month) {
      const iso = this.toYMD(cursor);
      const hasLog = loggedKeys.has(iso);

      const label = `Week ${index} (${cursor.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })})`;

      choices.push({
        index,
        label,
        startDate: iso,
        hasLog,
      });

      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 7);
      index++;
    }

    this.addWeekChoices = choices;
  }

  // ===== Helpers to normalize dates =====

  private toYMD(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private normalizeDateStr(dateStr: string): string {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return this.toYMD(d);
  }
}
