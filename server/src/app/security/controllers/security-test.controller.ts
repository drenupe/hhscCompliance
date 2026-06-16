import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';

import { RequirePermission } from '../../security/decorators/require-permission.decorator';
import { PermissionCodes } from '../../security/constants/permission-codes';

@Controller('security-test')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SecurityTestController {
  @Get('dashboard')
  @RequirePermission(PermissionCodes.DASHBOARD_VIEW)
  dashboard() {
    return {
      success: true,
      permission: PermissionCodes.DASHBOARD_VIEW,
    };
  }
}