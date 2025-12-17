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
  take,
} from 'rxjs/operators';

import { IssFacade } from '@hhsc-compliance/data-access';
import {
  StaffLog,
  StaffLogHeader,
  ServiceWeek,
  ServiceDayEntry,
  WeeklyInitialRow,
  WeeklyNote,
  normalizeStaffLogFromApi,
  UpdateStaffLogDto,
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

/* ============================================================
 * Typed form value shapes (removes all `any`)
 * ============================================================ */

type IssWeekHeaderFormValue = {
  individualName: string;
  date: string;
  lon: string;
  provider: string;
  license: string;
  staffNameTitle: string;
};

type IssServiceRowFormValue = {
  day: string;
  date: string;
  providerName: string;
  providerSignature: string;
  start: string;
  end: string;
  minutes: number;
  setting: 'on_site' | 'off_site' | string;
  individualsCount: number;
  staffCount: number;
};

type IssWeeklyRowFormValue = {
  label: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
};

type IssNoteRowFormValue = {
  date: string;
  initials: string;
  comment: string;
};

type IssWeekFormValue = {
  header: IssWeekHeaderFormValue;
  serviceWeek: IssServiceRowFormValue[];
  socialization: IssWeeklyRowFormValue[];
  selfHelp: IssWeeklyRowFormValue[];
  adaptive: IssWeeklyRowFormValue[];
  implementation: IssWeeklyRowFormValue[];
  community: IssWeeklyRowFormValue[];
  notes: IssNoteRowFormValue[];
};

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

  // helpful for debugging / optional UI display later
  private lastSaveSource: AutoSaveSource | null = null;

  // mobile flag used in template + SCSS
  isMobile = false;

  private readonly destroy$ = new Subject<void>();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly issFacade = inject(IssFacade);

  // ----- store streams -----
  get currentLog$() {
    return this.issFacade.currentLog$;
  }
  get loading$() {
    return this.issFacade.currentLogLoading$;
  }
  get saving$() {
    return this.issFacade.currentLogSaving$;
  }

  // ===== FormArray getters for template =====

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

  // ===== Lifecycle =====

  ngOnInit(): void {
    this.buildForm();
    this.updateIsMobile();
    this.bindRouteParams();
    this.bindLogStream();
    this.setupAutoSave();
    this.setupLifecycleAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== Responsive helper =====

  private updateIsMobile(): void {
    if (typeof window === 'undefined') {
      this.isMobile = false;
      return;
    }
    this.isMobile = window.innerWidth <= 768;
  }

  // ===== Form building (ISS 8615-ish structure) =====

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

  // ===== Route + NgRx wiring =====

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

          // Prefill header for brand-new weeks without overwriting existing data
          this.prefillHeaderFromContext();
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
        const normalized = normalizeStaffLogFromApi(log);

        this.currentLogId = normalized.id;
        this.patchFormFromLog(normalized);
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
  //  PREFILL HEADER FOR NEW WEEKS
  // ======================================================================

  private prefillHeaderFromContext(): void {
    if (!this.form) return;

    const headerGroup = this.form.get('header') as FormGroup | null;
    if (!headerGroup) return;

    const patch: Record<string, unknown> = {};

    const currentName = headerGroup.get('individualName')?.value;
    const currentDate = headerGroup.get('date')?.value;

    if (!currentDate && this.serviceDate) {
      patch['date'] = this.serviceDate;
    }

    this.issFacade.selectedConsumer$
      .pipe(take(1))
      .subscribe((consumer) => {
        if (consumer && !currentName) {
          patch['individualName'] = `${consumer.firstName ?? ''} ${
            consumer.lastName ?? ''
          }`.trim();
        }

        if (Object.keys(patch).length > 0) {
          headerGroup.patchValue(patch);
        }
      });
  }

  // ======================================================================
  //  SERVICE WEEK – HELPER TO CHECK NON-EMPTY
  // ======================================================================

  private hasNonEmptyWeek(week?: ServiceWeek | null): boolean {
    if (!week) return false;

    const days: (keyof ServiceWeek)[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    return days.some((day) => (week[day]?.length ?? 0) > 0);
  }

  // ======================================================================
  //  PATCH LOG → FORM
  // ======================================================================

  private patchFormFromLog(log: StaffLog): void {
    const header = (log.header ?? {}) as StaffLogHeader & {
      serviceWeek?: ServiceWeek;
    };

    this.form.patchValue({
      header: {
        individualName: header.individualName ?? '',
        date: header.date ?? this.serviceDate ?? '',
        lon: header.lon ?? header.levelOfNeed?.toString?.() ?? '',
        provider: header.provider ?? header.issProviderName ?? '',
        license: header.license ?? header.issProviderLicense ?? '',
        staffNameTitle: header.staffNameTitle ?? '',
      },
    });

    const weekFromRoot: ServiceWeek | undefined = log.serviceWeek;
    const weekFromHeader: ServiceWeek | undefined = header.serviceWeek;

    const week: ServiceWeek | undefined = this.hasNonEmptyWeek(weekFromRoot)
      ? weekFromRoot
      : this.hasNonEmptyWeek(weekFromHeader)
        ? weekFromHeader
        : undefined;

    if (week) {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ] as const;

      days.forEach((dayKey, idx) => {
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

    this.patchWeeklyArrayFromHeader(
      this.socializationArray,
      header.socialization,
    );
    this.patchWeeklyArrayFromHeader(this.selfHelpArray, header.selfHelp);
    this.patchWeeklyArrayFromHeader(this.adaptiveArray, header.adaptive);
    this.patchWeeklyArrayFromHeader(
      this.implementationArray,
      header.implementation,
    );
    this.patchWeeklyArrayFromHeader(this.communityArray, header.community);

    this.patchNotesFromHeader(this.notes, header.notes);
  }

  // ======================================================================
  //  HELPERS – WEEKLY + NOTES
  // ======================================================================

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

  // ===== Auto-save engine =====

  private setupAutoSave(): void {
    if (!this.form) return;

    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(2000),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.queueSave('typing'));
  }

  private setupLifecycleAutoSave(): void {
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.updateIsMobile());

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
  //  BUILD PAYLOAD (no `any`)
  // ======================================================================

  private buildCommonPayload(): {
    header: StaffLogHeader & { serviceWeek?: ServiceWeek };
    serviceWeek: ServiceWeek;
  } {
    const raw = this.form.getRawValue() as IssWeekFormValue;
    const serviceWeek = this.buildServiceWeekPayload();

    const header: StaffLogHeader & { serviceWeek?: ServiceWeek } = {
      ...(raw.header ?? ({} as IssWeekHeaderFormValue)),

      socialization: raw.socialization ?? [],
      selfHelp: raw.selfHelp ?? [],
      adaptive: raw.adaptive ?? [],
      implementation: raw.implementation ?? [],
      community: raw.community ?? [],
      notes: raw.notes ?? [],

      serviceWeek,
    };

    return { header, serviceWeek };
  }

  private buildPayload(): UpdateStaffLogDto {
    const { header, serviceWeek } = this.buildCommonPayload();
    return { header, serviceWeek };
  }

  private triggerSave(source: AutoSaveSource): void {
    if (!this.form) return;

    // use `source` so lint doesn't flag it and it’s useful for debugging/UI later
    this.lastSaveSource = source;

    if (!this.consumerId || !this.serviceDate) {
      console.warn('[ISS week] Missing consumerId or serviceDate; abort save', {
        consumerId: this.consumerId,
        serviceDate: this.serviceDate,
      });
      return;
    }

    if (this.form.invalid) {
      this.autoSaveStatus = 'error';
      return;
    }

    const payload = this.buildPayload();
    this.autoSaveStatus = 'saving';
    this.lastSavedAt = new Date();

    this.issFacade.saveLog(this.currentLogId, payload);
  }

  private buildServiceWeekPayload(): ServiceWeek {
    const rows = this.serviceWeek.controls as FormGroup[];

    const mapRow = (g: FormGroup): ServiceDayEntry => {
      const v = g.getRawValue() as IssServiceRowFormValue;

      return {
        timeIn: v.start ?? null,
        timeOut: v.end ?? null,
        activity: null,
        notes: null,

        date: v.date ?? null,
        providerName: v.providerName ?? null,
        providerSignature: v.providerSignature ?? null,
        start: v.start ?? null,
        end: v.end ?? null,
        minutes: v.minutes ?? 0,
        setting: v.setting ?? 'on_site',
        individualsCount: v.individualsCount ?? 0,
        staffCount: v.staffCount ?? 1,
      };
    };

    const [mon, tue, wed, thu, fri] = rows.map(mapRow);

    return {
      monday: [mon],
      tuesday: [tue],
      wednesday: [wed],
      thursday: [thu],
      friday: [fri],
    };
  }

  onSave(): void {
    this.queueSave('manual');
  }

  ratio(index: number): string {
    const row = this.serviceWeek.at(index) as FormGroup;
    const setting = row.get('setting')?.value as
      | 'on_site'
      | 'off_site'
      | undefined;

    if (setting !== 'off_site') return '';

    const individuals = Number(row.get('individualsCount')?.value ?? 0);
    const staff = Number(row.get('staffCount')?.value ?? 1);

    if (!staff) return '';
    return `${individuals}:${staff}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ======================================================================
  //  PRINT WEEK – RELIABLE IFRAME + LIVE VALUE COPY
  // ======================================================================

  printWeek(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const source = document.querySelector('.iss-week-page') as HTMLElement | null;

    if (!source) {
      console.warn('[ISS week] .iss-week-page not found for print');
      return;
    }

    // Clean up any leftover print frames first
    document
      .querySelectorAll('iframe.iss-print-frame')
      .forEach((el) => el.remove());

    const iframe = document.createElement('iframe');
    iframe.className = 'iss-print-frame';
    iframe.setAttribute('aria-hidden', 'true');

    // Hard lock the iframe so it cannot overlay or intercept clicks
    Object.assign(iframe.style, {
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      width: '1px',
      height: '1px',
      border: '0',
      visibility: 'hidden',
      opacity: '0',
      pointerEvents: 'none',
    } as Partial<CSSStyleDeclaration>);

    document.body.appendChild(iframe);

    const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!frameDoc) {
      console.warn('[ISS week] Unable to access iframe document for print');
      iframe.remove();
      return;
    }

    frameDoc.open();
    frameDoc.write(this.buildPrintShellHtml());
    frameDoc.close();

    let didRun = false;

    const cleanup = () => {
      try {
        // Hard reset any accidental scroll locks
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
      } catch {
        /* empty */
      }

      try {
        iframe.remove();
      } catch {
        /* empty */
      }
    };

    // Absolute safety cleanup (in case print is canceled or browser skips onafterprint)
    const safetyTimer = window.setTimeout(cleanup, 8000);

    const runPrint = () => {
      if (didRun) return;
      didRun = true;

      try {
        const root = frameDoc.getElementById('print-root');
        if (!root) {
          console.warn('[ISS week] print-root not found in iframe');
          window.clearTimeout(safetyTimer);
          cleanup();
          return;
        }

        const clone = source.cloneNode(true) as HTMLElement;

        // Safety reset before creating print frame
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';

        root.appendChild(clone);
        this.copyLiveFormValues(source, clone);

        const frameWin = iframe.contentWindow;
        if (!frameWin) {
          window.clearTimeout(safetyTimer);
          cleanup();
          return;
        }

        frameWin.requestAnimationFrame(() => {
          frameWin.requestAnimationFrame(() => {
            frameWin.focus();
            frameWin.print();

            frameWin.onafterprint = () => {
              window.clearTimeout(safetyTimer);
              cleanup();
            };
          });
        });
      } catch (err) {
        console.warn('[ISS week] print error', err);
        window.clearTimeout(safetyTimer);
        cleanup();
      }
    };

    iframe.onload = runPrint;
    setTimeout(runPrint, 0);
  }

  private buildPrintShellHtml(): string {
    if (typeof document === 'undefined') {
      return `<!doctype html><html><head></head><body><div id="print-root"></div></body></html>`;
    }

    const headClone = document.head.cloneNode(true) as HTMLHeadElement;
    headClone.querySelectorAll('script').forEach((s) => s.remove());

    const headHtml = headClone.innerHTML;

    return `
      <!doctype html>
      <html>
        <head>
          ${headHtml}
          <title>ISS Staff Log – Week of ${this.serviceDate ?? ''}</title>
          <style>
            @media print {
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div id="print-root"></div>
        </body>
      </html>
    `;
  }

  private copyLiveFormValues(
    sourceRoot: HTMLElement,
    targetRoot: HTMLElement,
  ): void {
    const srcFields = Array.from(
      sourceRoot.querySelectorAll('input, textarea, select'),
    ) as Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

    const dstFields = Array.from(
      targetRoot.querySelectorAll('input, textarea, select'),
    ) as Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

    const len = Math.min(srcFields.length, dstFields.length);

    for (let i = 0; i < len; i++) {
      const s = srcFields[i];
      const d = dstFields[i];

      if (s instanceof HTMLInputElement && d instanceof HTMLInputElement) {
        const type = (s.getAttribute('type') || 'text').toLowerCase();

        if (type === 'checkbox' || type === 'radio') {
          d.checked = s.checked;
          if (s.checked) d.setAttribute('checked', '');
          else d.removeAttribute('checked');
        } else {
          d.value = s.value ?? '';
          d.setAttribute('value', s.value ?? '');
        }
        continue;
      }

      if (s instanceof HTMLTextAreaElement && d instanceof HTMLTextAreaElement) {
        d.value = s.value ?? '';
        d.textContent = s.value ?? '';
        continue;
      }

      if (s instanceof HTMLSelectElement && d instanceof HTMLSelectElement) {
        d.value = s.value;
        Array.from(d.options).forEach((opt) => {
          if (opt.value === s.value) opt.setAttribute('selected', '');
          else opt.removeAttribute('selected');
        });
      }
    }
  }

  // ===== Back to year =====

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
