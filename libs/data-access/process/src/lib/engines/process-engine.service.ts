import { Injectable, inject } from '@angular/core';

import {
  ImportTemplate,
  OnboardingProviderSetup,
} from '@hhsc-compliance/shared-models';

import { BuildEngineService } from './build-engine.service';
import { ValidationEngineService } from './validation-engine.service';
import { WorkflowEngineService } from './workflow-engine.service';
import { ProcessStateService } from '../state';

@Injectable({
  providedIn: 'root',
})
export class ProcessEngineService {
  private readonly state = inject(ProcessStateService);
  private readonly validation = inject(ValidationEngineService);
  private readonly builder = inject(BuildEngineService);
  private readonly workflow = inject(WorkflowEngineService);

  start(): void {
    this.state.reset();
  }

  updateProvider(provider: Partial<OnboardingProviderSetup>): void {
    this.state.updateProvider(provider);
  }

  updateTemplates(templates: ImportTemplate[]): void {
    this.state.setTemplates(templates);
  }

  validate(): void {
    const session = this.state.session();

    const readiness = this.validation.evaluate(session.templates);

    this.state.setReadiness(readiness);

    this.state.setBuildPlan(
      this.builder.createPlan({
        ...session,
        readiness,
      }),
    );

    this.workflow.goTo('review');
  }

  beginBuild(): void {
    this.workflow.goTo('build');
  }

  async build(): Promise<void> {
    this.workflow.goTo('build');

    const result = await this.builder.build(this.state.session());

    this.state.setResult(result);
  }

  previous(): void {
    this.workflow.previous();
  }

  next(): void {
    this.workflow.next();
  }
}