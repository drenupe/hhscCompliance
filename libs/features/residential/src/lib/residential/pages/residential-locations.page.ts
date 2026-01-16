import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of, tap } from 'rxjs';

import { ResidentialLocationsApi } from '@hhsc-compliance/data-access';
import {
  ResidentialLocationDto,
  ResidentialType,
  UpsertResidentialLocationInput,
} from '@hhsc-compliance/shared-models';

@Component({
  standalone: true,
  selector: 'lib-residential-locations-page',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="header card">
        <div>
          <div class="h1">Residential</div>
          <div class="sub">Residences / locations under the Provider</div>
        </div>

        <div class="header-actions">
          <button class="btn btn--primary" type="button" (click)="openCreate()" [disabled]="busy()">
            + Add residence
          </button>
          <button class="btn btn--ghost" type="button" (click)="reload()" [disabled]="busy()">
            Reload
          </button>
        </div>
      </div>

      <div class="msg" *ngIf="message()">{{ message() }}</div>

      <div class="list">
        <button
          class="loc card"
          type="button"
          *ngFor="let r of rows()"
          (click)="openEdit(r)"
        >
          <div class="loc-top">
            <div class="loc-name">{{ r.name }}</div>
            <div class="pill">{{ labelType(r.type) }}</div>
          </div>

          <div class="loc-sub">
            <span *ngIf="formatAddr(r) as a; else noaddr">{{ a }}</span>
            <ng-template #noaddr><span class="muted">No address yet</span></ng-template>
          </div>
        </button>

        <div class="empty card" *ngIf="!busy() && rows().length === 0">
          <div class="h2">No residences yet</div>
          <div class="sub">Tap “Add residence” to create your first location.</div>
        </div>
      </div>

      <!-- Bottom-sheet editor -->
      <button
  type="button"
  class="sheet-backdrop"
  *ngIf="sheetOpen()"
  (click)="closeSheet()"
  aria-label="Close editor"
></button>

      <div class="sheet" *ngIf="sheetOpen()">
        <div class="sheet-head">
          <div>
            <div class="h2">{{ editing() ? 'Edit residence' : 'Add residence' }}</div>
            <div class="sub">Mobile-first editor</div>
          </div>

          <button class="icon-btn" type="button" (click)="closeSheet()">✕</button>
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="save()">
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
            <button class="btn btn--primary" type="submit" [disabled]="busy() || form.invalid">
              {{ editing() ? 'Save changes' : 'Create residence' }}
            </button>

            <button class="btn btn--ghost" type="button" (click)="resetForm()" [disabled]="busy()">
              Reset
            </button>

            <button class="btn btn--danger" type="button" (click)="remove()" [disabled]="busy() || !editing()">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: var(--sp-4); display: grid; gap: var(--sp-4); }

    .header { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-3); }
    .header-actions { display:flex; gap: var(--sp-2); flex-wrap: wrap; }

    .msg { font-size: .9rem; opacity: .9; }

    .list { display:grid; gap: var(--sp-3); }
    .loc { width: 100%; text-align: left; cursor: pointer; }
    .loc-top { display:flex; justify-content:space-between; gap: var(--sp-2); align-items:center; }
    .loc-name { font-weight: 800; color: var(--clr-text-strong); }
    .loc-sub { margin-top: 6px; opacity: .9; }

    .pill {
      padding: .25rem .6rem;
      border-radius: var(--radius-pill);
      border: 1px solid var(--clr-line);
      background: color-mix(in srgb, var(--clr-card) 78%, var(--clr-accent) 22%);
      color: var(--clr-text-strong);
      font-size: .8rem;
      white-space: nowrap;
    }

    .empty { text-align:center; }

    /* bottom sheet */
    .sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  z-index: 40;

  /* reset button appearance */
  border: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}
   
    .sheet-head { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-2); margin-bottom: var(--sp-3); }
    .icon-btn {
      border: 1px solid var(--clr-line);
      background: transparent;
      color: var(--clr-text-strong);
      border-radius: 12px;
      padding: .4rem .6rem;
      cursor: pointer;
    }

    .form { display:grid; gap: var(--sp-3); }
    .field { display:grid; gap: 6px; }
    .label { font-weight: 700; color: var(--clr-text-muted); }
    .hint { font-size: .8rem; color: var(--clr-error); }

    .grid { display:grid; grid-template-columns: 1fr 120px 1fr; gap: var(--sp-2); }
    @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

    .row { display:flex; gap: var(--sp-2); flex-wrap: wrap; }

    /* ensure readable buttons in your emerald theme */
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
    .muted { opacity: .75; }
  `],
})
export class ResidentialLocationsPage {
  private api = inject(ResidentialLocationsApi);

  busy = signal(false);
  message = signal('');
  rows = signal<ResidentialLocationDto[]>([]);

  sheetOpen = signal(false);
  editing = signal<ResidentialLocationDto | null>(null);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<ResidentialType>('THREE_PERSON', { nonNullable: true }),

    address: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    state: new FormControl('TX', { nonNullable: true }),
    zip: new FormControl('', { nonNullable: true }),
  });

  get name() { return this.form.controls.name; }

  constructor() {
    this.reload();
  }

  reload() {
    this.message.set('');
    this.busy.set(true);

    this.api.list().pipe(
      tap((list) => this.rows.set(list ?? [])),
      catchError((err) => {
        this.message.set(`Load failed (${err?.status ?? 'unknown'}).`);
        return of([]);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  openCreate() {
    this.editing.set(null);
    this.resetForm();
    this.sheetOpen.set(true);
  }

  openEdit(r: ResidentialLocationDto) {
    this.editing.set(r);
    this.form.patchValue(
      {
        name: r.name,
        type: r.type,
        address: r.address ?? '',
        city: r.city ?? '',
        state: (r.state ?? 'TX').toUpperCase(),
        zip: r.zip ?? '',
      },
      { emitEvent: false },
    );
    this.sheetOpen.set(true);
  }

  closeSheet() {
    this.sheetOpen.set(false);
  }

  resetForm() {
    this.form.reset(
      { name: '', type: 'THREE_PERSON', address: '', city: '', state: 'TX', zip: '' },
      { emitEvent: false },
    );
    this.form.markAsPristine();
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.payloadFromForm();
    this.message.set('');
    this.busy.set(true);

    const existing = this.editing();
    const req$ = existing ? this.api.update(existing.id, payload) : this.api.create(payload);

    req$.pipe(
      tap(() => {
        this.message.set('Saved.');
        this.closeSheet();
        this.reload();
      }),
      catchError((err) => {
        const code = err?.status ?? 'unknown';
        this.message.set(`Save failed (${code}). ${err?.error?.message ?? ''}`.trim());
        return of(null);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  remove() {
    const existing = this.editing();
    if (!existing) return;

    this.message.set('');
    this.busy.set(true);

    this.api.remove(existing.id).pipe(
      tap(() => {
        this.message.set('Deleted.');
        this.closeSheet();
        this.reload();
      }),
      catchError((err) => {
        this.message.set(`Delete failed (${err?.status ?? 'unknown'}).`);
        return of(null);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  labelType(t: ResidentialType) {
    return t === 'THREE_PERSON' ? '3-person' : t === 'FOUR_PERSON' ? '4-person' : 'Host home';
  }

  formatAddr(r: ResidentialLocationDto) {
    const parts = [r.address, r.city, r.state, r.zip]
      .map((x) => (x ?? '').trim())
      .filter(Boolean);
    return parts.length ? parts.join(', ') : '';
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
      name: clean(v.name),
      type: v.type,
      address: toNull(v.address),
      city: toNull(v.city),
      state: (clean(v.state) || 'TX').toUpperCase(),
      zip: toNull(digitsZip(v.zip)),
    };
  }
}
