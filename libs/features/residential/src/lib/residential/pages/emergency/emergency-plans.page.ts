import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-emergency-plans-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Emergency Plans</div>
      <div class="sub">TAC §565.23(f) — plan availability, staff review, posted emergency numbers.</div>
      <div class="msg">Next: plan storage location + staff acknowledgement log + posted numbers checklist.</div>
    </section>
  `,
})
export class EmergencyPlansPage {}
