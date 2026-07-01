import { Injectable } from '@nestjs/common';

import { ProviderHealthResult } from '@hhsc-compliance/shared-models';

import { ProviderHealthScoreService } from './scoring/provider-health-score.service';

@Injectable()
export class ProviderHealthService {
  constructor(
    private readonly providerHealthScoreService: ProviderHealthScoreService,
  ) {}

  scoreProviderHealth(totals: {
    openFindings: number;
    criticalFindings: number;
    highFindings: number;
    openCaps: number;
    overdueCaps: number;
    capsWithoutEvidence: number;
    moduleRiskScore?: number;
  }): ProviderHealthResult {
    return this.providerHealthScoreService.calculate({
      openFindings: totals.openFindings,
      criticalFindings: totals.criticalFindings,
      highFindings: totals.highFindings,
      openCaps: totals.openCaps,
      overdueCaps: totals.overdueCaps,
      capsWithoutEvidence: totals.capsWithoutEvidence,
      surveyReadinessScore: this.scoreSurveyReadiness(totals),
      moduleRiskScore: totals.moduleRiskScore ?? 0,
    });
  }

  scoreSurveyReadiness(totals: {
    openFindings: number;
    criticalFindings: number;
    highFindings: number;
    overdueCaps: number;
  }): number {
    const penalty =
      totals.criticalFindings * 10 +
      totals.highFindings * 5 +
      totals.overdueCaps * 4 +
      totals.openFindings * 0.5;

    return this.clampScore(100 - penalty);
  }

  scoreOperationalHealth(totals: {
    openFindings: number;
    overdueCaps: number;
    capsWithoutEvidence: number;
  }): number {
    const penalty =
      totals.overdueCaps * 6 +
      totals.capsWithoutEvidence * 4 +
      totals.openFindings * 0.75;

    return this.clampScore(100 - penalty);
  }

  metricStatus(score: number): 'healthy' | 'attention' | 'critical' {
    if (score >= 85) return 'healthy';
    if (score >= 70) return 'attention';

    return 'critical';
  }

  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}