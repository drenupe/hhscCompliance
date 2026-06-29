import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { DashboardService } from './services/dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('dashboard:view')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('summary')
  summary(@Query('locationId') locationId?: string) {
    return this.svc.summary(locationId);
  }

  @Get('chart')
  chart() {
    return this.svc.chart();
  }

  /**
   * Provider Intelligence Engine
   */
  @Get('provider-intelligence')
  providerIntelligence() {
    return this.svc.providerIntelligence();
  }

  /**
   * Case Manager Dashboard
   */
  @Get('case-manager/work-queue')
  caseManagerWorkQueue(@Query('locationId') locationId: string) {
    const loc = this.requireLocationId(locationId);
    return this.svc.caseManagerWorkQueue(loc);
  }

  /**
   * Module Workbench
   */
  @Get('modules/:module')
  moduleCorrection(@Param('module') module: string) {
    const mod = this.requireParam(module, 'module');
    return this.svc.moduleCorrection(mod);
  }

  /**
   * Entity Workbench
   */
  @Get('modules/:module/entities/:entityType/:entityId')
  entityWorkbench(
    @Param('module') module: string,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    const mod = this.requireParam(module, 'module');
    const type = this.requireParam(entityType, 'entityType');
    const id = this.requireParam(entityId, 'entityId');

    return this.svc.entityWorkbench(mod, type, id);
  }

  private requireLocationId(locationId?: string): string {
    const loc = String(locationId ?? '').trim();

    if (!loc) {
      throw new BadRequestException('locationId is required');
    }

    return loc;
  }

  private requireParam(value: unknown, name: string): string {
    const cleaned = String(value ?? '').trim();

    if (!cleaned) {
      throw new BadRequestException(`${name} is required`);
    }

    return cleaned;
  }
}