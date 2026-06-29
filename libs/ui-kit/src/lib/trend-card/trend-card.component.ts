import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type TrendDirection = 'up' | 'down' | 'flat';

export type TrendTone = 'healthy' | 'attention' | 'critical' | 'neutral';

export interface TrendPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'lib-trend-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trend-card.component.html',
  styleUrls: ['./trend-card.component.scss'],
})
export class TrendCardComponent {
  @Input() kicker = '';
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() detail = '';
  @Input() direction: TrendDirection = 'flat';
  @Input() tone: TrendTone = 'neutral';
  @Input() points: TrendPoint[] = [];

  get trendSymbol(): string {
    if (this.direction === 'up') return '↗';
    if (this.direction === 'down') return '↘';
    return '→';
  }

  get maxValue(): number {
    return Math.max(...this.points.map((point) => point.value), 1);
  }

  get minValue(): number {
    return Math.min(...this.points.map((point) => point.value), 0);
  }

  get range(): number {
    return Math.max(this.maxValue - this.minValue, 1);
  }
  get isPercentValue(): boolean {
  return typeof this.value === 'string' && this.value.includes('%');
}
  pointHeight(value: number): string {
    const normalized = ((value - this.minValue) / this.range) * 100;
    return `${Math.max(12, Math.round(normalized))}%`;
  }
}