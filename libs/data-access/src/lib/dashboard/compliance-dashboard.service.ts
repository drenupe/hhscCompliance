import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';

export interface ComplianceSummary {
  title: string;
  module: string;
  count: number;
  status: 'ok' | 'warning' | 'critical';
  lastUpdated: string;
}

@Injectable({ providedIn: 'root' })
export class ComplianceDashboardService {
  getSummaryData(location: string): Observable<ComplianceSummary[]> {
    const locationSuffix = ` – ${location}`;
    const baseCounts =
      ({
        'Austin Home': [3, 2, 0, 1, 0, 1, 1, 0, 0],
        'Dallas Home': [1, 0, 2, 0, 1, 2, 0, 1, 0],
        'San Antonio Home': [0, 1, 1, 1, 0, 0, 1, 2, 1],
      } as Record<string, number[]>)[location] ?? [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const statuses = baseCounts.map((count) =>
      count === 0 ? 'ok' : count < 2 ? 'warning' : 'critical'
    ) as Array<'ok' | 'warning' | 'critical'>;

    return of([
      { title: `Residential Requirements${locationSuffix}`, module: 'residential',          count: baseCounts[0], status: statuses[0], lastUpdated: '2025-06-24' },
      { title: `Programmatic Requirements${locationSuffix}`, module: 'programmatic',        count: baseCounts[1], status: statuses[1], lastUpdated: '2025-06-22' },
      { title: `Finances and Rent${locationSuffix}`,         module: 'finance',             count: baseCounts[2], status: statuses[2], lastUpdated: '2025-06-21' },
      { title: `Behavior Support Plan${locationSuffix}`,     module: 'behavior',            count: baseCounts[3], status: statuses[3], lastUpdated: '2025-06-20' },
      { title: `Abuse, Neglect, and Exploitation${locationSuffix}`, module: 'abuse-reporting', count: baseCounts[4], status: statuses[4], lastUpdated: '2025-06-20' },
      { title: `Restraints${locationSuffix}`,                module: 'restraints',          count: baseCounts[5], status: statuses[5], lastUpdated: '2025-06-19' },
      { title: `Enclosed Beds${locationSuffix}`,             module: 'enclosed-beds',       count: baseCounts[6], status: statuses[6], lastUpdated: '2025-06-18' },
      { title: `Protective Devices${locationSuffix}`,        module: 'protective-devices',  count: baseCounts[7], status: statuses[7], lastUpdated: '2025-06-17' },
      { title: `Prohibitions${locationSuffix}`,              module: 'prohibited-practices',count: baseCounts[8], status: statuses[8], lastUpdated: '2025-06-16' },
    ]);
  }

  getChartData(location: string): Observable<{ label: string; value: number }[]> {
    return this.getSummaryData(location).pipe(
      map((data) => {
        const totals = { ok: 0, warning: 0, critical: 0 };
        data.forEach((item) => totals[item.status]++);
        return [
          { label: 'OK',       value: totals.ok },
          { label: 'Warning',  value: totals.warning },
          { label: 'Critical', value: totals.critical },
        ];
      })
    );
  }
}
