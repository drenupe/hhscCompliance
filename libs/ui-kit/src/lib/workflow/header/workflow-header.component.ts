import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-workflow-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-header.component.html',
  styleUrls: ['./workflow-header.component.scss'],
})
export class WorkflowHeaderComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() progress = 0;
  @Input() currentStepLabel = '';
  @Input() lastSaved = '';
  @Input() showProgress = true;

  @Output() saveDraft = new EventEmitter<void>();
  @Output() help = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();
}