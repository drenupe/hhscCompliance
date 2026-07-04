import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  StepperAlignment,
  StepperOrientation,
  StepperSize,
  StepperStep,
  StepperVariant,
  StepperWidth,
  StepStatus,
} from './models/stepper.model';

import { StepperStateService } from './services/stepper-state.service';

@Component({
  selector: 'lib-stepper',
  standalone: true,
  imports: [CommonModule],
  providers: [StepperStateService],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnChanges {
  private readonly state = inject(StepperStateService);

  @Input({ required: true })
  steps: StepperStep[] = [];

  @Input()
  currentStepId = '';

  @Input()
  variant: StepperVariant = 'number';

  @Input()
  orientation: StepperOrientation = 'horizontal';

  @Input()
  size: StepperSize = 'comfortable';

  @Input()
  width: StepperWidth = 'fill';

  @Input()
  alignment: StepperAlignment = 'space-between';

  @Input()
  clickable = false;

  @Input()
  showNumbers = true;

  @Input()
  showDescriptions = true;

  @Input()
  showIcons = true;

  @Input()
  showProgress = true;

  @Input()
  responsive = true;

  @Output()
  stepSelected = new EventEmitter<StepperStep>();

  readonly progressPercent = this.state.progressPercent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['steps'] || changes['currentStepId']) {
      this.state.initialize(this.steps, this.currentStepId);
    }
  }

  get hostClasses(): string[] {
    return [
      'stepper',
      `stepper--${this.variant}`,
      `stepper--${this.orientation}`,
      `stepper--${this.size}`,
      `stepper--width-${this.width}`,
      `stepper--align-${this.alignment}`,
      this.responsive ? 'stepper--responsive' : '',
    ].filter(Boolean);
  }

  getStepStatus(step: StepperStep, index: number): StepStatus {
    if (step.disabled) {
      return 'disabled';
    }

    if (step.status) {
      return step.status;
    }

    if (step.id === this.currentStepId) {
      return 'active';
    }

    if (index < this.state.currentIndex()) {
      return 'complete';
    }

    return 'pending';
  }

  getStepClasses(step: StepperStep, index: number): string[] {
    const status = this.getStepStatus(step, index);

    return [
      'stepper__step',
      `stepper__step--${status}`,
      this.clickable && !step.disabled ? 'stepper__step--clickable' : '',
    ].filter(Boolean);
  }

  selectStep(step: StepperStep): void {
    if (!this.clickable || step.disabled) {
      return;
    }

    this.state.goTo(step.id);
    this.stepSelected.emit(step);
  }
}