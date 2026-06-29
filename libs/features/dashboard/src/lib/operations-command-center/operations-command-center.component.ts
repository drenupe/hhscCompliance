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
  ProviderRecommendation,
} from '@hhsc-compliance/data-access';

import {
  OperationActivity,
  OperationActivityType,
  OperationComplianceModule,
  OperationPriority,
  OperationPriorityLevel,
  OperationServiceLine,
  OperationStatus,
} from '@hhsc-compliance/shared-models';

import {
  ButtonComponent,
  GridComponent,
  HeroAction,
  HeroComponent,
  HeroMetric,
  MetricCardComponent,
  PageComponent,
  PanelComponent,
} from '@hhsc-compliance/ui-kit';

import { ActivityFeedComponent } from '../activity-feed/activity-feed.component';
import { ComplianceModuleGridComponent } from '../compliance-module-grid/compliance-module-grid.component';
import { OperationsEngineCardComponent } from '../operations-engine-card/operations-engine-card.component';
import { PriorityListComponent } from '../priority-list/priority-list.component';

interface OperationsCommandCenterVm {
  loading: boolean;
  error: string | null;
  view: OperationsCommandCenterViewModel | null;
}

interface OperationsCommandCenterViewModel {
  providerName: string;
  title: string;
  subtitle: string;
  providerHealthScore: number;
  surveyReadinessScore: number;
  operationalHealth: number;
  riskLevel: string;
  criticalItems: number;
  dueSoon: number;
  openTasks: number;
  heroMetrics: HeroMetric[];
  kpiMetrics: ProviderIntelligenceMetric[];
  serviceLines: OperationServiceLine[];
  coreModules: OperationComplianceModule[];
  priorities: OperationPriority[];
  recentActivity: OperationActivity[];
}

