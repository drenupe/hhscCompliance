import {
  RequirementSeverity,
  ValidationRuleType,
} from '../enums/regulatory.enums';

export interface ValidationRule {
  id: string;
  requirementId: string;

  code: string;
  title: string;
  description?: string;

  ruleType: ValidationRuleType;
  targetPath: string;

  severity: RequirementSeverity;

  expectedValue?: unknown;
  comparisonValue?: unknown;

  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;

  pattern?: string;
  relatedPath?: string;

  errorMessage: string;
  recommendation?: string;

  customValidatorKey?: string;

  enabled: boolean;
  displayOrder?: number;

  createdAt?: string;
  updatedAt?: string;
}