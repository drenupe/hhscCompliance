export type ComplianceEntityType = 'RESIDENTIAL' | 'CONSUMER' | 'EMPLOYEE' | 'PROVIDER';
export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
export type ComplianceSeverity = 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';

export interface ComplianceResultDto {
  id: string;
  providerId: string;
  locationId: string | null;
  entityType: ComplianceEntityType;
  entityId: string;

  // canonical module key (ex: RESIDENTIAL, ANE, etc.)
  module: string;

  // ✅ add this
  subcategory: string | null;

  ruleCode: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message: string | null;

  routeCommands: any[] | null;
  queryParams: Record<string, any> | null;

  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateComplianceResultInput = Omit<
  ComplianceResultDto,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateComplianceResultInput = Partial<
  Pick<
    ComplianceResultDto,
    'status' | 'severity' | 'message' | 'subcategory' | 'routeCommands' | 'queryParams' | 'lastCheckedAt'
  >
>;
