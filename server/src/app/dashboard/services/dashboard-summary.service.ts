import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { titleFor } from './dashboard-labels';

export type SummaryStatus = 'ok' | 'warning' | 'critical';

export type ComplianceSummaryView = {
  title: string;
  module: string;
  subcategory: string | null;
  count: number;
  status: SummaryStatus;
  lastUpdated?: string;
  link?: any[];
  queryParams?: Record<string, any>;
};

export type ChartDatum = {
  label: string;
  value: number;
};

@Injectable()
export class DashboardSummaryService {
  constructor(private readonly ds: DataSource) {}

  async summary(locationId?: string): Promise<ComplianceSummaryView[]> {
    const loc = locationId ? String(locationId).trim() : null;

    const rows = await this.ds.query(
      `
      SELECT
        cr.module,
        NULL AS subcategory,
        cr.module AS section_key,
        COUNT(*)::int AS count,
        COUNT(DISTINCT cr.entity_id)::int AS affected_entity_count,
        MAX(cr.entity_type) AS affected_entity_type,
        MAX(CASE cr.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'MED' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END)::int AS max_sev,
        MAX(cr.updated_at) AS last_updated
      FROM compliance_results cr
      WHERE cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
        AND ($1::uuid IS NULL OR cr.location_id = $1)
      GROUP BY cr.module
      ORDER BY max_sev DESC, cr.module
      `,
      [loc],
    );

    return rows.map((row: any) => {
      const module = String(row.module);
      const maxSeverity = Number(row.max_sev) || 0;

      return {
        title: titleFor(module),
        module,
        subcategory: null,
        count: Number(row.count) || 0,
        affectedEntityCount: Number(row.affected_entity_count) || 0,
        affectedEntityType: row.affected_entity_type
          ? String(row.affected_entity_type)
          : null,
        status: this.statusFromSeverityRank(maxSeverity),
        lastUpdated: row.last_updated
          ? new Date(row.last_updated).toISOString().slice(0, 10)
          : undefined,
        link: ['/', 'dashboard', 'modules', module],
        queryParams: {
          module,
          ...(loc ? { locationId: loc } : {}),
        },
      };
    });
  }

  async chart(): Promise<ChartDatum[]> {
  const rows = await this.ds.query(`
    SELECT status, COUNT(*)::int AS count
    FROM compliance_results
    GROUP BY status
  `);

  const map = new Map<string, number>();

  for (const row of rows) {
    map.set(String(row.status), Number(row.count));
  }

  return [
    { label: 'Compliant', value: map.get('COMPLIANT') ?? 0 },
    { label: 'Non-compliant', value: map.get('NON_COMPLIANT') ?? 0 },
    { label: 'Unknown', value: map.get('UNKNOWN') ?? 0 },
  ];
}

private statusFromSeverityRank(rank: number): SummaryStatus {
  if (rank >= 4) return 'critical';
  if (rank >= 2) return 'warning';
  return 'ok';
}
}