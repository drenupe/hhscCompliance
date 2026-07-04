import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  ImportSummary,
  ImportValidationResult,
} from '@hhsc-compliance/shared-models';

import {
  StepperComponent,
  StepperStep,
} from '@hhsc-compliance/ui-kit';

import { ImportValidationCardComponent } from '../import-validation-card/import-validation-card.component';
import { ImportEngineService } from '../../services/import-engine.service';
import { AGENCY_CREATION_WORKFLOW } from '../../workflows/agency-creation.workflow';

@Component({
  selector: 'lib-import-validation',
  standalone: true,
  imports: [CommonModule, ImportValidationCardComponent, StepperComponent],
  templateUrl: './import-validation.component.html',
  styleUrls: ['./import-validation.component.scss'],
})
export class ImportValidationComponent {
  private readonly importEngine = inject(ImportEngineService);

  readonly workflow = AGENCY_CREATION_WORKFLOW;
  readonly currentStepId = 'validation';
  readonly steps: StepperStep[] = this.workflow.steps;

  readonly validationResults = this.importEngine.validationResults;
  readonly summary: ImportSummary = this.importEngine.getSummary();

  trackByTemplate(index: number, item: ImportValidationResult): string {
    return item.templateId;
  }
}