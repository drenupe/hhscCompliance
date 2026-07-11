import { CommonModule } from '@angular/common';
import { Component, computed, inject , OnInit} from '@angular/core';
import { Router } from '@angular/router';

import {
  ProcessEngineService,
  ProcessStateService,
} from '@hhsc-compliance/data-access';

import {
  StepperStep,
  WorkflowShellComponent,
  WorkspaceComponent,
} from '@hhsc-compliance/ui-kit';

import { AGENCY_CREATION_WORKFLOW } from '../../workflows/agency-creation.workflow';

@Component({
  selector: 'lib-review',
  standalone: true,
  imports: [CommonModule, WorkflowShellComponent, WorkspaceComponent],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly engine = inject(ProcessEngineService);
  readonly state = inject(ProcessStateService);

  readonly workflow = AGENCY_CREATION_WORKFLOW;
  readonly currentStepId = 'review';
  readonly steps: StepperStep[] = this.workflow.steps;

  readonly provider = this.state.provider;
  readonly readiness = this.state.readiness;
  readonly buildPlan = this.state.buildPlan;
  readonly templates = this.state.templates;


ngOnInit(): void {
  window.setTimeout(() => {
    if (this.readiness().readyToBuild) {
      void this.buildProvider();
    }
  }, 1800);
}
  readonly uploadedTemplates = computed(() =>
    this.templates().filter((template) => template.uploaded),
  );

  readonly totalRecords = computed(() =>
    this.templates().reduce(
      (total, template) => total + (template.recordsFound ?? 0),
      0,
    ),
  );

  readonly requiredUploaded = computed(() =>
    this.templates().filter(
      (template) => template.requirement === 'required' && template.uploaded,
    ).length,
  );

  readonly relationshipChecks = computed(() => [
    {
      label: 'Provider record detected',
      passed: this.uploadedTemplates().some((template) => template.id === 'provider'),
    },
    {
      label: 'Residential locations available',
      passed: this.uploadedTemplates().some((template) => template.id === 'locations'),
    },
    {
      label: 'Employee records available',
      passed: this.uploadedTemplates().some((template) => template.id === 'employees'),
    },
    {
      label: 'Consumer records available',
      passed: this.uploadedTemplates().some((template) => template.id === 'consumers'),
    },
    {
      label: 'No blocking validation errors',
      passed: this.readiness().errors === 0,
    },
    {
      label: 'Build plan generated',
      passed: !!this.buildPlan(),
    },
  ]);

  readonly intelligenceSummary = computed(() => {
    const total = this.totalRecords();
    const uploaded = this.uploadedTemplates().length;
    const errors = this.readiness().errors;
    const warnings = this.readiness().warnings;

    if (errors > 0) {
      return `The Import Intelligence Engine reviewed ${uploaded} uploaded files and found ${errors} blocking issue${errors === 1 ? '' : 's'} that must be resolved before build.`;
    }

    if (warnings > 0) {
      return `The Import Intelligence Engine reviewed ${uploaded} uploaded files and prepared ${total} records. There are ${warnings} warning${warnings === 1 ? '' : 's'} to review before build.`;
    }

    return `The Import Intelligence Engine reviewed ${uploaded} uploaded files and prepared ${total} records. No blocking validation issues were detected. This provider is ready to build.`;
  });

  async buildProvider(): Promise<void> {
    this.engine.beginBuild();

    await this.router.navigate([
      '/provider-onboarding/agency-creation/build',
    ]);
  }

  async previous(): Promise<void> {
    this.engine.validate();

    await this.router.navigate([
      '/provider-onboarding/agency-creation/validation',
    ]);
  }
}