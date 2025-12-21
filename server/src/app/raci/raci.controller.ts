/* eslint-disable @nx/enforce-module-boundaries */
import { Controller, Get, Query } from '@nestjs/common';

import type {
  AppRole,
  ModuleKey,
  RaciRole,
} from '@hhsc-compliance/shared-models';
import { RaciService } from './raci.service';

@Controller({
  path: 'raci',
  version: '1',
})
export class RaciController {
  constructor(private readonly svc: RaciService) {}

  /**
   * GET /api/v1/raci/allowed-roles?module=programmatic
   * Returns the coarse-grained RACI roles for a given module.
   */
  @Get('allowed-roles')
  allowedRoles(@Query('module') module: ModuleKey) {
    return this.svc.allowedRoles(module);
  }

  /**
   * GET /api/v1/raci/menu?role=Admin
   * Builds a nav menu for a given fine-grained AppRole by mapping it
   * into a coarse RaciRole bucket.
   */
  @Get('menu')
  async menu(@Query('role') role: AppRole) {
    const raciRole = this.mapAppRoleToRaciRole(role);
    return this.svc.buildMenuForRole(raciRole);
  }

  /**
   * Map fine-grained AppRole -> coarse RaciRole bucket.
   * Adjust this mapping anytime you add/change AppRole values.
   */
  private mapAppRoleToRaciRole(role: AppRole): RaciRole {
    switch (role) {
      // 🔑 Top-level owners/admins
      case 'Admin':
      case 'ProgramDirector':
      case 'ComplianceOfficer':
      case 'MedicalDirector':
      case 'FinanceOfficer':
        return 'ADMIN';

      // 👀 Managers / leads
      case 'ISSManager':
      case 'CaseManager':
      case 'BehaviorSupportLead':
      case 'Nurse':
        return 'MANAGER';

      // 🧑‍⚕️ Front-line staff
      case 'DirectCareStaff':
      case 'ISSStaff':
      case 'Finance':
        return 'STAFF';

      // Default to READONLY bucket
      default:
        return 'READONLY';
    }
  }
}
