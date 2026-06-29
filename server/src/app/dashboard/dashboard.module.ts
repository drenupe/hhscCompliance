import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SecurityModule } from '../security/security.module';

import { DashboardService } from './services/dashboard.service';
import { CaseManagerWorkQueueService } from './services/case-manager-work-queue.service';
import { DashboardSummaryService } from './services/dashboard-summary.service';
import { EntityWorkbenchService } from './services/entity-workbench.service';
import { ModuleCorrectionService } from './services/module-correction.service';
import { ProviderIntelligenceService } from './services/provider-intelligence.service';
import { ProviderAlertService } from './services/provider-intelligence/provider-alert.service';
import { ProviderHealthService } from './services/provider-intelligence/provider-health.service';
import { ProviderRecommendationService } from './services/provider-intelligence/provider-recommendation.service';
import { RiskScoringService } from './services/provider-intelligence/risk-scoring.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [AuthModule, SecurityModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    DashboardSummaryService,
    ModuleCorrectionService,
    EntityWorkbenchService,
    CaseManagerWorkQueueService,
    ProviderIntelligenceService,
    ProviderHealthService,
    RiskScoringService,
    ProviderAlertService,
    ProviderRecommendationService,
  ],
})
export class DashboardModule {}