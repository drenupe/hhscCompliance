// compliance/types/compliance-result-input.type.ts

import {
  ComplianceEntityType,
  ComplianceSeverity,
  ComplianceStatus,
} from '../entities/compliance-result.entity';

export interface ComplianceResultInput {
  providerId?: string;

  locationId?: string | null;

  entityType: ComplianceEntityType;
  entityId: string;

  module: string;
  subcategory?: string | null;

  ruleCode: string;

  status: ComplianceStatus;
  severity: ComplianceSeverity;

  message?: string | null;

  routeCommands?: unknown[] | null;

  queryParams?: Record<
    string,
    string | number | boolean | null
  > | null;

  lastCheckedAt?: Date | string | null;
}