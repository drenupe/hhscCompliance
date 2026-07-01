export interface ModuleWorkbenchView {
  module: string;

  title: string;

  subtitle: string;

  totalFindings: number;

  criticalFindings: number;

  highFindings: number;

  mediumFindings: number;

  lowFindings: number;

  entities: number;

  surveyReadiness: number;
}