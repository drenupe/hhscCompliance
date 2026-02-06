import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';


import { ResidentialLocationsApi } from '@hhsc-compliance/data-access';
import { ResidentialLocationDto, ResidentialType } from '@hhsc-compliance/shared-models';

import { OverlayService } from '@hhsc-compliance/ui-overlay';
import { ResidenceEditorSheetComponent } from '../sheets/residence-editor.sheet';

type ResidenceEditorResult = { saved?: boolean; deleted?: boolean };

@Component({
  standalone: true,
  selector: 'lib-residential-locations-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <div class="header card">
        <div>
          <div class="h1">Residential</div>
          <div class="sub">Residences / locations under the Provider</div>
        </div>

        <div class="header-actions">
          <button class="btn btn--primary" type="button" (click)="openCreate()">
            + Add residence
          </button>

          <button class="btn btn--ghost" type="button" (click)="reload()"
            [disabled]="(vm$ | async)?.loading">
            {{ (vm$ | async)?.loading ? 'Loading…' : 'Reload' }}
          </button>
        </div>
      </div>

      <div class="msg" *ngIf="(vm$ | async)?.message as m">{{ m }}</div>

      <div class="list" *ngIf="(vm$ | async) as vm">
        <button class="loc card" type="button" *ngFor="let r of vm.rows" (click)="openResidence(r)">
          <div class="loc-top">
            <div class="loc-name">{{ r.name }}</div>
            <div class="pill">{{ labelType(r.type) }}</div>
          </div>

          <div class="loc-sub">
            <span *ngIf="formatAddr(r) as a; else noaddr">{{ a }}</span>
            <ng-template #noaddr><span class="muted">No address yet</span></ng-template>
          </div>
        </button>

        <div class="empty card" *ngIf="!vm.loading && vm.rows.length === 0">
          <div class="h2">No residences yet</div>
          <div class="sub">Tap “Add residence” to create your first location.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; min-width:0; width:100%; }
    .page { width:100%; max-width: 980px; margin-inline:auto; display:grid; gap: var(--sp-4); min-width:0; }
    .list { display:grid; gap: var(--sp-3); min-width:0; }

    .header { display:flex; justify-content:space-between; align-items:flex-start; gap: var(--sp-3); min-width:0; }
    .header-actions { display:flex; gap: var(--sp-2); flex-wrap: wrap; }

    .msg { font-size:.9rem; opacity:.9; }

    .loc { width:100%; text-align:left; cursor:pointer; }
    .loc-top { display:flex; justify-content:space-between; gap: var(--sp-2); align-items:center; }
    .loc-name { font-weight:800; color: var(--clr-text-strong); }
    .pill { padding:.25rem .6rem; border-radius: var(--radius-pill); border:1px solid var(--clr-line); }
    .muted { opacity:.75; }
    .empty { text-align:center; }
  `],
})
export class ResidentialLocationsPage {
  private readonly api = inject(ResidentialLocationsApi);
  private readonly overlay = inject(OverlayService);

  private readonly reload$ = new BehaviorSubject<void>(undefined);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ✅ ViewModel stream – async pipe triggers CD reliably even in zoneless setups
  readonly vm$ = this.reload$.pipe(
    switchMap(() =>
      this.api.list().pipe(
        map((rows) => ({ rows: Array.isArray(rows) ? rows : [], loading: false, message: '' })),
        startWith({ rows: [] as ResidentialLocationDto[], loading: true, message: '' }),
        catchError((err) =>
          of({
            rows: [] as ResidentialLocationDto[],
            loading: false,
            message: `Load failed (${err?.status ?? 'unknown'}). ${err?.error?.message ?? ''}`.trim(),
          }),
        ),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  reload(): void {
    this.reload$.next();
  }

  openCreate(): void {
    const ref = this.overlay.open<{ mode: 'create' }, ResidenceEditorResult>(
      ResidenceEditorSheetComponent,
      { size: 'md', ariaLabel: 'Add residence', data: { mode: 'create' } },
    );

    ref.closed$.pipe().subscribe((result) => {
      if (result?.saved) this.reload();
    });
  }

  openEdit(r: ResidentialLocationDto): void {
    const ref = this.overlay.open<{ mode: 'edit'; existing: ResidentialLocationDto }, ResidenceEditorResult>(
      ResidenceEditorSheetComponent,
      { size: 'md', ariaLabel: 'Edit residence', data: { mode: 'edit', existing: r } },
    );

    ref.closed$.pipe().subscribe((result) => {
      if (result?.saved || result?.deleted) this.reload();
    });
  }

  labelType(t: ResidentialType): string {
    return t === 'THREE_PERSON' ? '3-person' : t === 'FOUR_PERSON' ? '4-person' : 'Host home';
  }

  openResidence(r: ResidentialLocationDto): void {
    this.router.navigate(['location', 'overview'], {
      relativeTo: this.route,
      queryParams: { locationId: r.id },
    });
  }


  formatAddr(r: ResidentialLocationDto): string {
    const parts = [r.address, r.city, r.state, r.zip].map((x) => (x ?? '').trim()).filter(Boolean);
    return parts.length ? parts.join(', ') : '';
  }
}
