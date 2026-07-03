export interface ImportSummaryItem {
  templateId: string;
  label: string;
  recordsReady: number;
  warnings: number;
  errors: number;
}

export interface ImportSummary {
  totalFilesUploaded: number;
  totalRecordsReady: number;
  totalWarnings: number;
  totalErrors: number;
  readinessPercent: number;
  items: ImportSummaryItem[];
}