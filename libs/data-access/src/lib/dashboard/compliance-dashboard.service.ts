import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../api-core/base-api.service';

// Match what your API returns (includes deep link fields)
export type SummaryStatus = 'ok' | 'warning' | 'critical';

export interface ComplianceSummaryView {
  title: string;
  module: string;
  count: number;
  status: SummaryStatus;
  lastUpdated?: string;
  link?: any[];
  queryParams?: Record<string, any>;
}

export type ChartDatum = { label: string; value: number };

@Injectable({ providedIn: 'root' })
export class ComplianceDashboardService extends BaseApiService {
  private readonly dashboardPath = '/dashboard';

  /** GET /api/v1/dashboard/summary?locationId=UUID */
  getSummaryData(locationId: string): Observable<ComplianceSummaryView[]> {
    const url = this.buildUrl(`${this.dashboardPath}/summary`);
    return this.get<ComplianceSummaryView[]>(url, { locationId });
  }

  /** GET /api/v1/dashboard/chart?locationId=UUID */
  getChartData(locationId: string): Observable<ChartDatum[]> {
    const url = this.buildUrl(`${this.dashboardPath}/chart`);
    return this.get<ChartDatum[]>(url, { locationId });
  }
}
