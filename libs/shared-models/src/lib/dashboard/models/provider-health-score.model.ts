export interface ProviderHealthWeights {
  surveyReadiness: number;
  criticalFindings: number;
  highFindings: number;
  capCompletion: number;
  evidenceCompletion: number;
  moduleRisk: number;
}

export interface ProviderHealthInputs {
  openFindings: number;
  criticalFindings: number;
  highFindings: number;
  openCaps: number;
  overdueCaps: number;
  capsWithoutEvidence: number;
  surveyReadinessScore: number;
  moduleRiskScore: number;
}

export interface ProviderHealthBreakdown {
  surveyReadiness: number;
  criticalRisk: number;
  highRisk: number;
  capHealth: number;
  evidenceHealth: number;
  moduleHealth: number;
}

export interface ProviderHealthResult {
  providerHealthScore: number;
  breakdown: ProviderHealthBreakdown;
}

export const DEFAULT_PROVIDER_HEALTH_WEIGHTS: ProviderHealthWeights = {
  surveyReadiness: 35,
  criticalFindings: 25,
  highFindings: 15,
  capCompletion: 10,
  evidenceCompletion: 5,
  moduleRisk: 10,
};