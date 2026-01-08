import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  HorizontalTabsComponent,
  HorizontalTab,
} from '../../../components/horizontal-tabs/horizontal-tabs.component';

@Component({
  standalone: true,
  selector: 'lib-pdp-shell-page',
  imports: [RouterOutlet, HorizontalTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pdp">
      <header class="pdp__header surface">
        <div class="pdp__title">
          <div class="h2">PDP</div>
          <div class="sub">ID: {{ consumerId() }}</div>
        </div>

        <div class="pdp__actions">
          <button type="button" class="btn">Create Revision</button>
          <button type="button" class="btn btn--ghost">Export</button>
        </div>
      </header>

      <lib-horizontal-tabs [tabs]="tabs()" variant="stepper" />

      <!-- Match your ConsumerShell content surface behavior -->
      <main class="pdp__content surface">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .pdp { display:flex; flex-direction:column; gap: var(--sp-4); min-height: 0; }

    .pdp__header {
      padding: var(--sp-4);
      display:flex;
      flex-direction:column;
      gap: var(--sp-3);
    }

    .pdp__title { display:flex; flex-direction:column; gap: 2px; }
    .pdp__actions { display:flex; gap:.5rem; flex-wrap:wrap; justify-content:flex-start; }

    .pdp__content {
      padding: var(--sp-3);
      min-height: 50vh; /* same “not blank” feel as ConsumerShell */
    }

    @media (min-width: 960px) {
      .pdp__header { flex-direction:row; align-items:flex-start; justify-content:space-between; }
      .pdp__actions { justify-content:flex-end; }
    }
  `],
})
export class PdpShellPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Enterprise: PDP shell is under /consumers/:consumerId/... so consumerId
   * is on the parent route. Snapshot on this.route can be empty.
   */
  readonly consumerId = computed(() => this.route.parent?.snapshot.paramMap.get('consumerId') ?? '');

  /**
   * Enterprise: absolute links remove dependency on HorizontalTabs implementation
   * (relativeTo, route context, mobile sheet vs desktop, etc.)
   */
  readonly tabs = computed<HorizontalTab[]>(() => {
    const id = this.consumerId();
    const base: ReadonlyArray<string | number> = ['/', 'consumers', id, 'programmatic', 'pdp'];

    return [
      { label: 'Summary',      link: [...base, 'summary'] },
      { label: 'Participants', link: [...base, 'participants'] },
      { label: 'Outcomes',     link: [...base, 'outcomes'] },
      { label: 'Documents',    link: [...base, 'documents'] },
    ];
  });

  /**
   * Optional hardening: if someone hits /pdp with no child, force summary.
   * (Your routes already redirect, but this guards against broken links.)
   */
  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('?')[0].split('#')[0];
        if (url.endsWith('/programmatic/pdp') || url.endsWith('/programmatic/pdp/')) {
          const id = this.consumerId();
          if (id) this.router.navigate(['/', 'consumers', id, 'programmatic', 'pdp', 'summary']);
        }
      });
  }
}
