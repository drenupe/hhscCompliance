import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { WeekSummary } from '@hhsc-compliance/shared-models';
import { IssFacade } from '@hhsc-compliance/data-access';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-consumer-year-page',
  imports: [CommonModule, RouterModule, NgIf, NgForOf, NgClass, AsyncPipe, DatePipe],
  templateUrl: './iss-consumer-year.page.html',
  styleUrls: ['./iss-consumer-year.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssConsumerYearPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly issFacade = inject(IssFacade);

  weeks$!: Observable<WeekSummary[]>;

  consumerName$ = this.issFacade.selectedConsumer$.pipe(
    filter((c): c is NonNullable<typeof c> => !!c),
    map((c) => `${c.firstName} ${c.lastName}`),
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
    // store which week is selected
    this.issFacade.selectWeek(serviceDate);

    // route into the week 8615 page
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

  backToHome(): void {
    this.router.navigate(['/iss', 'home']);
  }
}
