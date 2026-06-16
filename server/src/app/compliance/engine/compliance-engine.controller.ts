import { BadRequestException, Controller, Param, Post } from '@nestjs/common';

import { ComplianceEngineService } from './compliance-engine.service';

@Controller('compliance/engine')
export class ComplianceEngineController {
  constructor(private readonly engine: ComplianceEngineService) {}

  @Post('locations/:locationId/evaluate')
  evaluateLocation(@Param('locationId') locationId: string) {
    const loc = String(locationId ?? '').trim();

    if (!loc) {
      throw new BadRequestException('locationId is required');
    }

    return this.engine.evaluateLocation(loc);
  }
}