import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-fa-overview-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Functional Assessment Overview</div>
      <p class="sub">Summary + scoring guidance. Add domain cards + completion status here.</p>
    </section>
  `,
})
export class FaOverviewStep {}
