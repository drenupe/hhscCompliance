import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, map, of, tap } from 'rxjs';

type ProviderStatus = 'ACTIVE' | 'INACTIVE';

interface ProviderDto {
  id: string;
  name: string;

  contractNumber: string | null;
  componentCode: string | null;
  npi: string | null;
  ein: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;

  status: ProviderStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type ProviderUpsertPayload = {
  name: string;

  contractNumber?: string | null;
  componentCode?: string | null;
  npi?: string | null;
  ein?: string | null;

  status?: ProviderStatus;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
};

@Component({
  standalone: true,
  selector: 'lib-providers-page',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="card">
        <div class="card__header">
          <div class="h1">Provider</div>
          <div class="sub">Single company record (one row in the providers table)</div>
        </div>

        <form class="form" [formGroup]="form" (ngSubmit)="save()">
          <label class="field">
            <div class="label">Company name</div>
            <input
              class="input"
              type="text"
              formControlName="name"
              placeholder="e.g., Demo Provider LLC"
              autocomplete="organization"
            />
            <div class="hint" *ngIf="name.invalid && (name.touched || name.dirty)">
              Company name is required.
            </div>
          </label>

          <!-- Identifiers -->
          <div class="grid2">
            <label class="field">
              <div class="label">Contract number (9 digits)</div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                formControlName="contractNumber"
                placeholder="#########"
                autocomplete="off"
              />
            </label>

            <label class="field">
              <div class="label">Component code (3 digits)</div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                formControlName="componentCode"
                placeholder="###"
                autocomplete="off"
              />
            </label>
          </div>

          <div class="grid2">
            <label class="field">
              <div class="label">NPI (10 digits)</div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                formControlName="npi"
                placeholder="##########"
                autocomplete="off"
              />
            </label>

            <label class="field">
              <div class="label">EIN (9 digits)</div>
              <input
                class="input"
                type="text"
                inputmode="numeric"
                formControlName="ein"
                placeholder="#########"
                autocomplete="off"
              />
            </label>
          </div>

          <!-- Location -->
          <label class="field">
            <div class="label">Address</div>
            <input
              class="input"
              type="text"
              formControlName="address"
              placeholder="Street address / suite (optional)"
              autocomplete="street-address"
            />
          </label>

          <div class="grid3">
            <label class="field">
              <div class="label">City</div>
              <input class="input" type="text" formControlName="city" placeholder="City" autocomplete="address-level2" />
            </label>

            <label class="field">
              <div class="label">State</div>
              <input class="input" type="text" formControlName="state" placeholder="TX" autocomplete="address-level1" />
            </label>

            <label class="field">
              <div class="label">ZIP</div>
              <input class="input" type="text" formControlName="zip" placeholder="Zip" autocomplete="postal-code" />
            </label>
          </div>

          <div class="row row--actions">
            <button class="btn btn--primary" type="submit" [disabled]="busy() || form.invalid">
              {{ provider() ? 'Save changes' : 'Create provider' }}
            </button>

            <button class="btn btn--ghost" type="button" (click)="reload()" [disabled]="busy()">
              Reload
            </button>

            <button class="btn btn--danger" type="button" (click)="clear()" [disabled]="busy() || !provider()">
              Clear
            </button>
          </div>

          <div class="msg" *ngIf="message()">{{ message() }}</div>

          <div class="meta" *ngIf="provider() as p">
            <div><b>ID:</b> {{ p.id }}</div>
            <div><b>Status:</b> {{ p.status }}</div>
            <div><b>Updated:</b> {{ p.updatedAt }}</div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 16px; }
    .card { max-width: 840px; border: 1px solid rgba(0,0,0,.12); border-radius: 16px; padding: 16px; }
    .card__header { display: grid; gap: 6px; margin-bottom: 14px; }
    .h1 { font-size: 20px; font-weight: 800; }
    .sub { font-size: 13px; opacity: .75; }

    .form { display: grid; gap: 12px; }
    .field { display: grid; gap: 6px; }
    .label { font-weight: 700; }
    .input { width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(0,0,0,.15); }

    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid3 { display: grid; grid-template-columns: 1.5fr .6fr .9fr; gap: 10px; }
    @media (max-width: 840px) { .grid2, .grid3 { grid-template-columns: 1fr; } }

    .hint { font-size: 12px; color: #b00020; }
    .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

    /* THEME-COMPAT BUTTONS (readable on dark UI) */
    .btn{
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid var(--clr-line);
      background: rgba(15, 23, 42, 0.25);
      color: var(--clr-text);
      cursor: pointer;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      gap: 8px;
    }

    .btn:hover{
      background: color-mix(in srgb, var(--clr-card) 88%, var(--clr-accent) 12%);
    }

    .btn:focus-visible{
      outline: var(--ring);
      outline-offset: 2px;
    }

    /* Keep disabled buttons VISIBLE even if global CSS hides them */
    .row--actions .btn:disabled,
    .row--actions .btn[disabled]{
      display: inline-flex !important;
      visibility: visible !important;
      opacity: .55;
      cursor: not-allowed;
      pointer-events: none;
    }

    .btn--ghost{ background: transparent; }

    .btn--danger{
      border-color: color-mix(in srgb, var(--clr-error) 55%, var(--clr-line));
      color: var(--clr-error);
    }

    .btn--danger:hover{
      background: color-mix(in srgb, var(--clr-error) 18%, var(--clr-card));
    }

    .btn--primary:not(:disabled){
      background: color-mix(in srgb, var(--clr-card) 70%, var(--clr-accent) 30%);
      border-color: color-mix(in srgb, var(--clr-accent) 60%, var(--clr-line));
    }

    .msg { font-size: 13px; }
    .meta { margin-top: 6px; font-size: 12px; opacity: .8; display: grid; gap: 4px; }
  `],
})
export class ProvidersPage {
  private http = inject(HttpClient);
  private base = '/api/v1/providers';

  busy = signal(false);
  message = signal('');
  provider = signal<ProviderDto | null>(null);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

    contractNumber: new FormControl('', { nonNullable: true }),
    componentCode: new FormControl('', { nonNullable: true }),
    npi: new FormControl('', { nonNullable: true }),
    ein: new FormControl('', { nonNullable: true }),

    address: new FormControl('', { nonNullable: true }),
    city: new FormControl('', { nonNullable: true }),
    state: new FormControl('TX', { nonNullable: true }),
    zip: new FormControl('', { nonNullable: true }),
  });

  get name() {
    return this.form.controls.name;
  }

  constructor() {
    this.reload();
  }

  reload() {
    this.message.set('');
    this.busy.set(true);

    this.http.get<ProviderDto[]>(this.base).pipe(
      map((rows) => rows?.[0] ?? null),
      tap((p) => {
        this.provider.set(p);
        this.patchFromDto(p);
        this.form.markAsPristine();
      }),
      catchError((err) => {
        this.message.set(`Load failed (${err?.status ?? 'unknown'}).`);
        return of(null);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.payloadFromForm();
    if (!payload.name) return;

    this.message.set('');
    this.busy.set(true);

    const existing = this.provider();
    const req$ = existing
  ? this.http.patch<ProviderDto>(`${this.base}/${existing.id}`, payload)
  : this.http.post<ProviderDto>(this.base, payload);
  
    req$.pipe(
      tap((p) => {
        this.provider.set(p);
        this.patchFromDto(p);
        this.form.markAsPristine();
        this.message.set('Saved.');
      }),
      catchError((err) => {
        const code = err?.status ?? 'unknown';
        const msg = err?.error?.message ?? '';
        this.message.set(`Save failed (${code}). ${msg}`.trim());
        return of(null);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  clear() {
    const existing = this.provider();
    if (!existing) return;

    this.message.set('');
    this.busy.set(true);

    this.http.delete<void>(`${this.base}/${existing.id}`).pipe(
      tap(() => {
        this.provider.set(null);
        this.form.reset({
          name: '',
          contractNumber: '',
          componentCode: '',
          npi: '',
          ein: '',
          address: '',
          city: '',
          state: 'TX',
          zip: '',
        });
        this.form.markAsPristine();
        this.message.set('Cleared.');
      }),
      catchError((err) => {
        this.message.set(`Clear failed (${err?.status ?? 'unknown'}).`);
        return of(void 0);
      }),
      finalize(() => this.busy.set(false)),
    ).subscribe();
  }

  private patchFromDto(p: ProviderDto | null) {
    this.form.patchValue(
      {
        name: p?.name ?? '',

        contractNumber: p?.contractNumber ?? '',
        componentCode: p?.componentCode ?? '',
        npi: p?.npi ?? '',
        ein: p?.ein ?? '',

        address: p?.address ?? '',
        city: p?.city ?? '',
        state: p?.state ?? 'TX',
        zip: p?.zip ?? '',
      },
      { emitEvent: false },
    );
  }

  private payloadFromForm(): ProviderUpsertPayload {
    const v = this.form.getRawValue();

    const clean = (s: string) => s.trim();
    const toNull = (s: string) => {
      const t = clean(s);
      return t.length ? t : null;
    };

    const digits = (s: string) => clean(s).replace(/[^\d]/g, '');
    const toNullDigits = (s: string) => {
      const d = digits(s);
      return d.length ? d : null;
    };

    return {
      name: clean(v.name),

      contractNumber: toNullDigits(v.contractNumber),
      componentCode: toNullDigits(v.componentCode),
      npi: toNullDigits(v.npi),
      ein: toNullDigits(v.ein),

      address: toNull(v.address),
      city: toNull(v.city),
      state: (clean(v.state) || 'TX').toUpperCase(),
      zip: toNullDigits(v.zip),
    };
  }
}
