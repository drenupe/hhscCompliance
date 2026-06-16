# Roles and Permissions Architecture

## Purpose

This document explains how roles and permissions work together in the HHSC Compliance Platform.

The platform uses a permission-based authorization model.

Roles are collections of permissions.

Users may also receive direct allow or deny permissions.

---

# Authorization Flow

User
    ↓
Roles
    ↓
Role Permissions
    ↓
Direct User Permissions
    ↓
Effective Permissions
    ↓
Access Decision

---

# Authorization Rules

## Rule 1

Direct DENY overrides everything.

## Rule 2

Direct ALLOW grants access unless denied.

## Rule 3

Role permissions grant access if active.

## Rule 4

If no permission is found, access is denied.

---

# Entities

## RoleEntity

Represents a named role.

Examples:

- SUPER_ADMIN
- PROVIDER_ADMIN
- RN
- DIRECT_CARE_STAFF
- HOST_HOME_PROVIDER
- FOSTER_CARE_PROVIDER
- SURVEYOR

## PermissionEntity

Represents a specific action the system can authorize.

Examples:

- CONSUMER_VIEW
- MEDICAID_EDIT
- COMPLIANCE_RUN
- REPORT_EXPORT

## RolePermissionEntity

Connects roles to permissions.

## UserPermissionEntity

Allows user-specific overrides.

Examples:

- Temporarily allow REPORT_EXPORT
- Explicitly deny MEDICAID_EDIT
- Deny AUDIT_VIEW for a specific user

---

# Role Definitions

## SUPER_ADMIN

Full system access.

Can manage platform configuration, security, users, roles, permissions, compliance rules, and reports.

---

## PROVIDER_ADMIN

Provider-level administrator.

Can manage provider operations, residential locations, consumers, staff assignments, compliance findings, dashboards, and reports.

---

## PROGRAM_MANAGER

Oversees programmatic and residential compliance.

Can view and manage operational records, review findings, and resolve compliance issues.

---

## RN

Responsible for clinical oversight.

Typical responsibilities:

- Nursing assessments
- RN delegation
- Medication oversight
- Diagnosis review
- Clinical documentation

---

## LVN

Provides nursing support under RN oversight.

Typical responsibilities:

- Medication documentation
- Nursing notes
- Clinical follow-up
- Delegation-related documentation

---

## CASE_MANAGER

Coordinates consumer services.

Typical responsibilities:

- Medicaid tracking
- IPC-related workflows
- Guardian documentation
- Legal status documentation
- Care team coordination

---

## ISS_MANAGER

Oversees ISS services.

Typical responsibilities:

- ISS documentation review
- Staff log review
- Consumer activity oversight
- ISS compliance review

---

## ISS_STAFF

Documents ISS services.

Typical responsibilities:

- ISS daily service logs
- Community participation notes
- Activity documentation

---

## DIRECT_CARE_STAFF

Provides direct support services and daily documentation.

Typical responsibilities:

- Daily notes
- Consumer support
- Community activities
- Medication observation
- Residential support
- ISS support when applicable

Direct care staff should not manage Medicaid, legal status, security, audit records, or compliance overrides.

---

## HOST_HOME_PROVIDER

Provides residential support in a Host Home environment.

Additional responsibilities:

- Home environment monitoring
- Emergency preparedness
- Fire drill participation
- Residential documentation
- Health and safety monitoring
- Incident documentation

Host Home Provider access should be broader than Direct Care Staff for residential documentation, but still restricted from security, audit, and compliance override authority.

---

## FOSTER_CARE_PROVIDER

Provides care and supervision in foster care settings.

Additional responsibilities:

- Foster home documentation
- Child-specific planning
- Emergency preparedness
- Behavior support monitoring
- Health and safety oversight
- Incident documentation

Foster Care Provider access should be separated from Direct Care Staff and Host Home Provider so the platform can support future foster-care-specific workflows.

---

## SURVEYOR

External or internal reviewer with read-only access.

Surveyor users may view records needed for survey review but must not create, edit, delete, resolve, override, or administer records.

---

## READ_ONLY

Internal read-only role.

Used for staff or leadership who need visibility but no editing authority.

---

# Recommended Role Hierarchy

SUPER_ADMIN

PROVIDER_ADMIN

PROGRAM_MANAGER

RN

LVN

CASE_MANAGER

ISS_MANAGER

ISS_STAFF

DIRECT_CARE_STAFF

HOST_HOME_PROVIDER

FOSTER_CARE_PROVIDER

SURVEYOR

READ_ONLY

---

# Permission Bundle Strategy

Permission bundles should be assigned by role.

Users should not normally receive large numbers of direct permissions.

Direct user permissions should be used only for exceptions.

---

# Direct Permission Rules

## Direct ALLOW

Use when a user temporarily needs access outside their role.

Example:

A program manager temporarily receives REPORT_EXPORT.

## Direct DENY

Use when a user must be blocked from a permission normally granted by role.

Example:

A user has PROVIDER_ADMIN but is denied SECURITY_MANAGE.

Direct DENY always wins.

---

# Surveyor Access Rule

Surveyor users are reviewers.

They may view records needed for HHSC survey review but must not:

- Create records
- Edit records
- Delete records
- Resolve findings
- Override compliance results
- Manage security
- Manage users
- Modify permissions

---

# HIPAA Security Rule Alignment

The authorization model supports:

- Unique user access
- Role-based access
- Minimum necessary access
- Auditability
- Access review
- Permission revocation
- Secure survey access

All access to PHI must be traceable to an authenticated user.