import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ImportValidationResult } from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-import-validation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-validation-card.component.html',
  styleUrls: ['./import-validation-card.component.scss'],
})
export class ImportValidationCardComponent {
  @Input({ required: true })
  result!: ImportValidationResult;

  get statusLabel(): string {
    if (this.result.errorCount > 0) {
      return 'Needs Correction';
    }

    if (this.result.warningCount > 0) {
      return 'Review Recommended';
    }

    return 'Ready';
  }

  get statusClass(): string {
    if (this.result.errorCount > 0) {
      return 'status status--error';
    }

    if (this.result.warningCount > 0) {
      return 'status status--warning';
    }

    return 'status status--ready';
  }

  get hasIssues(): boolean {
    return this.result.issues.length > 0;
  }
}