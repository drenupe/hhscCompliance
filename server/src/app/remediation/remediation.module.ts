import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SecurityModule } from '../security/security.module';
import { CorrectiveActionPlanEntity } from './entities/corrective-action-plan.entity';
import { ComplianceFindingNoteEntity } from './entities/compliance-finding-note.entity';
import { RemediationController } from './controllers/remediation.controller';
import { RemediationRoutingService } from './services/remediation-routing.service';
import { RemediationService } from './services/remediation.service';
import { AuthorizationService } from '../security/services/authorization.service';
import { ComplianceResultCapEntity } from './entities/compliance-result-cap.entity';
import { ComplianceResultEntity } from '../compliance/entities/compliance-result.entity';
import { CapStatusHistoryEntity } from './entities/cap-status-history.entity';
import { CapEvidenceEntity } from './entities/cap-evidence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorrectiveActionPlanEntity,
      ComplianceFindingNoteEntity,
      ComplianceResultCapEntity,
      ComplianceResultEntity,
      CapStatusHistoryEntity,
      CapEvidenceEntity
    ]),
    SecurityModule,
  ],
  controllers: [RemediationController],
  providers: [RemediationService, RemediationRoutingService, AuthorizationService],
  exports: [RemediationService, RemediationRoutingService],
})
export class RemediationModule { }