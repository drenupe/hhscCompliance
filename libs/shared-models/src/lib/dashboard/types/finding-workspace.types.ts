export interface FindingWorkspaceView {
  findingId: string;

  module: string;

  entityId: string;

  entityName: string;

  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  status: string;

  rule: string;

  finding: string;

  recommendation: string;

  evidenceCount: number;

  capCount: number;

  lastUpdated: string;
}