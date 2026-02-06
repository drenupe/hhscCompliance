import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get('summary')
  summary(@Query('locationId') locationId: string) {
    if (!locationId) throw new BadRequestException('locationId is required');
    return this.svc.summary(locationId);
  }

  @Get('chart')
  chart(@Query('locationId') locationId: string) {
    if (!locationId) throw new BadRequestException('locationId is required');
    return this.svc.chart(locationId);
  }
}
