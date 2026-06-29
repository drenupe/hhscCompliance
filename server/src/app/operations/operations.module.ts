import { Module } from '@nestjs/common';

import { SecurityModule } from '../security/security.module';
import { OperationsController } from './operations.controller';
import { OperationsCommandCenterService } from './services/operations-command-center.service';
import { ExecutiveIntelligenceService } from './services/executive-intelligence.service';

@Module({
  imports: [SecurityModule],
  controllers: [OperationsController],
  providers: [OperationsCommandCenterService,ExecutiveIntelligenceService],
  exports: [OperationsCommandCenterService],
})
export class OperationsModule {}