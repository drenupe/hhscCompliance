import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of, tap } from 'rxjs';

import { ResidentialLocationsApi } from '@hhsc-compliance/data-access';
import {
  ResidentialLocationDto,
  ResidentialType,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';

import { OVERLAY_REF, OVERLAY_SHEET_DATA, OverlayRef } from '@hhsc-compliance/ui-overlay';

export type ResidentialSheetData =
  | { mode: 'create' }
  | { mode: 'edit'; row: ResidentialLocationDto };

export type ResidenceEditorResult = { saved?: true; deleted?: true };

@Component({
  standalone: true,
  selector: 'lib-residential-location-sheet',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sheet">
      <div class="sheet__head">
        <div>
          <div class="h2">{{ isEdit ? 'Edit residence' : 'Add residence' }}</div>
          <div class="sub">Mobile-first editor</div>
        </div>

        <button class="icon-btn" type="button" (click)="close()">✕</button>
      </div>

      <form class="form" [formGroup]="form" (ngSubmit)="save()">

        <!-- ✅ Location Code -->
        <label class="field">
          <div class="label">Location code</div>
          <input
            class="input"
            type="text"
            formControlName="locationCode"
            maxlength="4"
            placeholder="e.g. A102"
            (input)="onLocationCodeInput()"
          />
          <div
            class="hint"
            *ngIf="locationCode.invalid && (locationCode.dirty || locationCode.touched)"
          >
            Must be exactly 4 letters or numbers (A–Z, 0–9).
          </div>
        </label>

        <label class="field">
          <div class="label">Residence name</div>
          <input class="input" type="text" formControlName="name" placeholder="e.g., Oak Ln – 3 Person" />
          <div class="hint" *ngIf="name.invalid && (name.dirty || name.touched)">Name is required.</div>
        </label>

        <label class="field">
          <div class="label">Type</div>
          <select class="input" formControlName="type">
            <option value="THREE_PERSON">Three-person residence</option>
            <option value="FOUR_PERSON">Four-person residence</option>
            <option value="HOST_HOME">Host home / companion care</option>
          </select>
        </label>

        <label class="field">
          <div class="label">Address</div>
          <input class="input" type="text" formControlName="address" placeholder="Street / suite (optional)" />
        </label>

        <div class="grid">
          <label class="field">
            <div class="label">City</div>
            <input class="input" type="text" formControlName="city" placeholder="City" />
          </label>

          <label class="field">
            <div class="label">State</div>
            <input class="input" type="text" formControlName="state" placeholder="TX" />
          </label>

          <label class="field">
            <div class="label">ZIP</div>
            <input class="input" type="text" inputmode="numeric" formControlName="zip" placeholder="#####"/>
          </label>
        </div>

        <div class="row">
          <button class="btn btn--primary" type="submit" [disabled]="busy || form.invalid">
            {{ isEdit ? 'Save changes' : 'Create residence' }}
          </button>

          <button class="btn btn--ghost" type="button" (click)="resetForm()" [disabled]="busy">
            Reset
          </button>

          <button class="btn btn--danger" type="button" (click)="remove()" [disabled]="busy || !isEdit">
            Delete
          </button>
        </div>

        <div class="msg" *ngIf="message">{{ message }}</div>
      </form>
    </div>
  `,
  styles: [`
    :host { display:block; min-width: 0; }

    .sheet { display:grid; gap: var(--sp-3); min-width: 0; }
    .sheet__head { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-2); }

    .icon-btn {
      border: 1px solid var(--clr-line);
      background: transparent;
      color: var(--clr-text-strong);
      border-radius: 12px;
      padding: .4rem .6rem;
      cursor: pointer;
    }

    .form { display:grid; gap: var(--sp-3); min-width: 0; }
    .field { display:grid; gap: 6px; min-width: 0; }
    .label { font-weight: 700; color: var(--clr-text-muted); }
    .hint { font-size: .8rem; color: var(--clr-error); }
    .msg { opacity: .9; font-size: .9rem; }

    .input { width: 100%; max-width: 100%; min-width: 0; box-sizing: border-box; }

    .grid { display:grid; grid-template-columns: 1fr 120px 1fr; gap: var(--sp-2); min-width: 0; }
    @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

    .row { display:flex; gap: var(--sp-2); flex-wrap: wrap; }

    .btn--primary {
      background: color-mix(in srgb, var(--clr-accent) 35%, var(--clr-card));
      border-color: color-mix(in srgb, var(--clr-accent) 55%, var(--clr-line));
      color: var(--clr-text-strong);
      font-weight: 800;
    }
    .btn--danger {
      background: color-mix(in srgb, var(--clr-error) 20%, var(--clr-card));
      border-color: color-mix(in srgb, var(--clr-error) 55%, var(--clr-line));
      color: var(--clr-text-strong);
      font-weight: 800;
    }
  `],
})
export class ResidentialLocationSheetComponent {
  private api = inject(ResidentialLocationsApi);
  private ref = inject(OVERLAY_REF) as OverlayRef<ResidenceEditorResult>;
  private data = inject(OVERLAY_SHEET_DATA) as ResidentialSheetData;

  busy = false;
  message = '';

  get isEdit(): boolean {
    return this.data?.mode === 'edit';
  }

  get editingRow(): ResidentialLocationDto | null {
    return this.isEdit ? (this.data as any).row : null;
  }

  form = new FormGroup({
    // ✅ added
    locationCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{4}$/)],
    }),

    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<ResidentialType>('THREE_PERSON', { nonNullable: true }),

    address: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    state: new FormControl('TX', { nonNullable: true }),
    zip: new FormControl('', { nonNullable: true }),
  });

  get locationCode() { return this.form.controls.locationCode; }
  get name() { return this.form.controls.name; }

  constructor() {
    const r = this.editingRow;
    if (r) {
      this.form.patchValue({
        locationCode: (r.locationCode ?? '').toUpperCase(),
        name: r.name,
        type: r.type,
        address: r.address ?? '',
        city: r.city ?? '',
        state: (r.state ?? 'TX').toUpperCase(),
        zip: r.zip ?? '',
      }, { emitEvent: false });
    }
  }

  onLocationCodeInput(): void {
    const v = (this.locationCode.value ?? '').toUpperCase();
    if (v !== this.locationCode.value) {
      this.locationCode.setValue(v, { emitEvent: false });
    }
  }

  close() {
    this.ref.close();
  }

  resetForm() {
    const r = this.editingRow;
    if (r) {
      this.form.reset({
        locationCode: (r.locationCode ?? '').toUpperCase(),
        name: r.name,
        type: r.type,
        address: r.address ?? '',
        city: r.city ?? '',
        state: (r.state ?? 'TX').toUpperCase(),
        zip: r.zip ?? '',
      }, { emitEvent: false });
    } else {
      this.form.reset(
        { locationCode: '', name: '', type: 'THREE_PERSON', address: '', city: '', state: 'TX', zip: '' },
        { emitEvent: false },
      );
    }
    this.form.markAsPristine();
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.payloadFromForm();
    this.message = '';
    this.busy = true;

    const r = this.editingRow;
    const req$ = r ? this.api.update(r.id, payload) : this.api.create(payload);

    req$.pipe(
      tap(() => this.ref.close({ saved: true })),
      catchError((err) => {
        const code = err?.status ?? 'unknown';
        this.message = `Save failed (${code}). ${err?.error?.message ?? ''}`.trim();
        return of(null);
      }),
      finalize(() => (this.busy = false)),
    ).subscribe();
  }

  remove() {
    const r = this.editingRow;
    if (!r) return;

    this.message = '';
    this.busy = true;

    this.api.remove(r.id).pipe(
      tap(() => this.ref.close({ deleted: true })),
      catchError((err) => {
        this.message = `Delete failed (${err?.status ?? 'unknown'}).`;
        return of(null);
      }),
      finalize(() => (this.busy = false)),
    ).subscribe();
  }

  private payloadFromForm(): UpsertResidentialLocationInput {
    const v = this.form.getRawValue();
    const clean = (s: string) => s.trim();
    const toNull = (s: string) => {
      const t = clean(s);
      return t.length ? t : null;
    };
    const digitsZip = (s: string) => clean(s).replace(/[^\d-]/g, '');

    return {
      // ✅ added
      locationCode: clean(v.locationCode).toUpperCase(),

      name: clean(v.name),
      type: v.type,
      address: toNull(v.address),
      city: toNull(v.city),
      state: (clean(v.state) || 'TX').toUpperCase(),
      zip: toNull(digitsZip(v.zip)),
    } as any;
  }
}
