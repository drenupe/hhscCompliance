# Permission Matrix

## Purpose

The Permission Matrix defines who can access, create, edit, delete, export, print, resolve, or administer data inside the HHSC Compliance Platform.

This supports:

- HIPAA minimum necessary access
- HHSC survey readiness
- Role-based security
- Audit logging
- Surveyor read-only access
- Least privilege access

---

# Core Roles

## SUPER_ADMIN

Full platform administrator.

## PROVIDER_ADMIN

Provider-level administrator.

## PROGRAM_MANAGER

Oversees residential, programmatic, and operational compliance.

## RN

Responsible for nursing oversight, delegation, medication review, and clinical documentation.

## LVN

Supports nursing documentation and medication-related workflows under RN oversight.

## CASE_MANAGER

Supports Medicaid, IPC, care coordination, and consumer documentation.

## ISS_MANAGER

Oversees ISS program documentation and staff logs.

## ISS_STAFF

Creates and views ISS service documentation.

## DIRECT_CARE_STAFF

Provides direct support services to consumers in residential and community settings.

## HOST_HOME_PROVIDER

Provides residential services in a Host Home setting.

## FOSTER_CARE_PROVIDER

Provides care and supervision in a foster care setting.

## SURVEYOR

Read-only access for HHSC survey review.

## READ_ONLY

Internal read-only access with no edit permissions.

---

# Permission Naming Convention

Permissions follow this pattern:

MODULE_ACTION

Examples:

CONSUMER_VIEW  
CONSUMER_EDIT  
MEDICAID_VIEW  
MEDICAID_EDIT  
COMPLIANCE_VIEW  
COMPLIANCE_RUN  

---

# Core Permissions

## Consumer

CONSUMER_VIEW  
CONSUMER_CREATE  
CONSUMER_EDIT  
CONSUMER_DELETE  

## Diagnosis

DIAGNOSIS_VIEW  
DIAGNOSIS_CREATE  
DIAGNOSIS_EDIT  
DIAGNOSIS_DELETE  

## Guardian

GUARDIAN_VIEW  
GUARDIAN_CREATE  
GUARDIAN_EDIT  
GUARDIAN_DELETE  

## Legal Status

LEGAL_STATUS_VIEW  
LEGAL_STATUS_CREATE  
LEGAL_STATUS_EDIT  
LEGAL_STATUS_DELETE  

## Medicaid Benefits

MEDICAID_VIEW  
MEDICAID_CREATE  
MEDICAID_EDIT  
MEDICAID_DELETE  

## Residential

RESIDENTIAL_VIEW  
RESIDENTIAL_CREATE  
RESIDENTIAL_EDIT  
RESIDENTIAL_DELETE  

## Care Team

CARE_TEAM_VIEW  
CARE_TEAM_CREATE  
CARE_TEAM_EDIT  
CARE_TEAM_DELETE  

## Daily Notes

DAILY_NOTE_VIEW  
DAILY_NOTE_CREATE  
DAILY_NOTE_EDIT  
DAILY_NOTE_DELETE  

## ISS

ISS_LOG_VIEW  
ISS_LOG_CREATE  
ISS_LOG_EDIT  
ISS_LOG_DELETE  

## Medication

MEDICATION_VIEW  
MEDICATION_CREATE  
MEDICATION_EDIT  
MEDICATION_DELETE  
MEDICATION_ADMIN_OBSERVE  

## Nursing

NURSING_VIEW  
NURSING_CREATE  
NURSING_EDIT  
NURSING_DELETE  
RN_DELEGATION_VIEW  
RN_DELEGATION_CREATE  
RN_DELEGATION_EDIT  

## Host Home

HOST_HOME_VIEW  
HOST_HOME_DOCUMENTATION  
HOST_HOME_EDIT  

## Foster Care

FOSTER_HOME_VIEW  
FOSTER_HOME_DOCUMENTATION  
FOSTER_HOME_EDIT  

## Emergency Preparedness

EMERGENCY_PLAN_VIEW  
EMERGENCY_PLAN_CREATE  
EMERGENCY_PLAN_EDIT  

