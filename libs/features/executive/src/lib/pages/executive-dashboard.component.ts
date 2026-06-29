import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { ExecutiveDashboardView } from '@hhsc-compliance/shared-models';
import { ExecutiveService } from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-executive-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-dashboard.component.html',
  styleUrl: './executive-dashboard.component.scss',
})
export class ExecutiveDashboardComponent implements OnInit {
  private readonly executive = inject(ExecutiveService);

  loading = true;
  error = '';
  dashboard?: ExecutiveDashboardView;

  ngOnInit(): void {
    this.executive.getDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load Executive Intelligence.';
      },
    });
  }
}