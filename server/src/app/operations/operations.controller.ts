import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { OperationsCommandCenterService } from './services/operations-command-center.service';

@Controller('operations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('dashboard:view')
export class OperationsController {
  constructor(private readonly commandCenter: OperationsCommandCenterService) {}

  @Get('command-center')
  getCommandCenter() {
    return this.commandCenter.getCommandCenter();
  }
}