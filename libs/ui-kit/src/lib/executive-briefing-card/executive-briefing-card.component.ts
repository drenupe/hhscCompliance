import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type ExecutiveBriefingTone =
  | 'healthy'
  | 'attention'
  | 'critical'
  | 'neutral';

export interface ExecutiveBriefingItem {
  label: string;
  value?: string | number;
  tone?: ExecutiveBriefingTone;
}

@Component({
  selector: 'lib-executive-briefing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-briefing-card.component.html',
  styleUrl: './executive-briefing-card.component.scss',
})
export class ExecutiveBriefingCardComponent {
  @Input() kicker = 'Executive Briefing';
  @Input() title = 'Current leadership summary';
  @Input() summary = '';
  @Input() tone: ExecutiveBriefingTone = 'neutral';
  @Input() items: ExecutiveBriefingItem[] = [];
}