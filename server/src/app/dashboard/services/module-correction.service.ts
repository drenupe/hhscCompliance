import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  ModuleAffectedEntity,
  ModuleCorrectionArea,
  ModuleCorrectionEntityType,
  ModuleCorrectionView,
} from '../../../../../libs/shared-models/src/lib/dashboard/types/module-correction.types';

import {
  defaultEntityTypeForModule,
  entityLabel,
  normalizeSeverity,
  titleFor,
  titleForSection,
} from './dashboard-labels';

type CorrectionAreaRoute = {
  routeCommands: string[];
  queryParams: Record<string, string>;
};

type ModuleCorrectionAreaBuilder = Omit<
  ModuleCorrectionArea,
  'affectedEntities' | 'routeCommands' | 'queryParams'
> & {
  affectedEntitiesMap: Map<string, ModuleAffectedEntity>;
};

@Injectable()
export class ModuleCorrectionService {
  constructor(private readonly ds: DataSource) {}

  async getModuleCorrection(module: string): Promise<ModuleCorrectionView> {
    const mod = String(module ?? '').trim().toUpperCase();
    const title = titleFor(mod);

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
        cr.updated_at,
        rl.name AS residential_location_name
      FROM compliance_results cr
      LEFT JOIN residential_locations rl
        ON cr.entity_type = 'RESIDENTIAL'
       AND rl.id::text = cr.entity_id::text
      WHERE cr.module = $1
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
      [mod],
    );

    const areasMap = new Map<string, ModuleCorrectionAreaBuilder>();
    const uniqueEntities = new Set<string>();

    for (const row of rows) {
      const subcategory = row.subcategory ? String(row.subcategory) : 'GENERAL';

      const entityType = String(
        row.entity_type ?? defaultEntityTypeForModule(mod),
      ) as ModuleCorrectionEntityType;

      const entityId = String(row.entity_id ?? 'provider');
      const entityKey = `${entityType}:${entityId}`;
      const severity = normalizeSeverity(row.severity);

      const displayLabel =
        row.residential_location_name && entityType === 'RESIDENTIAL'
          ? String(row.residential_location_name)
          : entityLabel(entityType, entityId);

      uniqueEntities.add(entityKey);

      if (!areasMap.has(subcategory)) {
        areasMap.set(subcategory, {
          subcategory,
          title: titleForSection(mod, subcategory),
          findingCount: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          affectedEntityCount: 0,
          affectedEntitiesMap: new Map<string, ModuleAffectedEntity>(),
        });
      }

      const area = areasMap.get(subcategory)!;

      area.findingCount += 1;

      if (severity === 'CRITICAL') area.criticalCount += 1;
      if (severity === 'HIGH') area.highCount += 1;
      if (severity === 'MED') area.mediumCount += 1;

      if (!area.affectedEntitiesMap.has(entityKey)) {
        area.affectedEntitiesMap.set(entityKey, {
          entityType,
          entityId,
          entityLabel: displayLabel,
          findingCount: 0,
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
        });
      }

      const entity = area.affectedEntitiesMap.get(entityKey)!;

      entity.findingCount += 1;

      if (severity === 'CRITICAL') entity.criticalCount += 1;
      if (severity === 'HIGH') entity.highCount += 1;
      if (severity === 'MED') entity.mediumCount += 1;
    }

    const areas = Array.from(areasMap.values())
      .map((area) => {
        const affectedEntities = Array.from(
          area.affectedEntitiesMap.values(),
        ).sort((a, b) => {
          if (b.criticalCount !== a.criticalCount) {
            return b.criticalCount - a.criticalCount;
          }

          if (b.highCount !== a.highCount) {
            return b.highCount - a.highCount;
          }

          return b.findingCount - a.findingCount;
        });

        const firstEntityId = affectedEntities[0]?.entityId ?? 'provider';
        const route = correctionAreaRoute(mod, area.subcategory, firstEntityId);

        return {
          subcategory: area.subcategory,
          title: area.title,
          findingCount: area.findingCount,
          criticalCount: area.criticalCount,
          highCount: area.highCount,
          mediumCount: area.mediumCount,
          affectedEntityCount: affectedEntities.length,
          affectedEntities,
          routeCommands: route.routeCommands,
          queryParams: route.queryParams,
        };
      })
      .sort((a, b) => {
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
      entityType: defaultEntityTypeForModule(mod),
      totalFindings: rows.length,
      totalAreas: areas.length,
      totalEntities: uniqueEntities.size,
      areas,
    };
  }
}


function correctionAreaRoute(
  module: string,
  subcategory: string,
  entityId: string,
): CorrectionAreaRoute {
  const mod = String(module ?? '').trim().toUpperCase();
  const sub = String(subcategory ?? '').trim().toUpperCase();
  const id = String(entityId ?? '').trim();

  if (mod === 'RESIDENTIAL') {
    const base = ['/compliance', 'residential', 'location', id];

    switch (sub) {
      case 'FIRE_DRILLS':
        return {
          routeCommands: [...base, 'fire-drills'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'EMERGENCY_PLANS':
        return {
          routeCommands: [...base, 'emergency-plans'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'HOT_WATER':
        return {
          routeCommands: [...base, 'hot-water'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'LIFE_SAFETY':
        return {
          routeCommands: [...base, 'life-safety'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'HOME_ENVIRONMENT':
        return {
          routeCommands: [...base, 'home'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'MEDICATION':
        return {
          routeCommands: [...base, 'medication'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'INFECTION_CONTROL':
        return {
          routeCommands: [...base, 'infection-control'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'NURSING':
        return {
          routeCommands: [...base, 'nursing'],
          queryParams: { module: mod, subcategory: sub },
        };

      case 'FOUR_PERSON':
        return {
          routeCommands: [...base, 'four-person'],
          queryParams: { module: mod, subcategory: sub },
        };

      default:
        return {
          routeCommands: base,
          queryParams: { module: mod, subcategory: sub },
        };
    }
  }

  return {
    routeCommands: ['/dashboard', 'modules', mod],
    queryParams: { module: mod, subcategory: sub },
  };
}