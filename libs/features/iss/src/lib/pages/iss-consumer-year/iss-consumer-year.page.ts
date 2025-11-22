import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { WeekSummary } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-hhsc-iss-consumer-year-page',
  templateUrl: './iss-consumer-year.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssConsumerYearPageComponent implements OnInit {
  // DI (new compiler style)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issFacade = inject(IssFacade);

  // State streams
  weeks$!: Observable<WeekSummary[]>;

  consumerName$ = this.issFacade.selectedConsumer$.pipe(
    filter((c): c is NonNullable<typeof c> => !!c),
    map((c) => `${c.firstName} ${c.lastName}`)
  );

  providerId!: string;
  consumerId!: string;

  ngOnInit(): void {
    this.weeks$ = this.issFacade.weeks$;

    this.route.paramMap.subscribe((params) => {
      this.providerId = params.get('providerId') ?? '';
      this.consumerId = params.get('consumerId') ?? '';

      if (this.consumerId) {
        this.issFacade.selectConsumer(this.consumerId);
        this.issFacade.loadWeeksForConsumer(this.consumerId);
      }
    });
  }

  openWeek(serviceDate: string): void {
    this.issFacade.selectWeek(this.consumerId, serviceDate);
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
