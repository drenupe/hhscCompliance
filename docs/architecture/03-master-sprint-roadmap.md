# Regulatory Intelligence Platform
## Master Sprint Plan — Version 2.0

**Status:** Proposed architectural baseline — design mode  
**First complete vertical slice:** Texas HCS Cost Reporting  
**Subsequent regulatory vertical slice:** Texas HCS Emergency Preparedness  
**Scope:** Existing platform foundation through enterprise production readiness  
**Governance:** Design approval and implementation approval remain separate.

> This roadmap is a planning baseline, not implementation authorization. Existing work must be reconciled against the repository and historical sprint records before status is changed.

---

## 1. Governing architecture

The platform is organized around two independent knowledge authorities, shared intelligence capabilities, and applied operational intelligence.

### 1.1 Regulatory Knowledge Engine

The Regulatory Knowledge Engine is the authoritative source for regulatory requirements.

It governs:

- Jurisdictions and regulatory authorities.
- Regulatory sources and source versions.
- Provisions and citations.
- Regulatory obligations.
- Applicability conditions and exceptions.
- Regulatory interpretations.
- Regulatory knowledge packs.
- Regulatory lifecycle, approval and publication.

No regulatory feature may introduce a regulatory requirement outside this engine.

### 1.2 Financial Knowledge Engine

The Financial Knowledge Engine is the independent authority for financial rules and methodologies.

It governs:

- Financial authorities and sources.
- Financial source versions.
- Financial concepts and classifications.
- Cost categories and allowability rules.
- Allocation methodologies and definitions.
- Reimbursement methodologies and rate definitions.
- Financial formulas and calculations.
- Reporting definitions, schedules and lines.
- Statistical definitions.
- Financial validation rules.
- Financial knowledge packs and lifecycle.

No financial reporting feature may introduce financial treatment, classification, allocation or calculation logic outside this engine.

### 1.3 Shared intelligence capabilities

The following capabilities support both knowledge authorities:

1. Evidence management.
2. Validation execution.
3. Document management and presentation.
4. Audit and traceability.
5. Change and version management.
6. Form and structured-data intelligence.
7. Approval and publication workflows.
8. Reporting and execution infrastructure.

These capabilities must not create competing sources of regulatory or financial truth.

### 1.4 Applied intelligence

**Compliance Intelligence** applies regulatory knowledge to organizational records, evidence and operational activity.

**Financial Intelligence** applies financial knowledge to accounting, payroll, service-delivery and other financial records.

The platform must distinguish management accounting outputs from official regulatory financial reporting values.

### 1.5 Governing principles

- Knowledge is authoritative; databases persist state; services execute logic; interfaces present information.
- Regulatory and financial knowledge remain independent authorities.
- Texas HCS is the first implementation environment, not the universal platform architecture.
- Jurisdiction-specific and program-specific logic must not leak into universal core models.
- AI may assist with extraction, explanation and analysis but cannot independently approve or publish authoritative knowledge.
- Every material result must be traceable to its source data, applicable knowledge version and execution history.
- Existing work and uncommitted changes must be preserved during reconciliation.
- No implementation begins without an approved design and an explicit implementation authorization.

---

## 2. Master sprint register

### Phase 0 — Existing Platform Foundation

**Purpose:** Reconcile and document the existing application foundation. Verify actual implementation status without assuming completion.

| Sprint | Name | Objective |
|---|---|---|
| 0 | Architecture Foundation | Establish Nx, Angular, NestJS, PostgreSQL and foundational domain entities. |
| 1 | Security Foundation | Authentication, users, roles, permissions and authorization. |
| 2 | Compliance Engine Foundation | Initial evaluator, compliance results, dashboard and remediation integration. |
| 3 | Provider Management | Provider profiles, organizational identity and provider records. |
| 4 | People and Service Delivery | People, consumer records, employees, clinical profiles and assignments. |
| 5 | Compliance Workflow Foundation | Findings, notes, evidence, corrective actions, status and rechecks. |
| 5B | Frontend/Backend Workflow Handoff | Provider-wide dashboard and Residential Module Workbench. |
| 6 | Residential Operations | Residential locations, operational records and fire drills. |
| 7 | Platform Integration | Connect business domains, compliance results and user workflows. |

**Phase exit criteria**

