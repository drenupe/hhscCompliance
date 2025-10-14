import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SummaryStatus = 'ok' | 'warning' | 'critical';

export interface ComplianceSummaryView {
  title: string;
  module: string;
  count: number;
  status: SummaryStatus;
  lastUpdated?: string;
}

@Component({
  selector: 'lib-compliance-summary-card',
  standalone: true,
  imports: [CommonModule],
  // If your file name is `compliance-summary-card.html`, keep this:
  templateUrl: './compliance-summary-card.html',
  // If you use `.component.html`, change to `./compliance-summary-card.component.html`
  styleUrls: ['./compliance-summary-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceSummaryCard {
  @Input() summary?: ComplianceSummaryView;  // allow undefined at compile time
  @Output() viewDetails = new EventEmitter<string>(); // emits module

  get statusClass(): string {
    const s = this.summary?.status ?? 'ok';
    return `is-${s}`;
  }

  get icon(): string {
    switch (this.summary?.status) {
      case 'critical':
        return '✖';
      case 'warning':
        return '⚠';
      default:
        return '✔';
    }
  }

  onView() {
    if (this.summary?.module) this.viewDetails.emit(this.summary.module);
  }
}
