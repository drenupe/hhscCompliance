// libs/features/iss/src/lib/pages/iss-week/iss-week.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  skip,
  takeUntil,
} from 'rxjs/operators';

import { IssFacade } from '@hhsc-compliance/data-access';
import {
  StaffLog,
  StaffLogHeader,
  ServiceWeek,
  ServiceDayEntry,
  UpdateStaffLogDto,
  WeeklyInitialRow,
  WeeklyNote,
  normalizeStaffLogFromApi,
  buildStaffLogSavePayload,
} from '@hhsc-compliance/shared-models';

// Weekly initials child
import { IssWeeklyInitialsSectionComponent } from '../../ui/weekly-initials/iss-weekly-initials-section.component';

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'queued' | 'error';
type AutoSaveSource =
  | 'typing'
  | 'blur'
  | 'visibility'
  | 'online'
  | 'beforeunload'
  | 'manual';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

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
    // Weekly initials child
    IssWeeklyInitialsSectionComponent,
  ],
  templateUrl: './iss-week.page.html',
  styleUrls: ['./iss-week.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssWeekPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  providerId!: number;
  consumerId!: number;
  serviceDate!: string;

  private currentLogId: number | null = null;

  autoSaveStatus: AutoSaveStatus = 'idle';
  lastSavedAt: Date | null = null;

  private readonly destroy$ = new Subject<void>();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly issFacade = inject(IssFacade);

  // ----- store streams ----- //
  get currentLog$() {
    return this.issFacade.currentLog$;
  }
  get loading$() {
    return this.issFacade.currentLogLoading$;
  }
  get saving$() {
    return this.issFacade.currentLogSaving$;
  }

  // ===== FormArray getters for template ===== //

  get serviceWeek(): FormArray<FormGroup> {
    return this.form.get('serviceWeek') as FormArray<FormGroup>;
  }

  get socializationArray(): FormArray<FormGroup> {
    return this.form.get('socialization') as FormArray<FormGroup>;
  }

  get selfHelpArray(): FormArray<FormGroup> {
    return this.form.get('selfHelp') as FormArray<FormGroup>;
  }

  get adaptiveArray(): FormArray<FormGroup> {
    return this.form.get('adaptive') as FormArray<FormGroup>;
  }

  get implementationArray(): FormArray<FormGroup> {
    return this.form.get('implementation') as FormArray<FormGroup>;
  }

  get communityArray(): FormArray<FormGroup> {
    return this.form.get('community') as FormArray<FormGroup>;
  }

  get notes(): FormArray<FormGroup> {
    return this.form.get('notes') as FormArray<FormGroup>;
  }

  // ===== Lifecycle ===== //

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

  // ===== Form building (ISS 8615-ish structure) ===== //

  private buildForm(): void {
    this.form = this.fb.group({
      header: this.fb.group({
        individualName: [''],
        date: [new Date().toISOString().slice(0, 10)],
        lon: [''],
        provider: [''],
        license: [''],
        staffNameTitle: [''],
      }),

      // Monday–Friday line items (single row per day)
      serviceWeek: this.fb.array([
        this.buildServiceRow('Monday'),
        this.buildServiceRow('Tuesday'),
        this.buildServiceRow('Wednesday'),
        this.buildServiceRow('Thursday'),
        this.buildServiceRow('Friday'),
      ]),

      // Weekly initials sections
      socialization: this.fb.array([
        this.buildWeeklyRow('Communication'),
        this.buildWeeklyRow('Socialization Skills Development'),
        this.buildWeeklyRow('Group Activity'),
        this.buildWeeklyRow('Volunteer or Employment Skills Development'),
        this.buildWeeklyRow('Transportation'),
      ]),
      selfHelp: this.fb.array([
        this.buildWeeklyRow('Personal Hygiene'),
        this.buildWeeklyRow('Eating'),
        this.buildWeeklyRow('Meal Preparation'),
        this.buildWeeklyRow('Cleaning'),
        this.buildWeeklyRow('Assistance with Medication'),
      ]),
      adaptive: this.fb.array([
        this.buildWeeklyRow('Ambulation and Mobility'),
        this.buildWeeklyRow('Reinforce Lessons'),
      ]),
      implementation: this.fb.array([
        this.buildWeeklyRow('Other:'),
        this.buildWeeklyRow('Other:'),
      ]),
      community: this.fb.array([
        this.buildWeeklyRow(
          'Community Location (describe location(s) in the comments)',
        ),
        this.buildWeeklyRow('Transportation'),
      ]),

      // Notes rows: minimum 5 (one for each day of service)
      notes: this.fb.array(
        Array.from({ length: 5 }, () => this.buildNoteRow()),
      ),
    });
  }

  private buildServiceRow(day: string): FormGroup {
    return this.fb.group({
      day: [day],
      date: [''],
      providerName: [''],
      providerSignature: [''],
      start: [''],
      end: [''],
      minutes: [0],
      setting: ['on_site'], // 'on_site' | 'off_site'
      individualsCount: [0],
      staffCount: [1],
    });
  }

  private buildWeeklyRow(label: string): FormGroup {
    return this.fb.group({
      label: [label],
      mon: [''],
      tue: [''],
      wed: [''],
      thu: [''],
      fri: [''],
    });
  }

  private buildNoteRow(): FormGroup {
    return this.fb.group({
      date: [''],
      initials: [''],
      comment: [''],
    });
  }

  // ===== Route + NgRx wiring ===== //

  private bindRouteParams(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const providerId = Number(params.get('providerId'));
        const consumerId = Number(params.get('consumerId'));
        const serviceDate = params.get('serviceDate') ?? '';

        this.providerId = providerId;
        this.consumerId = consumerId;
        this.serviceDate = serviceDate;

        if (this.consumerId && this.serviceDate) {
          this.issFacade.selectConsumer(this.consumerId);
          this.issFacade.selectWeek(this.serviceDate);
          this.issFacade.loadLogForWeek(this.consumerId, this.serviceDate);
        }
      });
  }

  private bindLogStream(): void {
    this.currentLog$
      .pipe(
        filter((log): log is StaffLog => !!log),
        takeUntil(this.destroy$),
      )
      .subscribe((log) => {
        // Normalize dates from API → UI
        const normalizedLog = normalizeStaffLogFromApi(log);

        this.currentLogId = normalizedLog.id;

        // If route didn’t specify a date, align with log’s serviceDate
        if (normalizedLog.serviceDate && !this.serviceDate) {
          this.serviceDate = normalizedLog.serviceDate;
        }

        this.patchFormFromLog(normalizedLog);
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

  // ======================================================================
  //  PATCH LOG → FORM
  // ======================================================================

  private patchFormFromLog(log: StaffLog): void {
    const header: StaffLogHeader = log.header ?? {};

    // ----- TOP HEADER ----- //
    this.form.patchValue({
      header: {
        individualName: (header as any).individualName ?? '',
        date: (header as any).date ?? this.serviceDate ?? '',
        lon: (header as any).lon ?? '',
        provider:
          (header as any).provider ?? (header as any).issProviderName ?? '',
        license:
          (header as any).license ?? (header as any).issProviderLicense ?? '',
        staffNameTitle: (header as any).staffNameTitle ?? '',
      },
    });

    // ----- SERVICE WEEK (MON–FRI CARDS) ----- //
    const week: ServiceWeek | undefined = log.serviceWeek;

    if (week) {
      WEEK_DAYS.forEach((dayKey, idx) => {
        const rowGroup = this.serviceWeek.at(idx) as FormGroup | undefined;
        if (!rowGroup) return;

        const entries = week[dayKey];
        const first: ServiceDayEntry | undefined = entries?.[0];

        if (first) {
          rowGroup.patchValue({
            date: first.date ?? '',
            providerName: first.providerName ?? '',
            providerSignature: first.providerSignature ?? '',
            start: first.start ?? first.timeIn ?? '',
            end: first.end ?? first.timeOut ?? '',
            minutes: first.minutes ?? 0,
            setting: first.setting ?? 'on_site',
            individualsCount: first.individualsCount ?? 0,
            staffCount: first.staffCount ?? 1,
          });
        }
      });
    }

    // ----- WEEKLY INITIALS ----- //
    this.patchWeeklyArrayFromHeader(this.socializationArray, header.socialization);
    this.patchWeeklyArrayFromHeader(this.selfHelpArray, header.selfHelp);
    this.patchWeeklyArrayFromHeader(this.adaptiveArray, header.adaptive);
    this.patchWeeklyArrayFromHeader(
      this.implementationArray,
      header.implementation,
    );
    this.patchWeeklyArrayFromHeader(this.communityArray, header.community);

    // ----- NOTES ----- //
    this.patchNotesFromHeader(this.notes, header.notes);
  }

  // ======================================================================
  //  HELPERS – WEEKLY + NOTES
  // ======================================================================

  /** Hydrate a weekly initials FormArray from header[property] arrays */
  private patchWeeklyArrayFromHeader(
    formArray: FormArray<FormGroup>,
    savedRows?: WeeklyInitialRow[],
  ): void {
    if (!savedRows?.length) return;

    savedRows.forEach((row, idx) => {
      const group = formArray.at(idx) as FormGroup | undefined;
      if (!group) return;

      group.patchValue({
        label: row.label ?? group.get('label')?.value ?? '',
        mon: row.mon ?? '',
        tue: row.tue ?? '',
        wed: row.wed ?? '',
        thu: row.thu ?? '',
        fri: row.fri ?? '',
      });
    });
  }

  /** Hydrate note rows from header.notes[] */
  private patchNotesFromHeader(
    formArray: FormArray<FormGroup>,
    savedNotes?: WeeklyNote[],
  ): void {
    if (!savedNotes?.length) return;

    savedNotes.forEach((row, idx) => {
      const group = formArray.at(idx) as FormGroup | undefined;
      if (!group) return;

      group.patchValue({
        date: row.date ?? '',
        initials: row.initials ?? '',
        comment: row.comment ?? '',
      });
    });
  }

  // ===== Auto-save engine ===== //

  private setupAutoSave(): void {
    if (!this.form) return;

    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(2000),
        distinctUntilChanged(
          (a, b) => JSON.stringify(a) === JSON.stringify(b),
        ),
        takeUntil(this.destroy$),
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

  // ======================================================================
  //  SAVE → DTO (UI → API mapper)
  // ======================================================================

  private triggerSave(_source: AutoSaveSource): void {
    if (!this.form) return;

    const raw = this.form.getRawValue() as any;

    const { logId, payload } = buildStaffLogSavePayload({
      currentLogId: this.currentLogId,
      providerId: this.providerId,
      consumerId: this.consumerId,
      serviceDate: this.serviceDate,
      rawForm: raw,
    });

    this.autoSaveStatus = 'saving';
    this.issFacade.saveLog(logId, payload);
  }

  onSave(): void {
    this.queueSave('manual');
  }

  // ===== Ratio helper ===== //

  ratio(index: number): string {
    const row = this.serviceWeek.at(index) as FormGroup;
    const setting = row.get('setting')?.value as
      | 'on_site'
      | 'off_site'
      | undefined;

    if (setting !== 'off_site') {
      return '';
    }

    const individuals = Number(row.get('individualsCount')?.value ?? 0);
    const staff = Number(row.get('staffCount')?.value ?? 1);

    if (!staff) return '';
    return `${individuals}:${staff}`;
  }

  // ===== Back to year ===== //

  backToYear(): void {
    this.router.navigate([
      '/iss',
      'provider',
      this.providerId,
      'consumer',
      this.consumerId,
      'year',
    ]);
  }
}
