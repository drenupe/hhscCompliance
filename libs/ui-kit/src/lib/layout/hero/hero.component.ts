import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface HeroMetric {
  label: string;
  value: string | number;
  helper?: string;
}

export interface HeroAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  action: string;
}

@Component({
  selector: 'lib-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() statusLabel = '';
  @Input() statusTone: 'healthy' | 'warning' | 'danger' | 'neutral' = 'neutral';

  @Input() primaryMetricLabel = '';
  @Input() primaryMetricValue: string | number = '';
  @Input() primaryMetricHelper = '';

  @Input() metrics: HeroMetric[] = [];
  @Input() actions: HeroAction[] = [];

  @Output() actionSelected = new EventEmitter<string>();

  onAction(action: string): void {
    this.actionSelected.emit(action);
  }
}