import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-infection-control-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Infection Control</div>
      <div class="sub">TAC §565.23(g) — standard precautions + written policies + revision on shortcomings.</div>
      <div class="msg">Next: policy evidence + audit log (optional).</div>
    </section>
  `,
})
export class ResidentialInfectionControlPage {}
