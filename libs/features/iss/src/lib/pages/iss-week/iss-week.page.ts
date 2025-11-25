import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  CommonModule,
  AsyncPipe,
  DatePipe,
  NgIf,
  NgClass,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skip,
  takeUntil,
} from 'rxjs/operators';

import { IssFacade } from '@hhsc-compliance/data-access';
import { StaffLog } from '@hhsc-compliance/shared-models';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'queued' | 'error';
type AutoSaveSource =
  | 'typing'
  | 'blur'
  | 'visibility'
  | 'online'
  | 'beforeunload'
  | 'manual';

@Component({
  standalone: true,
  selector: 'lib-hhsc-iss-week-page',
  imports: [
    // Template / directives
    CommonModule,
    NgIf,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    // Forms
    ReactiveFormsModule,
    // Pipes
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './iss-week.page.html',
  styleUrls: ['./iss-week.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssWeekPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  providerId!: string;
  consumerId!: string;
  serviceDate!: string;

  // ✅ string | null to match action / facade types
  private currentLogId: string | null = null;

  autoSaveStatus: AutoSaveStatus = 'idle';
  lastSavedAt: Date | null = null;

  private readonly destroy$ = new Subject<void>();

  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly issFacade = inject(IssFacade);

  // expose observables as getters so they're created lazily
  get currentLog$() {
    return this.issFacade.currentLog$;
  }
  get loading$() {
    return this.issFacade.currentLogLoading$;
  }
  get saving$() {
    return this.issFacade.currentLogSaving$;
  }

  ngOnInit(): void {
    this.buildForm();
    this.bindRouteParams();
    this.bindLogStream();
    this.setupAutoSave();
    this.setupLifecycleAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ----- init helpers -----
  private buildForm(): void {
    this.form = this.fb.group({
      header: this.fb.group({
        locationName: [''],
        staffInitials: [''],
        ratio: [''],
      }),
      // TODO: serviceWeek form group when we define full 8615 structure
    });
  }

  private bindRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.providerId = params.get('providerId') ?? '';
        this.consumerId = params.get('consumerId') ?? '';
        this.serviceDate = params.get('serviceDate') ?? '';

        if (this.consumerId && this.serviceDate) {
          this.issFacade.selectConsumer(this.consumerId);
          // ✅ new signature: only serviceDate
          this.issFacade.selectWeek(this.serviceDate);
          this.issFacade.loadLogForWeek(this.consumerId, this.serviceDate);
        }
      });
  }

  private bindLogStream(): void {
    this.currentLog$
      .pipe(
        filter((log): log is StaffLog => !!log),
        takeUntil(this.destroy$)
      )
      .subscribe((log) => {
        // ✅ normalize ID to string for NgRx / actions
        this.currentLogId =
          log.id !== undefined && log.id !== null ? String(log.id) : null;

        this.patchFormFromLog(log);
        this.form.markAsPristine();
        this.lastSavedAt = new Date();

        if (
          this.autoSaveStatus === 'saving' ||
          this.autoSaveStatus === 'queued'
        ) {
          this.autoSaveStatus = 'saved';
        }
      });
  }

  private patchFormFromLog(log: StaffLog): void {
    this.form.patchValue({
      header: {
        locationName: log.header?.locationName ?? '',
        staffInitials: log.header?.staffInitials ?? '',
        ratio: log.header?.ratio ?? '',
      },
      // TODO: map serviceWeek -> form
    });
  }

  // ----- auto-save -----
  private setupAutoSave(): void {
    if (!this.form) return;

    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(2000),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.queueSave('typing'));
  }

  private setupLifecycleAutoSave(): void {
    fromEvent(window, 'blur')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queueSave('blur'));

    fromEvent(document, 'visibilitychange')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (document.visibilityState === 'hidden') {
          this.queueSave('visibility');
        }
      });

    fromEvent(window, 'online')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.form?.dirty && this.autoSaveStatus === 'queued') {
          this.triggerSave('online');
        }
      });

    fromEvent<BeforeUnloadEvent>(window, 'beforeunload')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (this.form?.dirty) {
          this.queueSave('beforeunload');
          event.preventDefault();
          event.returnValue = '';
        }
      });
  }

  private queueSave(source: AutoSaveSource): void {
    if (!this.form || !this.form.dirty) return;

    if (this.form.invalid) {
      this.autoSaveStatus = 'error';
      return;
    }

    if (!navigator.onLine && source !== 'online') {
      this.autoSaveStatus = 'queued';
      return;
    }

    this.triggerSave(source);
  }

  private triggerSave(_source: AutoSaveSource): void {
    if (!this.form) return;

    const value = this.form.value;
    const payload = {
      header: value.header,
      // TODO: include serviceWeek later
    };

    this.autoSaveStatus = 'saving';
    this.issFacade.saveLog(this.currentLogId, payload);
  }

  onSave(): void {
    this.queueSave('manual');
  }
}
