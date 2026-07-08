import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProcessEngineService, ProcessStateService } from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  private readonly router = inject(Router);
  private readonly engine = inject(ProcessEngineService);
  readonly state = inject(ProcessStateService);

  readonly provider = this.state.provider;
  readonly readiness = this.state.readiness;
  readonly buildPlan = this.state.buildPlan;
  readonly templates = this.state.templates;

  async buildProvider(): Promise<void> {
    this.engine.beginBuild();

    await this.router.navigate([
      '/provider-onboarding/agency-creation/build',
    ]);
  }

  async previous(): Promise<void> {
    this.engine.previous();

    await this.router.navigate([
      '/provider-onboarding/agency-creation/validation',
    ]);
  }
}