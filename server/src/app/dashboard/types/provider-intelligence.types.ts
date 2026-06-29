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