export type ImportValidationSeverity = 'info' | 'warning' | 'error';

export interface ImportValidationIssue {
  id: string;
  templateId: string;
  title: string;
  description: string;
  severity: ImportValidationSeverity;
  affectedRows?: number[];
  recommendedAction: string;
}

export interface ImportValidationResult {
  templateId: string;
  templateName: string;
  totalRecords: number;
  validRecords: number;
  warningCount: number;
  errorCount: number;
  issues: ImportValidationIssue[];
}