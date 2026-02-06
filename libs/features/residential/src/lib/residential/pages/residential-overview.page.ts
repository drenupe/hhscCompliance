import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-residential-overview-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="h2">Residential Overview</div>
      <div class="sub">
        This will become the TAC §565.23 section dashboard (Home, Life Safety, Fire Drills, Plans, etc.)
      </div>
    </div>
  `,
})
export class ResidentialOverviewPage {}
