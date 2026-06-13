# HIPAA Compliance Architecture

## Purpose

Ensure the HHSC Compliance Platform protects PHI (Protected Health Information) and supports HIPAA Security Rule requirements.

---

# Protected Data

Examples:

- Consumer Names
- Medicaid Numbers
- Diagnoses
- Medication Information
- Nursing Notes
- Guardian Information
- Clinical Documentation
- Care Team Information

---

# Administrative Safeguards

## Role Based Access

Users only access information required for their job duties.

Examples:

RN
    Medication
    Nursing

Case Manager
    Consumer Services

Surveyor
    Read Only

---

## Workforce Accountability

Every action must be attributable to a specific authenticated user.

Examples:

Create

Update

Delete

Export

Print

---

# Technical Safeguards

## Authentication

Current

- JWT Access Tokens
- Refresh Rotation
- Session Management

Future

- MFA
- Backup Codes

---

## Authorization

Role
      ↓
Permission
      ↓
Resource Access

Examples

CONSUMER_VIEW

CONSUMER_EDIT

MEDICATION_VIEW

MEDICATION_EDIT

---

## Audit Logging

All PHI access should be auditable.

Track:

User

Timestamp

Action

Resource

Before Value

After Value

Examples

Viewed Consumer

Updated Diagnosis

Printed Survey Binder

Downloaded Report

---

## Encryption

### In Transit

TLS Required

HTTPS Only

### At Rest

Encrypted Database Storage

Encrypted Backups

Encrypted File Storage

---

## Session Security

Automatic Expiration

Refresh Rotation

Reuse Detection

Account Lockout

---

# Minimum Necessary Standard

Users should only see information necessary to perform assigned duties.

Examples

RN
    Diagnosis
    Medication
    Nursing

Surveyor
    Read Only

ISS Staff
    Service Documentation Only

---

# Break Glass Access

Future Feature

Emergency access to PHI.

Requirements

Reason Required

Audit Logged

Administrative Review

---

# Data Retention

Track retention requirements for:

Consumer Records

Nursing Records

Medication Records

Survey Evidence

Audit Logs

---

# Future HIPAA Modules

Audit Log Dashboard

Security Incident Tracking

Access Review Reports

Break Glass Monitoring

PHI Export Tracking

Document Access Tracking

# Planned HIPAA Entities

## AuditLogEntity

Purpose:

Track all access and modifications to protected health information.

Fields:

id

userId

action

resourceType

resourceId

timestamp

ipAddress

beforeValue

afterValue

metadata

Examples:

Viewed Consumer

Updated Diagnosis

Updated Guardian

Viewed Medicaid Benefits

Exported Survey Binder

Downloaded Report