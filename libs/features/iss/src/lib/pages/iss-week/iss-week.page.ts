import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AsyncPipe,
  DatePipe,
  NgIf,
} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { IssFacade } from '@hhsc-compliance/data-access';
import { StaffLog } from '@hhsc-compliance/shared-models';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-week-page',
  templateUrl: './iss-week.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    NgIf,
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
  ],
})
export class IssWeekPageComponent implements OnInit, OnDestroy {
  // DI (declare first)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly issFacade = inject(IssFacade);

  form!: FormGroup;
  providerId!: string;
  consumerId!: string;
  serviceDate!: string;

  currentLog$ = this.issFacade.currentLog$;
  loading$ = this.issFacade.currentLogLoading$;
  saving$ = this.issFacade.currentLogSaving$;

  private currentLogId: string | null = null;
  private logSub?: Subscription;

  ngOnInit(): void {
    this.form = this.fb.group({
      header: this.fb.group({
        locationName: [''],
        staffInitials: [''],
        ratio: [''],
      }),
      // TODO: serviceWeek form group when we define full 8615 structure
    });

    this.route.paramMap.subscribe((params) => {
      this.providerId = params.get('providerId') ?? '';
      this.consumerId = params.get('consumerId') ?? '';
      this.serviceDate = params.get('serviceDate') ?? '';

      if (this.consumerId && this.serviceDate) {
        this.issFacade.selectConsumer(this.consumerId);
        this.issFacade.selectWeek(this.consumerId, this.serviceDate);
      }
    });

    this.logSub = this.currentLog$.subscribe((log: StaffLog | null) => {
      if (!log) return;
      this.currentLogId = log.id;
      this.patchFormFromLog(log);
    });
  }

  ngOnDestroy(): void {
    this.logSub?.unsubscribe();
  }

  patchFormFromLog(log: StaffLog): void {
    this.form.patchValue({
      header: {
        locationName: log.header?.locationName ?? '',
        staffInitials: log.header?.staffInitials ?? '',
        ratio: log.header?.ratio ?? '',
      },
      // TODO: map serviceWeek → form when ready
    });
  }

  onSave(): void {
    const value = this.form.value as { header: any };
    const payload = {
      header: value.header,
      // TODO: include serviceWeek when we wire 8615 grid
    };

    this.issFacade.saveLog(this.currentLogId, payload);
  }

  goBack(): void {
    this.router.navigate([
      '/iss',
      'provider',
      this.providerId,
      'consumer',
      this.consumerId,
    ]);
  }
}
