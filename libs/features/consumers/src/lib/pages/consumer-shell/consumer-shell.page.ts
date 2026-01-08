import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

import { ConsumerLeftNavComponent } from '../../components/left-nav/consumer-left-nav.component';

@Component({
  standalone: true,
  selector: 'lib-consumer-shell-page',
  imports: [RouterOutlet, ConsumerLeftNavComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <header class="shell__header surface">
        <div class="shell__heading">
          <div class="h1">{{ consumerName() }}</div>
          <div class="meta">
            <span class="pill">ID: {{ consumerId() }}</span>
            <span class="pill">{{ residenceLabel() }}</span>
          </div>
        </div>

        <div class="actions">
          <!-- Mobile-only -->
          <button type="button" class="btn btn--ghost sections-btn" (click)="openMobileNav()">
            Sections
          </button>

          <button type="button" class="btn">Survey Packet</button>
          <button type="button" class="btn btn--ghost">Read-only View</button>
        </div>
      </header>

      <div class="shell__body">
        <!-- Desktop-only -->
        <aside class="sidebar surface">
          <lib-consumer-left-nav [base]="baseLink()" />
        </aside>

        <main class="content surface">
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- ✅ MOBILE SHEET (no OverlayService) -->
    <ng-container *ngIf="mobileNavOpen">
      <button
        type="button"
        class="mobile-backdrop"
        aria-label="Close sections"
        (click)="closeMobileNav()"
      ></button>

      <section
        class="mobile-sheet surface"
        role="dialog"
        aria-modal="true"
        aria-label="Consumer sections"
        tabindex="-1"
        (keydown.escape)="closeMobileNav()"
      >
        <header class="mobile-hdr">
          <div>
            <div class="title">Sections</div>
            <div class="sub">ID: {{ consumerId() }}</div>
          </div>

          <button type="button" class="btn btn--ghost" (click)="closeMobileNav()">
            Close
          </button>
        </header>

        <div class="mobile-body">
          <lib-consumer-left-nav [base]="baseLink()" (navigate)="closeMobileNavAfterNav()" />
        </div>
      </section>
    </ng-container>
  `,
  styles: [`
    .shell { display:flex; flex-direction:column; gap: var(--sp-4); padding: var(--sp-4); }

    .shell__header {
      padding: var(--sp-4);
      display:flex;
      flex-direction:column;
      gap: var(--sp-3);
    }

    .shell__heading { display:flex; flex-direction:column; gap:.25rem; }
    .h1 { font-size: 1.2rem; font-weight: 700; color: var(--clr-text-strong); }

    .meta { display:flex; gap:.5rem; margin-top:.35rem; flex-wrap:wrap; }
    .pill {
      font-size:.8rem; padding:.2rem .55rem; border-radius: var(--radius-pill, 999px);
      border: 1px solid color-mix(in srgb, var(--clr-line) 65%, transparent);
      color: var(--clr-text);
    }

    .actions { display:flex; gap:.5rem; flex-wrap:wrap; align-items:flex-start; }

    .shell__body { display:grid; grid-template-columns: 1fr; gap: var(--sp-4); min-height: 60vh; }
    .sidebar { display:none; padding: var(--sp-3); }
    .content { padding: var(--sp-3); min-height: 50vh; }

    /* Sections button is mobile-only */
    .sections-btn { display: inline-flex; }

    @media (min-width: 960px) {
      .shell__header { flex-direction:row; align-items:flex-start; justify-content:space-between; }
      .shell__body { grid-template-columns: 260px 1fr; }
      .sidebar { display:block; position: sticky; top: var(--sp-4); align-self: start; }
      .sections-btn { display: none; }
    }

    /* ===== Mobile Sheet ===== */
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      z-index: 3000;
      border: 0;
      padding: 0;
      background: rgba(2, 6, 23, 0.62);
    }

    .mobile-sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3001;

      border-radius: 16px 16px 0 0;
      padding: 12px 14px calc(14px + env(safe-area-inset-bottom));

      max-height: 92dvh;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .mobile-hdr {
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--clr-line, #1f2937) 55%, transparent);
      flex: 0 0 auto;
    }

    .title { font-size:1.05rem; font-weight:750; color: var(--clr-text-strong, #f9fafb); }
    .sub { font-size:.85rem; opacity:.8; margin-top:2px; }

    .mobile-body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding-top: 12px;
    }
  `],
})
export class ConsumerShellPage {
  private readonly route = inject(ActivatedRoute);

  mobileNavOpen = false;

  readonly consumerId = computed(() => this.route.snapshot.paramMap.get('consumerId') ?? '');
  readonly consumerName = computed(() => 'Consumer');
  readonly residenceLabel = computed(() => 'Residence');

  /** Base route so nav links preserve /consumers/:consumerId */
  readonly baseLink = computed<ReadonlyArray<string | number>>(() => ['/', 'consumers', this.consumerId()]);

  openMobileNav(): void {
    this.mobileNavOpen = true;
  }

  closeMobileNav(): void {
    this.mobileNavOpen = false;
  }

  closeMobileNavAfterNav(): void {
    queueMicrotask(() => (this.mobileNavOpen = false));
  }
}
