
# Regulatory Intelligence Platform — Architecture Documentation

**Documentation owner:** Platform Engineering  
**Baseline date:** 2026-10-30  
**Current development branch:** develop  
**Architecture status:** Design in progress  
**Master roadmap:** Version 2.0 — Proposed baseline  
**Roadmap scope:** Sprint 0 through Sprint 47

---

## 1. Purpose

This directory contains the authoritative architecture documentation for the Regulatory Intelligence Platform.

The platform is designed to support regulatory, financial, and operational intelligence across multiple jurisdictions, industries, programs, and organizations.

It records:

- The architecture currently implemented in the repository.
- Approved architectural principles and decisions.
- The intended target architecture.
- Domain ownership and integration boundaries.
- Regulatory and financial knowledge authorities.
- Security, evidence, validation, audit, and reporting workflows.
- Known gaps and the implementation roadmap.

## 2. Documentation Governance

The repository implementation is the authority for describing current system behavior.

Architecture decisions define approved direction. Proposed capabilities must never be represented as implemented functionality.

Every architecture document must distinguish:

| Status | Meaning |
|---|---|
| Implemented | Verified in repository implementation |
| Partially implemented | Some components exist; complete behavior is not verified |
| Proposed | Design direction, not yet implemented |
| Historical | Records an earlier design or development stage |
| Needs verification | Insufficient implementation evidence |

Major architectural changes must be accompanied by documentation updates and, where appropriate, an Architecture Decision Record (ADR).

Design approval and implementation approval are separate decisions.

**Design approval does not authorize implementation.**

## 3. Core Platform Architecture

The platform has two independent knowledge authorities, shared intelligence capabilities, and separate applied intelligence capabilities.

### 3.1 Regulatory Knowledge Engine

Owns:

- Regulatory jurisdictions and authorities.
- Regulatory sources and source versions.
- Provisions and citations.
- Regulatory obligations.
- Applicability conditions and exceptions.
- Regulatory interpretations.
- Regulatory validation definitions.
- Regulatory knowledge packs.
- Knowledge approval, publication, versioning, and retirement.

Its responsibility is to establish what requirements apply and what organizations are obligated to do.

### 3.2 Financial Knowledge Engine

Owns:

- Financial authorities and sources.
- Financial source versions.
- Financial concepts and classifications.
- Cost categories and cost principles.
- Allowability rules.
- Allocation methodologies and definitions.
- Reimbursement methodologies and rate definitions.
- Financial formulas and calculation definitions.
- Reporting definitions, schedules, and lines.
- Statistical definitions.
- Financial validation rules.
- Financial knowledge packs.
- Knowledge approval, publication, versioning, and retirement.

Its responsibility is to establish how financial information must be classified, evaluated, calculated, allocated, and reported.

### 3.3 Applied Intelligence Capabilities

The knowledge authorities are applied through separate business intelligence capabilities, including:

- Financial Intelligence.
- Compliance Intelligence.
- Financial Reporting.
- Compliance Evaluation and Workflow.
- Financial Binder.
- Survey Binder and Survey Workspace.

Financial Intelligence applies financial knowledge to organizational financial records.

Compliance Intelligence applies regulatory knowledge to organizational operations, obligations, evidence, and compliance workflows.

### 3.4 Shared Platform Capabilities

Both knowledge authorities and their applied capabilities may use shared services:

- Evidence.
- Validation execution.
- Audit and traceability.
- Document management.
- Identity and authorization.
- Version management infrastructure.
- Approval workflows.
- Reporting infrastructure.

Shared infrastructure does not transfer knowledge ownership between the two knowledge authorities.

## 4. Foundational Architectural Principles

1. Regulatory knowledge must be represented in the Regulatory Knowledge Engine before a regulatory feature is implemented.
2. Financial knowledge must be represented in the Financial Knowledge Engine before a financial rule or methodology is implemented.
3. Regulatory knowledge and provider operational data have separate ownership.
4. Financial knowledge and provider financial transactions have separate ownership.
5. Regulatory and financial architecture must support multiple jurisdictions, authorities, programs, and reporting periods.
6. Compliance and financial decisions must be traceable to their sources, inputs, evidence, definitions, and execution history.
7. Missing evidence must not automatically be interpreted as a regulatory violation or financial conclusion.
8. Security, least privilege, tenant isolation, and auditability are foundational.
9. Published knowledge releases must preserve historical versions.
10. Historical evaluations and financial reports must remain explainable and reproducible.
11. AI may assist analysis and propose changes, but authorized human approval is required for substantive knowledge publication, financial decisions, and report certification.
12. New development must preserve domain ownership and avoid duplicate models.

## 5. Architecture Documents

