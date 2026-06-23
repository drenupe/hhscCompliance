import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ComplianceEngineService } from './compliance-engine.service';
import { RequirePermission } from '../../security/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';

@Controller('compliance/engine')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplianceEngineController {
  constructor(private readonly engine: ComplianceEngineService) {}

  @Post('locations/:locationId/evaluate')
  @RequirePermission('residential:view')
  evaluateLocation(@Param('locationId') locationId: string) {
    const loc = String(locationId ?? '').trim();

    if (!loc) {
      throw new BadRequestException('locationId is required');
    }

    return this.engine.evaluateLocation(loc);
  }
}