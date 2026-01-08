import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import {
  HorizontalTabsComponent,
  HorizontalTab,
} from '../../../components/horizontal-tabs/horizontal-tabs.component';

@Component({
  standalone: true,
  selector: 'lib-ipc-shell-page',
  imports: [RouterOutlet, HorizontalTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ipc">
      <header class="ipc__header surface">
        <div class="ipc__title">
          <div class="h2">IPC</div>
          <div class="sub">Consumer ID: {{ consumerId() }}</div>
        </div>

        <div class="ipc__actions">
          <button type="button" class="btn">Save Draft</button>
          <button type="button" class="btn btn--ghost">Export</button>
        </div>
      </header>

      <lib-horizontal-tabs [tabs]="tabs" variant="stepper" />

      <div class="ipc__content">
        <router-outlet />
      </div>
    </section>
  `,
  styles: [`
    /* Mobile-first */
    .ipc {
      display: flex;
      flex-direction: column;
      gap: var(--sp-4);
    }

    .ipc__header {
      padding: var(--sp-4);
      display: flex;
      flex-direction: column; /* mobile: stack */
      gap: var(--sp-3);
    }

    .ipc__title {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ipc__actions {
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;
      justify-content: flex-start; /* mobile: left */
    }

    .ipc__content { padding: .25rem; }

    /* Desktop */
    @media (min-width: 960px) {
      .ipc__header {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }
      .ipc__actions { justify-content: flex-end; }
    }
  `],
})
export class IpcShellPage {
  private readonly route = inject(ActivatedRoute);

  readonly consumerId = computed(() => this.route.snapshot.paramMap.get('consumerId') ?? '');

  readonly tabs: HorizontalTab[] = [
    { label: 'Details', link: ['details'] },
    { label: 'Services', link: ['services'], badge: 2 },
    { label: 'Approvals', link: ['approvals'], badge: '!' },
    { label: 'Documents', link: ['documents'], disabled: true },
  ];
}