## Fire Drills

FIRE_DRILL_VIEW  
FIRE_DRILL_CREATE  
FIRE_DRILL_EDIT  

## Home Environment

HOME_ENVIRONMENT_VIEW  
HOME_ENVIRONMENT_CREATE  
HOME_ENVIRONMENT_EDIT  

## Incidents

INCIDENT_VIEW  
INCIDENT_CREATE  
INCIDENT_EDIT  
INCIDENT_REVIEW  

## Behavior Support

BEHAVIOR_SUPPORT_VIEW  
BEHAVIOR_SUPPORT_CREATE  
BEHAVIOR_SUPPORT_EDIT  

## Compliance

COMPLIANCE_VIEW  
COMPLIANCE_RUN  
COMPLIANCE_RESOLVE  
COMPLIANCE_OVERRIDE  

## Dashboard

DASHBOARD_VIEW  

## Reports

REPORT_VIEW  
REPORT_EXPORT  
REPORT_PRINT  

## Audit

AUDIT_VIEW  

## Security

SECURITY_VIEW  
SECURITY_MANAGE  

## MFA

MFA_VIEW  
MFA_MANAGE  

---

# Role Permission Bundles

## SUPER_ADMIN

Has all permissions.

---

## PROVIDER_ADMIN

Recommended permissions:

CONSUMER_VIEW  
CONSUMER_CREATE  
CONSUMER_EDIT  

DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  

RESIDENTIAL_VIEW  
RESIDENTIAL_CREATE  
RESIDENTIAL_EDIT  

CARE_TEAM_VIEW  
CARE_TEAM_CREATE  
CARE_TEAM_EDIT  

COMPLIANCE_VIEW  
COMPLIANCE_RUN  
COMPLIANCE_RESOLVE  

DASHBOARD_VIEW  

REPORT_VIEW  
REPORT_EXPORT  
REPORT_PRINT  

AUDIT_VIEW  

SECURITY_VIEW  
SECURITY_MANAGE  

---

## PROGRAM_MANAGER

Recommended permissions:

CONSUMER_VIEW  
CONSUMER_EDIT  

DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  

RESIDENTIAL_VIEW  
RESIDENTIAL_EDIT  

CARE_TEAM_VIEW  
CARE_TEAM_EDIT  

DAILY_NOTE_VIEW  
ISS_LOG_VIEW  

COMPLIANCE_VIEW  
COMPLIANCE_RUN  
COMPLIANCE_RESOLVE  

DASHBOARD_VIEW  

REPORT_VIEW  
REPORT_EXPORT  
REPORT_PRINT  

---

## RN

Recommended permissions:

CONSUMER_VIEW  

DIAGNOSIS_VIEW  
DIAGNOSIS_CREATE  
DIAGNOSIS_EDIT  

MEDICATION_VIEW  
MEDICATION_CREATE  
MEDICATION_EDIT  

NURSING_VIEW  
NURSING_CREATE  
NURSING_EDIT  

RN_DELEGATION_VIEW  
RN_DELEGATION_CREATE  
RN_DELEGATION_EDIT  

CARE_TEAM_VIEW  

COMPLIANCE_VIEW  
DASHBOARD_VIEW  

REPORT_VIEW  

---

## LVN

Recommended permissions:

CONSUMER_VIEW  

DIAGNOSIS_VIEW  

MEDICATION_VIEW  
MEDICATION_CREATE  
MEDICATION_EDIT  

NURSING_VIEW  
NURSING_CREATE  

RN_DELEGATION_VIEW  

CARE_TEAM_VIEW  

DASHBOARD_VIEW  

---

## CASE_MANAGER

Recommended permissions:

CONSUMER_VIEW  
CONSUMER_EDIT  

DIAGNOSIS_VIEW  

GUARDIAN_VIEW  
GUARDIAN_CREATE  
GUARDIAN_EDIT  

LEGAL_STATUS_VIEW  
LEGAL_STATUS_CREATE  
LEGAL_STATUS_EDIT  

