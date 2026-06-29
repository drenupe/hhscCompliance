import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type AnalyticsCardTone =
  | 'healthy'
  | 'attention'
  | 'critical'
  | 'neutral';

export interface AnalyticsCardDatum {
  label: string;
  value: number;
  helper?: string;
  tone?: AnalyticsCardTone;
}

@Component({
  selector: 'lib-analytics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-card.component.html',
  styleUrls: ['./analytics-card.component.scss'],
})
export class AnalyticsCardComponent {
  @Input() kicker = '';
  @Input() title = '';
  @Input() summary = '';
  @Input() value: string | number = '';
  @Input() detail = '';
  @Input() tone: AnalyticsCardTone = 'neutral';
  @Input() data: AnalyticsCardDatum[] = [];

  get maxValue(): number {
    const max = Math.max(...this.data.map((item) => item.value), 0);
    return max > 0 ? max : 1;
  }

  widthFor(value: number): string {
    return `${Math.max(4, Math.round((value / this.maxValue) * 100))}%`;
  }
}