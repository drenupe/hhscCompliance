export type ModuleEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export type ModuleSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface ModuleCorrectionFinding {
  id: string;
  ruleCode: string;
  status: string;
  severity: ModuleSeverity;
  message: string | null;
  subcategory: string | null;
  routeCommands?: any[] | null;
  queryParams?: Record<string, any> | null;
}

export interface ModuleCorrectionEntityGroup {
  entityType: ModuleEntityType;
  entityId: string;
  entityName: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  findings: ModuleCorrectionFinding[];
}

export interface ModuleCorrectionView {
  module: string;
  title: string;
  entityType: ModuleEntityType;
  totalFindings: number;
  totalEntities: number;
  groups: ModuleCorrectionEntityGroup[];
}