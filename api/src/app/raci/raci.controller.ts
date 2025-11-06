import { Controller, Get, Query } from '@nestjs/common';
import type { ModuleKey, Role } from '@hhsc-compliance/shared-models';
import { RaciService } from './raci.service';

@Controller({ path: 'raci', version: '1' })
export class RaciController {
  constructor(private readonly raci: RaciService) {}

  @Get('menu')
  menu(@Query('role') role: Role) {
    return this.raci.serverMenuForRole(role);
  }

  @Get('allowed-roles')
  allowed(@Query('module') moduleKey: ModuleKey) {
    return this.raci.allowedRoles(moduleKey);
  }

  @Get('is-responsible')
  isResponsible(@Query('module') moduleKey: ModuleKey, @Query('role') role: Role) {
    return this.raci.isResponsible(moduleKey, role);
  }

  @Get('raci')
  raciFor(@Query('module') moduleKey: ModuleKey) {
    return this.raci.getRaciForModule(moduleKey);
  }
}
