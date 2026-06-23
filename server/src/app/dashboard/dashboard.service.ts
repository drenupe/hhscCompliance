import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ModuleCorrectionEntityGroup,
  ModuleCorrectionView,
} from './types/module-correction.types';

import {
  CaseManagerWorkQueueItem,
  CaseManagerWorkQueueView,
} from './types/dashboard.types';
import { EntityWorkbenchSection, EntityWorkbenchView } from './types/entity-workbench.types';

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
  constructor(private readonly ds: DataSource) { }

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
      title: this.titleFor(module),
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

    for (const row of rows) {
      map.set(String(row.status), Number(row.count));
    }

    return [
      { label: 'Compliant', value: map.get('COMPLIANT') ?? 0 },
      { label: 'Non-compliant', value: map.get('NON_COMPLIANT') ?? 0 },
      { label: 'Unknown', value: map.get('UNKNOWN') ?? 0 },
    ];
  }

  async caseManagerWorkQueue(
    locationId: string,
  ): Promise<CaseManagerWorkQueueView> {
    const [
      openCaps,
      readyForReview,
      overdueCaps,
      highSeverityFindings,
      evidenceMissing,
      recheckQueue,
    ] = await Promise.all([
      this.getOpenCaps(locationId),
      this.getReadyForReview(locationId),
      this.getOverdueCaps(locationId),
      this.getHighSeverityFindings(locationId),
      this.getEvidenceMissing(locationId),
      this.getRecheckQueue(locationId),
    ]);

    return {
      openCaps,
      readyForReview,
      overdueCaps,
      highSeverityFindings,
      evidenceMissing,
      recheckQueue,
    };
  }

  private async getOpenCaps(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.status IN ('OPEN', 'IN_PROGRESS')
      ORDER BY
        CASE cr.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          WHEN 'MEDIUM' THEN 2
          WHEN 'MED' THEN 2
          WHEN 'LOW' THEN 1
          ELSE 0
        END DESC,
        cap.target_completion_date ASC NULLS LAST,
        cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'CAP Open'));
  }

  private async getReadyForReview(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.status = 'READY_FOR_REVIEW'
      ORDER BY cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'Ready For Review'),
    );
  }

  private async getOverdueCaps(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      WHERE cr.location_id = $1
        AND cap.target_completion_date IS NOT NULL
        AND cap.target_completion_date < NOW()
        AND cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
      ORDER BY cap.target_completion_date ASC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'CAP Overdue'));
  }

  private async getHighSeverityFindings(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cr.id,
        cr.status,
        NULL AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM compliance_results cr
      WHERE cr.location_id = $1
        AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
        AND cr.severity IN ('HIGH', 'CRITICAL')
      ORDER BY
        CASE cr.severity
          WHEN 'CRITICAL' THEN 4
          WHEN 'HIGH' THEN 3
          ELSE 0
        END DESC,
        cr.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'High Severity Finding'),
    );
  }

  private async getEvidenceMissing(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cap.id,
        cap.status,
        cap.target_completion_date AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM corrective_action_plans cap
      INNER JOIN compliance_results cr
        ON cr.id = cap.compliance_result_id
      LEFT JOIN cap_evidence ev
        ON ev.cap_id = cap.id
      WHERE cr.location_id = $1
        AND cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
      GROUP BY
        cap.id,
        cap.status,
        cap.target_completion_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      HAVING COUNT(ev.id) = 0
      ORDER BY cap.target_completion_date ASC NULLS LAST, cap.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) =>
      this.toWorkQueueItem(row, 'Evidence Missing'),
    );
  }

  private async getRecheckQueue(
    locationId: string,
  ): Promise<CaseManagerWorkQueueItem[]> {
    const rows = await this.ds.query(
      `
      SELECT
        cr.id,
        cr.status,
        cr.next_check_at AS due_date,
        cr.location_id,
        cr.module,
        cr.subcategory,
        cr.rule_code,
        cr.severity,
        cr.message,
        cr.route_commands,
        cr.query_params
      FROM compliance_results cr
      WHERE cr.location_id = $1
        AND cr.needs_recheck = true
      ORDER BY cr.next_check_at ASC NULLS LAST, cr.updated_at DESC
      LIMIT 25
      `,
      [locationId],
    );

    return rows.map((row: any) => this.toWorkQueueItem(row, 'Needs Recheck'));
  }


  async moduleCorrection(module: string): Promise<ModuleCorrectionView> {
  const mod = String(module ?? '').trim().toUpperCase();
  const title = this.titleFor(mod);

  const rows = await this.ds.query(
    `
    SELECT
      cr.id,
      cr.module,
      cr.subcategory,
      cr.entity_type,
      cr.entity_id,
      cr.rule_code,
      cr.status,
      cr.severity,
      cr.message,
      cr.route_commands,
      cr.query_params
    FROM compliance_results cr
    WHERE cr.module = $1
      AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
    ORDER BY
      cr.entity_type,
      cr.entity_id,
      CASE cr.severity
        WHEN 'CRITICAL' THEN 4
        WHEN 'HIGH' THEN 3
        WHEN 'MEDIUM' THEN 2
        WHEN 'MED' THEN 2
        WHEN 'LOW' THEN 1
        ELSE 0
      END DESC,
      cr.updated_at DESC
    `,
    [mod],
  );

  const groupsMap = new Map<string, ModuleCorrectionEntityGroup>();

  for (const row of rows) {
    const entityType = String(row.entity_type ?? 'PROVIDER') as any;
    const entityId = String(row.entity_id ?? 'provider');
    const key = `${entityType}:${entityId}`;
    const severity = this.normalizeSeverity(row.severity);

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        entityType,
        entityId,
        entityName: this.entityLabel(entityType, entityId),
        findingCount: 0,
        criticalCount: 0,
        highCount: 0,
        findings: [],
      });
    }

    const group = groupsMap.get(key)!;

    group.findingCount += 1;

    if (severity === 'CRITICAL') group.criticalCount += 1;
    if (severity === 'HIGH') group.highCount += 1;

    group.findings.push({
      id: String(row.id),
      ruleCode: String(row.rule_code),
      status: String(row.status),
      severity,
      message: row.message ? String(row.message) : null,
      subcategory: row.subcategory ? String(row.subcategory) : null,
      routeCommands: row.route_commands ?? null,
      queryParams: row.query_params ?? null,
    });
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => {
    if (b.criticalCount !== a.criticalCount) {
      return b.criticalCount - a.criticalCount;
    }

    if (b.highCount !== a.highCount) {
      return b.highCount - a.highCount;
    }

    return b.findingCount - a.findingCount;
  });

  return {
    module: mod,
    title,
    entityType: (groups[0]?.entityType ?? this.defaultEntityTypeForModule(mod)) as any,
    totalFindings: rows.length,
    totalEntities: groups.length,
    groups,
  };
}

  private toWorkQueueItem(
    row: any,
    label: string,
  ): CaseManagerWorkQueueItem {
    const module = row.module ? String(row.module) : null;
    const subcategory = row.subcategory ? String(row.subcategory) : null;
    const ruleCode = row.rule_code ? String(row.rule_code) : null;
    const severity = this.normalizeSeverity(row.severity);
    const message = row.message ? String(row.message) : null;
    const sectionKey = subcategory ?? module ?? 'UNKNOWN';
    const locationId = row.location_id ? String(row.location_id) : null;

    return {
      id: String(row.id),
      title: `${label}: ${this.titleForSection(module ?? 'UNKNOWN', sectionKey)}`,
      status: row.status ? String(row.status) : 'UNKNOWN',
      severity,
      module,
      subcategory,
      ruleCode,
      message,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      locationId,
      routeCommands:
        row.route_commands ??
        this.linkForSection(locationId ?? '', module ?? 'UNKNOWN', sectionKey),
      queryParams:
        row.query_params ?? {
          locationId,
          module,
          subcategory: sectionKey,
        },
    };
  }

  private normalizeSeverity(
    value: unknown,
  ): 'LOW' | 'MED' | 'HIGH' | 'CRITICAL' {
    const severity = String(value ?? '').toUpperCase();

    if (severity === 'CRITICAL') return 'CRITICAL';
    if (severity === 'HIGH') return 'HIGH';
    if (severity === 'MEDIUM' || severity === 'MED') return 'MED';

    return 'LOW';
  }

  private statusFromSeverityRank(rank: number): SummaryStatus {
    if (rank >= 4) return 'critical';
    if (rank >= 2) return 'warning';
    return 'ok';
  }

  private titleForSection(module: string, sectionKey: string): string {
    const parentTitle = this.titleFor(module);

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
      case 'NURSING':
        sectionTitle = 'Nursing';
        break;
      case 'FOUR_PERSON':
        sectionTitle = 'Four-Person Residence';
        break;
    }

    return `${parentTitle} / ${sectionTitle}`;
  }

  private linkForSection(
    locationId: string | null | undefined,
    module: string,
    sectionKey: string,
  ): any[] {
    if (module !== 'RESIDENTIAL') {
      return ['/', 'compliance', 'message-center'];
    }

    switch (sectionKey) {
      case 'HOME_ENVIRONMENT':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'home-environment',
        ];

      case 'HOT_WATER':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'home-environment',
          'hot-water',
        ];

      case 'LIFE_SAFETY':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'life-safety',
        ];

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
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'infection-control',
        ];

      case 'MEDICATION':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'medication',
        ];

      case 'NURSING':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'nursing',
        ];

      case 'FOUR_PERSON':
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'four-person',
        ];

      default:
        return [
          '/',
          'compliance',
          'residential',
          'location',
          locationId,
          'overview',
        ];
    }
  }
