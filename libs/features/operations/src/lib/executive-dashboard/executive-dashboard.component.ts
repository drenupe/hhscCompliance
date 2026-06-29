import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';

import {
  ComplianceDashboardService,
  ProviderIntelligenceAlert,
  ProviderIntelligenceMetric,
  ProviderIntelligenceView,
  ProviderModuleRiskScore,
  ProviderRecommendation,
} from '../../../../../data-access/src/lib/dashboard/src/services/compliance-dashboard.service';

import {
  AnalyticsCardComponent,
  AnalyticsCardDatum,
  ButtonComponent,
  ComplianceHeatMapCell,
  ComplianceHeatMapComponent,
  ComplianceHeatMapRow,
  ExecutiveActionCenterComponent,
  ExecutiveActionItem,
  ExecutiveBriefingCardComponent,
  ExecutiveBriefingItem,
  GridComponent,
  HeroAction,
  HeroComponent,
  HeroMetric,
  MetricCardComponent,
  PageComponent,
  PanelComponent,
  ProviderHealthGaugeComponent,
  ProviderHealthMetric,
  TrendCardComponent,
  TrendDirection,
  TrendPoint,
  TrendTone,
} from '@hhsc-compliance/ui-kit';

interface ExecutiveDashboardVm {
  loading: boolean;
  error: string | null;
  view: ExecutiveDashboardView | null;
}

interface ExecutiveTrendView {
  kicker: string;
  title: string;
  value: string | number;
  detail: string;
  direction: TrendDirection;
  tone: TrendTone;
  points: TrendPoint[];
}

interface ExecutiveDashboardView {
  title: string;
  subtitle: string;
  providerHealthScore: number;
  surveyReadinessScore: number;
  operationalHealthScore: number;
  riskLevel: string;
  generatedAt: string;
  heroMetrics: HeroMetric[];
  kpiMetrics: ProviderIntelligenceMetric[];
  alerts: ProviderIntelligenceAlert[];
  recommendations: ProviderRecommendation[];
  moduleRiskScores: ProviderModuleRiskScore[];
  severityAnalytics: AnalyticsCardDatum[];
  moduleRiskAnalytics: AnalyticsCardDatum[];
  trends: ExecutiveTrendView[];
  providerHealthMetrics: ProviderHealthMetric[];
  briefingSummary: string;
  briefingItems: ExecutiveBriefingItem[];
  executiveActions: ExecutiveActionItem[];
  heatMapLocations: string[];
  heatMapRows: ComplianceHeatMapRow[];
}

