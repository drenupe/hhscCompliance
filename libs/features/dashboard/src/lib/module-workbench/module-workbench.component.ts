// libs/features/dashboard/src/lib/module-workbench/module-workbench.component.ts

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
    ModuleCorrectionEntityGroup,
    ModuleCorrectionView,
} from '@hhsc-compliance/data-access';

import { ModuleWorkbenchService } from '@hhsc-compliance/data-access';

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
    private readonly api = inject(ModuleWorkbenchService);
    private readonly cdr = inject(ChangeDetectorRef);

    loading = false;
    error = '';

    data: ModuleCorrectionView | null = null;

    ngOnInit(): void {
        const module = this.route.snapshot.paramMap.get('module');

        if (!module) {
            this.error = 'Module is required';
            return;
        }

        this.load(module);
    }

    private load(module: string): void {
        this.loading = true;
        this.error = '';

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

    previewFindings(
        group: ModuleCorrectionEntityGroup,
    ): ModuleCorrectionEntityGroup['findings'] {
        return group.findings.slice(0, 3);
    }


    openEntity(group: ModuleCorrectionEntityGroup): void {
        if (!this.data) return;

        this.router.navigate([
            '/',
            'dashboard',
            'modules',
            this.data.module,
            'entities',
            group.entityId,
        ]);
    }
}