export type RegulatorySourceType =
  | 'LAW'
  | 'RULE'
  | 'GUIDANCE'
  | 'FORM_INSTRUCTION'
  | 'AUDIT_STANDARD'
  | 'POLICY_MANUAL'
  | 'SME_GUIDANCE'
  | 'BEST_PRACTICE';

export type RegulatoryStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'RETIRED';

export type RequirementSeverity =
  | 'INFORMATIONAL'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export type RequirementFrequency =
  | 'ONCE'
  | 'ONGOING'
  | 'PER_EVENT'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'ANNUAL'
  | 'BIENNIAL'
  | 'CUSTOM';

export type EvidenceType =
  | 'DOCUMENT'
  | 'FORM'
  | 'PHOTO'
  | 'SIGNATURE'
  | 'TRAINING_RECORD'
  | 'INSPECTION'
  | 'OBSERVATION'
  | 'CALCULATION'
  | 'SYSTEM_RECORD'
  | 'MEETING_MINUTES'
  | 'POLICY'
  | 'PROCEDURE'
  | 'LOG'
  | 'OTHER';

export type QuestionInputType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'DATE'
  | 'DATETIME'
  | 'BOOLEAN'
  | 'SINGLE_SELECT'
  | 'MULTI_SELECT'
  | 'EMAIL'
  | 'PHONE'
  | 'ADDRESS'
  | 'FILE'
  | 'SIGNATURE';

export type ValidationRuleType =
  | 'REQUIRED'
  | 'MIN_LENGTH'
  | 'MAX_LENGTH'
  | 'MIN_VALUE'
  | 'MAX_VALUE'
  | 'PATTERN'
  | 'DATE_BEFORE'
  | 'DATE_AFTER'
  | 'DATE_RANGE'
  | 'RELATIONSHIP'
  | 'UNIQUE'
  | 'CUSTOM';

export type DocumentOutputFormat = 'PDF' | 'DOCX' | 'HTML';

export type RenewalUnit = 'DAYS' | 'MONTHS' | 'YEARS';

export type ApplicabilityOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'IN'
  | 'NOT_IN'
  | 'EXISTS'
  | 'NOT_EXISTS'
  | 'GREATER_THAN'
  | 'LESS_THAN';

export type ProviderDomain =
  | 'RESIDENTIAL'
  | 'ISS'
  | 'BEHAVIOR_SUPPORT'
  | 'CLINICAL'
  | 'NURSING'
  | 'HUMAN_RESOURCES'
  | 'FINANCE'
  | 'ADMINISTRATION'
  | 'QUALITY'
  | 'GENERAL';