@Component({
  selector: 'lib-operations-command-center',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ComplianceModuleGridComponent,
    GridComponent,
    HeroComponent,
    MetricCardComponent,
    OperationsEngineCardComponent,
    PageComponent,
    PanelComponent,
    PriorityListComponent,
    ActivityFeedComponent,
  ],
  templateUrl: './operations-command-center.component.html',
  styleUrl: './operations-command-center.component.scss',
})
export class OperationsCommandCenterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(ComplianceDashboardService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly heroActions: HeroAction[] = [
    {
      label: 'View Priority Queue',
      action: 'priorityQueue',
      variant: 'primary',
    },
    {
      label: 'Review Modules',
      action: 'modules',
      variant: 'secondary',
    },
    {
      label: 'Refresh Intelligence',
      action: 'refresh',
      variant: 'ghost',
    },
  ];

  readonly vm$ = this.refresh$.pipe(
    switchMap(() =>
      this.dashboardService.getProviderIntelligence().pipe(
        map(
          (intelligence): OperationsCommandCenterVm => ({
            loading: false,
            error: null,
            view: this.toOperationsView(intelligence),
          }),
        ),
        startWith({
          loading: true,
          error: null,
          view: null,
        } satisfies OperationsCommandCenterVm),
        catchError((error) =>
          of({
            loading: false,
            error:
              error?.error?.message ??
              error?.message ??
              'Unable to load Provider Intelligence Center.',
            view: null,
          } satisfies OperationsCommandCenterVm),
        ),
      ),
    ),
  );

  ngOnInit(): void {
    this.refresh$.next();
  }

  openServiceLine(line: OperationServiceLine): void {
    this.router.navigate(line.routeCommands, {
      queryParams: line.queryParams ?? {},
    });
  }

  openCoreModule(module: OperationComplianceModule): void {
    this.router.navigate(module.routeCommands, {
      queryParams: module.queryParams ?? {},
    });
  }

  openPriority(priority: OperationPriority): void {
    if (!priority.routeCommands?.length) {
      return;
    }

    this.router.navigate(priority.routeCommands, {
      queryParams: priority.queryParams ?? {},
    });
  }

  onHeroAction(action: string): void {
    if (action === 'priorityQueue') {
      this.scrollToSection('priorityQueue');
      return;
    }

    if (action === 'modules') {
      this.scrollToSection('modules');
      return;
    }

    if (action === 'refresh') {
      this.refresh$.next();
    }
  }

  private toOperationsView(
    intelligence: ProviderIntelligenceView,
  ): OperationsCommandCenterViewModel {
    return {
      providerName: 'Provider Intelligence Center',
      title: 'Operations Command Center',
      subtitle:
        'Provider-wide operational intelligence for survey readiness, compliance risk, corrective actions, and documentation health.',
      providerHealthScore: intelligence.providerHealthScore,
      surveyReadinessScore: intelligence.surveyReadinessScore,
      operationalHealth: intelligence.operationalHealthScore,
      riskLevel: intelligence.riskLevel,
      criticalItems: this.countCriticalItems(intelligence),
      dueSoon: this.countDueSoon(intelligence),
      openTasks: this.countOpenTasks(intelligence),
      heroMetrics: this.toHeroMetrics(intelligence),
      kpiMetrics: intelligence.metrics,
      serviceLines: this.toServiceLines(intelligence),
      coreModules: this.toCoreModules(intelligence),
      priorities: this.toPriorities(intelligence),
      recentActivity: this.toRecentActivity(intelligence),
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
        label: 'Critical Alerts',
        value: this.countCriticalItems(intelligence),
        helper: 'Requires immediate review',
      },
      {
        label: 'Recommendations',
        value: intelligence.recommendations.length,
        helper: 'System-generated actions',
      },
      {
        label: 'Modules at Risk',
        value: intelligence.moduleRiskScores.filter(
          (module) => module.riskLevel !== 'LOW',
        ).length,
        helper: 'Moderate risk or higher',
      },
    ];
  }

  private toServiceLines(
    intelligence: ProviderIntelligenceView,
  ): OperationServiceLine[] {
    const topModules = intelligence.moduleRiskScores.slice(0, 5);

    if (!topModules.length) {
      return [
        {
          type: 'FINANCE_ADMIN',
          title: 'Provider Operations',
          subtitle: 'No active module risk detected.',
          status: 'HEALTHY',
          surveyReadiness: intelligence.surveyReadinessScore,
          activeConsumers: 0,
          openTasks: 0,
          dueSoon: 0,
          criticalItems: 0,
          routeCommands: ['/', 'operations'],
          queryParams: {},
        },
      ];
    }

    return topModules.map((module) => ({
      type: this.toServiceLineType(module.module),
      title: module.title,
      subtitle: `${module.openFindings} open finding(s). Risk level: ${module.riskLevel}.`,
      status: this.toOperationStatus(module.riskLevel),
      surveyReadiness: Math.max(0, 100 - module.riskScore),
      activeConsumers: 0,
      openTasks: module.openFindings,
      dueSoon: 0,
      criticalItems: module.criticalFindings,
      routeCommands: ['/', 'dashboard', 'modules', module.module],
      queryParams: {
        module: module.module,
      },
    }));
  }

  private toCoreModules(
    intelligence: ProviderIntelligenceView,
  ): OperationComplianceModule[] {
    return intelligence.moduleRiskScores.map((module) => ({
      module: module.module,
      title: module.title,
      subtitle: `${module.openFindings} open finding(s).`,
      status: this.toOperationStatus(module.riskLevel),
      findingCount: module.openFindings,
      criticalCount: module.criticalFindings,
      dueSoon: 0,
      routeCommands: ['/', 'dashboard', 'modules', module.module],
      queryParams: {
        module: module.module,
      },
    }));
  }

  private toPriorities(
    intelligence: ProviderIntelligenceView,
  ): OperationPriority[] {
    return [
      ...intelligence.alerts.map((alert) => this.alertToPriority(alert)),
      ...intelligence.recommendations.map((recommendation) =>
        this.recommendationToPriority(recommendation),
      ),
    ].slice(0, 8);
  }

  private toRecentActivity(
    intelligence: ProviderIntelligenceView,
  ): OperationActivity[] {
    return [
      ...intelligence.alerts.slice(0, 3).map((alert) => ({
        id: `alert-${alert.id}`,
        message: `${alert.title}: ${alert.message}`,
        timestamp: intelligence.generatedAt,
        type: 'COMPLIANCE' as OperationActivityType,
      })),
      ...intelligence.recommendations.slice(0, 3).map((recommendation) => ({
        id: `recommendation-${recommendation.id}`,
        message: `${recommendation.title}: ${recommendation.message}`,
        timestamp: intelligence.generatedAt,
        type: 'OPERATIONS' as OperationActivityType,
      })),
    ];
  }

  private alertToPriority(alert: ProviderIntelligenceAlert): OperationPriority {
    return {
      id: alert.id,
      level: this.toPriorityLevel(alert.severity),
      title: alert.title,
      context: alert.message,
      due: 'Review now',
      routeCommands: alert.routeCommands ?? ['/', 'compliance', 'message-center'],
      queryParams: this.toStringQueryParams(alert.queryParams),
    };
  }

  private recommendationToPriority(
    recommendation: ProviderRecommendation,
  ): OperationPriority {
    return {
      id: recommendation.id,
      level: this.toPriorityLevel(recommendation.priority),
      title: recommendation.title,
      context: recommendation.message,
      due: 'Recommended action',
      routeCommands:
        recommendation.routeCommands ?? ['/', 'compliance', 'message-center'],
      queryParams: this.toStringQueryParams(recommendation.queryParams),
    };
  }

  private toServiceLineType(module: string): OperationServiceLine['type'] {
    const key = String(module ?? '').toUpperCase();

    if (key === 'RESIDENTIAL') return 'RESIDENTIAL';
    if (key === 'ISS') return 'ISS';
    if (key === 'NURSING') return 'NURSING';
    if (key === 'MEDICATION') return 'NURSING';
    if (key === 'BEHAVIOR_SUPPORT') return 'BEHAVIOR_SUPPORT';
    if (key === 'FOSTER_HOST_HOME') return 'FOSTER_HOST_HOME';

    return 'FINANCE_ADMIN';
  }

  private toOperationStatus(riskLevel: string): OperationStatus {
    if (riskLevel === 'CRITICAL') return 'CRITICAL';
    if (riskLevel === 'HIGH') return 'AT_RISK';
    if (riskLevel === 'MODERATE') return 'ATTENTION';

    return 'HEALTHY';
  }

  private toPriorityLevel(
    value: string,
  ): OperationPriorityLevel {
    if (value === 'CRITICAL') return 'Critical';
    if (value === 'HIGH') return 'High';
    if (value === 'MED' || value === 'MODERATE') return 'Medium';

    return 'Low';
  }

  private countCriticalItems(intelligence: ProviderIntelligenceView): number {
    return intelligence.alerts.filter((alert) => alert.severity === 'CRITICAL')
      .length;
  }

  private countOpenTasks(intelligence: ProviderIntelligenceView): number {
    return intelligence.alerts.length + intelligence.recommendations.length;
  }

  private countDueSoon(intelligence: ProviderIntelligenceView): number {
    return intelligence.alerts.filter(
      (alert) => alert.id.includes('overdue') || alert.id.includes('due'),
    ).length;
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