- Existing implementation and architecture are inventoried.
- Completed, partial, planned and historical work are distinguished.
- Security, tenant-isolation and integration gaps are recorded.
- Existing work is preserved; no destructive cleanup is performed during reconciliation.

### Phase I — Regulatory Knowledge Engine

**Purpose:** Establish a jurisdiction-neutral source of regulatory truth.

| Sprint | Name | Objective |
|---|---|---|
| 8 | Knowledge Engine Foundation | Knowledge-pack architecture, models, loader and validator. |
| 9 | Universal Regulatory Domain Model | Jurisdictions, authorities, sources, provisions and obligations. |
| 10 | Applicability Intelligence | Scope, conditions, exceptions, populations and effective periods. |
| 11 | Regulatory Source Intelligence | Provenance, citations, authority, publication and effective dates. |
| 12 | Knowledge Lifecycle Management | Authoring, validation, approval, publication, versioning and retirement. |

**Phase exit criteria**

- Regulatory knowledge can be represented independently of one state or industry.
- Obligations are traceable to authoritative sources and provisions.
- Applicability is represented explicitly.
- Knowledge packs have controlled lifecycle and versioning.
- Invalid or incomplete knowledge cannot be published.

### Phase II — Shared Supporting Intelligence

| Sprint | Name | Objective |
|---|---|---|
| 13 | Evidence Engine | Evidence definitions, collection, storage, provenance, sufficiency and expiration. |
| 14 | Validation Engine | Data, evidence, date, frequency, conditional and cross-record validation. |
| 15 | Form Intelligence | Form definitions, versions, fields, mappings, validation and generation. |
| 16 | Change Intelligence | Amendments, source comparison, impact analysis and version transitions. |
| 17 | Intelligence Integration | Integration contracts, identifiers, traceability and version compatibility. |

**Phase exit criteria**

- Supporting engines consume approved knowledge through defined contracts.
- Outputs are structured, version-aware and traceable.
- Shared services can support both regulatory and financial workflows.
- No supporting service becomes an independent authority for regulatory or financial rules.

### Phase III — Compliance Evaluation and Workflow

| Sprint | Name | Objective |
|---|---|---|
| 18 | Compliance Evaluation Architecture | Evaluate obligations, applicability, evidence, validation and compliance status. |
| 19 | Findings and Corrective Actions | Finding classification, ownership, due dates, remediation and supporting evidence. |
| 20 | Reassessment and External Review Contracts | Reassessment, closure, reopening, survey identity, access and presentation contracts. |

**Phase exit criteria**

- An obligation can be evaluated.
- Evaluation can produce a traceable finding.
- A finding can enter corrective action.
- Evidence can be reviewed and revalidated.
- Reassessment can determine whether an issue is resolved, remains open or must be reopened.
- External review contracts support a separate surveyor identity and authorization model.

### Phase IV — Financial Knowledge Engine and First Vertical Slice

**First complete vertical slice: Texas HCS Cost Reporting**

The purpose of this phase is to establish financial knowledge independently and prove that the platform can apply that knowledge to actual provider financial records.

| Sprint | Name | Objective |
|---|---|---|
| 21 | Financial Knowledge Engine Architecture | Define financial authorities, sources, concepts, classifications, methodologies and knowledge-pack lifecycle. |
| 22 | Texas HCS Financial Knowledge Pack | Establish and verify applicable HHSC financial sources, reporting requirements, classifications and reporting definitions. |
| 23 | Financial Data Intake | Design accounting and payroll imports, source mapping, validation, reconciliation and provenance. |
| 24 | Cost Classification and Allowability | Apply versioned financial classifications and allowable/unallowable cost treatment. |
| 25 | Cost Allocation | Design allocation pools, bases, methodologies, formulas, supporting records and approvals. |
| 26 | Financial Calculations and Reconciliation | Implement the approved calculation model, inputs, precision, rounding, reconciliation and traceability design. |
| 27 | Financial Validation and Reporting | Define reporting schedules, lines, statistical definitions, validation and exception handling. |
| 28 | Financial Binder and HCS Cost Reporting | Deliver the end-to-end financial review, evidence, calculation, validation and reporting workflow. |

**Required vertical-slice capabilities**

