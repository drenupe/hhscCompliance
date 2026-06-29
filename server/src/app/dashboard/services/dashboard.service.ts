import { Injectable } from '@nestjs/common';

import { CaseManagerWorkQueueService } from './case-manager-work-queue.service';
import { DashboardSummaryService } from './dashboard-summary.service';
import { EntityWorkbenchService } from './entity-workbench.service';
import { ModuleCorrectionService } from './module-correction.service';
import { ProviderIntelligenceService } from './provider-intelligence.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly summaryService: DashboardSummaryService,
    private readonly moduleCorrectionService: ModuleCorrectionService,
    private readonly entityWorkbenchService: EntityWorkbenchService,
    private readonly caseManagerWorkQueueService: CaseManagerWorkQueueService,
    private readonly providerIntelligenceService: ProviderIntelligenceService,
  ) {}

  summary(locationId?: string) {
    return this.summaryService.summary(locationId);
  }

  chart() {
    return this.summaryService.chart();
  }

  providerIntelligence() {
    return this.providerIntelligenceService.getProviderIntelligence();
  }

  moduleCorrection(module: string) {
    return this.moduleCorrectionService.getModuleCorrection(module);
  }

  entityWorkbench(module: string, entityType: string, entityId: string) {
    return this.entityWorkbenchService.getEntityWorkbench(
      module,
      entityType,
      entityId,
    );
  }

  caseManagerWorkQueue(locationId: string) {
    return this.caseManagerWorkQueueService.getWorkQueue(locationId);
  }
}