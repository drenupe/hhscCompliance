import { Injectable, inject } from '@angular/core';

import { OnboardingStep } from '@hhsc-compliance/shared-models';
import { ProcessStateService } from '../state';

@Injectable({
  providedIn: 'root',
})
export class WorkflowEngineService {
  private readonly state = inject(ProcessStateService);

  private readonly order: OnboardingStep[] = [
    'setup',
    'import',
    'validation',
    'review',
    'build',
    'complete',
  ];

  next(): void {
    const index = this.order.indexOf(this.state.currentStep());

    if (index < this.order.length - 1) {
      this.state.setStep(this.order[index + 1]);
    }
  }

  previous(): void {
    const index = this.order.indexOf(this.state.currentStep());

    if (index > 0) {
      this.state.setStep(this.order[index - 1]);
    }
  }

  goTo(step: OnboardingStep): void {
    this.state.setStep(step);
  }

  finish(): void {
    this.state.setStep('complete');
  }

  reset(): void {
    this.state.setStep('setup');
  }
}