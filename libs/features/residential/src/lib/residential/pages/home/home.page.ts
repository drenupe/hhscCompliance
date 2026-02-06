import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-home-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Home & Environment</div>
      <div class="sub">TAC §565.23(b) — residence condition, hazards, furnishings, sanitation, safety.</div>
      <div class="msg">Next: implement requirements list + evidence/log widgets for (b)(1)–(18).</div>
    </section>
  `,
})
export class ResidentialHomePage {}
