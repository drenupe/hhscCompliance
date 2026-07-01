export type ModuleCorrectionEntityType =
  | 'RESIDENTIAL'
  | 'CONSUMER'
  | 'EMPLOYEE'
  | 'PROVIDER';

export interface ModuleAffectedEntity {
  entityType: ModuleCorrectionEntityType;
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

  routeCommands: string[];
  queryParams: Record<string, string>;
}

export interface ModuleCorrectionView {
  module: string;
  title: string;
  entityType: ModuleCorrectionEntityType;
  totalFindings: number;
  totalAreas: number;
  totalEntities: number;
  areas: ModuleCorrectionArea[];
}