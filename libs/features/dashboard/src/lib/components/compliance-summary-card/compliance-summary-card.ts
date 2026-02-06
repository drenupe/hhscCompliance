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

  // ✅ deep link support
  link?: any[];
  queryParams?: Record<string, any>;
}

@Component({
  selector: 'lib-compliance-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-summary-card.html',
  styleUrls: ['./compliance-summary-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceSummaryCard {
  @Input() summary?: ComplianceSummaryView;

  // ✅ IMPORTANT: emit the whole object (not a string)
  @Output() viewDetails = new EventEmitter<ComplianceSummaryView>();

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
  
onView(e?: Event) {
  console.log('[card] click', { hasSummary: !!this.summary, summary: this.summary });
  if (this.summary) this.viewDetails.emit(this.summary);
}

}
