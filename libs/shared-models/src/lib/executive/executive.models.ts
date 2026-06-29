export type ExecutiveStatus =
  | 'HEALTHY'
  | 'ATTENTION'
  | 'AT_RISK'
  | 'CRITICAL';

export type ExecutiveTrend =
  | 'IMPROVING'
  | 'STABLE'
  | 'DECLINING';

export interface ExecutiveMetric {
  title: string;
  value: number;
  status: ExecutiveStatus;
  trend: ExecutiveTrend;
  change: number;
}

export interface ExecutiveRisk {
  id: string;
  title: string;
  summary: string;
  severity: ExecutiveStatus;
  routeCommands: string[];
  queryParams?: Record<string, string>;
}

export interface ExecutiveDashboardView {
  providerName: string;

  agencyHealth: ExecutiveMetric;

  surveyReadiness: ExecutiveMetric;

  providerScore: ExecutiveMetric;

  staffReadiness: ExecutiveMetric;

  billingHealth: ExecutiveMetric;

  capCompletion: ExecutiveMetric;

  risks: ExecutiveRisk[];
}