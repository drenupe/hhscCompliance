import { Module } from '@nestjs/common';

import { ComplianceEngineController } from './compliance-engine.controller';
import { ComplianceEngineService } from './compliance-engine.service';

import { ResidentialComplianceModule } from './residential/residential-compliance.module';

@Module({
  imports: [
    ResidentialComplianceModule,
  ],
  controllers: [
    ComplianceEngineController,
  ],
  providers: [
    ComplianceEngineService,
  ],
  exports: [
    ComplianceEngineService,
  ],
})
export class ComplianceEngineModule {}