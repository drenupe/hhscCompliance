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
  FindingWorkspaceService,
  FindingWorkspaceView,
} from '@hhsc-compliance/data-access';

@Component({
  selector: 'lib-finding-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finding-workspace.component.html',
  styleUrls: ['./finding-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingWorkspaceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(FindingWorkspaceService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  error = '';
  data: FindingWorkspaceView | null = null;

  ngOnInit(): void {
    const findingId = this.route.snapshot.paramMap.get('findingId');

    if (!findingId) {
      this.error = 'Finding ID is required.';
      return;
    }

    this.load(findingId);
  }

  openCorrectionArea(): void {
    const finding = this.data?.finding;

    if (!finding?.routeCommands?.length) return;

    this.router.navigate(finding.routeCommands, {
      queryParams: finding.queryParams ?? {},
    });
  }

  private load(findingId: string): void {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.api
      .getFindingWorkspace(findingId)
      .pipe(
        take(1),
        catchError((err: unknown) => {
          const code =
            typeof err === 'object' && err !== null && 'status' in err
              ? String((err as { status?: unknown }).status ?? 'unknown')
              : 'unknown';

          this.error = `Failed to load finding workspace (${code}).`;
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
}