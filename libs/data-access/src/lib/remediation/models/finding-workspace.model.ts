export type FindingWorkspaceSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface FindingWorkspaceFinding {
  id: string;
  providerId?: string | null;
  locationId?: string | null;
  entityType: string;
  entityId: string;
  module: string;
  subcategory?: string | null;
  ruleCode: string;
  status: string;
  severity: FindingWorkspaceSeverity;
  message?: string | null;
  routeCommands?: any[] | null;
  queryParams?: Record<string, any> | null;
  needsRecheck?: boolean;
  nextCheckAt?: string | null;
  lastRecheckedAt?: string | null;
  recheckReason?: string | null;
  lastCheckedAt?: string | null;
}

export interface FindingWorkspaceCap {
  id: string;
  status: string;
  issue?: string | null;
  correctiveAction?: string | null;
  responsibleParty?: string | null;
  targetCompletionDate?: string | null;
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FindingWorkspaceNote {
  id: string;
  note: string;
  createdByUserId?: string | null;
  createdAt?: string | null;
}

export interface FindingWorkspaceEvidence {
  id: string;
  fileName?: string | null;
  originalFileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  uploadedByUserId?: string | null;
  createdAt?: string | null;
}

export interface FindingWorkspaceStatusHistory {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  reason?: string | null;
  changedByUserId?: string | null;
  createdAt?: string | null;
}

export interface FindingWorkspaceView {
  finding: FindingWorkspaceFinding;
  cap: FindingWorkspaceCap | null;
  notes: FindingWorkspaceNote[];
  evidence: FindingWorkspaceEvidence[];
  statusHistory: FindingWorkspaceStatusHistory[];
}