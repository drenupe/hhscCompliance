import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-assessments-overview-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Assessments Overview</div>
      <p class="sub">Rollup of required assessments, due dates, and status.</p>
    </section>
  `,
})
export class AssessmentsOverviewStep {}
