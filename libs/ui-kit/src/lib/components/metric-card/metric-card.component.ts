import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() detail = '';
  @Input() status: 'healthy' | 'attention' | 'at-risk' | 'critical' | 'neutral' =
    'neutral';
}