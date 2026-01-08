import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import {
  HorizontalTabsComponent,
  HorizontalTab,
} from '../../../components/horizontal-tabs/horizontal-tabs.component';

@Component({
  standalone: true,
  selector: 'lib-imp-shell-page',
  imports: [RouterOutlet, HorizontalTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="imp">
      <header class="imp__header surface">
        <div class="imp__title">
          <div class="h2">IMP</div>
          <div class="sub">Consumer ID: {{ consumerId() }}</div>
        </div>

        <div class="imp__actions">
          <button type="button" class="btn">Save Draft</button>
          <button type="button" class="btn btn--ghost">Export</button>
        </div>
      </header>

      <lib-horizontal-tabs [tabs]="tabs" variant="stepper" />

      <div class="imp__content">
        <router-outlet />
      </div>
    </section>
  `,
  styles: [`
    .imp { display:flex; flex-direction:column; gap: var(--sp-4); }

    /* mobile-first */
    .imp__header {
      padding: var(--sp-4);
      display:flex;
      flex-direction:column;
      gap: var(--sp-3);
    }

    .imp__title { display:flex; flex-direction:column; gap: 2px; }

    .imp__actions {
      display:flex;
      gap:.5rem;
      flex-wrap:wrap;
      justify-content:flex-start;
    }

    .imp__content { padding: .25rem; }

    /* desktop */
    @media (min-width: 960px) {
      .imp__header { flex-direction:row; justify-content:space-between; align-items:flex-start; }
      .imp__actions { justify-content:flex-end; }
    }
  `],
})
export class ImpShellPage {
  private readonly route = inject(ActivatedRoute);

  readonly consumerId = computed(() => this.route.snapshot.paramMap.get('consumerId') ?? '');

  readonly tabs: HorizontalTab[] = [
    { label: 'Summary', link: ['summary'] },
    { label: 'Implementation', link: ['implementation'] },
    { label: 'Staffing', link: ['staffing'] },
    { label: 'Documents', link: ['documents'] },
  ];
}
