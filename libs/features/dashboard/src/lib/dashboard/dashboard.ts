import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, forkJoin, of, take, tap } from 'rxjs';

import {
  ComplianceChart,
  ChartDatum,
} from '../components/compliance-chart/compliance-chart';
import {
  ComplianceSummaryCard,
  ComplianceSummaryView,
} from '../components/compliance-summary-card/compliance-summary-card';
import {
  CaseManagerWorkQueueComponent,
  CaseManagerWorkQueueItem,
  CaseManagerWorkQueueView,
} from '../case-manager-work-queue/case-manager-work-queue.component';

import {
  ComplianceDashboardService,
  ResidentialLocationsApi,
} from '@hhsc-compliance/data-access';
import { ResidentialLocationDto } from '@hhsc-compliance/shared-models';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComplianceSummaryCard,
    ComplianceChart,
    CaseManagerWorkQueueComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboard = inject(ComplianceDashboardService);
  private readonly locationsApi = inject(ResidentialLocationsApi);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  locations: ResidentialLocationDto[] = [];
  selectedLocationId = '';

  loadingLocations = false;
  loadingData = false;
  message = '';

  summaryData: ComplianceSummaryView[] = [];
  chartData: ChartDatum[] = [];
  workQueue: CaseManagerWorkQueueView | null = null;
  alerts: string[] = [];

  get hasUrgentAlerts(): boolean {
    return this.summaryData.some((s) => s.status === 'critical');
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  onLocationChange(locationId: string): void {
    this.selectedLocationId = locationId;
    this.loadDashboard(locationId);
  }

  private loadLocations(): void {
    this.message = '';
    this.loadingLocations = true;
    this.cdr.markForCheck();

    this.locationsApi
      .list()
      .pipe(
        take(1),
        tap((rows) => {
          this.locations = Array.isArray(rows) ? rows : [];

          if (!this.selectedLocationId && this.locations.length) {
            this.selectedLocationId = this.locations[0].id;
            this.loadDashboard(this.selectedLocationId);
          }

          if (!this.locations.length) {
            this.message = 'No residences found. Create one location first.';
            this.clearDashboard();
          }

          this.cdr.markForCheck();
        }),
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message = `Failed to load residences (${code}).`;
          this.locations = [];
          this.selectedLocationId = '';
          this.clearDashboard();
          this.cdr.markForCheck();
          return of([] as ResidentialLocationDto[]);
        }),
        finalize(() => {
          this.loadingLocations = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
  }

  private loadDashboard(locationId: string): void {
    if (!locationId) return;

    this.message = '';
    this.loadingData = true;
    this.cdr.markForCheck();

    forkJoin({
      summary: this.dashboard.getSummaryData(locationId).pipe(
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message = `Failed to load dashboard summary (${code}).`;
          return of([] as ComplianceSummaryView[]);
        }),
      ),
      chart: this.dashboard.getChartData(locationId).pipe(
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message = this.message || `Failed to load chart (${code}).`;
          return of([] as ChartDatum[]);
        }),
      ),
      queue: this.dashboard.getCaseManagerWorkQueue(locationId).pipe(
        catchError((err) => {
          const code = err?.status ?? 'unknown';
          this.message = this.message || `Failed to load work queue (${code}).`;
          return of(null);
        }),
      ),
    })
      .pipe(
        take(1),
        tap(({ summary, chart, queue }) => {
          this.summaryData = Array.isArray(summary) ? summary : [];
          this.chartData = Array.isArray(chart) ? chart : [];
          this.workQueue = queue;

          this.alerts = this.summaryData
            .filter((d) => d.status === 'critical')
            .map((d) => `${d.title}: ${d.count} issue(s)`);

          this.cdr.markForCheck();
        }),
        finalize(() => {
          this.loadingData = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe();
  }

  navigateTo(s: ComplianceSummaryView): void {
    if (s?.link?.length) {
      this.router.navigate(s.link, { queryParams: s.queryParams ?? {} });
      return;
    }

    if (s?.module) {
      this.router.navigate(['/', s.module], {
        queryParams: s?.queryParams ?? {},
      });
    }
  }

  navigateToWorkQueueItem(item: CaseManagerWorkQueueItem): void {
    if (item?.routeCommands?.length) {
      this.router.navigate(item.routeCommands, {
        queryParams: item.queryParams ?? {},
      });
    }
  }

  locationLabel(r: ResidentialLocationDto): string {
    const code = (r.locationCode || '').trim();
    const name = (r.name || '').trim();

    if (code && name) return `${code} — ${name}`;
    return name || code || 'Unnamed location';
  }

  private clearDashboard(): void {
    this.summaryData = [];
    this.chartData = [];
    this.workQueue = null;
    this.alerts = [];
  }
}