- Approved Financial Knowledge Engine architecture.
- Verified financial source register.
- Versioned Texas HCS financial knowledge pack.
- Accounting and payroll data intake.
- Source-to-platform mapping and reconciliation.
- Cost classification and allowability.
- Documented cost allocation methodology.
- Traceable financial calculations.
- Financial validation and exception management.
- Reporting schedule and line mapping.
- Financial Binder.
- Review, approval and audit history.
- End-to-end testing.

**Financial Binder requirements**

The Financial Binder must preserve:

- Original source records and imported data.
- Source and financial knowledge versions.
- Account and transaction mappings.
- Cost classifications and allowability decisions.
- Allocation methods, inputs and outputs.
- Calculation inputs and results.
- Validation findings and reconciliations.
- Supporting evidence and documents.
- Reviewer notes and approvals.
- Report versions and audit history.

A reviewer must be able to trace a reported value through its schedule, calculation, allocation, source transaction and supporting evidence.

**Important financial controls**

- A cost category is not a transaction, allocation or reporting line.
- An expense is not automatically an allowable cost.
- Management accounting outputs must remain distinguishable from official HHSC reporting values.
- No allocation methodology or financial formula may be invented or selected merely to produce a favorable result.
- Applicable reporting periods, official instructions and source versions must be verified before rules are approved.
- Electronic submission is outside the initial slice unless a supported and authorized interface is separately verified and approved.

**Phase exit criteria**

Demonstrate a traceable workflow from authoritative financial source through financial knowledge, imported records, classification, allowability, allocation, calculation, validation, review and report generation.

### Phase V — Survey Workspace

**Purpose:** Provide a secure Survey Workspace through which authorized survey personnel can review provider documentation directly.

| Sprint | Name | Objective |
|---|---|---|
| 29 | Survey Workspace Architecture and Experience | Survey lifecycle, provider workflow, surveyor workflow, workspace and scope. |
| 30 | Surveyor Identity and Access | Individual accounts, invitations, MFA, permissions, expiration and revocation. |
| 31 | Document Presentation Engine | Secure viewer, large-file streaming, search, navigation and authorized downloads. |
| 32 | Survey Request Management | Surveyor requests, provider responses, comments and outstanding requests. |
| 33 | Survey Audit and Session Management | Login history, document activity, revocation, session closure and audit preservation. |
| 34 | Survey Readiness Intelligence | Missing documentation, evidence gaps, expiration, coverage and readiness reports. |

**Survey Workspace requirements**

- Individual surveyor identities; no shared credentials.
- Provider-created accounts and individual secure invitations.
- Separate surveyor identity and authorization from provider employee accounts.
- Survey-specific assignments and least-privilege access.
- Provider, location, individual and record-level scope restrictions.
- Multifactor authentication.
- Time-limited access and immediate revocation.
- Secure browser-based document viewing.
- Large-file support through authenticated streaming rather than email attachments.
- Search, navigation and supported file formats.
- Authorized download/export where permitted.
- Surveyor document requests and provider responses.
- Comments, clarification and request status tracking.
- Audit history for login, views, downloads, requests and responses.
- Survey session closure and preservation of history.

**Important access principle:** Platform restrictions must not prevent survey personnel from inspecting or obtaining records they are legally entitled to access. Download controls and presentation policies must accommodate applicable survey authority and lawful access requirements.

**Phase exit criteria**

- Surveyors can authenticate individually.
- Access is limited to the assigned scope.
- Large documentation can be reviewed in the portal.
- Surveyors can request records and providers can respond.
- Activity is auditable.
- Access can expire or be revoked.
- Survey history is preserved.

### Phase VI — Texas HCS Emergency Preparedness

**Purpose:** Deliver the subsequent regulatory vertical slice using the established Regulatory Knowledge Engine and shared intelligence capabilities.

| Sprint | Name | Objective |
|---|---|---|
| 35 | Emergency Preparedness Regulatory Knowledge | Establish authoritative sources, provisions, obligations, applicability, evidence and applicable forms. |
| 36 | Emergency Preparedness Operational Evaluation | Collect operational information, validate evidence, evaluate obligations and generate findings. |
| 37 | Emergency Preparedness Complete Workflow | Deliver provider workflow, corrective actions, reassessment and surveyor review. |

**Required capabilities**

