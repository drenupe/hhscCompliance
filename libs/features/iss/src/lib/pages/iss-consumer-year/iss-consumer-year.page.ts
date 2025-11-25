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
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { WeekSummary } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-consumer-year-page',
  imports: [NgIf, NgForOf, NgClass, AsyncPipe, DatePipe],
  templateUrl: './iss-consumer-year.page.html',
  styleUrls: ['./iss-consumer-year.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssConsumerYearPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issFacade = inject(IssFacade);
  private readonly destroy$ = new Subject<void>();

  // All week summaries for the currently-selected consumer
  weeks$!: Observable<WeekSummary[]>;

  // Consumer display name in header
  consumerName$ = this.issFacade.selectedConsumer$.pipe(
    filter((c): c is NonNullable<typeof c> => !!c),
    map((c) => `${c.firstName} ${c.lastName}`),
  );

  providerId!: number;
  consumerId!: number;

  ngOnInit(): void {
    // Base stream from store – selector should already be keyed to selected consumer
    this.weeks$ = this.issFacade.weeks$;

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.providerId = Number(params.get('providerId')) || 0;
      this.consumerId = Number(params.get('consumerId')) || 0;

      if (this.consumerId) {
        // Make sure the store is actually hydrated for this consumer
        this.issFacade.loadConsumers();                 // ensures selectedConsumer$ can resolve
        this.issFacade.selectConsumer(this.consumerId); // sets selected consumer in state
        this.issFacade.loadWeeksForConsumer(this.consumerId); // triggers API / effect to fill weeks$
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
    // Keep the “selected week” in store in sync with navigation
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

  statusClass(week: WeekSummary): string {
    if (!week.hasLog) return 'week-tile--empty';
    if (week.status === 'approved') return 'week-tile--approved';
    if (week.status === 'submitted') return 'week-tile--submitted';
    if (week.status === 'draft') return 'week-tile--draft';
    return 'week-tile--filled';
  }
}
