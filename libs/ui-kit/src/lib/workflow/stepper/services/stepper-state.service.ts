import { computed, Injectable, signal } from '@angular/core';

import { StepperStep } from '../models/stepper.model';

@Injectable()
export class StepperStateService {
  private readonly stepsState = signal<StepperStep[]>([]);
  private readonly currentStepIdState = signal<string>('');

  readonly steps = this.stepsState.asReadonly();
  readonly currentStepId = this.currentStepIdState.asReadonly();

  readonly currentIndex = computed(() =>
    this.steps().findIndex((step) => step.id === this.currentStepId()),
  );

  readonly currentStep = computed(() =>
    this.steps().find((step) => step.id === this.currentStepId()),
  );

  readonly previousStep = computed(() => {
    const index = this.currentIndex();

    return index > 0 ? this.steps()[index - 1] : undefined;
  });

  readonly nextStep = computed(() => {
    const index = this.currentIndex();

    return index >= 0 && index < this.steps().length - 1
      ? this.steps()[index + 1]
      : undefined;
  });

  readonly progressPercent = computed(() => {
    const totalSteps = this.steps().length;
    const index = this.currentIndex();

    if (totalSteps <= 1 || index < 0) {
      return 0;
    }

    return Math.round((index / (totalSteps - 1)) * 100);
  });

  initialize(steps: StepperStep[], currentStepId: string): void {
    this.stepsState.set(steps);
    this.currentStepIdState.set(currentStepId);
  }

  setCurrentStep(stepId: string): void {
    this.currentStepIdState.set(stepId);
  }

  goTo(stepId: string): void {
    this.setCurrentStep(stepId);
  }

  next(): void {
    const nextStep = this.nextStep();

    if (!nextStep || nextStep.disabled) {
      return;
    }

    this.currentStepIdState.set(nextStep.id);
  }

  previous(): void {
    const previousStep = this.previousStep();

    if (!previousStep || previousStep.disabled) {
      return;
    }

    this.currentStepIdState.set(previousStep.id);
  }

  reset(): void {
    const firstStep = this.steps()[0];

    this.currentStepIdState.set(firstStep?.id ?? '');
  }
}