- Regulatory source traceability.
- Validated regulatory knowledge pack.
- Applicability determination.
- Evidence collection and validation.
- Form Intelligence where applicable.
- Compliance evaluation.
- Traceable findings.
- Corrective actions.
- Reassessment.
- Dashboard and workbench integration.
- Survey Workspace integration.
- End-to-end testing.

**Phase exit criteria**

Demonstrate the complete regulatory lifecycle from authoritative source through knowledge, applicability, evidence, validation, evaluation, finding, corrective action and reassessment.

### Phase VII — Platform Expansion

| Sprint | Name | Objective |
|---|---|---|
| 38 | Texas HCS Regulatory Expansion | Add further HCS regulatory knowledge packs and workflows. |
| 39 | Cross-Module Intelligence | Share obligations, evidence, findings, financial records and evaluation across modules. |
| 40 | Multi-Jurisdiction Architecture | Support state, federal, territorial, tribal, county and municipal authorities. |
| 41 | Universal Intelligence Workbench | Reusable workbench across regulatory programs, financial domains and industries. |

**Phase exit criteria**

- Additional regulatory programs can be represented through knowledge packs.
- Financial knowledge can support additional programs and reporting environments.
- Shared platform capabilities are reused rather than duplicated.
- Jurisdiction-specific logic does not leak into universal core components.
- Regulatory and financial authorities remain independent.

### Phase VIII — Enterprise and Production Readiness

| Sprint | Name | Objective |
|---|---|---|
| 42 | Security and Tenant Isolation | Provider memberships, resource authorization and tenant boundaries. |
| 43 | Audit and Data Governance | Audit trails, retention, provenance, privacy and governance. |
| 44 | Reliability and Performance | Scalability, monitoring, recovery, background processing and large-file performance. |
| 45 | Quality Assurance and Regression | Automated tests, knowledge validation, financial regression and survey access testing. |
| 46 | Deployment and Release Management | Environments, migrations, release controls, rollback and monitoring. |
| 47 | Pilot and Production Launch | Pilot providers, acceptance testing, training and production release. |

**Phase exit criteria**

- Security and tenant isolation are verified.
- Auditability and data governance requirements are met.
- Performance, reliability and recovery are tested.
- Regulatory and financial regression suites pass.
- Deployment and rollback procedures are validated.
- Pilot acceptance criteria are met before production release.

---

## 3. Mandatory sprint design package

Every sprint must have the following documented before implementation begins:

1. Sprint charter: objective, business value and scope.
2. Knowledge requirements: authoritative regulatory or financial sources where applicable.
3. Architecture design: components, boundaries, responsibilities and interactions.
4. Data model: entities, relationships, identifiers and persistence.
5. API and service contracts: inputs, outputs, errors and integration.
6. Software change register: existing files, services, models, migrations and UI affected.
7. UI/UX design: screens, workflows, user roles and interactions.
8. Security assessment: authentication, authorization, privacy and tenant isolation.
9. Dependencies and risks: prerequisites, constraints and unresolved decisions.
10. Acceptance criteria: measurable conditions for completion.
11. Test strategy: unit, integration, end-to-end and regulatory/financial regression tests.
12. Documentation: architecture decisions, implementation notes and updated sprint status.

A sprint is not complete merely because its code has been written.

---

## 4. Vertical Slice Readiness Gates

Each complete vertical slice requires a separate readiness review and approval.

### 4.1 HCS Cost Reporting readiness gate

| Capability | Required design |
|---|---|
| Financial Knowledge Engine | Required |
| Financial authorities and sources | Required |
| Financial concepts and classifications | Required |
| Cost allowability | Required |
| Allocation methodologies | Required |
| Financial calculations | Required |
| Financial validation | Required |
| Reporting schedules and lines | Required |
| Data intake and reconciliation | Required |
| Evidence and document management | Required |
| Financial Binder | Required |
| Approval and audit traceability | Required |
| Software change register | Required |

### 4.2 Emergency Preparedness readiness gate

| Capability | Required design |
|---|---|
| Regulatory Knowledge Engine | Required |
| Sources and provisions | Required |
| Obligations and applicability | Required |
| Evidence Engine | Required |
| Validation Engine | Required |
| Form Intelligence | Required where applicable |
| Change Intelligence | Required |
| Compliance Evaluation | Required |
| Findings and corrective actions | Required |
| Reassessment | Required |
| Survey Workspace integration | Required |
| Dashboard and workbench integration | Required |
| Software change register | Required |

