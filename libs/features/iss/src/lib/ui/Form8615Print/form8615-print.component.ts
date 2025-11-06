// libs/features/iss/src/lib/ui/Form8615Print/form8615-print.component.ts
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';

// ---- external shape coming from pages ----
export interface Form8615Header {
  individualName?: string;
  date?: string;
  staffNameTitle?: string;
  startTime?: string;
  endTime?: string;
  totalMinutes?: number;
  setting?: 'on_site' | 'off_site';
  individualsCount?: number;
  staffCount?: number;
  lon?: string;
  provider?: string;
  license?: string;
}

export interface Form8615Row {
  date?: string;
  initials?: string;
  comment?: string;
}

// ---- typed sub-forms ----
type HeaderForm = FormGroup<{
  individualName: FormControl<string>;
  date: FormControl<string>;
  staffNameTitle: FormControl<string | null>;
  startTime: FormControl<string | null>;
  endTime: FormControl<string | null>;
  totalMinutes: FormControl<number | null>;
  setting: FormControl<'on_site' | 'off_site'>;
  individualsCount: FormControl<number | null>;
  staffCount: FormControl<number | null>;
  lon: FormControl<string | null>;
  provider: FormControl<string | null>;
  license: FormControl<string | null>;
}>;

type RowForm = FormGroup<{
  date: FormControl<string>;
  initials: FormControl<string>;
  comment: FormControl<string>;
}>;

@Component({
  selector: 'iss-form8615-print',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8615-print.component.html',
})
export class Form8615PrintComponent implements OnChanges {
  // pages still pass these 👇
  @Input({ required: true }) header!: Form8615Header;
  @Input({ required: true }) rows!: Form8615Row[];

  private fb = inject(FormBuilder);

  // 👇 this is the ACTUAL form the template binds to
  form: FormGroup<{
    header: HeaderForm;
    rows: FormArray<RowForm>;
  }>;

  constructor() {
    this.form = this.buildForm();
  }

  // ---- builders -------------------------------------------------
  private buildForm(): FormGroup<{ header: HeaderForm; rows: FormArray<RowForm> }> {
    return this.fb.group({
      header: this.buildHeader(),
      // 👇 THIS is the key part: we tell Angular exactly what's in the array
      rows: this.fb.array<RowForm>([]),
    });
  }

  private buildHeader(): HeaderForm {
    return this.fb.group({
      individualName: this.fb.control('', { nonNullable: true }),
      date: this.fb.control('', { nonNullable: true }),
      staffNameTitle: this.fb.control<string | null>(null),
      startTime: this.fb.control<string | null>(null),
      endTime: this.fb.control<string | null>(null),
      totalMinutes: this.fb.control<number | null>(null),
      setting: this.fb.control<'on_site' | 'off_site'>('off_site', { nonNullable: true }),
      individualsCount: this.fb.control<number | null>(null),
      staffCount: this.fb.control<number | null>(null),
      lon: this.fb.control<string | null>(null),
      provider: this.fb.control<string | null>(null),
      license: this.fb.control<string | null>(null),
    });
  }

  private buildRow(data?: Form8615Row): RowForm {
    return this.fb.group({
      date: this.fb.control(data?.date ?? '', { nonNullable: true }),
      initials: this.fb.control(data?.initials ?? '', { nonNullable: true }),
      comment: this.fb.control(data?.comment ?? '', { nonNullable: true }),
    });
  }

  // ---- lifecycle ------------------------------------------------
  ngOnChanges(_: SimpleChanges): void {
    // 1) patch header
    if (this.header) {
      this.headerGroup.patchValue(
        {
          individualName: this.header.individualName ?? '',
          date: this.header.date ?? '',
          staffNameTitle: this.header.staffNameTitle ?? null,
          startTime: this.header.startTime ?? null,
          endTime: this.header.endTime ?? null,
          totalMinutes: this.header.totalMinutes ?? null,
          setting: this.header.setting ?? 'off_site',
          individualsCount: this.header.individualsCount ?? null,
          staffCount: this.header.staffCount ?? null,
          lon: this.header.lon ?? null,
          provider: this.header.provider ?? null,
          license: this.header.license ?? null,
        },
        { emitEvent: false }
      );
    }

    // 2) rebuild rows to match incoming @Input()
    const arr = this.rowsArray;
    arr.clear({ emitEvent: false });
    for (const r of this.rows ?? []) {
      arr.push(this.buildRow(r), { emitEvent: false });
    }
  }

  // ---- getters for template ------------------------------------
  get headerGroup(): HeaderForm {
    return this.form.controls.header;
  }

  get rowsArray(): FormArray<RowForm> {
    return this.form.controls.rows;
  }

  ratio(): string {
    const h = this.headerGroup.value;
    const i = Number(h.individualsCount ?? 0);
    const s = Number(h.staffCount ?? 1) || 1;
    return `${i}:${s}`;
  }
}
