import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { WeekSummary } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

interface YearMonth {
  monthStart: Date;
  weeks: WeekSummary[];
}

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-consumer-year-print',
  imports: [NgIf, NgForOf, AsyncPipe, DatePipe],
  templateUrl: './iss-consumer-year-print.page.html',
  styleUrls: ['./iss-consumer-year-print.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssConsumerYearPrintPageComponent
  implements OnInit, AfterViewInit
{
  private readonly route = inject(ActivatedRoute);
  private readonly issFacade = inject(IssFacade);

  today = new Date();

  weeks$!: Observable<WeekSummary[]>;
  months$!: Observable<YearMonth[]>;

  consumerName$ = this.issFacade.selectedConsumer$.pipe(
    filter((c): c is NonNullable<typeof c> => !!c),
    map((c) => `${c.firstName} ${c.lastName}`),
  );

  ngOnInit(): void {
   // const providerIdParam = this.route.snapshot.paramMap.get('providerId');
    const consumerIdParam = this.route.snapshot.paramMap.get('consumerId');

    const consumerId = consumerIdParam ? Number(consumerIdParam) : 0;
    if (consumerId) {
      this.issFacade.loadConsumers();
      this.issFacade.selectConsumer(consumerId);
      this.issFacade.loadWeeksForConsumer(consumerId);
    }

    this.weeks$ = this.issFacade.weeks$ as Observable<WeekSummary[]>;

    this.months$ = this.weeks$.pipe(
      map((weeks) => {
        const byMonth = new Map<string, YearMonth>();

        for (const w of weeks ?? []) {
          if (!w?.serviceDate) continue;

          const d = new Date(w.serviceDate);
          if (Number.isNaN(d.getTime())) continue;

          const key = `${d.getFullYear()}-${d.getMonth()}`;
          let bucket = byMonth.get(key);
          if (!bucket) {
            bucket = {
              monthStart: new Date(d.getFullYear(), d.getMonth(), 1),
              weeks: [],
            };
            byMonth.set(key, bucket);
          }

          bucket.weeks.push(w);
        }

        const result = Array.from(byMonth.values());

        // sort months
        result.sort(
          (a, b) => a.monthStart.getTime() - b.monthStart.getTime()
        );

        // sort weeks within each month
        for (const m of result) {
          m.weeks.sort(
            (a, b) =>
              new Date(a.serviceDate).getTime() -
              new Date(b.serviceDate).getTime()
          );
        }

        return result;
      })
    );
  }

  ngAfterViewInit(): void {
    // Small delay so the view can render before print
    setTimeout(() => {
      window.print();
    }, 300);
  }

  onPrintClick(): void {
    window.print();
  }

  onCloseClick(): void {
    window.close();
  }
}
