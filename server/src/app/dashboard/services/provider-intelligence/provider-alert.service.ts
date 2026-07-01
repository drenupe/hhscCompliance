import { Injectable } from '@nestjs/common';
import { ProviderModuleRiskScore, ProviderIntelligenceAlert } from '../../../../../../libs/shared-models/src/lib/dashboard/types/provider-intelligence.types';


@Injectable()
export class ProviderAlertService {
  buildAlerts(
    totals: {
      criticalFindings: number;
      overdueCaps: number;
      capsWithoutEvidence: number;
    },
    modules: ProviderModuleRiskScore[],
  ): ProviderIntelligenceAlert[] {
    const alerts: ProviderIntelligenceAlert[] = [];

    if (totals.criticalFindings > 0) {
      alerts.push({
        id: 'critical-findings',
        title: 'Critical findings require review',
        message: `${totals.criticalFindings} critical compliance finding(s) are currently open.`,
        severity: 'CRITICAL',
        count: totals.criticalFindings,
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { severity: 'CRITICAL' },
      });
    }

    if (totals.overdueCaps > 0) {
      alerts.push({
        id: 'overdue-caps',
        title: 'Corrective actions are overdue',
        message: `${totals.overdueCaps} CAP(s) are past the target completion date.`,
        severity: 'HIGH',
        count: totals.overdueCaps,
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { status: 'OVERDUE' },
      });
    }

    if (totals.capsWithoutEvidence > 0) {
      alerts.push({
        id: 'missing-evidence',
        title: 'Evidence is missing',
        message: `${totals.capsWithoutEvidence} open CAP(s) do not have supporting evidence attached.`,
        severity: 'HIGH',
        count: totals.capsWithoutEvidence,
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { evidence: 'missing' },
      });
    }

    const highestRiskModule = modules[0];

    if (highestRiskModule && highestRiskModule.riskLevel !== 'LOW') {
      alerts.push({
        id: `module-risk-${highestRiskModule.module}`,
        title: `${highestRiskModule.title} is driving provider risk`,
        message: `${highestRiskModule.openFindings} open finding(s), including ${highestRiskModule.criticalFindings} critical.`,
        severity:
          highestRiskModule.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        module: highestRiskModule.module,
        count: highestRiskModule.openFindings,
        routeCommands: ['/', 'dashboard', 'modules', highestRiskModule.module],
        queryParams: { module: highestRiskModule.module },
      });
    }

    return alerts;
  }
}