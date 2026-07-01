import { Injectable } from '@nestjs/common';

import {
  DEFAULT_PROVIDER_HEALTH_WEIGHTS,
  ProviderHealthInputs,
  ProviderHealthResult,
  ProviderHealthWeights,
} from '@hhsc-compliance/shared-models';

@Injectable()
export class ProviderHealthScoreService {
  calculate(
    inputs: ProviderHealthInputs,
    weights: ProviderHealthWeights = DEFAULT_PROVIDER_HEALTH_WEIGHTS,
  ): ProviderHealthResult {
    const breakdown = {
      surveyReadiness: this.clamp(inputs.surveyReadinessScore),

      criticalRisk: this.scoreCriticalRisk(inputs.criticalFindings),

      highRisk: this.scoreHighRisk(inputs.highFindings),

      capHealth: this.scoreCapHealth(inputs.openCaps, inputs.overdueCaps),

      evidenceHealth: this.scoreEvidenceHealth(
        inputs.openCaps,
        inputs.capsWithoutEvidence,
      ),

      moduleHealth: this.scoreModuleHealth(inputs.moduleRiskScore),
    };

    const providerHealthScore = Math.round(
      (breakdown.surveyReadiness * weights.surveyReadiness +
        breakdown.criticalRisk * weights.criticalFindings +
        breakdown.highRisk * weights.highFindings +
        breakdown.capHealth * weights.capCompletion +
        breakdown.evidenceHealth * weights.evidenceCompletion +
        breakdown.moduleHealth * weights.moduleRisk) /
        this.totalWeight(weights),
    );

    return {
      providerHealthScore: this.clamp(providerHealthScore),
      breakdown,
    };
  }

  private scoreCriticalRisk(criticalFindings: number): number {
    if (criticalFindings <= 0) return 100;
    if (criticalFindings === 1) return 80;
    if (criticalFindings === 2) return 65;
    if (criticalFindings === 3) return 50;
    if (criticalFindings === 4) return 40;

    return Math.max(15, 40 - (criticalFindings - 4) * 5);
  }

  private scoreHighRisk(highFindings: number): number {
    if (highFindings <= 0) return 100;
    if (highFindings <= 3) return 85;
    if (highFindings <= 6) return 75;
    if (highFindings <= 10) return 65;

    return Math.max(35, 65 - (highFindings - 10) * 2);
  }

  private scoreCapHealth(openCaps: number, overdueCaps: number): number {
    if (openCaps <= 0) return 100;

    const overdueRate = overdueCaps / openCaps;

    if (overdueRate <= 0) return 90;
    if (overdueRate <= 0.15) return 80;
    if (overdueRate <= 0.3) return 70;
    if (overdueRate <= 0.5) return 55;

    return 40;
  }

  private scoreEvidenceHealth(
    openCaps: number,
    capsWithoutEvidence: number,
  ): number {
    if (openCaps <= 0) return 100;

    const missingRate = capsWithoutEvidence / openCaps;

    if (missingRate <= 0) return 95;
    if (missingRate <= 0.15) return 85;
    if (missingRate <= 0.3) return 75;
    if (missingRate <= 0.5) return 60;

    return 45;
  }

  private scoreModuleHealth(moduleRiskScore: number): number {
    return this.clamp(100 - moduleRiskScore);
  }

  private totalWeight(weights: ProviderHealthWeights): number {
    return (
      weights.surveyReadiness +
      weights.criticalFindings +
      weights.highFindings +
      weights.capCompletion +
      weights.evidenceCompletion +
      weights.moduleRisk
    );
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}