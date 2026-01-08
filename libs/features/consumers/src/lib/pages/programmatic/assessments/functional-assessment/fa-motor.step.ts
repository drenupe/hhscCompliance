import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-fa-motor-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Motor (Gross + Fine)</div>
      <p class="sub">Score independence 0–4, safety, consistency. Notes + supports.</p>
    </section>
  `,
})
export class FaMotorStep {}
