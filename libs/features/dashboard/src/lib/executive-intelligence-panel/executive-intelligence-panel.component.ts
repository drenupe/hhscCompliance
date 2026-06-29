import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  OperationExecutiveRisk,
  OperationPriorityLevel,
  OperationsExecutiveIntelligence,
} from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-executive-intelligence-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-intelligence-panel.component.html',
  styleUrl: './executive-intelligence-panel.component.scss',
})
export class ExecutiveIntelligencePanelComponent {
  private readonly router = inject(Router);

  @Input({ required: true })
  executive!: OperationsExecutiveIntelligence;

  priorityClass(level: OperationPriorityLevel): string {
    return `risk--${level.toLowerCase()}`;
  }

  openRisk(risk: OperationExecutiveRisk): void {
    if (!risk.routeCommands?.length) {
      return;
    }

    this.router.navigate(risk.routeCommands, {
      queryParams: risk.queryParams ?? {},
    });
  }
}