import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { ProcessEngineService, ProcessStateService } from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-build',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.scss'],
})
export class BuildComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly engine = inject(ProcessEngineService);
  readonly state = inject(ProcessStateService);

  readonly buildPlan = this.state.buildPlan;
  readonly progress = signal(0);
  readonly building = signal(false);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    await this.runBuild();
  }

  async runBuild(): Promise<void> {
    if (this.building()) {
      return;
    }

    this.error.set('');
    this.building.set(true);
    this.progress.set(8);

    const timer = window.setInterval(() => {
      this.progress.update((value) => Math.min(value + 9, 92));
    }, 300);

    try {
      await this.engine.build();

      this.progress.set(100);

      window.clearInterval(timer);

      await new Promise((resolve) => window.setTimeout(resolve, 500));

      await this.router.navigate([
        '/provider-onboarding/agency-creation/complete',
      ]);
    } catch {
      window.clearInterval(timer);
      this.error.set('Build failed. Please review the import and try again.');
    } finally {
      this.building.set(false);
    }
  }
}