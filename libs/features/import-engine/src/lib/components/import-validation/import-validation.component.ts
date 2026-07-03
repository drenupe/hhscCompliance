import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  ImportSummary,
  ImportValidationResult,
} from '@hhsc-compliance/shared-models';

import { ImportValidationCardComponent } from '../import-validation-card/import-validation-card.component';
import { ImportEngineService } from '../../services/import-engine.service';

@Component({
  selector: 'lib-import-validation',
  standalone: true,
  imports: [
    CommonModule,
    ImportValidationCardComponent,
  ],
  templateUrl: './import-validation.component.html',
  styleUrls: ['./import-validation.component.scss'],
})
export class ImportValidationComponent {
  private readonly importEngine = inject(ImportEngineService);

  readonly validationResults = this.importEngine.validationResults;

  readonly summary: ImportSummary = this.importEngine.getSummary();

  trackByTemplate(
    index: number,
    item: ImportValidationResult,
  ): string {
    return item.templateId;
  }
}