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
  EntityWorkbenchFinding,
  EntityWorkbenchSection,
  EntityWorkbenchView,
  ModuleCorrectionEntityType,
  ModuleWorkbenchService,
} from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-entity-workbench',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-workbench.component.html',
  styleUrls: ['./entity-workbench.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityWorkbenchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ModuleWorkbenchService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  error = '';
  data: EntityWorkbenchView | null = null;

ngOnInit(): void {
  const module = this.route.snapshot.paramMap.get('module');
  const entityType = this.route.snapshot.paramMap.get(
    'entityType',
  ) as ModuleCorrectionEntityType | null;
  const entityId = this.route.snapshot.paramMap.get('entityId');

  if (!module || !entityType || !entityId) {
    this.error = 'Module, entity type, and entity are required.';
    return;
  }

  this.load(module, entityType, entityId);
}

  private load(
  module: string,
  entityType: ModuleCorrectionEntityType,
  entityId: string,
): void {
  this.loading = true;
  this.error = '';
  this.cdr.markForCheck();

  this.api
    .getEntityWorkbench(module, entityType, entityId)
    .pipe(
      take(1),
      catchError((err: unknown) => {
        const code =
          typeof err === 'object' && err !== null && 'status' in err
            ? String((err as { status?: unknown }).status ?? 'unknown')
            : 'unknown';

        this.error = `Failed to load entity workbench (${code}).`;
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
  openFinding(finding: EntityWorkbenchFinding): void {
    this.router.navigate(['/', 'remediation', 'findings', finding.id]);
  }

  sectionSeverity(section: EntityWorkbenchSection): 'critical' | 'high' | 'normal' {
    if (section.criticalCount > 0) return 'critical';
    if (section.highCount > 0) return 'high';
    return 'normal';
  }

  previewFindings(
    section: EntityWorkbenchSection,
  ): EntityWorkbenchSection['findings'] {
    return section.findings.slice(0, 4);
  }


}