private defaultEntityTypeForModule(
  module: string,
): 'RESIDENTIAL' | 'CONSUMER' | 'EMPLOYEE' | 'PROVIDER' {
  switch (module) {
    case 'RESIDENTIAL':
    case 'PROTECTIVE_DEVICES':
    case 'RESTRAINTS':
    case 'ENCLOSED_BEDS':
    case 'PROHIBITIONS':
      return 'RESIDENTIAL';

    case 'MEDICATION':
    case 'NURSING':
    case 'PROGRAMMATIC':
    case 'BEHAVIOR_SUPPORT':
    case 'FINANCES_RENT':
    case 'ISS':
      return 'CONSUMER';

    case 'ANE':
    case 'TRAINING':
    case 'STAFF_CREDENTIALS':
      return 'EMPLOYEE';

    default:
      return 'PROVIDER';
  }
}

private entityLabel(entityType: string, entityId: string): string {
  switch (entityType) {
    case 'RESIDENTIAL':
      return `Location ${entityId}`;

    case 'CONSUMER':
      return `Consumer ${entityId}`;

    case 'EMPLOYEE':
      return `Employee ${entityId}`;

    case 'PROVIDER':
      return 'Provider';

    default:
      return `${entityType} ${entityId}`;
  }
}


async entityWorkbench(
  module: string,
  entityId: string,
): Promise<EntityWorkbenchView> {
  const mod = String(module ?? '').trim().toUpperCase();
  const entId = String(entityId ?? '').trim();

  const rows = await this.ds.query(
    `
    SELECT
      cr.id,
      cr.module,
      cr.subcategory,
      cr.entity_type,
      cr.entity_id,
      cr.rule_code,
      cr.status,
      cr.severity,
      cr.message,
      cr.route_commands,
      cr.query_params
    FROM compliance_results cr
    WHERE cr.module = $1
      AND cr.entity_id = $2
      AND cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
    ORDER BY
      cr.subcategory,
      CASE cr.severity
        WHEN 'CRITICAL' THEN 4
        WHEN 'HIGH' THEN 3
        WHEN 'MEDIUM' THEN 2
        WHEN 'MED' THEN 2
        WHEN 'LOW' THEN 1
        ELSE 0
      END DESC,
      cr.updated_at DESC
    `,
    [mod, entId],
  );

  const sectionsMap = new Map<string, EntityWorkbenchSection>();

  for (const row of rows) {
    const subcategory = row.subcategory ? String(row.subcategory) : null;
    const key = subcategory ?? mod;
    const severity = this.normalizeSeverity(row.severity);

    if (!sectionsMap.has(key)) {
      sectionsMap.set(key, {
        subcategory,
        title: this.titleForSection(mod, key),
        findingCount: 0,
        criticalCount: 0,
        highCount: 0,
        findings: [],
      });
    }

    const section = sectionsMap.get(key)!;

    section.findingCount += 1;

    if (severity === 'CRITICAL') section.criticalCount += 1;
    if (severity === 'HIGH') section.highCount += 1;

    section.findings.push({
      id: String(row.id),
      ruleCode: String(row.rule_code),
      status: String(row.status),
      severity,
      message: row.message ? String(row.message) : null,
      subcategory,
      routeCommands: row.route_commands ?? null,
      queryParams: row.query_params ?? null,
    });
  }

  const sections = Array.from(sectionsMap.values()).sort((a, b) => {
    if (b.criticalCount !== a.criticalCount) {
      return b.criticalCount - a.criticalCount;
    }

    if (b.highCount !== a.highCount) {
      return b.highCount - a.highCount;
    }

    return b.findingCount - a.findingCount;
  });

  const entityType =
    rows[0]?.entity_type ??
    this.defaultEntityTypeForModule(mod);

  return {
    module: mod,
    moduleTitle: this.titleFor(mod),
    entityType,
    entityId: entId,
    entityName: this.entityLabel(entityType, entId),
    totalFindings: rows.length,
    sections,
  };
}
  private titleFor(moduleKey: string): string {
    return MODULES.find((module) => module.key === moduleKey)?.title ?? moduleKey;
  }
}