A vertical slice does not need every possible feature in each engine. It must have a sufficiently complete, approved implementation of each required capability to prove the architecture.

---

## 5. Software change governance

For each sprint, identify:

- Existing functionality to retain.
- Existing functionality to modify.
- New functionality to introduce.
- Database entities and migrations affected.
- API and service contracts affected.
- UI and workflow changes.
- Security and permission changes.
- Legacy behavior to preserve or retire.
- Regression risks.
- Knowledge-pack or source-version changes.
- Data migration and reconciliation implications.

No regulatory feature may bypass the Regulatory Knowledge Engine.

No financial feature may bypass the Financial Knowledge Engine.

The software change register is mandatory for every sprint and vertical slice.

---

## 6. Sprint status and approval rules

### Status classifications

- **Completed:** Verified against implementation and acceptance criteria.
- **In progress:** Work has started and is not yet accepted.
- **Design approved:** Design is accepted but implementation has not started.
- **Planned:** Included in the roadmap but not yet designed or approved.
- **Blocked:** A dependency or unresolved decision prevents progress.

### Two separate approvals

**Design approval:** Architecture, scope, dependencies, data model, contracts, software changes and acceptance criteria are agreed upon.

**Implementation approval:** Development is explicitly authorized. The approved design becomes the implementation baseline.

Design approval does not automatically authorize implementation.

---

## 7. Master roadmap completion criteria

The project is complete only when:

1. The Regulatory Knowledge Engine supports multiple jurisdictions and authorities.
2. Regulatory sources, provisions, obligations and applicability are traceable.
3. The Financial Knowledge Engine supports controlled financial knowledge and methodologies.
4. Financial classifications, allowability, allocations and calculations are versioned and traceable.
5. Evidence can be collected, validated and related to regulatory and financial records.
6. Regulatory forms and financial reporting definitions can be represented and validated.
7. Regulatory and financial changes can be identified and their impacts assessed.
8. Compliance evaluations are version-aware and traceable.
9. Findings and corrective actions can be managed through reassessment.
10. Financial reports can be traced to source transactions, allocations, calculations and evidence.
11. Surveyors can securely log in and review authorized records.
12. Large documentation can be presented without dependence on email attachments.
13. Survey requests, responses and activity are auditable.
14. Provider-wide intelligence and workbenches operate across supported domains.
15. Security, tenant isolation, performance and data governance are verified.
16. The platform passes production acceptance testing.

---

## 8. Current project position — provisional

This is a planning snapshot based on prior project discussion, not a fresh repository audit.

| Sprint group | Provisional position |
|---|---|
| 0–2 | Previously reported completed; verify |
| 3–7 and 5B | Existing work and architecture to reconcile |
| 8 | Knowledge Engine work already underway |
| 9–20 | Planned architecture and capability design |
| 21–28 | Financial Knowledge Engine and HCS Cost Reporting; planned |
| 29–34 | Survey Workspace; planned |
| 35–37 | Emergency Preparedness; planned |
| 38–47 | Expansion and production readiness; planned |

The existing working tree and uncommitted work must be preserved during reconciliation.

---

## 9. Immediate design sequence

1. Reconcile existing sprint history and repository work.
2. Approve the target platform architecture and component boundaries.
3. Design the Regulatory Knowledge Engine in detail.
4. Design the Financial Knowledge Engine in detail.
5. Design the shared Evidence, Validation, Form, Change and Document contracts.
6. Design Compliance Intelligence and Financial Intelligence orchestration.
7. Design the HCS Cost Reporting vertical slice and its source register.
8. Design the Financial Binder and Survey Workspace.
9. Design the Emergency Preparedness vertical slice.
10. Complete the required design reviews and readiness gates.
11. Authorize implementation separately for each approved scope.

---

## 10. Governing project principle

> One platform. Two independent knowledge authorities. Shared intelligence. Traceable operational outcomes.

We are not building disconnected forms, dashboards, evaluators, financial calculators, document libraries and survey tools.

We are building a universal Regulatory Intelligence Platform that understands regulatory obligations and financial rules, applies validated knowledge to organizational records, manages operational outcomes and makes documentation accessible to authorized reviewers.

**This Master Sprint Plan is the governing proposed baseline for design decisions from Sprint 0 through Sprint 47. It does not authorize implementation.**
