import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkflowHeaderComponent } from '../header/workflow-header.component';
import { WorkflowToolbarComponent } from '../toolbar/workflow-toolbar.component';
import { WorkflowFooterComponent } from '../footer/workflow-footer.component';
import { StepperComponent } from '../stepper/stepper.component';

import {
  StepperSize,
  StepperStep,
  StepperVariant,
} from '../stepper/models/stepper.model';

@Component({
  selector: 'lib-workflow-shell',
  standalone: true,
  imports: [
    CommonModule,
    WorkflowHeaderComponent,
    WorkflowToolbarComponent,
    WorkflowFooterComponent,
    StepperComponent,
  ],
  templateUrl: './workflow-shell.component.html',
  styleUrls: ['./workflow-shell.component.scss'],
})
export class WorkflowShellComponent {
  @Input({ required: true })
  steps: StepperStep[] = [];

  @Input({ required: true })
  currentStepId = '';

  // Header
  @Input()
  eyebrow = 'Workflow';

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  lastSaved = '';

  // Stepper
  @Input()
  stepperSize: StepperSize = 'compact';

  @Input()
  stepperVariant: StepperVariant = 'number';

  @Input()
  sticky = true;

  @Input()
  showProgress = true;

  @Input()
  showDescriptions = false;

  @Input()
  showHeader = true;

  @Input()
  showToolbar = true;

  @Input()
  showFooter = true;

  // Footer
  @Input()
  previousLabel = 'Previous';

  @Input()
  nextLabel = 'Next';

  @Input()
  saveLabel = 'Save Draft';

  @Input()
  disablePrevious = false;

  @Input()
  disableNext = false;

  @Input()
  showSave = true;

  @Output()
  previous = new EventEmitter<void>();

  @Output()
  next = new EventEmitter<void>();

  @Output()
  save = new EventEmitter<void>();

  @Output()
  help = new EventEmitter<void>();

  @Output()
  exit = new EventEmitter<void>();

  @Output()
  stepSelected = new EventEmitter<StepperStep>();

  get currentIndex(): number {
    return this.steps.findIndex(
      (step) => step.id === this.currentStepId,
    );
  }

  get progress(): number {
    if (!this.steps.length || this.currentIndex < 0) {
      return 0;
    }

    return Math.round(
      ((this.currentIndex + 1) / this.steps.length) * 100,
    );
  }

  get currentStepLabel(): string {
    if (!this.steps.length || this.currentIndex < 0) {
      return '';
    }

    return `Step ${this.currentIndex + 1} of ${this.steps.length}`;
  }
}