| Document | Purpose | Status |
|---|---|---|
| [Current Architecture Baseline](01-current-architecture-baseline.md) | Verified repository architecture and known limitations | Initial baseline |
| [Security and Tenant Isolation](02-security-and-tenant-isolation.md) | Security architecture and tenant boundaries | Design baseline |
| [Master Sprint Roadmap](03-master-sprint-roadmap.md) | Platform development sequence and sprint governance | Version 2.0 — Proposed baseline |
| [Sprint 0 Architecture Baseline](sprint-0-architecture-baseline.md) | Historical entity purpose and original domain intent | Historical |
| [Compliance Engine](compliance-engine.md) | Compliance evaluation and result workflow | Existing design |
| [Dashboard Architecture](dashboard-architecture.md) | Dashboard architecture | Existing; verify against implementation |
| [Authentication Architecture](auth-architecture.md) | Authentication architecture | Needs documentation review |
| [Roles and Permissions](roles-and-permissions.md) | Role and permission model | Existing design |
| [Permission Matrix](permission-matrix.md) | Proposed role permission bundles | Existing design |
| [Audit Logging](audit-logging-architecture.md) | Audit architecture | Existing; verify implementation |
| [HIPAA Architecture](hipaa-compliance-architecture.md) | HIPAA security design | Existing; verify implementation |
| [Data Retention](data-retention-policy.md) | Data retention policy | Existing policy |
| [Security Incident Response](security-incident-response.md) | Incident response | Existing policy |
| [TAC Rule Library](tac-rule-library.md) | Earlier TAC-specific regulatory design | Historical; reconcile with Knowledge Engine |

## 6. Architecture Decision Records

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](decisions/ADR-001-knowledge-authorities.md) | Independent Regulatory and Financial Knowledge Authorities | Accepted Architectural Direction |
| [ADR-002](decisions/ADR-002-first-vertical-slice.md) | Texas HHSC HCS Cost Reporting as First Vertical Slice | Accepted Architectural Direction |
| [ADR-003](decisions/ADR-003-financial-binder.md) | Financial Binder as a First-Class Platform Capability | Accepted Architectural Direction |
| [ADR-004](decisions/ADR-004-design-and-implementation-approval.md) | Separate Design and Implementation Approval | Accepted Architectural Direction |

These records establish architectural direction. They do not independently authorize implementation.

## 7. First Vertical Slice

The first complete platform vertical slice is:

**Texas HHSC HCS Cost Reporting**

It will demonstrate the complete relationship between:

- Official financial sources.
- Financial Knowledge Engine.
- HCS financial knowledge pack.
- Provider financial data.
- Cost classification and allowability.
- Cost allocation.
- Financial calculations.
- Reconciliation and validation.
- Evidence and supporting documentation.
- Financial Binder.
- Human review and approval.
- Exportable report preparation.

The initial scope is preparation and validation of cost-report information. Electronic submission requires a separately verified and approved submission approach.

Emergency Preparedness remains a planned regulatory compliance vertical slice following the initial financial vertical slice.

## 8. Master Sprint Roadmap

The complete project development roadmap is maintained in:

[Master Sprint Roadmap](./03-master-sprint-roadmap.md)

**Current roadmap baseline:** Version 2.0 — Sprints 0–47.

The planned sequence is:

| Phase | Sprint Range | Focus |
|---|---:|---|
| Phase 0 | 0–7 | Existing Platform Foundation |
| Phase I | 8–12 | Regulatory Knowledge Engine |
| Phase II | 13–17 | Shared Supporting Intelligence |
| Phase III | 18–20 | Compliance Evaluation and Workflow |
| Phase IV | 21–28 | Financial Knowledge Engine and HCS Cost Reporting |
| Phase V | 29–34 | Survey Workspace |
| Phase VI | 35–37 | Texas HCS Emergency Preparedness |
| Phase VII | 38–41 | Platform Expansion |
| Phase VIII | 42–47 | Enterprise and Production Readiness |

Every sprint requires a documented design package and design approval before implementation approval.

Sprint completion statuses must be verified against repository implementation and acceptance criteria.

The roadmap is the planning baseline, not evidence that a capability has been implemented.

## 9. Related Documentation

- `docs/domain-model/` — domain entity inventory and purpose maps.
- `docs/roadmap/` — historical sprint plans and completion reports.
- `docs/architecture/` — system architecture, security, and decisions.
- `docs/vertical-slices/` — detailed end-to-end implementation designs.

## 10. Baseline Maintenance

Update this documentation when:

- A major domain or application boundary changes.
- A knowledge authority or intelligence capability is introduced.
- A new security or authorization capability is implemented.
- A significant data model or integration decision is approved.
- A major workflow changes.
- An architecture decision is superseded.

The current architecture baseline must be revised from repository evidence, not assumptions.

The master roadmap and architecture documentation must remain aligned.

---

**Governing principle**

> One platform. Two independent knowledge authorities. Shared intelligence. Traceable operational outcomes.

This documentation establishes the proposed architecture and governance direction. It does not authorize implementation.
