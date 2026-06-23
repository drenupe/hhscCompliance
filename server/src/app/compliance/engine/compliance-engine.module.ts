import { Module } from '@nestjs/common';

import { ComplianceEngineController } from './compliance-engine.controller';
import { ComplianceEngineService } from './compliance-engine.service';

import { ResidentialComplianceModule } from './residential/residential-compliance.module';
import { AuthorizationService } from '../../security/services/authorization.service';
import { SecurityModule } from '../../security/security.module';

@Module({
  imports: [
    ResidentialComplianceModule,SecurityModule
  ],
  controllers: [
    ComplianceEngineController,
  ],
  providers: [
    ComplianceEngineService,AuthorizationService
  ],
  exports: [
    ComplianceEngineService,
  ],
})
export class ComplianceEngineModule {}