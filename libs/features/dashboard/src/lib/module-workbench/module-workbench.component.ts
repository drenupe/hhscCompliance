import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';

import {
  ComplianceDashboardService,
  ModuleAffectedEntity,
  ModuleCorrectionArea,
  ModuleCorrectionView,
} from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-module-workbench',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-workbench.component.html',
  styleUrls: ['./module-workbench.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleWorkbenchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ComplianceDashboardService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  error = '';
  module = '';

  data: ModuleCorrectionView | null = null;

  get affectedEntities(): ModuleAffectedEntity[] {
    const map = new Map<string, ModuleAffectedEntity>();

    for (const area of this.data?.areas ?? []) {
      for (const entity of area.affectedEntities ?? []) {
        const key = `${entity.entityType}:${entity.entityId}`;
        const existing = map.get(key);

        if (!existing) {
          map.set(key, { ...entity });
          continue;
        }

        existing.findingCount += entity.findingCount;
        existing.criticalCount += entity.criticalCount;
        existing.highCount += entity.highCount;
        existing.mediumCount += entity.mediumCount;
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (b.criticalCount !== a.criticalCount) {
        return b.criticalCount - a.criticalCount;
      }

      if (b.highCount !== a.highCount) {
        return b.highCount - a.highCount;
      }

      return b.findingCount - a.findingCount;
    });
  }

  ngOnInit(): void {
    const module = this.route.snapshot.paramMap.get('module');

    if (!module) {
      this.error = 'Module is required';
      return;
    }

    this.module = module;
    this.load(module);
  }

  private load(module: string): void {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.api
      .getModuleCorrection(module)
      .pipe(
        take(1),
        catchError((err) => {
          this.error = `Failed to load module (${err?.status ?? 'unknown'})`;
          this.loading = false;
          this.cdr.markForCheck();
          return of(null);
        }),
      )
      .subscribe((result) => {
        this.data = result;
        this.loading = false;
        this.cdr.markForCheck();
      });
  }

  openEntity(entity: ModuleAffectedEntity): void {
    this.router.navigate([
      '/',
      'dashboard',
      'modules',
      this.module,
      'entities',
      entity.entityType,
      entity.entityId,
    ]);
  }

  openCorrectionArea(area: ModuleCorrectionArea): void {
    if (!area.routeCommands?.length) {
      return;
    }

    this.router.navigate(area.routeCommands, {
      queryParams: area.queryParams ?? {},
    });
  }

  goBack(): void {
    this.router.navigate(['/', 'dashboard']);
  }
}