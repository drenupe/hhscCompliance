import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ProviderHealthTone =
  | 'healthy'
  | 'attention'
  | 'critical';

export interface ProviderHealthMetric {
  label: string;
  value: string | number;
}

@Component({
  selector: 'lib-provider-health-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-health-gauge.component.html',
  styleUrl: './provider-health-gauge.component.scss',
})
export class ProviderHealthGaugeComponent {
  @Input() score = 0;
  @Input() title = 'Provider Health';
  @Input() subtitle = 'Overall Provider Performance';
  @Input() trend = '+0% This Quarter';
  @Input() metrics: ProviderHealthMetric[] = [];

  get tone(): ProviderHealthTone {
    if (this.score >= 90) return 'healthy';
    if (this.score >= 75) return 'attention';
    return 'critical';
  }

  get circumference(): number {
    return 2 * Math.PI * 52;
  }

  get dashOffset(): number {
    return this.circumference - (this.score / 100) * this.circumference;
  }

  get label(): string {
    if (this.score >= 95) return 'Excellent';
    if (this.score >= 85) return 'Healthy';
    if (this.score >= 70) return 'Needs Attention';
    return 'Critical';
  }
}