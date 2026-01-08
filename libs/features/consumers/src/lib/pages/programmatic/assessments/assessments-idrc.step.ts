import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-assessments-idrc-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">IDRC</div>
      <p class="sub">IDRC determinations, service decisions, meeting notes.</p>
    </section>
  `,
})
export class AssessmentsIdrcStep {}