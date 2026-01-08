import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'lib-imp-staffing-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="h2">Staffing</div>
      <p class="sub">Assigned staff, training requirements, schedules, responsible parties.</p>
    </section>
  `,
})
export class ImpStaffingStep {}
