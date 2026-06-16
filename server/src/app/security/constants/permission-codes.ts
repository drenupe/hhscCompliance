export const PermissionCodes = {
  DASHBOARD_VIEW: 'dashboard:view',

  CONSUMER_VIEW: 'consumer:view',
  CONSUMER_UPDATE: 'consumer:update',

  MEDICAID_VIEW: 'medicaid:view',
  MEDICAID_UPDATE: 'medicaid:update',

  DIAGNOSIS_VIEW: 'diagnosis:view',
  DIAGNOSIS_UPDATE: 'diagnosis:update',

  RESIDENTIAL_VIEW: 'residential:view',
  RESIDENTIAL_UPDATE: 'residential:update',

  ISS_VIEW: 'iss:view',
  ISS_UPDATE: 'iss:update',

  AUDIT_LOG_VIEW: 'audit-log:view',

  SURVEY_BINDER_VIEW: 'survey-binder:view',
  SURVEY_BINDER_PRINT: 'survey-binder:print',

  REPORT_EXPORT: 'report:export',

  SECURITY_ROLE_MANAGE: 'security:role:manage',
  SECURITY_PERMISSION_MANAGE: 'security:permission:manage',
} as const;

export type PermissionCode =
  (typeof PermissionCodes)[keyof typeof PermissionCodes];