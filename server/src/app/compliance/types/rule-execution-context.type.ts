// server/src/app/compliance/types/rule-execution-context.type.ts

import { ComplianceEntityType } from '../entities/compliance-result.entity';

export interface RuleExecutionContext {
  providerId: string;
  locationId?: string | null;
  entityType: ComplianceEntityType;
  entityId: string;
  module: string;
  subcategory?: string | null;
}