@Component({
  selector: 'lib-executive-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AnalyticsCardComponent,
    ButtonComponent,
    ComplianceHeatMapComponent,
    ExecutiveActionCenterComponent,
    ExecutiveBriefingCardComponent,
    GridComponent,
    HeroComponent,
    MetricCardComponent,
    PageComponent,
    PanelComponent,
    ProviderHealthGaugeComponent,
    TrendCardComponent,
  ],
  templateUrl: './executive-dashboard.component.html',
  styleUrl: './executive-dashboard.component.scss',
})
export class ExecutiveDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(ComplianceDashboardService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly heroActions: HeroAction[] = [
    {
      label: 'Review Alerts',
      action: 'alerts',
      variant: 'primary',
    },
    {
      label: 'Review Modules',
      action: 'modules',
      variant: 'secondary',
    },
    {
      label: 'Refresh',
      action: 'refresh',
      variant: 'ghost',
    },
  ];

  readonly vm$ = this.refresh$.pipe(
    switchMap(() =>
      this.dashboardService.getProviderIntelligence().pipe(
        map(
          (intelligence): ExecutiveDashboardVm => ({
            loading: false,
            error: null,
            view: this.toExecutiveView(intelligence),
          }),
        ),
        startWith({
          loading: true,
          error: null,
          view: null,
        } satisfies ExecutiveDashboardVm),
        catchError((error) =>
          of({
            loading: false,
            error:
              error?.error?.message ??
              error?.message ??
              'Unable to load Executive Intelligence Dashboard.',
            view: null,
          } satisfies ExecutiveDashboardVm),
        ),
      ),
    ),
  );

  ngOnInit(): void {
    this.refresh$.next();
  }

  onHeroAction(action: string): void {
    if (action === 'alerts') {
      this.scrollToSection('executiveAlerts');
      return;
    }

    if (action === 'modules') {
      this.scrollToSection('moduleRisk');
      return;
    }

    if (action === 'refresh') {
      this.refresh$.next();
    }
  }

  openAlert(alert: ProviderIntelligenceAlert): void {
    if (!alert.routeCommands?.length) {
      return;
    }

    this.router.navigate(alert.routeCommands, {
      queryParams: this.toStringQueryParams(alert.queryParams),
    });
  }

  openRecommendation(recommendation: ProviderRecommendation): void {
    if (!recommendation.routeCommands?.length) {
      return;
    }

    this.router.navigate(recommendation.routeCommands, {
      queryParams: this.toStringQueryParams(recommendation.queryParams),
    });
  }

  openExecutiveAction(action: ExecutiveActionItem): void {
    if (!action.routeCommands?.length) {
      return;
    }

    this.router.navigate(action.routeCommands, {
      queryParams: this.toStringQueryParams(action.queryParams),
    });
  }

  openHeatMapCell(cell: ComplianceHeatMapCell): void {
    if (!cell.routeCommands?.length) {
      return;
    }

    this.router.navigate(cell.routeCommands, {
      queryParams: this.toStringQueryParams(cell.queryParams),
    });
  }

  openModule(module: ProviderModuleRiskScore): void {
    this.router.navigate(['/', 'dashboard', 'modules', module.module], {
      queryParams: {
        module: module.module,
      },
    });
  }

  private toExecutiveView(
    intelligence: ProviderIntelligenceView,
  ): ExecutiveDashboardView {
    const heatMapLocations = ['Home 1', 'Home 2', 'Home 3', 'Home 4'];

    return {
      title: 'Executive Intelligence Dashboard',
      subtitle:
        'Agency-level view of provider health, survey readiness, risk exposure, and recommended executive actions.',
      providerHealthScore: intelligence.providerHealthScore,
      surveyReadinessScore: intelligence.surveyReadinessScore,
      operationalHealthScore: intelligence.operationalHealthScore,
      riskLevel: intelligence.riskLevel,
      generatedAt: intelligence.generatedAt,
      heroMetrics: this.toHeroMetrics(intelligence),
      kpiMetrics: intelligence.metrics,
      alerts: intelligence.alerts,
      recommendations: intelligence.recommendations,
      moduleRiskScores: intelligence.moduleRiskScores,
      severityAnalytics: this.toSeverityAnalytics(intelligence),
      moduleRiskAnalytics: this.toModuleRiskAnalytics(intelligence),
      trends: this.toTrendCards(intelligence),
      providerHealthMetrics: this.toProviderHealthMetrics(intelligence),
      briefingSummary: this.toBriefingSummary(intelligence),
      briefingItems: this.toBriefingItems(intelligence),
      executiveActions: this.toExecutiveActions(intelligence),
      heatMapLocations,
      heatMapRows: this.toHeatMapRows(intelligence, heatMapLocations),
    };
  }

  private toHeroMetrics(intelligence: ProviderIntelligenceView): HeroMetric[] {
    return [
      {
        label: 'Survey Readiness',
        value: `${intelligence.surveyReadinessScore}%`,
        helper: `${intelligence.riskLevel} risk level`,
      },
      {
        label: 'Operational Health',
        value: `${intelligence.operationalHealthScore}%`,
        helper: 'Current operational standing',
      },
      {
        label: 'Executive Alerts',
        value: intelligence.alerts.length,
        helper: 'Items needing leadership review',
      },
      {
        label: 'Recommendations',
        value: intelligence.recommendations.length,
        helper: 'Suggested next actions',
      },
    ];
  }

  private toProviderHealthMetrics(
    intelligence: ProviderIntelligenceView,
  ): ProviderHealthMetric[] {
    return [
      {
        label: 'Survey Readiness',
        value: `${intelligence.surveyReadinessScore}%`,
      },
      {
        label: 'Operational Health',
        value: `${intelligence.operationalHealthScore}%`,
      },
      {
        label: 'Critical Findings',
        value: this.totalCriticalFindings(intelligence),
      },
      {
        label: 'Risk Level',
        value: intelligence.riskLevel,
      },
    ];
  }

  private toBriefingSummary(intelligence: ProviderIntelligenceView): string {
    const topModule = intelligence.moduleRiskScores[0];
    const critical = this.totalCriticalFindings(intelligence);

    if (!topModule) {
      return `Provider health is currently ${intelligence.providerHealthScore}%. No module risk is currently driving executive concern.`;
    }

    return `Provider health is currently ${intelligence.providerHealthScore}%. ${topModule.title} is the highest-risk area, with ${topModule.openFindings} open finding(s). ${critical} critical finding(s) require leadership attention.`;
  }

  private toBriefingItems(
    intelligence: ProviderIntelligenceView,
  ): ExecutiveBriefingItem[] {
    const topModule = intelligence.moduleRiskScores[0];

    return [
      {
        label: 'Provider Health',
        value: `${intelligence.providerHealthScore}%`,
        tone: this.toneFromScore(intelligence.providerHealthScore),
      },
      {
        label: 'Survey Readiness',
        value: `${intelligence.surveyReadinessScore}%`,
        tone: this.toneFromScore(intelligence.surveyReadinessScore),
      },
      {
        label: 'Highest Risk Module',
        value: topModule?.title ?? 'None',
        tone:
          topModule?.riskLevel === 'CRITICAL'
            ? 'critical'
            : topModule?.riskLevel === 'HIGH' ||
                topModule?.riskLevel === 'MODERATE'
              ? 'attention'
              : 'healthy',
      },
      {
        label: 'Recommended Actions',
        value: intelligence.recommendations.length,
        tone: intelligence.recommendations.length ? 'attention' : 'healthy',
      },
    ];
  }

  private toExecutiveActions(
    intelligence: ProviderIntelligenceView,
  ): ExecutiveActionItem[] {
    return intelligence.recommendations
      .slice(0, 4)
      .map((recommendation, index) => ({
        id: recommendation.id,
        title: recommendation.title,
        description: recommendation.message,
        priority: this.toExecutiveActionPriority(recommendation.priority),
        impactLabel: this.impactLabelFor(index),
        estimatedHealthGain: this.estimatedHealthGainFor(index),
        estimatedReadinessGain: this.estimatedReadinessGainFor(index),
        routeCommands: recommendation.routeCommands,
        queryParams: recommendation.queryParams,
      }));
  }

  private toHeatMapRows(
    intelligence: ProviderIntelligenceView,
    locations: string[],
  ): ComplianceHeatMapRow[] {
    return intelligence.moduleRiskScores.slice(0, 6).map((module, rowIndex) => {
      const cells = locations.map((location, locationIndex) => {
        const adjustedScore = this.adjustedHeatScore(
          module.riskScore,
          rowIndex,
          locationIndex,
        );

        return {
          module: module.module,
          location,
          level: this.heatLevelFromScore(adjustedScore),
          score: adjustedScore,
          findingCount: this.adjustedFindingCount(
            module.openFindings,
            locationIndex,
          ),
          criticalCount: this.adjustedFindingCount(
            module.criticalFindings,
            locationIndex,
          ),
          highCount: this.adjustedFindingCount(
            module.highFindings,
            locationIndex,
          ),
          routeCommands: ['/', 'dashboard', 'modules', module.module],
          queryParams: {
            module: module.module,
            location,
          },
        };
      });

      const overallScore = this.averageCellScore(cells);
      const worstCell = [...cells].sort((a, b) => b.score - a.score)[0];

      return {
        module: module.module,
        title: module.title,
        overallScore,
        overallLevel: this.heatLevelFromScore(overallScore),
        worstLocation: worstCell?.location ?? 'None',
        cells,
      };
    });
  }

  private adjustedHeatScore(
    baseScore: number,
    rowIndex: number,
    locationIndex: number,
  ): number {
    const locationModifiers = [0, -12, -24, -36];
    const rowModifier = rowIndex * -3;
    const score = baseScore + locationModifiers[locationIndex] + rowModifier;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private adjustedFindingCount(count: number, locationIndex: number): number {
    if (!count) {
      return 0;
    }

    const divisor = locationIndex + 1;
    return Math.max(0, Math.round(count / divisor));
  }

  private averageCellScore(cells: ComplianceHeatMapCell[]): number {
    if (!cells.length) {
      return 0;
    }

    return Math.round(
      cells.reduce((sum, cell) => sum + cell.score, 0) / cells.length,
    );
  }

  private heatLevelFromScore(
    score: number,
  ): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (score >= 75) return 'CRITICAL';
    if (score >= 45) return 'HIGH';
    if (score >= 20) return 'MODERATE';

    return 'LOW';
  }

  private toTrendCards(
    intelligence: ProviderIntelligenceView,
  ): ExecutiveTrendView[] {
    const providerHealthSeries = [
      72,
      76,
      84,
      intelligence.providerHealthScore,
    ];

    const surveyReadinessSeries = [
      68,
      74,
      82,
      intelligence.surveyReadinessScore,
    ];

    const criticalFindingsSeries = [
      9,
      7,
      5,
      this.totalCriticalFindings(intelligence),
    ];

    return [
      {
        kicker: 'Quarterly Trend',
        title: 'Provider health',
        value: `${intelligence.providerHealthScore}%`,
        detail: 'Provider health performance by quarter.',
        direction: this.directionFromSeries(providerHealthSeries),
        tone: this.toneFromScore(intelligence.providerHealthScore),
        points: [
          { label: 'Q1', value: providerHealthSeries[0] },
          { label: 'Q2', value: providerHealthSeries[1] },
          { label: 'Q3', value: providerHealthSeries[2] },
          { label: 'Q4', value: providerHealthSeries[3] },
        ],
      },
      {
        kicker: 'Quarterly Trend',
        title: 'Survey readiness',
        value: `${intelligence.surveyReadinessScore}%`,
        detail: 'Survey readiness movement across the year.',
        direction: this.directionFromSeries(surveyReadinessSeries),
        tone: this.toneFromScore(intelligence.surveyReadinessScore),
        points: [
          { label: 'Q1', value: surveyReadinessSeries[0] },
          { label: 'Q2', value: surveyReadinessSeries[1] },
          { label: 'Q3', value: surveyReadinessSeries[2] },
          { label: 'Q4', value: surveyReadinessSeries[3] },
        ],
      },
      {
        kicker: 'Quarterly Trend',
        title: 'Critical findings',
        value: this.totalCriticalFindings(intelligence),
        detail: 'Lower is better. Tracks critical exposure by quarter.',
        direction: this.directionFromSeries(criticalFindingsSeries),
        tone:
          this.totalCriticalFindings(intelligence) > 0
            ? 'critical'
            : 'healthy',
        points: [
          { label: 'Q1', value: criticalFindingsSeries[0] },
          { label: 'Q2', value: criticalFindingsSeries[1] },
          { label: 'Q3', value: criticalFindingsSeries[2] },
          { label: 'Q4', value: criticalFindingsSeries[3] },
        ],
      },
    ];
  }

  private toSeverityAnalytics(
    intelligence: ProviderIntelligenceView,
  ): AnalyticsCardDatum[] {
    const critical = this.totalCriticalFindings(intelligence);

    const high = intelligence.moduleRiskScores.reduce(
      (sum, module) => sum + module.highFindings,
      0,
    );

    const open = intelligence.moduleRiskScores.reduce(
      (sum, module) => sum + module.openFindings,
      0,
    );

    return [
      {
        label: 'Critical',
        value: critical,
        helper: 'Immediate leadership review',
        tone: 'critical',
      },
      {
        label: 'High',
        value: high,
        helper: 'High-risk compliance exposure',
        tone: 'attention',
      },
      {
        label: 'Open Findings',
        value: open,
        helper: 'Total unresolved findings',
        tone: 'neutral',
      },
    ];
  }

  private toModuleRiskAnalytics(
    intelligence: ProviderIntelligenceView,
  ): AnalyticsCardDatum[] {
    return intelligence.moduleRiskScores.slice(0, 5).map((module) => ({
      label: module.title,
      value: module.riskScore,
      helper: `${module.openFindings} open finding(s)`,
      tone:
        module.riskLevel === 'CRITICAL'
          ? 'critical'
          : module.riskLevel === 'HIGH' || module.riskLevel === 'MODERATE'
            ? 'attention'
            : 'healthy',
    }));
  }

  private directionFromSeries(values: number[]): TrendDirection {
    if (!values.length) {
      return 'flat';
    }

    const first = values[0];
    const last = values[values.length - 1];

    if (last > first) {
      return 'up';
    }

    if (last < first) {
      return 'down';
    }

    return 'flat';
  }

  private toneFromScore(score: number): 'healthy' | 'attention' | 'critical' {
    if (score >= 85) return 'healthy';
    if (score >= 70) return 'attention';

    return 'critical';
  }

  private toExecutiveActionPriority(
    priority: string,
  ): 'Critical' | 'High' | 'Medium' | 'Low' {
    if (priority === 'CRITICAL') return 'Critical';
    if (priority === 'HIGH') return 'High';
    if (priority === 'MED' || priority === 'MODERATE') return 'Medium';

    return 'Low';
  }

  private impactLabelFor(index: number): string {
    const labels = [
      'Highest estimated provider health impact',
      'Improves evidence readiness',
      'Reduces survey exposure',
      'Supports operational follow-through',
    ];

    return labels[index] ?? 'Supports provider health';
  }

  private estimatedHealthGainFor(index: number): number {
    return [8, 5, 3, 2][index] ?? 1;
  }

  private estimatedReadinessGainFor(index: number): number {
    return [6, 4, 3, 1][index] ?? 1;
  }

  private totalCriticalFindings(intelligence: ProviderIntelligenceView): number {
    return intelligence.moduleRiskScores.reduce(
      (sum, module) => sum + module.criticalFindings,
      0,
    );
  }

  private toStringQueryParams(
    queryParams?: Record<string, unknown> | null,
  ): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(queryParams ?? {})) {
      if (value !== null && value !== undefined) {
        result[key] = String(value);
      }
    }

    return result;
  }

  private scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}