import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProcessEngineService, ProcessStateService } from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent {
  private readonly router = inject(Router);
  private readonly engine = inject(ProcessEngineService);
  readonly state = inject(ProcessStateService);

  readonly result = this.state.result;

  async goToDashboard(): Promise<void> {
    await this.router.navigate(['/operations']);
  }

  async importAnotherProvider(): Promise<void> {
    this.engine.start();

    await this.router.navigate(['/provider-onboarding/agency-creation']);
  }
}