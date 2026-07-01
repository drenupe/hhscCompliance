import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProviderAlertService } from './provider-intelligence/provider-alert.service';
import { ProviderHealthService } from './provider-intelligence/provider-health.service';
import { ProviderRecommendationService } from './provider-intelligence/provider-recommendation.service';
import { RiskScoringService } from './provider-intelligence/risk-scoring.service';
import { ProviderIntelligenceView } from '@hhsc-compliance/shared-models';

@Injectable()
export class ProviderIntelligenceService {
  constructor(
    private readonly ds: DataSource,
    private readonly healthService: ProviderHealthService,
    private readonly riskScoringService: RiskScoringService,
    private readonly alertService: ProviderAlertService,
    private readonly recommendationService: ProviderRecommendationService,
  ) {}

  async getProviderIntelligence(): Promise<ProviderIntelligenceView> {
    const [summaryRows, capRows, evidenceRows] = await Promise.all([
      this.getComplianceSummaryRows(),
      this.getCapRows(),
      this.getEvidenceRows(),
    ]);

    const moduleRiskScores = summaryRows.map((row) =>
      this.riskScoringService.toModuleRiskScore(row),
    );

    const highestModuleRiskScore = moduleRiskScores.length
      ? Math.max(...moduleRiskScores.map((module) => module.riskScore))
      : 0;

    const totals = this.calculateTotals(
      summaryRows,
      capRows,
      evidenceRows,
      highestModuleRiskScore,
    );

    const surveyReadinessScore =
      this.healthService.scoreSurveyReadiness(totals);

    const operationalHealthScore =
      this.healthService.scoreOperationalHealth(totals);

    const healthAnalysis = this.healthService.scoreProviderHealth({
      ...totals,
      moduleRiskScore: highestModuleRiskScore,
    });

    const providerHealthScore = healthAnalysis.providerHealthScore;

    return {
      providerHealthScore,
      surveyReadinessScore,
      operationalHealthScore,
      riskLevel:
        this.riskScoringService.riskLevelFromHealthScore(providerHealthScore),
      healthAnalysis: {
        score: providerHealthScore,
        breakdown: healthAnalysis.breakdown,
      },
      metrics: [
        {
          label: 'Provider Health',
          value: `${providerHealthScore}%`,
          detail: 'Weighted executive health score',
          status: this.healthService.metricStatus(providerHealthScore),
        },
        {
          label: 'Survey Readiness',
          value: `${surveyReadinessScore}%`,
          detail: 'Readiness based on current compliance exposure',
          status: this.healthService.metricStatus(surveyReadinessScore),
        },
        {
          label: 'Critical Findings',
          value: totals.criticalFindings,
          detail: 'Requires immediate action',
          status: totals.criticalFindings > 0 ? 'critical' : 'healthy',
        },
        {
          label: 'Open CAPs',
          value: totals.openCaps,
          detail: 'Corrective actions in progress',
          status: totals.overdueCaps > 0 ? 'attention' : 'neutral',
        },
      ],
      alerts: this.alertService.buildAlerts(totals, moduleRiskScores),
      moduleRiskScores,
      recommendations: this.recommendationService.buildRecommendations(
        totals,
        moduleRiskScores,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private async getComplianceSummaryRows(): Promise<any[]> {
    return this.ds.query(`
      SELECT
        cr.module,
        COUNT(*)::int AS open_findings,
        COUNT(*) FILTER (WHERE cr.severity = 'CRITICAL')::int AS critical_findings,
        COUNT(*) FILTER (WHERE cr.severity = 'HIGH')::int AS high_findings,
        COUNT(*) FILTER (WHERE cr.severity IN ('MED', 'MEDIUM'))::int AS medium_findings,
        COUNT(*) FILTER (WHERE cr.severity = 'LOW')::int AS low_findings,
        MAX(cr.updated_at) AS last_updated
      FROM compliance_results cr
      WHERE cr.status IN ('NON_COMPLIANT', 'UNKNOWN')
      GROUP BY cr.module
      ORDER BY critical_findings DESC, high_findings DESC, open_findings DESC
    `);
  }

  private async getCapRows(): Promise<any[]> {
    return this.ds.query(`
      SELECT
        COUNT(*) FILTER (
          WHERE cap.status IN ('OPEN', 'IN_PROGRESS', 'READY_FOR_REVIEW')
        )::int AS open_caps,
        COUNT(*) FILTER (
          WHERE cap.target_completion_date IS NOT NULL
            AND cap.target_completion_date < NOW()
            AND cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
        )::int AS overdue_caps
      FROM corrective_action_plans cap
    `);
  }

  private async getEvidenceRows(): Promise<any[]> {
    return this.ds.query(`
      SELECT
        COUNT(DISTINCT cap.id)::int AS caps_without_evidence
      FROM corrective_action_plans cap
      LEFT JOIN cap_evidence ev
        ON ev.cap_id = cap.id
      WHERE cap.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')
      GROUP BY cap.id
      HAVING COUNT(ev.id) = 0
    `);
  }

  private calculateTotals(
    summaryRows: any[],
    capRows: any[],
    evidenceRows: any[],
    moduleRiskScore: number,
  ) {
    const capTotals = capRows[0] ?? {};

    return {
      openFindings: summaryRows.reduce(
        (sum, row) => sum + Number(row.open_findings ?? 0),
        0,
      ),
      criticalFindings: summaryRows.reduce(
        (sum, row) => sum + Number(row.critical_findings ?? 0),
        0,
      ),
      highFindings: summaryRows.reduce(
        (sum, row) => sum + Number(row.high_findings ?? 0),
        0,
      ),
      openCaps: Number(capTotals.open_caps ?? 0),
      overdueCaps: Number(capTotals.overdue_caps ?? 0),
      capsWithoutEvidence: evidenceRows.length,
      moduleRiskScore,
    };
  }
}