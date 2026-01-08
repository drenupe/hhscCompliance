import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-imp-implementation-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Implementation</div>
      <p class="sub">Supports, routines, instructions, accommodations, risk mitigation.</p>
    </section>
  `,
})
export class ImpImplementationStep {}
