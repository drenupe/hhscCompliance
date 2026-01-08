import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-pdp-outcomes-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Outcomes</div>
      <p class="sub">Placeholder — goals, supports, action steps, measures.</p>
    </section>
  `,
})
export class PdpOutcomesStep {}