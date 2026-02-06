import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type SummaryStatus = 'ok' | 'warning' | 'critical';

export type ComplianceSummaryView = {
  title: string;
  module: string;
  count: number;
  status: SummaryStatus;
  lastUpdated?: string;
  link?: any[];
  queryParams?: Record<string, any>;
};

export type ChartDatum = { label: string; value: number };

@Injectable()
export class DashboardService {
  constructor(private readonly ds: DataSource) {}

  async summary(locationId: string): Promise<ComplianceSummaryView[]> {
    const rows = await this.ds.query(
      `
      SELECT
        module,
        COUNT(*)::int AS count,
        MAX(CASE severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MED' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END)::int AS max_sev,
        MAX(updated_at) AS last_updated
      FROM compliance_results
      WHERE location_id = $1
        AND status = 'NON_COMPLIANT'
      GROUP BY module
      ORDER BY module ASC
      `,
      [locationId],
    );

    return rows.map((r: any) => {
      const status: SummaryStatus =
        r.max_sev >= 4 ? 'critical' : r.max_sev >= 2 ? 'warning' : 'ok';

      return {
        title: this.prettyTitle(r.module),
        module: r.module,
        count: r.count,
        status,
        lastUpdated: r.last_updated ? new Date(r.last_updated).toISOString().slice(0, 10) : undefined,
        link: ['/', 'residential', r.module],
        queryParams: { locationId },
      };
    });
  }

  async chart(locationId: string): Promise<ChartDatum[]> {
    const rows = await this.ds.query(
      `
      SELECT status, COUNT(*)::int AS count
      FROM compliance_results
      WHERE location_id = $1
      GROUP BY status
      `,
      [locationId],
    );

    const map = new Map<string, number>();
    for (const r of rows) map.set(r.status, r.count);

    return [
      { label: 'Compliant', value: map.get('COMPLIANT') ?? 0 },
      { label: 'Non-compliant', value: map.get('NON_COMPLIANT') ?? 0 },
      { label: 'Unknown', value: map.get('UNKNOWN') ?? 0 },
    ];
  }

  private prettyTitle(module: string): string {
    switch (module) {
      case 'residential': return 'Residential';
      case 'fire': return 'Fire Safety';
      case 'training': return 'Training';
      case 'emergency': return 'Emergency Preparedness';
      case 'medication': return 'Medication';
      default: return module.charAt(0).toUpperCase() + module.slice(1);
    }
  }
}
