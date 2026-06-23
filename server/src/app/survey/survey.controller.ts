import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../security/decorators/require-permission.decorator';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { SurveyService } from './survey.service';

@Controller('survey')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('dashboard')
  @RequirePermission('dashboard:view')
  dashboard(@Query('locationId') locationId: string) {
    if (!locationId) {
      throw new BadRequestException('locationId is required');
    }

    return this.surveyService.dashboard(locationId);
  }

  @Get('findings')
  @RequirePermission('survey-binder:view')
  findings(@Query('locationId') locationId: string) {
    if (!locationId) {
      throw new BadRequestException('locationId is required');
    }

    return this.surveyService.findings(locationId);
  }
}