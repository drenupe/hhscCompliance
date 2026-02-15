import { BadRequestException, Controller, Post, Query } from '@nestjs/common';
import { ComplianceEngineService } from './compliance-engine.service';

@Controller('compliance-engine')
export class ComplianceEngineController {
  constructor(private readonly engine: ComplianceEngineService) {}

  /**
   * POST /api/v1/compliance-engine/evaluate?locationId=...
   * Optional: providerId, but you can resolve providerId same way you do in ComplianceResultsService.
   */
  @Post('evaluate')
  evaluate(@Query('locationId') locationId: string) {
    const loc = String(locationId ?? '').trim();
    if (!loc) throw new BadRequestException('locationId is required');
    return this.engine.evaluateLocation(loc);
  }
}
