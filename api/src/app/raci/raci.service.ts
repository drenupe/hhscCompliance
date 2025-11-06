import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleCatalog, RaciAssignment, RoleCatalog } from './raci.entities';
import type { ModuleKey, Role, Raci } from '@hhsc-compliance/shared-models';
import { DEFAULT_RACI_MAP } from '@hhsc-compliance/shared-models';

@Injectable()
export class RaciService {
  constructor(
    @InjectRepository(RoleCatalog) private roles: Repository<RoleCatalog>,
    @InjectRepository(ModuleCatalog) private modules: Repository<ModuleCatalog>,
    @InjectRepository(RaciAssignment) private assignments: Repository<RaciAssignment>,
  ) {}

  async getRaciForModule(moduleKey: ModuleKey): Promise<Raci> {
    const mod = await this.modules.findOne({ where: { key: moduleKey } });
    if (!mod) return DEFAULT_RACI_MAP[moduleKey];

    const rows = await this.assignments.find({ where: { moduleId: mod.id }, relations: ['role'] });
    const by = (lvl: 'R' | 'A' | 'C' | 'I') => rows.filter(r => r.level === lvl).map(r => r.role.name as Role);
    return { responsible: by('R'), accountable: by('A'), consulted: by('C'), informed: by('I') };
  }

  async allowedRoles(moduleKey: ModuleKey): Promise<Role[]> {
    const raci = await this.getRaciForModule(moduleKey);
    return Array.from(new Set([...(raci.responsible ?? []), ...(raci.accountable ?? []), ...(raci.consulted ?? [])]));
  }

  async isResponsible(moduleKey: ModuleKey, role: Role): Promise<boolean> {
    const mod = await this.modules.findOne({ where: { key: moduleKey } });
    if (!mod) return (DEFAULT_RACI_MAP[moduleKey].responsible ?? []).includes(role);
    const roleRow = await this.roles.findOne({ where: { name: role } });
    if (!roleRow) return false;
    const count = await this.assignments.count({ where: { moduleId: mod.id, roleId: roleRow.id, level: 'R' } });
    return count > 0;
  }

  async serverMenuForRole(role: Role) {
    const modules = await this.modules.find();
    const result: { key: ModuleKey; label: string; icon: string; path: string }[] = [];
    for (const m of modules) {
      const allowed = await this.allowedRoles(m.key as ModuleKey);
      if (allowed.includes(role)) result.push({ key: m.key as ModuleKey, label: m.label, icon: m.icon, path: m.path });
    }
    // Always include Dashboard for allowed users
    if (!result.some(x => x.key === 'dashboard')) {
      result.unshift({ key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', path: '/dashboard' });
    }
    return result;
  }
}
