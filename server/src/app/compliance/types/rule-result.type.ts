// server/src/app/compliance/types/rule-result.type.ts

import {
  ComplianceSeverity,
  ComplianceStatus,
} from '../entities/compliance-result.entity';

export interface RuleResult {
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  message?: string | null;
  routeCommands?: unknown[] | null;
  queryParams?: Record<string, string | number | boolean | null> | null;
}