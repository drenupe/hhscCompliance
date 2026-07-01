export interface OperationsDashboardView {
  providerName: string;
  title: string;
  subtitle: string;

  providerHealthScore: number;
  operationalHealthScore: number;
  surveyReadinessScore: number;

  openTasks: number;
  criticalItems: number;
  dueSoon: number;

  generatedAt: string;
}