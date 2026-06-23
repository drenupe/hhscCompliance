import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../api-core/base-api.service';

export type SummaryStatus = 'ok' | 'warning' | 'critical';

export interface ComplianceSummaryView {
  title: string;
  module: string;
  subcategory?: string | null;
  count: number;
  status: SummaryStatus;
  lastUpdated?: string;
  link?: any[];
  queryParams?: Record<string, any>;
}

export type ChartDatum = {
  label: string;
  value: number;
};

export type WorkQueueSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface CaseManagerWorkQueueItem {
  id: string;
  title: string;
  status: string;
  severity: WorkQueueSeverity;
  module?: string | null;
  subcategory?: string | null;
  ruleCode?: string | null;
  message?: string | null;
  dueDate?: string | null;
  locationId?: string | null;
  routeCommands?: any[] | null;
  queryParams?: Record<string, any> | null;
}

export interface CaseManagerWorkQueueView {
  openCaps: CaseManagerWorkQueueItem[];
  readyForReview: CaseManagerWorkQueueItem[];
  overdueCaps: CaseManagerWorkQueueItem[];
  highSeverityFindings: CaseManagerWorkQueueItem[];
  evidenceMissing: CaseManagerWorkQueueItem[];
  recheckQueue: CaseManagerWorkQueueItem[];
}

@Injectable({ providedIn: 'root' })
export class ComplianceDashboardService extends BaseApiService {
  private readonly dashboardPath = 'v1/dashboard';

  getSummaryData(locationId: string): Observable<ComplianceSummaryView[]> {
    const url = this.buildUrl(`${this.dashboardPath}/summary`);
    return this.get<ComplianceSummaryView[]>(url, { locationId });
  }

  getChartData(locationId: string): Observable<ChartDatum[]> {
    const url = this.buildUrl(`${this.dashboardPath}/chart`);
    return this.get<ChartDatum[]>(url, { locationId });
  }

  getCaseManagerWorkQueue(
    locationId: string,
  ): Observable<CaseManagerWorkQueueView> {
    const url = this.buildUrl(`${this.dashboardPath}/case-manager/work-queue`);
    return this.get<CaseManagerWorkQueueView>(url, { locationId });
  }
}