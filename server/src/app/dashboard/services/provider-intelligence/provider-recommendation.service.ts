import { Injectable } from '@nestjs/common';
import { ProviderModuleRiskScore, ProviderRecommendation } from '../../types/provider-intelligence.types';


@Injectable()
export class ProviderRecommendationService {
  buildRecommendations(
    totals: {
      criticalFindings: number;
      overdueCaps: number;
      capsWithoutEvidence: number;
    },
    modules: ProviderModuleRiskScore[],
  ): ProviderRecommendation[] {
    const recommendations: ProviderRecommendation[] = [];

    if (totals.criticalFindings > 0) {
      recommendations.push({
        id: 'resolve-critical-findings',
        title: 'Resolve critical findings first',
        message:
          'Prioritize all critical findings before addressing lower-risk work.',
        priority: 'CRITICAL',
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { severity: 'CRITICAL' },
      });
    }

    if (totals.overdueCaps > 0) {
      recommendations.push({
        id: 'review-overdue-caps',
        title: 'Review overdue CAPs',
        message:
          'Update overdue corrective action plans and confirm target completion dates.',
        priority: 'HIGH',
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { status: 'OVERDUE' },
      });
    }

    if (totals.capsWithoutEvidence > 0) {
      recommendations.push({
        id: 'upload-evidence',
        title: 'Attach missing evidence',
        message:
          'Upload documentation, photos, notes, or verification files to support open CAPs.',
        priority: 'HIGH',
        routeCommands: ['/', 'compliance', 'message-center'],
        queryParams: { evidence: 'missing' },
      });
    }

    const riskyModule = modules.find((module) => module.riskLevel !== 'LOW');

    if (riskyModule) {
      recommendations.push({
        id: `focus-${riskyModule.module}`,
        title: `Focus on ${riskyModule.title}`,
        message:
          'This module currently has the highest impact on provider risk.',
        priority: riskyModule.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        routeCommands: ['/', 'dashboard', 'modules', riskyModule.module],
        queryParams: { module: riskyModule.module },
      });
    }

    return recommendations;
  }
}