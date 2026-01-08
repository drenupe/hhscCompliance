import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-pdp-summary-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">PDP Summary</div>
      <p class="sub">Placeholder — wire to data-access later.</p>
    </section>
  `,
})
export class PdpSummaryStep {}
