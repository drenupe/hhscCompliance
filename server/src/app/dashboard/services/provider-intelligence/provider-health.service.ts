import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderHealthService {
  scoreProviderHealth(totals: {
    openFindings: number;
    criticalFindings: number;
    highFindings: number;
    overdueCaps: number;
    capsWithoutEvidence: number;
  }): number {
    const penalty =
      totals.criticalFindings * 12 +
      totals.highFindings * 6 +
      totals.overdueCaps * 5 +
      totals.capsWithoutEvidence * 3 +
      totals.openFindings;

    return this.clampScore(100 - penalty);
  }

  scoreSurveyReadiness(totals: {
    openFindings: number;
    criticalFindings: number;
    highFindings: number;
    overdueCaps: number;
  }): number {
    const penalty =
      totals.criticalFindings * 15 +
      totals.highFindings * 8 +
      totals.overdueCaps * 6 +
      totals.openFindings;

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
      totals.openFindings;

    return this.clampScore(100 - penalty);
  }

  metricStatus(score: number): 'healthy' | 'attention' | 'critical' {
    if (score >= 85) return 'healthy';
    if (score >= 70) return 'attention';
    return 'critical';
  }

  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
  }
}