import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-four-person-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Four-Person Requirements</div>
      <div class="sub">TAC §565.23(i) — inspections, approvals, annual certifications, documentation kept in home.</div>
      <div class="msg">Next: inspection record + annual recert tracking + evidence binder.</div>
    </section>
  `,
})
export class ResidentialFourPersonPage {}
