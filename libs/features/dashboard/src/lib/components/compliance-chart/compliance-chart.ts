import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChartDatum = { label: string; value: number };

@Component({
  selector: 'lib-compliance-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-chart.html',
  styleUrls: ['./compliance-chart.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceChart{
  @Input() data: ChartDatum[] = [];

  get max(): number {
    return Math.max(1, ...this.data.map(d => d.value ?? 0));
  }

  trackByLabel = (_: number, d: ChartDatum) => d.label;
}
