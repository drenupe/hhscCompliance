import { Controller, Get } from '@nestjs/common';

import { ExecutiveService } from './executive.service';

@Controller('executive')
export class ExecutiveController {
  constructor(
    private readonly service: ExecutiveService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboardView();
  }
}