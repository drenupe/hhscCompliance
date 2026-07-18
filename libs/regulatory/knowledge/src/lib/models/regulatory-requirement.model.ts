import {
  ApplicabilityOperator,
  ProviderDomain,
  RequirementFrequency,
  RequirementSeverity,
  RegulatoryStatus,
} from '../enums/regulatory.enums';

export interface ApplicabilityCondition {
  field: string;
  operator: ApplicabilityOperator;
  value?: unknown;
}

export interface RegulatoryRequirement {
  id: string;
  ruleId: string;

  code: string;
  title: string;
  description: string;
  intent?: string;

  domains: ProviderDomain[];
  providerTypes?: string[];
  serviceTypes?: string[];

  severity: RequirementSeverity;
  frequency: RequirementFrequency;
  customFrequencyDays?: number;

  status: RegulatoryStatus;

  applicability?: ApplicabilityCondition[];

  responsibleRoles?: string[];
  tags?: string[];

  effectiveDate?: string;
  expirationDate?: string;

  createdAt?: string;
  updatedAt?: string;
}