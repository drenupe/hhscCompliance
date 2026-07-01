export type WorkQueueSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface CaseManagerWorkQueueItem {
  id: string;
  title: string;
  status: string;
  severity: WorkQueueSeverity;
  module?: string | null;
  subcategory?: string | null;
  ruleCode?: string | null;
  message?: string | null;
  dueDate?: Date | string | null;
  locationId?: string | null;
  locationName?: string | null;
  routeCommands?: string[] | null;
  queryParams?: Record<string, unknown> | null;
}

export interface CaseManagerWorkQueueView {
  openCaps: CaseManagerWorkQueueItem[];
  readyForReview: CaseManagerWorkQueueItem[];
  overdueCaps: CaseManagerWorkQueueItem[];
  highSeverityFindings: CaseManagerWorkQueueItem[];
  evidenceMissing: CaseManagerWorkQueueItem[];
  recheckQueue: CaseManagerWorkQueueItem[];
}