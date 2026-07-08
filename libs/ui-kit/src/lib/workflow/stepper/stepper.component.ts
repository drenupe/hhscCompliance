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

  @Input() currentStepId = '';
  @Input() title = 'Agency Onboarding';
  @Input() subtitle = 'Import provider information';

  @Input() variant: StepperVariant = 'number';
  @Input() orientation: StepperOrientation = 'horizontal';
  @Input() size: StepperSize = 'compact';
  @Input() width: StepperWidth = 'fill';
  @Input() alignment: StepperAlignment = 'space-between';

  @Input() clickable = true;
  @Input() allowHistoryNavigation = true;
  @Input() showNumbers = true;
  @Input() showDescriptions = false;
  @Input() showIcons = true;
  @Input() showProgress = true;
  @Input() showHeader = true;
  @Input() sticky = true;
  @Input() autoScroll = true;
  @Input() responsive = true;

  @Output() stepSelected = new EventEmitter<StepperStep>();

  readonly progressPercent = this.state.progressPercent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['steps'] || changes['currentStepId']) {
      this.state.initialize(this.steps, this.currentStepId);

      if (changes['currentStepId'] && !changes['currentStepId'].firstChange) {
        this.scrollToTop();
      }
    }
  }

  get currentIndex(): number {
    return this.state.currentIndex();
  }

  get progressLabel(): number {
    return Math.round(this.progressPercent());
  }

  get currentStepLabel(): string {
    return this.steps.length && this.currentIndex >= 0
      ? `Step ${this.currentIndex + 1} of ${this.steps.length}`
      : 'Step 0 of 0';
  }

  get hostClasses(): string[] {
    return [
      'stepper',
      `stepper--${this.variant}`,
      `stepper--${this.orientation}`,
      `stepper--${this.size}`,
      `stepper--width-${this.width}`,
      `stepper--align-${this.alignment}`,
      this.sticky ? 'stepper--sticky' : '',
      this.responsive ? 'stepper--responsive' : '',
    ].filter(Boolean);
  }

  getStepStatus(step: StepperStep, index: number): StepStatus {
    if (step.disabled) return 'disabled';
    if (step.status) return step.status;
    if (step.id === this.currentStepId) return 'active';
    if (index < this.currentIndex) return 'complete';
    return 'pending';
  }

  getStepClasses(step: StepperStep, index: number): string[] {
    return [
      'stepper__step',
      `stepper__step--${this.getStepStatus(step, index)}`,
      this.canSelectStep(step, index) ? 'stepper__step--clickable' : '',
    ].filter(Boolean);
  }

  getConnectorClasses(index: number): string[] {
    const currentStatus = this.getStepStatus(this.steps[index], index);
    const nextStatus = this.getStepStatus(this.steps[index + 1], index + 1);

    return [
      'stepper__connector',
      currentStatus === 'complete' ? 'stepper__connector--complete' : '',
      nextStatus === 'active' ? 'stepper__connector--active' : '',
    ].filter(Boolean);
  }

  getMarkerLabel(step: StepperStep, index: number): string {
    const status = this.getStepStatus(step, index);

    if (status === 'complete') return '✓';
    if (this.showIcons && step.icon) return step.icon;
    if (this.showNumbers && this.variant !== 'dots') return String(index + 1);

    return '';
  }

  getStepTooltip(step: StepperStep, index: number): string {
    const status = this.getStepStatus(step, index);
    const label =
      status === 'complete'
        ? 'Completed'
        : status === 'active'
          ? 'Current step'
          : 'Pending';

    return step.description
      ? `${step.title} — ${label}. ${step.description}`
      : `${step.title} — ${label}`;
  }

  canSelectStep(step: StepperStep, index: number): boolean {
    if (!this.clickable || step.disabled) return false;
    if (step.id === this.currentStepId) return true;

    return this.allowHistoryNavigation && index < this.currentIndex;
  }

  selectStep(step: StepperStep, index: number): void {
    if (!this.canSelectStep(step, index)) return;

    this.state.goTo(step.id);
    this.stepSelected.emit(step);
    this.scrollToTop();
  }

  private scrollToTop(): void {
    if (!this.autoScroll || typeof window === 'undefined') return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}