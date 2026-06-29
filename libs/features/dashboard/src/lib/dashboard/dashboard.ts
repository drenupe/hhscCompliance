import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, finalize, of, take } from 'rxjs';

import {
  ComplianceDashboardService,
  ComplianceSummaryView,
} from '@hhsc-compliance/data-access';

import { ComplianceSummaryCard } from '../components/compliance-summary-card/compliance-summary-card';

const DEFAULT_LOCATION_ID = '160f46b1-9494-4bdd-b9df-53d7d73df091';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, ComplianceSummaryCard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboard = inject(ComplianceDashboardService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  loadingData = false;
  message = '';

  summaryData: ComplianceSummaryView[] = [];
  alerts: string[] = [];

  get hasUrgentAlerts(): boolean {
    return this.summaryData.some((s) => s.status === 'critical');
  }

  ngOnInit(): void {
    this.ensureLocationId();
    this.loadDashboard();
  }

  navigateTo(s: ComplianceSummaryView): void {
    if (!s?.module) {
      return;
    }

    this.router.navigate(['/', 'dashboard', 'modules', s.module]);
  }

  private loadDashboard(): void {
    const locationId = this.getLocationId();

    this.message = '';
    this.loadingData = true;
    this.summaryData = [];
    this.alerts = [];
    this.cdr.markForCheck();

    this.dashboard
      .getSummaryData()
      .pipe(
        take(1),
        catchError((err: unknown) => {
          const code = this.errorCode(err);
          console.error('DASHBOARD SUMMARY ERROR', err);
          this.message = `Failed to load dashboard summary (${code}).`;
          return of([] as ComplianceSummaryView[]);
        }),
        finalize(() => {
          this.loadingData = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe((summary) => {
        console.log('DASHBOARD SUMMARY DATA', summary);

        this.summaryData = Array.isArray(summary) ? summary : [];

        this.alerts = this.summaryData
          .filter((d) => d.status === 'critical')
          .map((d) => `${d.title}: ${d.count} findings`);

        if (!this.summaryData.length && !this.message) {
          this.message = 'No out-of-compliance findings found.';
        }

        this.cdr.markForCheck();
      });
  }

  private ensureLocationId(): void {
    const existing = localStorage.getItem('locationId');

    if (!existing?.trim()) {
      localStorage.setItem('locationId', DEFAULT_LOCATION_ID);
    }
  }

  private getLocationId(): string {
    return (
      localStorage.getItem('locationId')?.trim() || DEFAULT_LOCATION_ID
    );
  }

  private errorCode(err: unknown): string {
    if (typeof err === 'object' && err !== null && 'status' in err) {
      return String((err as { status?: unknown }).status ?? 'unknown');
    }

    return 'unknown';
  }
}