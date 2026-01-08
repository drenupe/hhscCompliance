import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

type AssessmentsStep = {
  label: string;
  path: string; // child path under this feature
};

@Component({
  standalone: true,
  selector: 'lib-assessments-home-page',
  imports: [RouterOutlet, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <header class="shell__header surface">
        <div class="shell__heading">
          <div class="h1">Assessments</div>
          <div class="meta">
            <span class="pill">Functional Capability</span>
            <span class="pill">Scoring: 0–4 + Safety + Consistency</span>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="btn btn--ghost sections-btn" (click)="toggleMobileNav()">
            Sections
          </button>
        </div>
      </header>

      <nav class="steps surface" aria-label="Assessment steps">
        <a
          *ngFor="let s of steps"
          class="step"
          [class.step--active]="activeTopPath() === s.path"
          (click)="go(s.path)"
          role="button"
          tabindex="0"
          (keydown.enter)="go(s.path)"
          (keydown.space)="go(s.path)"
        >
          {{ s.label }}
        </a>
      </nav>

      <main class="shell__content">
        <router-outlet />
      </main>

      <!-- Mobile sheet -->
      <div class="mobile-nav surface" *ngIf="mobileNavOpen()">
        <div class="mobile-nav__title">Sections</div>
        <button class="mobile-nav__close btn btn--ghost" (click)="toggleMobileNav()">Close</button>

        <div class="mobile-nav__list">
          <button
            *ngFor="let s of steps"
            class="btn btn--ghost mobile-nav__item"
            (click)="go(s.path); toggleMobileNav()"
          >
            {{ s.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .shell { display:flex; flex-direction:column; gap:.75rem; padding:1rem; }
      .shell__header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1rem; border-radius:.9rem; }
      .shell__heading { display:flex; flex-direction:column; gap:.35rem; min-width:0; }
      .h1 { font-size:1.25rem; font-weight:700; line-height:1.15; }
      .meta { display:flex; gap:.5rem; flex-wrap:wrap; }
      .pill { display:inline-flex; align-items:center; padding:.2rem .6rem; border-radius:999px; border:1px solid rgba(255,255,255,.12); font-size:.85rem; opacity:.9; white-space:nowrap; }
      .actions { display:flex; gap:.5rem; }
      .sections-btn { display:none; }

      .steps { display:flex; gap:.35rem; padding:.5rem; border-radius:.9rem; overflow-x:auto; }
      .step { display:inline-flex; align-items:center; padding:.55rem .75rem; border-radius:.75rem; border:1px solid rgba(255,255,255,.08); cursor:pointer; user-select:none; white-space:nowrap; opacity:.9; }
      .step--active { opacity:1; border-color: rgba(255,255,255,.18); }
      .shell__content { min-height:40vh; }

      .surface { background: rgba(255,255,255,.04); backdrop-filter: blur(6px); }
      .btn { border:1px solid rgba(255,255,255,.12); border-radius:.75rem; padding:.55rem .75rem; cursor:pointer; background:transparent; color:inherit; }
      .btn--ghost { background:transparent; }

      .mobile-nav { position:fixed; inset:auto 0 0 0; padding:1rem; border-top-left-radius:1rem; border-top-right-radius:1rem; box-shadow:0 -12px 30px rgba(0,0,0,.35); }
      .mobile-nav__title { font-weight:700; margin-bottom:.5rem; }
      .mobile-nav__close { position:absolute; top:.75rem; right:.75rem; }
      .mobile-nav__list { display:flex; flex-direction:column; gap:.35rem; margin-top:1rem; }

      @media (max-width: 900px) { .sections-btn { display:inline-flex; } }
    `,
  ],
})
export class AssessmentsHomePage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ✅ Add Functional Assessment
  readonly steps: AssessmentsStep[] = [
    { label: 'Overview', path: 'overview' },
    { label: 'IDRC', path: 'idrc' },
    { label: 'Risk', path: 'risk' },
    { label: 'Functional', path: 'functional-assessment' },
    { label: 'Documents', path: 'documents' },
  ];

  // ✅ Works for nested: functional-assessment/overview
  readonly activeTopPath = computed(() => {
    const child = this.route.firstChild;
    const top = child?.snapshot?.url?.[0]?.path;
    return top ?? 'overview';
  });

  // ✅ use signal for UI state
  private readonly _mobileOpen = signal(false);
  readonly mobileNavOpen = computed(() => this._mobileOpen());

  go(childPath: string) {
    this.router.navigate([childPath], { relativeTo: this.route });
  }

  toggleMobileNav() {
    this._mobileOpen.update(v => !v);
  }
}
