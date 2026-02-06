// apps/api/src/app/dashboard/dashboard.service.ts
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

// ✅ Canonical modules (source of truth)
// Add ISS later by pushing { key:'ISS', title:'ISS' } here.
const MODULES: Array<{ key: string; title: string }> = [
  { key: 'RESIDENTIAL', title: 'Residential Requirements' },
  { key: 'PROGRAMMATIC', title: 'Programmatic Requirements' },
  { key: 'FINANCES_RENT', title: 'Finances & Rent' },
  { key: 'BEHAVIOR_SUPPORT', title: 'Behavior Support Plan' },
  { key: 'ANE', title: 'Abuse/Neglect/Exploitation' },
  { key: 'RESTRAINTS', title: 'Restraints' },
  { key: 'ENCLOSED_BEDS', title: 'Enclosed Beds' },
  { key: 'PROTECTIVE_DEVICES', title: 'Protective Devices' },
  { key: 'PROHIBITIONS', title: 'Prohibitions' },
];

@Injectable()
export class DashboardService {
  constructor(private readonly ds: DataSource) {}

  /**
   * Always returns all modules (even if there are 0 rows in DB for that module).
   * “Needs work” = status IN ('NON_COMPLIANT','UNKNOWN')
   */
  async summary(locationId: string): Promise<ComplianceSummaryView[]> {
    const keys = MODULES.map((m) => m.key);

    const rows = await this.ds.query(
      `
      WITH modules(module) AS (
        SELECT * FROM unnest($2::text[])
      ),
      agg AS (
        SELECT
          cr.module,
          COUNT(*)::int AS needs_count,
          MAX(CASE cr.severity
            WHEN 'CRITICAL' THEN 4
            WHEN 'HIGH' THEN 3
            WHEN 'MED' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 0
          END)::int AS max_sev,
          MAX(cr.updated_at) AS last_updated
        FROM compliance_results cr
        WHERE cr.location_id = $1
          AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
        GROUP BY cr.module
      )
      SELECT
        m.module,
        COALESCE(a.needs_count, 0)::int AS count,
        COALESCE(a.max_sev, 0)::int AS max_sev,
        a.last_updated
      FROM modules m
      LEFT JOIN agg a ON a.module = m.module
      ORDER BY array_position($2::text[], m.module)
      `,
      [locationId, keys],
    );

    return rows.map((r: any) => {
      const status: SummaryStatus =
        r.max_sev >= 4 ? 'critical' : r.max_sev >= 2 ? 'warning' : 'ok';

      return {
        title: this.titleFor(String(r.module)),
        module: String(r.module),
        count: Number(r.count) || 0,
        status,
        lastUpdated: r.last_updated
          ? new Date(r.last_updated).toISOString().slice(0, 10)
          : undefined,

        // ✅ ONE destination: message center
        link: ['/', 'compliance', 'message-center'],
        queryParams: { locationId, module: String(r.module) },
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
    for (const r of rows) map.set(String(r.status), Number(r.count));

    return [
      { label: 'Compliant', value: map.get('COMPLIANT') ?? 0 },
      { label: 'Non-compliant', value: map.get('NON_COMPLIANT') ?? 0 },
      { label: 'Unknown', value: map.get('UNKNOWN') ?? 0 },
    ];
  }

  private titleFor(moduleKey: string): string {
    return MODULES.find((m) => m.key === moduleKey)?.title ?? moduleKey;
  }
}
