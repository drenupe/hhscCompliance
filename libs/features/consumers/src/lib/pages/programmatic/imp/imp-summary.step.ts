import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-imp-summary-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">IMP Summary</div>
      <p class="sub">Implementation Plan overview, effective dates, revision info.</p>
    </section>
  `,
})
export class ImpSummaryStep {}
