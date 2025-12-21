/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { ModuleKey, Raci, RaciRole } from '@hhsc-compliance/shared-models';
import { DEFAULT_RACI } from '@hhsc-compliance/shared-models';
import { ModuleCatalog, RaciAssignment, RoleCatalog } from './raci.entities';

// Navigation types (allow "dashboard" + extra keys)
export type NavKey = ModuleKey | 'dashboard';

export interface NavItem {
  key: NavKey;
  label: string;
  icon: string;
  path: string;
}

/**
 * Extra nav keys that are NOT part of ModuleKey
 * but still appear in your sidebar/navigation.
 * These will NOT be walked by RACI (we only iterate ModuleKey).
 */
type ExtraNavKey =
  | 'enclosed-beds'
  | 'protective-devices'
  | 'prohibitions'
  | 'medical-nursing'
  | 'medical-med-admin'
  | 'staff'
  | 'cost-report';

@Injectable()
export class RaciService {
  constructor(
    @InjectRepository(ModuleCatalog)
    private readonly modules: Repository<ModuleCatalog>,
    @InjectRepository(RoleCatalog)
    private readonly roles: Repository<RoleCatalog>,
    @InjectRepository(RaciAssignment)
    private readonly assignments: Repository<RaciAssignment>,
  ) {}

  /** In-memory fallback (use DB if you’ve seeded ModuleCatalog / RoleCatalog / Assignments) */
  private getDefaultRaciFor(moduleKey: ModuleKey): Raci {
    return DEFAULT_RACI[moduleKey];
  }

  /** Allowed roles for a module = union of r, a, c, i (coarse RaciRole buckets) */
  async allowedRoles(moduleKey: ModuleKey): Promise<RaciRole[]> {
    // DB path (if you’ve populated tables)
    const mod = await this.modules.findOne({ where: { key: moduleKey } });
    if (mod) {
      const rows = await this.assignments.find({
        where: { moduleId: mod.id },
        relations: ['role'],
      });

      const by = (lvl: 'R' | 'A' | 'C' | 'I') =>
        rows
          .filter((r) => r.level === lvl)
          .map((r) => r.role.name as RaciRole);

      const all = [...by('R'), ...by('A'), ...by('C'), ...by('I')];
      return Array.from(new Set(all));
    }

    // Fallback to in-memory default
    const r = this.getDefaultRaciFor(moduleKey);
    return Array.from(
      new Set([
        ...(r?.r ?? []),
        ...(r?.a ?? []),
        ...(r?.c ?? []),
        ...(r?.i ?? []),
      ]),
    );
  }

  /** Build a simple nav list for a given coarse RaciRole bucket */
  async buildMenuForRole(role: RaciRole): Promise<NavItem[]> {
    // Map module -> nav display (adjust labels/icons/paths here)
    const catalog: Record<ModuleKey, Omit<NavItem, 'key'>> &
      Partial<Record<ExtraNavKey, Omit<NavItem, 'key'>>> = {
      // ✅ keys that ARE ModuleKey
      residential: {
        label: 'Residential',
        icon: 'home',
        path: '/compliance/residential',
      },
      programmatic: {
        label: 'Programmatic',
        icon: 'list-checks',
        path: '/compliance/programmatic',
      },
      finance: {
        label: 'Finance / Rent',
        icon: 'wallet',
        path: '/compliance/finance',
      },
      behavior: {
        label: 'Behavior',
        icon: 'activity',
        path: '/compliance/behavior',
      },
      ane: {
        label: 'Abuse/Neglect/ANE',
        icon: 'shield-alert',
        path: '/compliance/ane',
      },
      restraints: {
        label: 'Restraints',
        icon: 'hand',
        path: '/compliance/restraints',
      },
      billing: {
        label: 'Billing',
        icon: 'file-text',
        path: '/compliance/billing',
      },
      iss: {
        label: 'ISS',
        icon: 'users',
        path: '/iss',
      },
      settings: {
        label: 'Settings',
        icon: 'settings',
        path: '/settings',
      },
      raci: {
        label: 'RACI Matrix',
        icon: 'shield-check',
        path: '/admin/raci',
      },
      dashboard: {
        label: 'Dashboard',
        icon: 'layout-dashboard',
        path: '/dashboard',
      },

      // ✅ extra nav-only keys (NOT part of ModuleKey)
      'enclosed-beds': {
        label: 'Enclosed Beds',
        icon: 'bed',
        path: '/compliance/enclosed-beds',
      },
      'protective-devices': {
        label: 'Protective Devices',
        icon: 'shield',
        path: '/compliance/protective',
      },
      prohibitions: {
        label: 'Prohibitions',
        icon: 'ban',
        path: '/compliance/prohibitions',
      },
      'medical-nursing': {
        label: 'Nursing',
        icon: 'stethoscope',
        path: '/medical/nursing',
      },
      'medical-med-admin': {
        label: 'Med Admin',
        icon: 'pill',
        path: '/medical/med-admin',
      },
      staff: {
        label: 'Staff',
        icon: 'user-cog',
        path: '/staff',
      },
      'cost-report': {
        label: 'Cost Report',
        icon: 'file-spreadsheet',
        path: '/admin/cost-report',
      },
    };

    const items: NavItem[] = [];

    // Only walk the RACI-aware modules
    for (const key of Object.keys(DEFAULT_RACI) as ModuleKey[]) {
      const allowed = await this.allowedRoles(key);
      if (allowed.includes(role)) {
        const d = catalog[key];
        if (d) items.push({ key, ...d });
      }
    }

    // Ensure Dashboard present (in case RACI somehow filtered all else)
    if (!items.some((x) => x.key === 'dashboard')) {
      const d = catalog.dashboard;
      items.unshift({ key: 'dashboard', ...d });
    }

    return items;
  }
}