MEDICAID_VIEW  
MEDICAID_CREATE  
MEDICAID_EDIT  

CARE_TEAM_VIEW  
CARE_TEAM_CREATE  
CARE_TEAM_EDIT  

RESIDENTIAL_VIEW  

COMPLIANCE_VIEW  
DASHBOARD_VIEW  

REPORT_VIEW  

---

## ISS_MANAGER

Recommended permissions:

CONSUMER_VIEW  
DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  

ISS_LOG_VIEW  
ISS_LOG_CREATE  
ISS_LOG_EDIT  

DAILY_NOTE_VIEW  

CARE_TEAM_VIEW  

COMPLIANCE_VIEW  
DASHBOARD_VIEW  

REPORT_VIEW  

---

## ISS_STAFF

Recommended permissions:

CONSUMER_VIEW  
DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  

ISS_LOG_VIEW  
ISS_LOG_CREATE  

DAILY_NOTE_VIEW  
DAILY_NOTE_CREATE  

CARE_TEAM_VIEW  

DASHBOARD_VIEW  

Restrictions:

No delete permissions  
No Medicaid edit permissions  
No legal status edit permissions  
No security access  
No audit access  
No compliance override  

---

## DIRECT_CARE_STAFF

Recommended permissions:

CONSUMER_VIEW  
DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  

RESIDENTIAL_VIEW  
CARE_TEAM_VIEW  

DAILY_NOTE_VIEW  
DAILY_NOTE_CREATE  

ISS_LOG_VIEW  
ISS_LOG_CREATE  

MEDICATION_VIEW  
MEDICATION_ADMIN_OBSERVE  

DASHBOARD_VIEW  

Restrictions:

No consumer edit permissions  
No Medicaid edit permissions  
No legal status edit permissions  
No security access  
No audit access  
No report exports  
No compliance overrides  
No delete permissions  

---

## HOST_HOME_PROVIDER

Recommended permissions:

All DIRECT_CARE_STAFF permissions

PLUS:

HOST_HOME_VIEW  
HOST_HOME_DOCUMENTATION  

EMERGENCY_PLAN_VIEW  

FIRE_DRILL_VIEW  

HOME_ENVIRONMENT_VIEW  
HOME_ENVIRONMENT_CREATE  

INCIDENT_VIEW  
INCIDENT_CREATE  

Restrictions:

No security access  
No audit access  
No compliance overrides  
No user management  
No delete permissions  

---

## FOSTER_CARE_PROVIDER

Recommended permissions:

All DIRECT_CARE_STAFF permissions

PLUS:

FOSTER_HOME_VIEW  
FOSTER_HOME_DOCUMENTATION  

EMERGENCY_PLAN_VIEW  

HOME_ENVIRONMENT_VIEW  
HOME_ENVIRONMENT_CREATE  

INCIDENT_VIEW  
INCIDENT_CREATE  

BEHAVIOR_SUPPORT_VIEW  

Restrictions:

No security access  
No audit access  
No compliance overrides  
No user management  
No delete permissions  

---

## SURVEYOR

Recommended permissions:

CONSUMER_VIEW  
DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  
RESIDENTIAL_VIEW  
CARE_TEAM_VIEW  
COMPLIANCE_VIEW  
DASHBOARD_VIEW  
REPORT_VIEW  

Restrictions:

No create permissions  
No edit permissions  
No delete permissions  
No security management  
No compliance override  
No remediation authority  

---

## READ_ONLY

Recommended permissions:

CONSUMER_VIEW  
DIAGNOSIS_VIEW  
GUARDIAN_VIEW  
LEGAL_STATUS_VIEW  
MEDICAID_VIEW  
RESIDENTIAL_VIEW  
CARE_TEAM_VIEW  
DASHBOARD_VIEW  

Restrictions:

No report export  
No report print  
No audit view  
No security management  
No edit permissions  
No delete permissions  

---

# HIPAA Principle

Access must follow the Minimum Necessary Standard.

Users should only access the information required to perform their job duties.

All access to PHI should be authenticated, authorized, and audit logged.