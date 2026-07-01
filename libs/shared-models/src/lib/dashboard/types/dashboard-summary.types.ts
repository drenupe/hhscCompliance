export interface DashboardSummaryCard {
  module: string;
  title: string;

  compliant: number;
  nonCompliant: number;
  unknown: number;

  critical: number;
  high: number;
  medium: number;
  low: number;

  surveyReadiness: number;

  routeCommands?: string[];
  queryParams?: Record<string, unknown>;
}

export interface DashboardSummaryView {
  providerHealthScore: number;
  surveyReadinessScore: number;

  modules: DashboardSummaryCard[];

  generatedAt: string;
}