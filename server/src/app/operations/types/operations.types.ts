export type OperationServiceLineType =
  | 'RESIDENTIAL'
  | 'ISS'
  | 'NURSING'
  | 'BEHAVIOR_SUPPORT'
  | 'FOSTER_HOST_HOME'
  | 'STAFF_OPERATIONS'
  | 'FINANCE_ADMIN';

export type OperationStatus = 'HEALTHY' | 'ATTENTION' | 'AT_RISK' | 'CRITICAL';

export type OperationPriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type OperationActivityType =
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'EVIDENCE'
  | 'CAP'
  | 'SYSTEM';

export interface OperationServiceLine {
  type: OperationServiceLineType;
  title: string;
  subtitle: string;
  status: OperationStatus;
  surveyReadiness: number;
  activeConsumers: number;
  openTasks: number;
  dueSoon: number;
  criticalItems: number;
  routeCommands: string[];
  queryParams?: Record<string, string>;
}

export interface OperationComplianceModule {
  module: string;
  title: string;
  subtitle: string;
  status: OperationStatus;
  findingCount: number;
  criticalCount: number;
  dueSoon: number;
  routeCommands: string[];
  queryParams?: Record<string, string>;
}

export interface OperationPriority {
  id: string;
  level: OperationPriorityLevel;
  title: string;
  context: string;
  due: string;
  routeCommands?: string[];
  queryParams?: Record<string, string>;
}

export interface OperationActivity {
  id: string;
  message: string;
  timestamp: string;
  type: OperationActivityType;
}

export interface OperationExecutiveMetric {
  label: string;
  value: string;
  detail: string;
  status: OperationStatus;
}

export interface OperationExecutiveRisk {
  id: string;
  title: string;
  summary: string;
  level: OperationPriorityLevel;
  routeCommands?: string[];
  queryParams?: Record<string, string>;
}

export interface OperationsExecutiveIntelligence {
  readinessTrend: 'Improving' | 'Stable' | 'Declining';
  providerHealthSummary: string;
  surveyRiskLevel: OperationPriorityLevel;
  capCompletionRate: number;
  billingRiskLevel: OperationPriorityLevel;
  staffReadinessRate: number;
  metrics: OperationExecutiveMetric[];
  risks: OperationExecutiveRisk[];
}

export interface OperationsCommandCenterView {
  providerName: string;
  title: string;
  subtitle: string;
  overallSurveyReadiness: number;
  operationalHealth: number;
  openTasks: number;
  criticalItems: number;
  dueSoon: number;
  serviceLines: OperationServiceLine[];
  coreModules: OperationComplianceModule[];
  priorities: OperationPriority[];
  recentActivity: OperationActivity[];
  executive: OperationsExecutiveIntelligence;
}