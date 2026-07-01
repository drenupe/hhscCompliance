import { ProviderHealthBreakdown } from "../models/provider-health-score.model";

export type ProviderRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ProviderMetricStatus =
  | 'healthy'
  | 'attention'
  | 'critical'
  | 'neutral';

export type ProviderRecommendationPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface ProviderIntelligenceMetric {
  label: string;
  value: string | number;
  detail: string;
  status: ProviderMetricStatus;
}

export interface ProviderIntelligenceAlert {
  id: string;
  title: string;
  message: string;
  severity: ProviderRiskLevel;
  count?: number;
  module?: string;
  routeCommands?: string[];
  queryParams?: Record<string, unknown>;
}

export interface ProviderRecommendation {
  id: string;
  title: string;
  message: string;
  priority: ProviderRecommendationPriority;
  routeCommands?: string[];
  queryParams?: Record<string, unknown>;
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

export interface ProviderHealthAnalysis {
  score: number;
  breakdown: ProviderHealthBreakdown;
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
  healthAnalysis?: ProviderHealthAnalysis;
  generatedAt: string;
}