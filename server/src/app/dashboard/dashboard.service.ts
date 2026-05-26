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
   * Always returns all modules (even if 0 rows exist in DB for that module).
   * “Needs work” = status IN ('NON_COMPLIANT','UNKNOWN')
   */
async summary(locationId: string): Promise<ComplianceSummaryView[]> {
  const rows = await this.ds.query(
    `
    SELECT
      cr.module,
      COALESCE(cr.subcategory, cr.module) AS section_key,
      COUNT(*)::int AS count,
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
    WHERE cr.location_id = $1
      AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
    GROUP BY cr.module, COALESCE(cr.subcategory, cr.module)
    ORDER BY cr.module, section_key
    `,
    [locationId],
  );

  return rows.map((r: any) => {
    const module = String(r.module);
    const sectionKey = String(r.section_key);
    const maxSev = Number(r.max_sev) || 0;

    return {
      title: this.titleForSection(module, sectionKey),
      module,
      count: Number(r.count) || 0,
      status: maxSev >= 4 ? 'critical' : maxSev >= 2 ? 'warning' : 'ok',
      lastUpdated: r.last_updated
        ? new Date(r.last_updated).toISOString().slice(0, 10)
        : undefined,
      link: this.linkForSection(locationId, module, sectionKey),
      queryParams: {
        locationId,
        module,
        subcategory: sectionKey,
        status: 'NON_COMPLIANT',
      },
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


private titleForSection(
  module: string,
  sectionKey: string,
): string {
  const parentTitle = this.titleFor(module);

  // Non-residential modules
  if (module !== 'RESIDENTIAL') {
    return parentTitle;
  }

  let sectionTitle = 'Residential Requirements';

  switch (sectionKey) {
    case 'HOME_ENVIRONMENT':
      sectionTitle = 'Home & Environment';
      break;

    case 'HOT_WATER':
      sectionTitle = 'Hot Water Safety';
      break;

    case 'LIFE_SAFETY':
      sectionTitle = 'Life Safety';
      break;

    case 'FIRE_DRILLS':
      sectionTitle = 'Fire Drills';
      break;

    case 'EMERGENCY_PLANS':
      sectionTitle = 'Emergency Plans';
      break;

    case 'INFECTION_CONTROL':
      sectionTitle = 'Infection Control';
      break;

    case 'MEDICATION':
      sectionTitle = 'Medication';
      break;

    case 'FOUR_PERSON':
      sectionTitle = 'Four-Person Residence';
      break;
  }

  // Enterprise breadcrumb-style naming
  return `${parentTitle} / ${sectionTitle}`;
}

private linkForSection(
  locationId: string,
  module: string,
  sectionKey: string,
): any[] {
  if (module !== 'RESIDENTIAL') {
    return ['/', 'compliance', 'message-center'];
  }

  switch (sectionKey) {
    case 'HOME_ENVIRONMENT':
      return ['/', 'compliance', 'residential', 'location', locationId, 'home-environment'];

    case 'HOT_WATER':
      return ['/', 'compliance', 'residential', 'location', locationId, 'hot-water'];

    case 'LIFE_SAFETY':
      return ['/', 'compliance', 'residential', 'location', locationId, 'life-safety'];

    case 'FIRE_DRILLS':
      return [
        '/',
        'compliance',
        'residential',
        'location',
        locationId,
        'emergency',
        'fire-drills',
      ];

    case 'EMERGENCY_PLANS':
      return [
        '/',
        'compliance',
        'residential',
        'location',
        locationId,
        'emergency',
        'plans',
      ];

    case 'INFECTION_CONTROL':
      return ['/', 'compliance', 'residential', 'location', locationId, 'infection-control'];

    case 'MEDICATION':
      return ['/', 'compliance', 'residential', 'location', locationId, 'medication'];

    case 'FOUR_PERSON':
      return ['/', 'compliance', 'residential', 'location', locationId, 'four-person'];

    default:
      return ['/', 'compliance', 'residential', 'location', locationId, 'overview'];
  }
}
  private titleFor(moduleKey: string): string {
    return MODULES.find((m) => m.key === moduleKey)?.title ?? moduleKey;
  }
}
