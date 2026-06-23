import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type WorkQueueSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface CaseManagerWorkQueueItem {
  id: string;
  title: string;
  status: string;
  severity: WorkQueueSeverity;
  module?: string | null;
  subcategory?: string | null;
  ruleCode?: string | null;
  message?: string | null;
  dueDate?: string | null;
  locationId?: string | null;
  routeCommands?: any[] | null;
  queryParams?: Record<string, any> | null;
}

export interface CaseManagerWorkQueueView {
  openCaps: CaseManagerWorkQueueItem[];
  readyForReview: CaseManagerWorkQueueItem[];
  overdueCaps: CaseManagerWorkQueueItem[];
  highSeverityFindings: CaseManagerWorkQueueItem[];
  evidenceMissing: CaseManagerWorkQueueItem[];
  recheckQueue: CaseManagerWorkQueueItem[];
}

@Component({
  selector: 'lib-case-manager-work-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-manager-work-queue.component.html',
  styleUrls: ['./case-manager-work-queue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerWorkQueueComponent {
  @Input() queue: CaseManagerWorkQueueView | null = null;
  @Input() loading = false;

  @Output() viewItem = new EventEmitter<CaseManagerWorkQueueItem>();

  sections(): Array<{ title: string; items: CaseManagerWorkQueueItem[]; empty: string }> {
    const q = this.queue;

    return [
      { title: 'Open CAPs', items: q?.openCaps ?? [], empty: 'No open CAPs.' },
      { title: 'Ready For Review', items: q?.readyForReview ?? [], empty: 'Nothing ready for review.' },
      { title: 'Overdue CAPs', items: q?.overdueCaps ?? [], empty: 'No overdue CAPs.' },
      { title: 'High Severity Findings', items: q?.highSeverityFindings ?? [], empty: 'No high severity findings.' },
      { title: 'Evidence Missing', items: q?.evidenceMissing ?? [], empty: 'No missing evidence.' },
      { title: 'Recheck Queue', items: q?.recheckQueue ?? [], empty: 'No rechecks pending.' },
    ];
  }

  itemClass(item: CaseManagerWorkQueueItem): string {
    return `item item--${String(item.severity || 'LOW').toLowerCase()}`;
  }

  dueLabel(item: CaseManagerWorkQueueItem): string {
    if (!item.dueDate) return 'No due date';
    return new Date(item.dueDate).toLocaleDateString();
  }

  open(item: CaseManagerWorkQueueItem): void {
    this.viewItem.emit(item);
  }
}