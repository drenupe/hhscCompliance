import { Module } from '@nestjs/common';

import { ExecutiveController } from './executive.controller';
import { ExecutiveService } from './executive.service';

import { ExecutiveDashboardService } from './services/executive-dashboard.service';

@Module({
  controllers: [
    ExecutiveController,
  ],
  providers: [
    ExecutiveService,
    ExecutiveDashboardService,
  ],
})
export class ExecutiveModule {}