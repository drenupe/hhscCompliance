export type HomeEnvironmentStatus =
  | 'NOT_STARTED'
  | 'COMPLIANT'
  | 'WARNING'
  | 'NONCOMPLIANT';

export type HomeEnvironmentSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type HomeEnvironmentEvidenceType =
  | 'NOTE'
  | 'PHOTO'
  | 'DOCUMENT'
  | 'CHECKLIST'
  | 'INSPECTION_LOG';

export type HomeEnvironmentCategory =
  | 'CONDITION'
  | 'HAZARDS'
  | 'FURNISHINGS'
  | 'SANITATION'
  | 'SAFETY';

export type HomeEnvironmentRuleCode =
  | '565.23(b)(1)'
  | '565.23(b)(2)'
  | '565.23(b)(3)'
  | '565.23(b)(4)'
  | '565.23(b)(5)'
  | '565.23(b)(6)'
  | '565.23(b)(7)'
  | '565.23(b)(8)'
  | '565.23(b)(9)'
  | '565.23(b)(10)'
  | '565.23(b)(11)'
  | '565.23(b)(12)'
  | '565.23(b)(13)'
  | '565.23(b)(14)'
  | '565.23(b)(15)'
  | '565.23(b)(16)'
  | '565.23(b)(17)'
  | '565.23(b)(18)';

export interface HomeEnvironmentRequirementDefinition {
  ruleCode: HomeEnvironmentRuleCode;
  citation: string;
  title: string;
  description: string;
  category: HomeEnvironmentCategory;
  sortOrder: number;
  defaultSeverity: HomeEnvironmentSeverity;
  evidenceTypes: HomeEnvironmentEvidenceType[];
  active: boolean;
}

export interface HomeEnvironmentRequirementReview {
  id: string;
  locationId: string;
  module: 'RESIDENTIAL';
  subcategory: 'HOME_ENVIRONMENT';
  ruleCode: HomeEnvironmentRuleCode;
  status: HomeEnvironmentStatus;
  severity: HomeEnvironmentSeverity;
  observedOn: string | null;
  reviewerName: string | null;
  notes: string | null;
  findings: string | null;
  correctiveAction: string | null;
  followUpDue: string | null;
  resolvedOn: string | null;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HomeEnvironmentEvidenceRecord {
  id: string;
  locationId: string;
  ruleCode: HomeEnvironmentRuleCode;
  type: HomeEnvironmentEvidenceType;
  title: string;
  note: string | null;
  fileName: string | null;
  fileUrl: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface UpsertHomeEnvironmentReviewInput {
  locationId: string;
  ruleCode: HomeEnvironmentRuleCode;
  status: HomeEnvironmentStatus;
  severity: HomeEnvironmentSeverity;
  observedOn?: string | null;
  reviewerName?: string | null;
  notes?: string | null;
  findings?: string | null;
  correctiveAction?: string | null;
  followUpDue?: string | null;
  resolvedOn?: string | null;
}

export interface CreateHomeEnvironmentEvidenceInput {
  locationId: string;
  ruleCode: HomeEnvironmentRuleCode;
  type: HomeEnvironmentEvidenceType;
  title: string;
  note?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
}

export interface HomeEnvironmentRequirementViewModel {
  definition: HomeEnvironmentRequirementDefinition;
  review: HomeEnvironmentRequirementReview | null;
}

export interface HomeEnvironmentSummary {
  total: number;
  compliant: number;
  warning: number;
  noncompliant: number;
  notStarted: number;
  lastUpdated: string | null;
}