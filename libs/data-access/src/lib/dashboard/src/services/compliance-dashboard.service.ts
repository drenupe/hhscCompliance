import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../api-core/base-api.service';

export type SummaryStatus = 'ok' | 'warning' | 'critical';

export type ModuleCorrectionEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export type EntityWorkbenchStatus =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'UNKNOWN';

export type EntityWorkbenchSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export type ProviderRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ProviderIntelligenceMetric {
  label: string;
  value: string | number;
  detail: string;
  status: 'healthy' | 'attention' | 'critical' | 'neutral';
}

export interface ProviderIntelligenceAlert {
  id: string;
  title: string;
  message: string;
  severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  module?: string | null;
  count?: number;
  routeCommands?: string[] | null;
  queryParams?: Record<string, unknown> | null;
}

export interface ProviderModuleRiskScore {
  module: string;
  title: string;
  openFindings: number;
  criticalFindings: number;
  highFindings: number;
  riskScore: number;
  riskLevel: ProviderRiskLevel;
}

export interface ProviderRecommendation {
  id: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  routeCommands?: string[] | null;
  queryParams?: Record<string, unknown> | null;
}

export interface ProviderIntelligenceView {
  providerHealthScore: number;
  surveyReadinessScore: number;
  operationalHealthScore: number;
  riskLevel: ProviderRiskLevel;
  metrics: ProviderIntelligenceMetric[];
  alerts: ProviderIntelligenceAlert[];
  moduleRiskScores: ProviderModuleRiskScore[];
  recommendations: ProviderRecommendation[];
  generatedAt: string;
}

export interface ModuleAffectedEntity {
  entityType: ModuleCorrectionEntityType;
  entityId: string;
  entityLabel: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
}

export interface ModuleCorrectionArea {
  subcategory: string;
  title: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  affectedEntityCount: number;
  affectedEntities: ModuleAffectedEntity[];
  routeCommands: string[];
  queryParams: Record<string, string>;
}

export interface ModuleCorrectionView {
  module: string;
  title: string;
  entityType: ModuleCorrectionEntityType;
  totalFindings: number;
  totalAreas: number;
  totalEntities: number;
  areas: ModuleCorrectionArea[];
}

export interface EntityWorkbenchFinding {
  id: string;
  module: string;
  subcategory: string | null;
  ruleCode: string;
  status: EntityWorkbenchStatus;
  severity: EntityWorkbenchSeverity;
  message: string | null;
  lastCheckedAt: string | null;
  routeCommands?: string[];
  queryParams?: Record<string, string>;
}

export interface EntityWorkbenchSection {
  subcategory: string | null;
  title: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  findings: EntityWorkbenchFinding[];
}

export interface EntityWorkbenchView {
  module: string;
  moduleTitle: string;
  entityType: ModuleCorrectionEntityType;
  entityId: string;
  entityName: string;
  totalFindings: number;
  sections: EntityWorkbenchSection[];
}

export interface ComplianceSummaryView {
  title: string;
  module: string;
  subcategory: string | null;
  count: number;
  affectedEntityCount?: number;
  affectedEntityType?: string | null;
  status: SummaryStatus;
  lastUpdated?: string;
  link?: any[];
  queryParams?: Record<string, any>;
}

export type ChartDatum = {
  label: string;
  value: number;
};

@Injectable({ providedIn: 'root' })
export class ComplianceDashboardService extends BaseApiService {
  private readonly dashboardPath = 'v1/dashboard';

  getProviderIntelligence(): Observable<ProviderIntelligenceView> {
    const url = this.buildUrl(`${this.dashboardPath}/provider-intelligence`);
    return this.get<ProviderIntelligenceView>(url);
  }

  getSummaryData(): Observable<ComplianceSummaryView[]> {
    const url = this.buildUrl(`${this.dashboardPath}/summary`);
    return this.get<ComplianceSummaryView[]>(url);
  }

  getChartData(): Observable<ChartDatum[]> {
    const url = this.buildUrl(`${this.dashboardPath}/chart`);
    return this.get<ChartDatum[]>(url);
  }

  getModuleCorrection(module: string): Observable<ModuleCorrectionView> {
    const url = this.buildUrl(
      `${this.dashboardPath}/modules/${encodeURIComponent(module)}`,
    );

    return this.get<ModuleCorrectionView>(url);
  }
}