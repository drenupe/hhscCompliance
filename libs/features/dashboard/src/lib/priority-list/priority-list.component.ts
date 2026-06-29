import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  OperationPriority,
  OperationPriorityLevel,
} from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-priority-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority-list.component.html',
  styleUrl: './priority-list.component.scss',
})
export class PriorityListComponent {
  @Input() priorities: OperationPriority[] = [];

  @Output() open = new EventEmitter<OperationPriority>();

  priorityClass(level: OperationPriorityLevel): string {
    return `priority--${level.toLowerCase()}`;
  }

  openPriority(priority: OperationPriority): void {
    this.open.emit(priority);
  }
}