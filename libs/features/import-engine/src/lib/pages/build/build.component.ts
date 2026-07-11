import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  ProcessEngineService,
  ProcessStateService,
} from '@hhsc-compliance/data-access';

import {
  WorkflowShellComponent,
  WorkspaceComponent,
} from '@hhsc-compliance/ui-kit';

import { AGENCY_CREATION_WORKFLOW } from '../../workflows/agency-creation.workflow';

interface BuildStage {
  id: string;
  label: string;
  description: string;
  count: number;
  status: 'waiting' | 'running' | 'complete' | 'failed';
}

@Component({
  selector: 'lib-build',
  standalone: true,
  imports: [CommonModule, WorkflowShellComponent, WorkspaceComponent],
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss'],
})
export class BuildComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly engine = inject(ProcessEngineService);
  readonly state = inject(ProcessStateService);

  readonly workflow = AGENCY_CREATION_WORKFLOW;
  readonly currentStepId = 'build';
  readonly steps = this.workflow.steps;

  readonly buildPlan = this.state.buildPlan;
  readonly progress = signal(0);
  readonly building = signal(false);
  readonly error = signal('');
  readonly currentStageIndex = signal(0);

  readonly stages = computed<BuildStage[]>(() => {
    const plan = this.buildPlan();

    if (!plan) {
      return [];
    }

    return plan.items.map((item, index) => {
      let status: BuildStage['status'] = 'waiting';

      if (index < this.currentStageIndex()) {
        status = 'complete';
      }

      if (index === this.currentStageIndex() && this.building()) {
        status = 'running';
      }

      if (this.error() && index === this.currentStageIndex()) {
        status = 'failed';
      }

      return {
        id: item.id,
        label: item.label,
        description: this.getStageDescription(item.id),
        count: item.count,
        status,
      };
    });
  });

  async ngOnInit(): Promise<void> {
    await this.runBuild();
  }

  async runBuild(): Promise<void> {
    const plan = this.buildPlan();

    if (this.building() || !plan) {
      return;
    }

    this.error.set('');
    this.progress.set(0);
    this.currentStageIndex.set(0);
    this.building.set(true);

    try {
      for (let index = 0; index < plan.items.length; index += 1) {
        this.currentStageIndex.set(index);
        this.progress.set(Math.round((index / plan.items.length) * 92));

        await this.delay(550);
      }

      this.progress.set(96);

      await this.engine.build();

      this.currentStageIndex.set(plan.items.length);
      this.progress.set(100);

      await this.delay(700);

      await this.router.navigate([
        '/provider/workspace',
      ]);
      
    } catch {
      this.error.set('Build failed. Please review the import and try again.');
    } finally {
      this.building.set(false);
    }
  }

  cancelBuild(): void {
    if (!this.building()) {
      return;
    }

    this.error.set('Build cancelled before database commit.');
    this.building.set(false);
  }

  private getStageDescription(stageId: string): string {
    switch (stageId) {
      case 'provider':
        return 'Preparing provider record from onboarding data.';

      case 'residential-locations':
        return 'Preparing residential locations and home records.';

      case 'employees':
        return 'Preparing employee profiles and staff records.';

      case 'consumers':
        return 'Preparing consumer records and service data.';

      case 'relationships':
        return 'Linking consumers, employees, homes, and authorizations.';

      case 'compliance-modules':
        return 'Generating initial compliance baseline.';

      case 'dashboard':
        return 'Preparing Provider Intelligence Center.';

      default:
        return 'Preparing build step.';
    }
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }
}