import {
  ProviderHealthAnalysis,
  ProviderIntelligenceAlert,
  ProviderIntelligenceMetric,
  ProviderModuleRiskScore,
  ProviderRecommendation,
  ProviderRiskLevel,
} from './provider-intelligence.types';

export interface ExecutiveTrendPoint {
  label: string;
  value: number;
}

export interface ExecutiveTrend {
  title: string;
  subtitle: string;
  currentValue: number;
  direction: 'up' | 'down' | 'flat';
  points: ExecutiveTrendPoint[];
}

export interface ExecutiveHeatMapCell {
  location: string;
  score: number;
  findings: number;
  critical: number;
  high: number;
}

export interface ExecutiveHeatMapRow {
  module: string;
  title: string;
  overallScore: number;
  overallRisk: ProviderRiskLevel;
  worstLocation: string;
  cells: ExecutiveHeatMapCell[];
}

export interface ExecutiveDashboardView {
  title: string;
  subtitle: string;
  providerHealthScore: number;
  surveyReadinessScore: number;
  operationalHealthScore: number;
  riskLevel: ProviderRiskLevel;
  metrics: ProviderIntelligenceMetric[];
  alerts: ProviderIntelligenceAlert[];
  moduleRiskScores: ProviderModuleRiskScore[];
  recommendations: ProviderRecommendation[];
  providerHealth: ProviderHealthAnalysis;
  trends: ExecutiveTrend[];
  heatMap: ExecutiveHeatMapRow[];
  generatedAt: string;
}