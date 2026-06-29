import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceSummaryView } from '@hhsc-compliance/data-access';

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

  @Output() viewDetails = new EventEmitter<ComplianceSummaryView>();

  get statusClass(): string {
    const status = this.summary?.status ?? 'ok';
    return `is-${status}`;
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

  onView(event?: Event): void {
    event?.stopPropagation();

    if (!this.summary) {
      return;
    }

    this.viewDetails.emit(this.summary);
  }
}