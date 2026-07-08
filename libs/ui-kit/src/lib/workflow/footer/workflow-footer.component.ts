import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-workflow-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-footer.component.html',
  styleUrls: ['./workflow-footer.component.scss'],
})
export class WorkflowFooterComponent {
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() saveLabel = 'Save Draft';

  @Input() disablePrevious = false;
  @Input() disableNext = false;
  @Input() showSave = true;

  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}