import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from "@angular/core";

import { ComplianceChart, ChartDatum } from '../components/compliance-chart/compliance-chart';
import { ComplianceSummaryCard, ComplianceSummaryView } from '../components/compliance-summary-card/compliance-summary-card';


 import { ComplianceDashboardService} from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ComplianceSummaryCard, ComplianceChart],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  locations = ['Austin Home', 'Dallas Home', 'San Antonio Home'];
  selectedLocation = this.locations[0];

  summaryData: ComplianceSummaryView[] = [];
  chartData: ChartDatum[] = [];
  alerts: string[] = [];
  get hasUrgentAlerts(): boolean {
    return this.summaryData.some(s => s.status === 'critical');
  }

  private readonly  dashboard = inject(ComplianceDashboardService);
    private readonly router =   inject(Router) ;

  ngOnInit(): void {
    this.load(this.selectedLocation);
  }

  onLocationChange(loc: string) {
    this.selectedLocation = loc;
    this.load(loc);
  }

  private load(loc: string) {
    this.dashboard.getSummaryData(loc).subscribe(data => {
      this.summaryData = data;
      this.alerts = data
        .filter(d => d.status === 'critical')
        .map(d => `${d.title}: ${d.count} overdue`);
    });

    this.dashboard.getChartData(loc).subscribe(d => (this.chartData = d));
  }

  navigateTo(module: string) {
    // Adjust routes to your real routes under the shell
    this.router.navigate(['/', module]);
  }
}
