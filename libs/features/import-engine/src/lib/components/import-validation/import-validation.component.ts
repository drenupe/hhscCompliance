import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import {
  ImportSummary,
  ImportValidationResult,
} from '@hhsc-compliance/shared-models';

import {
  StepperComponent,
  StepperStep,
} from '@hhsc-compliance/ui-kit';

import {
  ProcessEngineService,
  ProcessStateService,
} from '@hhsc-compliance/data-access';

import { ImportValidationCardComponent } from '../import-validation-card/import-validation-card.component';
import { AGENCY_CREATION_WORKFLOW } from '../../workflows/agency-creation.workflow';

@Component({
  selector: 'lib-import-validation',
  standalone: true,
  imports: [CommonModule, ImportValidationCardComponent, StepperComponent],
  templateUrl: './import-validation.component.html',
  styleUrls: ['./import-validation.component.scss'],
})
export class ImportValidationComponent {
  private readonly processEngine = inject(ProcessEngineService);
  private readonly processState = inject(ProcessStateService);

  readonly workflow = AGENCY_CREATION_WORKFLOW;
  readonly currentStepId = 'validation';
  readonly steps: StepperStep[] = this.workflow.steps;

  readonly validationResults = computed<ImportValidationResult[]>(() =>
    this.processState.readiness().categories.map((category) => {
      const totalRecords =
        this.processState
          .templates()
          .find((template) => template.id === category.id)?.recordsFound ?? 0;

      return {
        templateId: category.id,
        templateName: category.label,
        totalRecords,
        validRecords: Math.max(totalRecords - category.errors, 0),
        warningCount: category.warnings,
        errorCount: category.errors,
        issues: [],
      };
    }),
  );

readonly summary = computed<ImportSummary>(() => {
  const templates = this.processState.templates();
  const readiness = this.processState.readiness();

  return {
    totalFilesUploaded: templates.filter((template) => template.uploaded).length,
    totalRecordsReady: templates.reduce(
      (total, template) => total + (template.recordsFound ?? 0),
      0,
    ),
    totalWarnings: readiness.warnings,
    totalErrors: readiness.errors,
    readinessScore: readiness.overallScore,
    readinessPercent: readiness.overallScore,
    readyToImport: readiness.readyToBuild,
    items: readiness.categories.map((category) => {
      const recordsReady =
        templates.find((template) => template.id === category.id)
          ?.recordsFound ?? 0;

      return {
        templateId: category.id,
        label: category.label,
        recordsReady,
        warnings: category.warnings,
        errors: category.errors,
      };
    }),
  };
});

  validate(): void {
    this.processEngine.validate();
  }

  trackByTemplate(index: number, item: ImportValidationResult): string {
    return item.templateId;
  }
}