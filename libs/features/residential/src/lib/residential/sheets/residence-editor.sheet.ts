import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of, take, tap } from 'rxjs';

import { ResidentialLocationsApi } from '@hhsc-compliance/data-access';
import {
  ResidentialLocationDto,
  ResidentialType,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';
import { OVERLAY_REF, OVERLAY_SHEET_DATA, OverlayRef } from '@hhsc-compliance/ui-overlay';

export type ResidenceEditorResult = {
  saved?: true;
  deleted?: true;
};

type SheetData = {
  mode: 'create' | 'edit';
  existing?: ResidentialLocationDto;
};

@Component({
  standalone: true,
  selector: 'lib-residence-editor-sheet',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sheet-head">
      <div>
        <div class="h2">{{ mode === 'edit' ? 'Edit residence' : 'Add residence' }}</div>
        <div class="sub">Mobile-first editor</div>
      </div>

      <button class="icon-btn" type="button" (click)="close()">✕</button>
    </div>

    <form class="form" [formGroup]="form" (ngSubmit)="save()">
      <label class="field">
  <div class="label">Location code</div>

  <input
    class="input"
    type="text"
    formControlName="locationCode"
    maxlength="4"
    placeholder="e.g. A102"
    (input)="locationCode.setValue(locationCode.value.toUpperCase(), { emitEvent: false })"
  />

  <div class="hint" *ngIf="locationCode.invalid && (locationCode.dirty || locationCode.touched)">
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
        <button class="btn btn--primary" type="submit" [disabled]="saving || form.invalid">
          {{ mode === 'edit' ? 'Save changes' : 'Create residence' }}
        </button>

        <button class="btn btn--ghost" type="button" (click)="resetForm()" [disabled]="saving">
          Reset
        </button>

        <button
          class="btn btn--danger"
          type="button"
          (click)="remove()"
          [disabled]="saving || mode !== 'edit'"
        >
          Delete
        </button>
      </div>

      <div class="msg" *ngIf="message">{{ message }}</div>
    </form>
  `,
  styles: [`
    .sheet-head { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-2); margin-bottom: var(--sp-3); }
    .icon-btn { border: 1px solid var(--clr-line); background: transparent; color: var(--clr-text-strong); border-radius: 12px; padding: .4rem .6rem; cursor: pointer; }

    .form { display:grid; gap: var(--sp-3); min-width:0; }
    .field { display:grid; gap: 6px; min-width:0; }
    .label { font-weight: 700; color: var(--clr-text-muted); }
    .hint { font-size: .8rem; color: var(--clr-error); }
    .input { width: 100%; max-width: 100%; box-sizing: border-box; }

    .grid { display:grid; grid-template-columns: 1fr 120px 1fr; gap: var(--sp-2); min-width:0; }
    @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

    .row { display:flex; gap: var(--sp-2); flex-wrap: wrap; }
    .msg { font-size: .9rem; opacity: .9; }
  `],
})
export class ResidenceEditorSheetComponent {
  private api = inject(ResidentialLocationsApi);

  // ✅ strongly typed overlay ref + sheet data
  private ref = inject(OVERLAY_REF) as OverlayRef<ResidenceEditorResult>;
  private data = inject(OVERLAY_SHEET_DATA) as SheetData;

  mode: SheetData['mode'] = this.data?.mode ?? 'create';
  existing: ResidentialLocationDto | null = this.data?.existing ?? null;

  saving = false;
  message = '';

 
  form = new FormGroup({
  locationCode: new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]{4}$/),
    ],
  }),

  name: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  }),

  type: new FormControl<ResidentialType>('THREE_PERSON', { nonNullable: true }),
  address: new FormControl('', { nonNullable: true }),
  city: new FormControl('', { nonNullable: true }),
  state: new FormControl('TX', { nonNullable: true }),
  zip: new FormControl('', { nonNullable: true }),
});

  get name() { return this.form.controls.name; }

  constructor() {
if (this.existing) {
  this.form.patchValue({
    locationCode: this.existing.locationCode ?? '',
    name: this.existing.name,
    type: this.existing.type,
    address: this.existing.address ?? '',
    city: this.existing.city ?? '',
    state: (this.existing.state ?? 'TX').toUpperCase(),
    zip: this.existing.zip ?? '',
  }, { emitEvent: false });
}

  }

  close(): void {
    this.ref.close();
  }

  resetForm(): void {
    this.form.reset(
      { name: '', type: 'THREE_PERSON', address: '', city: '', state: 'TX', zip: '' },
      { emitEvent: false },
    );
    this.form.markAsPristine();
  }

  save(): void {
    if (this.form.invalid) return;

    this.message = '';
    this.saving = true;

    const payload = this.payloadFromForm();
    const req$ = this.existing
      ? this.api.update(this.existing.id, payload)
      : this.api.create(payload);

    req$.pipe(
      take(1),
      tap(() => this.ref.close({ saved: true })),
      catchError((err) => {
        const code = err?.status ?? 'unknown';
        this.message = `Save failed (${code}). ${err?.error?.message ?? ''}`.trim();
        return of(null);
      }),
      finalize(() => (this.saving = false)),
    ).subscribe();
  }

  remove(): void {
    if (!this.existing) return;

    this.message = '';
    this.saving = true;

    this.api.remove(this.existing.id).pipe(
      take(1),
      tap(() => this.ref.close({ deleted: true })),
      catchError((err) => {
        this.message = `Delete failed (${err?.status ?? 'unknown'}).`;
        return of(null);
      }),
      finalize(() => (this.saving = false)),
    ).subscribe();
  }
get locationCode() {
  return this.form.controls.locationCode;
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
  locationCode: clean(v.locationCode).toUpperCase(),
  name: clean(v.name),
  type: v.type,
  address: toNull(v.address),
  city: toNull(v.city),
  state: (clean(v.state) || 'TX').toUpperCase(),
  zip: toNull(digitsZip(v.zip)),
};
  }
}
