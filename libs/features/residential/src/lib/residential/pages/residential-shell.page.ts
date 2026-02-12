import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'lib-residential-shell-page',
  imports: [CommonModule, RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shell">
      <header class="card">
        <div class="h1">Residential</div>
        <div class="sub">Compliance + logs + evidence</div>

        <div class="meta" *ngIf="locationId">
          <span class="pill">locationId: {{ locationId }}</span>
        </div>
      </header>

      <div class="grid">
        <nav class="card nav">
          <a [routerLink]="['overview']" [queryParams]="{ locationId }">Overview</a>

          <div class="sep"></div>

          <div class="cap">§565.23 Residential Requirements</div>
          <a [routerLink]="['home']" [queryParams]="{ locationId }">Home & Environment (b)</a>
          <a [routerLink]="['hot-water']" [queryParams]="{ locationId }">Hot Water Safety (c)</a>
          <a [routerLink]="['life-safety']" [queryParams]="{ locationId }">Life Safety (d)</a>

          <div class="sep"></div>

          <a [routerLink]="['emergency', 'plans']" [queryParams]="{ locationId }">Emergency Plans (f)</a>
          <a [routerLink]="['emergency', 'fire-drills']" [queryParams]="{ locationId }">Fire Drills (e)</a>

          <div class="sep"></div>

          <a [routerLink]="['infection-control']" [queryParams]="{ locationId }">Infection Control (g)</a>
          <a [routerLink]="['medication']" [queryParams]="{ locationId }">Medication Practices (h)</a>
          <a [routerLink]="['four-person']" [queryParams]="{ locationId }">Four-Person Requirements (i)</a>
        </nav>

        <main class="main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; width: 100%; }
      .shell { width: 100%; max-width: 1100px; margin-inline: auto; display: grid; gap: var(--sp-4); }
      .meta { margin-top: var(--sp-2); }
      .pill { padding: .25rem .6rem; border-radius: var(--radius-pill); border: 1px solid var(--clr-line); }

      .grid { display: grid; grid-template-columns: 280px 1fr; gap: var(--sp-4); align-items: start; }
      .main { min-width: 0; }

      .nav { display: grid; gap: 10px; padding: 12px; }
      .nav a { display: block; padding: 10px 12px; border-radius: 12px; text-decoration: none; border: 1px solid var(--clr-line); }
      .nav a:hover { background: rgba(0,0,0,.04); }

      .cap { font-size: 12px; opacity: .8; font-weight: 800; margin-top: 4px; }
      .sep { height: 1px; background: var(--clr-line); margin: 4px 0; }

      @media (max-width: 900px) {
        .grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class ResidentialShellPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  locationId = '';

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((qp) => qp.get('locationId') ?? ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => {
        this.locationId = id;

        // ✅ Enforce contract: cannot be inside shell without locationId
        if (!id) {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
  }
}
