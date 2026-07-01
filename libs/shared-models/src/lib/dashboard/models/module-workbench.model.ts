export type DashboardEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export interface ModuleAffectedEntity {
  entityId: string;
  entityLabel: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
}

export interface ModuleCorrectionArea {
  subcategory: string;
  title: string;
  findingCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  affectedEntityCount: number;
  affectedEntities: ModuleAffectedEntity[];
}

export interface ModuleWorkbench {
  module: string;
  title: string;
  entityType: DashboardEntityType;
  totalFindings: number;
  totalAreas: number;
  totalEntities: number;
  areas: ModuleCorrectionArea[];
}