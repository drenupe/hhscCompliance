import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-life-safety-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Life Safety</div>
      <div class="sub">TAC §565.23(d) — egress, smoke alarms, extinguishers, escape plans.</div>
      <div class="msg">Next: add inspection checks + evidence binder per item.</div>
    </section>
  `,
})
export class ResidentialLifeSafetyPage {}
