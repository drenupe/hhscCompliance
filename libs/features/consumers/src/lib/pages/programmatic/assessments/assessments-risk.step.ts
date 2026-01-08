import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-assessments-risk-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Risk / Safety</div>
      <p class="sub">Risks, mitigations, protective factors, behavior/safety notes.</p>
    </section>
  `,
})
export class AssessmentsRiskStep {}