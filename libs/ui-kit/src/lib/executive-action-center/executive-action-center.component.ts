import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ExecutiveActionPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ExecutiveActionItem {
  id: string;
  title: string;
  description: string;
  priority: ExecutiveActionPriority;
  impactLabel?: string;
  estimatedHealthGain?: number;
  estimatedReadinessGain?: number;
  routeCommands?: string[] | null;
  queryParams?: Record<string, unknown> | null;
}

@Component({
  selector: 'lib-executive-action-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-action-center.component.html',
  styleUrl: './executive-action-center.component.scss',
})
export class ExecutiveActionCenterComponent {
  @Input() kicker = 'Executive Action Center';
  @Input() title = 'Highest-value actions';
  @Input() summary = 'Prioritized actions based on current provider risk.';
  @Input() actions: ExecutiveActionItem[] = [];

  @Output() open = new EventEmitter<ExecutiveActionItem>();

  get totalHealthGain(): number {
    return this.actions.reduce(
      (sum, action) => sum + (action.estimatedHealthGain ?? 0),
      0,
    );
  }

  get totalReadinessGain(): number {
    return this.actions.reduce(
      (sum, action) => sum + (action.estimatedReadinessGain ?? 0),
      0,
    );
  }

  openAction(action: ExecutiveActionItem): void {
    this.open.emit(action);
  }
}