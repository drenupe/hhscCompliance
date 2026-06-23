export type EntityWorkbenchSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface EntityWorkbenchFinding {
  id: string;
  ruleCode: string;
  status: string;
  severity: EntityWorkbenchSeverity;
  message: string | null;
  subcategory: string | null;
  routeCommands?: any[] | null;
  queryParams?: Record<string, any> | null;
}

export interface EntityWorkbenchSection {
  subcategory: string | null;
  title: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
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