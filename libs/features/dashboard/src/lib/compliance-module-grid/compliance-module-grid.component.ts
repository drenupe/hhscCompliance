import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  OperationComplianceModule,
  OperationStatus,
} from '@hhsc-compliance/shared-models';

import { StatusChipComponent } from '@hhsc-compliance/ui-kit';

@Component({
  selector: 'lib-compliance-module-grid',
  standalone: true,
  imports: [CommonModule, StatusChipComponent],
  templateUrl: './compliance-module-grid.component.html',
  styleUrl: './compliance-module-grid.component.scss',
})
export class ComplianceModuleGridComponent {
  @Input() modules: OperationComplianceModule[] = [];

  @Output() open = new EventEmitter<OperationComplianceModule>();

  openModule(module: OperationComplianceModule): void {
    this.open.emit(module);
  }

  statusLabel(status: OperationStatus): string {
    switch (status) {
      case 'HEALTHY':
        return 'Healthy';
      case 'ATTENTION':
        return 'Needs Attention';
      case 'AT_RISK':
        return 'At Risk';
      case 'CRITICAL':
        return 'Critical';
      default:
        return status;
    }
  }

  statusVariant(
    status: OperationStatus,
  ): 'healthy' | 'attention' | 'warning' | 'critical' | 'neutral' {
    switch (status) {
      case 'HEALTHY':
        return 'healthy';
      case 'ATTENTION':
        return 'attention';
      case 'AT_RISK':
        return 'warning';
      case 'CRITICAL':
        return 'critical';
      default:
        return 'neutral';
    }
  }
}