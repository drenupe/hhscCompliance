import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('dashboard:view')
export class DashboardController {
  constructor(private readonly svc: DashboardService) { }

  @Get('summary')
  summary(@Query('locationId') locationId?: string) {
    const loc = locationId ? String(locationId).trim() : undefined;
    return this.svc.summary(loc);
  }

  @Get('chart')
  chart(@Query('locationId') locationId: string) {
    const loc = this.requireLocationId(locationId);
    return this.svc.chart(loc);
  }

  @Get('case-manager/work-queue')
  caseManagerWorkQueue(@Query('locationId') locationId: string) {
    const loc = this.requireLocationId(locationId);
    return this.svc.caseManagerWorkQueue(loc);
  }

  private requireLocationId(locationId?: string): string {
    const loc = String(locationId ?? '').trim();

    if (!loc) {
      throw new BadRequestException('locationId is required');
    }

    return loc;
  }

  @Get('modules/:module')
  moduleCorrection(@Param('module') module: string) {
    return this.svc.moduleCorrection(String(module ?? '').trim());
  }


  @Get('modules/:module/entities/:entityId')
  entityWorkbench(
    @Param('module') module: string,
    @Param('entityId') entityId: string,
  ) {
    return this.svc.entityWorkbench(
      String(module ?? '').trim(),
      String(entityId ?? '').trim(),
    );
  }
}