export type EntityWorkbenchStatus =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'UNKNOWN';

export type EntityWorkbenchSeverity =
  | 'LOW'
  | 'MED'
  | 'HIGH'
  | 'CRITICAL';

export interface EntityWorkbenchFinding {
  id: string;
  module: string;
  subcategory: string | null;
  ruleCode: string;
  status: EntityWorkbenchStatus;
  severity: EntityWorkbenchSeverity;
  message: string | null;
  lastCheckedAt: Date | string | null;
  routeCommands?: unknown;
  queryParams?: unknown;
}

export interface EntityWorkbenchSection {
  subcategory: string | null;
  title: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  findings: EntityWorkbenchFinding[];
}

export interface EntityWorkbenchView {
  module: string;
  moduleTitle: string;
  entityType: string;
  entityId: string;
  entityName: string;
  totalFindings: number;
  sections: EntityWorkbenchSection[];
}