import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  EntityWorkbenchSection,
  EntityWorkbenchStatus,
  EntityWorkbenchView,
} from '../types/entity-workbench.types';
import {
  defaultEntityTypeForModule,
  entityLabel,
  normalizeSeverity,
  titleFor,
  titleForSection,
} from './dashboard-labels';

@Injectable()
export class EntityWorkbenchService {
  constructor(private readonly ds: DataSource) {}

  async getEntityWorkbench(
    module: string,
    entityType: string,
    entityId: string,
  ): Promise<EntityWorkbenchView> {
    const mod = String(module ?? '').trim().toUpperCase();
    const type = String(entityType ?? defaultEntityTypeForModule(mod))
      .trim()
      .toUpperCase();

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
        cr.query_params,
        cr.last_checked_at
      FROM compliance_results cr
      WHERE cr.module = $1
        AND cr.entity_type = $2
        AND cr.entity_id = $3
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
      [mod, type, entId],
    );

    const sectionsMap = new Map<string, EntityWorkbenchSection>();

    for (const row of rows) {
      const subcategory = row.subcategory ? String(row.subcategory) : null;
      const sectionKey = subcategory ?? mod;
      const severity = normalizeSeverity(row.severity);

      if (!sectionsMap.has(sectionKey)) {
        sectionsMap.set(sectionKey, {
          subcategory,
          title: titleForSection(mod, sectionKey),
          findingCount: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          findings: [],
        });
      }

      const section = sectionsMap.get(sectionKey)!;

      section.findingCount += 1;

      if (severity === 'CRITICAL') section.criticalCount += 1;
      if (severity === 'HIGH') section.highCount += 1;
      if (severity === 'MED') section.mediumCount += 1;

      section.findings.push({
        id: String(row.id),
        module: String(row.module ?? mod),
        subcategory,
        ruleCode: String(row.rule_code),
        status: toWorkbenchStatus(row.status),
        severity,
        message: row.message ? String(row.message) : null,
        lastCheckedAt: row.last_checked_at ?? null,
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

      if (b.mediumCount !== a.mediumCount) {
        return b.mediumCount - a.mediumCount;
      }

      return b.findingCount - a.findingCount;
    });

    return {
      module: mod,
      moduleTitle: titleFor(mod),
      entityType: type,
      entityId: entId,
      entityName: entityLabel(type, entId),
      totalFindings: rows.length,
      sections,
    };
  }
}

function toWorkbenchStatus(value: unknown): EntityWorkbenchStatus {
  const status = String(value ?? 'UNKNOWN').toUpperCase();

  if (
    status === 'COMPLIANT' ||
    status === 'NON_COMPLIANT' ||
    status === 'UNKNOWN'
  ) {
    return status;
  }

  return 'UNKNOWN';
}