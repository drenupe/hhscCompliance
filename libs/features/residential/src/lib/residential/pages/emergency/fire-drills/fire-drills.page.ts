import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';

import { FireDrillSheetComponent } from './fire-drill-sheet.component';
import { FireDrillsApi } from '@hhsc-compliance/data-access';
import { FireDrillDto } from '@hhsc-compliance/shared-models';

@Component({
  standalone: true,
  imports: [CommonModule, FireDrillSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex; align-items:center; justify-content: space-between; gap:12px; margin-bottom: 12px;">
      <div>
        <div style="font-size:18px; font-weight:700; color:#111827;">Fire Drills (Form 4719)</div>
        <div style="font-size:12px; color:#6b7280;">
          Location: <code>{{ locationId() }}</code>
        </div>
      </div>

      <div style="display:flex; gap:8px;">
        <button type="button" (click)="reload()" [disabled]="loading()">Refresh</button>
        <button type="button" (click)="openCreate()">Add drill</button>
      </div>
    </div>

    <div
      *ngIf="message()"
      style="padding:10px; border:1px solid #fecaca; background:#fef2f2; border-radius:12px; color:#991b1b; margin-bottom: 12px;"
    >
      {{ message() }}
    </div>

    <div *ngIf="loading()" style="color:#6b7280;">Loading...</div>

    <div
      *ngIf="!loading() && rows().length === 0"
      style="padding:12px; border:1px dashed #d1d5db; border-radius:12px; color:#6b7280;"
    >
      No fire drills recorded yet.
    </div>

    <div *ngIf="rows().length" style="border:1px solid #e5e7eb; border-radius: 14px; overflow:hidden;">
      <table style="width:100%; border-collapse: collapse;">
        <thead style="background:#f9fafb; color:#374151; font-size:12px;">
          <tr>
            <th style="text-align:left; padding:10px;">Date</th>
            <th style="text-align:left; padding:10px;">Time</th>
            <th style="text-align:left; padding:10px;">Shift</th>
            <th style="text-align:left; padding:10px;">Simulated</th>
            <th style="text-align:left; padding:10px;">Area</th>
            <th style="text-align:right; padding:10px;">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let r of rows()" style="border-top:1px solid #e5e7eb;">
            <td style="padding:10px;">{{ r.dateDrillConducted }}</td>
            <td style="padding:10px;">{{ r.timeDrillConducted ?? '—' }}</td>
            <td style="padding:10px;">{{ r.shift }}</td>
            <td style="padding:10px; color:#6b7280;">
              {{ (r.simulatedSituations?.length ? r.simulatedSituations.join(', ') : '—') }}
            </td>
            <td style="padding:10px; color:#6b7280;">
              {{ (r.locations?.length ? r.locations.join(', ') : '—') }}
            </td>
            <td style="padding:10px; text-align:right;">
              <button type="button" (click)="openEdit(r)">Edit</button>
              <button type="button" (click)="remove(r)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <lib-fire-drill-sheet
      *ngIf="sheetOpen()"
      [locationId]="locationId()"
      [row]="activeRow()"
      (closed)="closeSheet()"
      (submitted)="onSubmit($event)"
    />
  `,
  styles: [`
    button { padding:10px 12px; border-radius: 10px; border:1px solid #d1d5db; background:#fff; cursor:pointer; }
    button:hover { background:#f9fafb; }
  `],
})
export class FireDrillsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(FireDrillsApi);

  readonly locationId = signal<string>('');
  readonly rows = signal<FireDrillDto[]>([]);
  readonly loading = signal<boolean>(false);
  readonly message = signal<string>('');

  readonly sheetOpen = signal<boolean>(false);
  readonly activeRow = signal<FireDrillDto | null>(null);

  constructor() {
    const id = String(this.route.snapshot.paramMap.get('locationId') ?? '').trim();
    this.locationId.set(id);
    this.reload();
  }

  reload(): void {
    const locationId = this.locationId();
    if (!locationId) {
      this.message.set('Missing locationId in route.');
      return;
    }

    this.loading.set(true);
    this.message.set('');

    this.api
      .list(locationId)
      .pipe(
        tap((rows) => this.rows.set(Array.isArray(rows) ? rows : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Failed to load fire drills (${code}).`);
          this.rows.set([]);
          return of([] as FireDrillDto[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  openCreate(): void {
    this.activeRow.set(null);
    this.sheetOpen.set(true);
  }

  openEdit(r: FireDrillDto): void {
    this.activeRow.set(r);
    this.sheetOpen.set(true);
  }

  closeSheet(): void {
    this.sheetOpen.set(false);
    this.activeRow.set(null);
  }

  onSubmit(e: { id?: string; payload: any }): void {
    this.loading.set(true);
    this.message.set('');

    const req$ = e.id ? this.api.update(e.id, e.payload) : this.api.create(e.payload);

    req$
      .pipe(
        tap(() => this.closeSheet()),
        switchMap(() => this.api.list(this.locationId())),
        tap((rows) => this.rows.set(Array.isArray(rows) ? rows : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Save failed (${code}).`);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  remove(r: FireDrillDto): void {
    if (!confirm(`Delete fire drill on ${r.dateDrillConducted}?`)) return;

    this.loading.set(true);
    this.message.set('');

    this.api
      .remove(r.id)
      .pipe(
        switchMap(() => this.api.list(this.locationId())),
        tap((rows) => this.rows.set(Array.isArray(rows) ? rows : [])),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message.set(`Delete failed (${code}).`);
          return of([] as FireDrillDto[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
