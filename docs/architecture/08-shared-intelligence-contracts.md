# Regulatory Intelligence Platform
# Document 08 — Shared Intelligence Contracts

**Document Version:** 1.0  
**Status:** Proposed Architecture Baseline  
**Architecture Stage:** Shared Intelligence Services  
**Implementation Authorization:** Not Granted

---

## 1. Purpose

This document defines the shared intelligence contracts used throughout the Regulatory Intelligence Platform.

These contracts establish consistent mechanisms for evidence, validation execution, document management, auditability, versioning, approvals, and reporting.

The shared services support both independent knowledge authorities:

1. Regulatory Knowledge Engine
2. Financial Knowledge Engine

**Architectural rule:** Shared intelligence services execute, preserve, coordinate, and report knowledge-driven operations. They do not create or own regulatory or financial authority.

## 2. Architectural Position

The platform maintains six logical layers:

1. Platform Foundation
2. Business and Operational Domains
3. Independent Knowledge Authorities
4. Shared Intelligence Services
5. Applied Intelligence and Operations
6. Workspaces and User Experience

Shared Intelligence Services form Layer 4.

They provide reusable infrastructure to the applied intelligence capabilities while preserving the ownership boundaries defined in Documents 04–07.

These layers are logical architecture boundaries, not a requirement to deploy separate microservices.

## 3. Core Contract Principles

Every shared intelligence contract must support:

- Explicit ownership and authority attribution.
- Tenant and organization isolation.
- Stable identifiers.
- Versioned definitions and business records.
- Effective-date awareness where applicable.
- Evidence provenance and integrity.
- Traceable execution.
- Scoped authorization.
- Consistent error handling.
- Auditability and historical reconstruction.
- Controlled publication and approval.
- Separation between operational facts and authoritative interpretations.

A shared service must not silently substitute one knowledge authority's definitions for another's.

## 4. Common Intelligence Context

Shared services exchange a consistent conceptual execution context.

### 4.1 Required context dimensions

| Dimension | Purpose |
|---|---|
| Tenant ID | Identifies the customer security boundary |
| Organization ID | Identifies the relevant operating organization |
| Subject reference | Identifies the evaluated person, location, service, transaction, or other record |
| Authority type | Distinguishes regulatory from financial authority |
| Knowledge pack ID/version | Identifies the authoritative knowledge package |
| Definition ID/version | Identifies the rule or methodology being executed |
| Business record references | Identifies source records and relevant versions |
| Evidence references | Links supporting material |
| Evaluation date | Establishes the date for which the determination applies |
| Execution timestamp | Records when the system performed the operation |
| Actor or system identity | Identifies who or what initiated execution |
| Correlation ID | Connects related operations |
| Result ID | Provides a stable reference to the outcome |

Not every service operation requires every dimension. Contracts must specify which fields are mandatory for each operation.

### 4.2 Authority attribution

The authority type must distinguish at least:

- `REGULATORY`
- `FINANCIAL`

The authority type alone is insufficient. An authoritative determination must also reference the relevant knowledge pack and definition versions.

### 4.3 Context immutability

Once a determination is finalized, the execution context necessary to reconstruct it must be preserved.

Subsequent changes to knowledge or business records must not silently rewrite historical conclusions.

## 5. Evidence Service

### 5.1 Responsibility

The Evidence Service manages the registration, association, provenance, integrity, and retrieval of supporting evidence.

### 5.2 Core capabilities

- Register evidence items.
- Associate evidence with operational records.
- Link evidence to regulatory obligations or financial determinations.
- Record collection and submission details.
- Maintain evidence version references.
- Preserve integrity metadata.
- Apply access controls.
- Track evidence lifecycle.
- Support authorized retrieval and secure streaming.
- Record evidence access and disclosure.

### 5.3 Conceptual evidence record

An evidence record should identify:

- Evidence ID.
- Tenant and organization scope.
- Evidence type.
- Source and origin.
- Related business records.
- Document or artifact reference.
- Collection date.
- Submitted-by identity.
- Integrity information.
- Version.
- Applicable retention classification.
- Access restrictions.
- Relevant knowledge and validation references.

### 5.4 Ownership boundary

The Evidence Service establishes that evidence exists and preserves its provenance.

It does **not** independently determine that evidence satisfies a regulation, proves a financial expense is allowable, or establishes compliance.

Those determinations must be made through the applicable authoritative definitions and evaluation processes.

## 6. Validation Service

### 6.1 Responsibility

The Validation Service executes versioned validation definitions supplied by the appropriate knowledge authority or an explicitly identified operational validation owner.

### 6.2 Authority ownership

The Regulatory Knowledge Engine owns regulatory validation definitions.

The Financial Knowledge Engine owns financial validation definitions.

The shared Validation Service owns execution infrastructure, result persistence contracts, execution tracing, and operational reliability.

### 6.3 Validation request

A validation request must identify:

- Tenant and organization.
- Authority type and owner.
- Definition ID/version.
- Knowledge pack ID/version, where applicable.
- Evaluation subject.
- Relevant business record IDs/versions.
- Evidence references.
- Applicable effective or evaluation date.
- Execution options.
- Correlation and idempotency identifiers.

### 6.4 Validation result

A validation result must preserve:

- Unique result ID.
- Request and execution context.
- Originating authority.
- Definition and knowledge pack versions.
- Input record references and versions.
- Evidence references.
- Outcome.
- Findings or calculation details.
- Execution timestamp.
- Execution status.
- Relevant errors or limitations.
- Traceability references.

### 6.5 Outcome distinctions

The contract must distinguish between:

- Successful execution with a favorable determination.
- Successful execution with an unfavorable determination.
- Indeterminate evaluation due to insufficient information.
- Execution failure.
- Evaluation not applicable.

An execution error must never be represented as a compliant result.

### 6.6 Re-evaluation

When knowledge, evidence, or business records change, the platform may schedule a new evaluation.

The prior result remains historically available.

The new result references the versions actually used.

## 7. Document Service

### 7.1 Responsibility

The Document Service manages secure document storage, metadata, versioning, retrieval, and lifecycle operations.

### 7.2 Core capabilities

- Register and store documents.
- Maintain document metadata.
- Support versioned document references.
- Apply tenant and organization scope.
- Enforce access policies.
- Support large-file streaming.
- Record access events.
- Apply retention and disposition rules.
- Support authorized document sharing.
- Maintain links to business records and evidence.

### 7.3 Document and evidence distinction

A document is a managed artifact.

Evidence is the use of an artifact or record to support a particular determination.

One document may support multiple evidence relationships, subject to authorization and provenance requirements.

The Document Service does not decide whether the document is sufficient evidence.

### 7.4 Secure access

Document access must enforce authorization at retrieval time, not solely when a link is created.

Where appropriate, access mechanisms must support expiry, revocation, and restrictions on permitted actions.

## 8. Audit and Traceability Service

### 8.1 Responsibility

The Audit and Traceability Service preserves a trustworthy record of significant actions and system determinations.

### 8.2 Audit event contract

An audit event should capture:

- Event ID.
- Tenant and organization scope.
- Actor identity and actor type.
- Action.
- Target entity and identifier.
- Timestamp.
- Outcome.
- Correlation ID.
- Relevant authorization context.
- Before/after references or approved change summaries.
- Originating service.

### 8.3 Required event categories

Audit coverage includes:

- Knowledge publication and retirement.
- Validation execution.
- Evidence submission and replacement.
- Document access and disclosure.
- Approval decisions.
- Financial report generation and finalization.
- Compliance finding creation and remediation.
- Surveyor access and activity.
- Administrative changes.
- Security-relevant actions.

### 8.4 Historical integrity

Audit history must be append-oriented and protected against unauthorized alteration.

Corrections should be recorded through additional events rather than silently rewriting the original event.

### 8.5 Traceability

A finalized regulatory or financial determination should be traceable through:

**Determination → Execution → Definition/version → Knowledge pack/version → Source authority → Business records/versions → Evidence → Actor and time**

## 9. Change and Version Service

### 9.1 Responsibility

The Change and Version Service provides common mechanisms for version references, change tracking, comparison, and historical reconstruction.

### 9.2 Versioned objects

Versioned objects may include:

- Knowledge packs.
- Regulatory provisions and definitions.
- Financial classifications and methodologies.
- Operational records.
- Evidence.
- Documents.
- Approval policies.
- Reports and binder snapshots.

### 9.3 Ownership boundary

The service tracks versions and changes.

The originating domain or knowledge authority determines the meaning, validity, and consequences of those changes.

For example, the service may identify that an allocation methodology changed. Only the Financial Knowledge Engine can define the authoritative financial meaning of that change.

### 9.4 Effective dates

The platform must distinguish:

- When a record was created or changed.
- When a definition became effective.
- Which version was applicable to a historical period.
- When a determination was executed.

These dates must not be treated as interchangeable.

## 10. Approval Service

### 10.1 Responsibility

The Approval Service provides reusable workflow infrastructure for review, authorization, rejection, and controlled publication.

### 10.2 Core contract

An approval workflow should identify:

- Workflow ID.
- Approval subject.
- Subject version.
- Tenant or platform governance scope.
- Requested action.
- Applicable approval policy/version.
- Required roles.
- Reviewer assignments.
- Decisions and timestamps.
- Supporting comments or evidence.
- Final disposition.

### 10.3 Approval authority

The originating domain defines who may approve and what approval means.

Examples:

- Regulatory knowledge publication follows Regulatory Knowledge Engine governance.
- Financial knowledge publication follows Financial Knowledge Engine governance.
- Customer financial report approval follows the authorized financial reporting workflow.
- Provider remediation approval follows the applicable compliance workflow.

The shared Approval Service must not grant itself authority to approve content.

### 10.4 Separation of duties

Approval policies should support separation between preparation, review, and final authorization where required.

## 11. Reporting Infrastructure

### 11.1 Responsibility

Reporting Infrastructure assembles, formats, generates, and distributes authorized reports from governed information.

### 11.2 Core capabilities

- Report definition registration.
- Parameterized generation.
- Data provenance.
- Versioned report output.
- Export and rendering.
- Access control.
- Approval-state awareness.
- Historical report retrieval.
- Audit logging.

### 11.3 Ownership boundary

Reporting Infrastructure does not define:

- Regulatory obligations.
- Financial classifications.
- Cost allowability.
- Allocation methodologies.
- Reimbursement rules.
- Compliance conclusions.

Those remain with their originating authorities and applied intelligence capabilities.

### 11.4 Cross-domain reports

A report may present regulatory and financial findings together.

However, it must preserve their distinct authorities, methodologies, evidence, and conclusions.

A combined report does not create a merged knowledge authority.

## 12. Cross-Service Orchestration

Shared services may participate in coordinated workflows.

A typical determination sequence is:

1. An applied intelligence capability identifies an evaluation need.
2. The applicable knowledge authority supplies a versioned definition.
3. Operational records and evidence are resolved under authorized scope.
4. The Validation Service executes the definition.
5. Results and traceability references are preserved.
6. Audit events are recorded.
7. Approval is requested if required.
8. Reporting or binder capabilities consume the authorized result.

Orchestration must not bypass knowledge authority ownership.

## 13. Tenant Isolation and Authorization

Every shared service must enforce customer separation.

### 13.1 Tenant boundaries

- Tenant-owned records remain tenant-isolated.
- Cross-tenant record references are prohibited unless explicitly supported by a separately authorized platform-level relationship.
- A knowledge pack may be shared across tenants without exposing tenant operational data.
- Authorization must be evaluated against the requested resource and action.

### 13.2 Scope

Authorization may be restricted by:

- Tenant.
- Organization.
- Program.
- Location.
- Person.
- Record.
- Document.
- Workflow.
- Time period.
- Assigned reviewer role.

### 13.3 Sensitive information

Services must support minimum-necessary access, secure transport, appropriate storage protection, access logging, and retention policies.

Specific legal and contractual security obligations must be established through the relevant governing requirements rather than assumed.

## 14. Versioning, Immutability, and Replay

Finalized determinations must retain enough context to explain how the result was produced.

### 14.1 Replay requirements

Historical reconstruction should identify:

- Exact knowledge definitions.
- Applicable effective dates.
- Input record versions.
- Evidence versions.
- Calculation or validation engine version where material.
- Execution context.
- Original output.

### 14.2 Replay limitations

If a prior external dependency or source artifact is unavailable, the platform must identify the limitation rather than claim exact reproduction.

### 14.3 Corrections

Corrected results should be new versioned determinations linked to the prior result.

Historical results must remain distinguishable from current results.

## 15. Reliability and Error Handling

Shared contracts must define consistent handling for:

- Invalid requests.
- Unauthorized access.
- Missing records.
- Unavailable evidence.
- Unsupported definition versions.
- Execution failures.
- Duplicate requests.
- Conflicting updates.
- Expired access.
- Partial completion.
- Downstream service failures.

Failures must be explicit and auditable.

## 16. Idempotency and Asynchronous Operations

Long-running operations may include:

- Large-document processing.
- Bulk validation.
- Financial report generation.
- Binder assembly.
- Regulatory change analysis.
- Historical re-evaluation.

Contracts should support operation identifiers, idempotency keys, progress states, retries, cancellation where safe, and final outcomes.

Retries must not silently create duplicate approvals, determinations, or finalized reports.

## 17. Observability and Operational Monitoring

Shared services must expose operational information appropriate to their responsibilities.

Relevant measures include:

- Execution duration.
- Validation failure rates.
- Evidence processing failures.
- Document retrieval errors.
- Approval workflow delays.
- Report generation failures.
- Authorization denials.
- Queue and retry health.
- Audit event delivery health.

Monitoring must avoid unnecessary exposure of sensitive customer information.

## 18. API and Event Contract Standards

### 18.1 API principles

Shared APIs should provide:

- Stable resource identifiers.
- Explicit request/response schemas.
- Versioned contracts.
- Consistent authorization behavior.
- Predictable error responses.
- Pagination for collections.
- Correlation identifiers.
- Clear lifecycle states.

### 18.2 Event principles

Events should identify:

- Event type and version.
- Event ID.
- Originating capability.
- Tenant scope.
- Subject reference.
- Occurrence time.
- Correlation ID.
- Relevant version references.

Events should contain only the information necessary for authorized consumers.

### 18.3 Compatibility

Contract changes must be evaluated for backward compatibility before implementation.

## 19. Regulatory Knowledge Engine Integration

The Regulatory Knowledge Engine supplies authoritative:

- Regulatory sources and provisions.
- Obligations.
- Applicability definitions.
- Regulatory validation definitions.
- Evidence expectations.
- Knowledge pack versions.
- Effective dates and lifecycle states.

Shared services execute and preserve operations using those definitions.

They do not edit regulatory meaning.

## 20. Financial Knowledge Engine Integration

The Financial Knowledge Engine supplies authoritative:

- Financial classifications.
- Allowability definitions.
- Allocation methodologies.
- Reimbursement and rate definitions.
- Formulas.
- Reporting line definitions.
- Statistical definitions.
- Financial validation definitions.
- Financial knowledge pack versions.

Shared services execute and preserve operations using those definitions.

They do not independently establish financial treatment.

## 21. Compliance Intelligence Integration

Compliance Intelligence applies regulatory knowledge to operational facts.

It may use shared services to:

- Resolve evidence.
- Execute evaluations.
- Preserve findings.
- Track remediation evidence.
- Support rechecks.
- Maintain audit history.
- Generate authorized reports.

Compliance Intelligence owns its applied workflow and determination lifecycle, not the underlying regulatory authority.

## 22. Financial Intelligence Integration

Financial Intelligence applies financial knowledge to operational and financial facts.

It may use shared services to:

- Validate financial transactions.
- Evaluate classification and allowability.
- Execute governed calculations.
- Preserve allocation results.
- Generate reporting outputs.
- Assemble Financial Binder evidence.
- Maintain approval and audit history.

Financial Intelligence owns applied financial operations, not the authoritative financial definitions.

## 23. Financial Binder and Survey Workspace Integration

### 23.1 Financial Binder

The Financial Binder is a first-class applied capability.

It organizes financial reporting artifacts, source records, supporting evidence, validation outcomes, approvals, and historical snapshots.

The Binder consumes shared services but retains its own domain-specific workflow and presentation requirements.

### 23.2 Survey Binder and Survey Workspace

Survey access is a separate capability from the Financial Binder.

The Survey Workspace must support:

- Individually identified surveyor accounts.
- Appropriate multifactor authentication.
- Assignment-based authorization.
- Provider, location, person, and record-level scope.
- Secure document viewing.
- Large-file streaming.
- Information requests and responses.
- Access auditing.
- Expiration and revocation.
- Lawful and authorized download where permitted.

Surveyor identities must remain distinct from provider employee identities.

### 23.3 Access enforcement

A binder or workspace must not bypass Document Service authorization or expose documents merely because they appear in a collection.

## 24. ISS Operations and Customer Separation

The platform supports Individualized Skills and Socialization (ISS) as a reusable operational capability.

The following boundaries are mandatory:

| Component | Ownership |
|---|---|
| Regulatory Intelligence Platform | Reusable software product |
| ISS Operations | Reusable operational capability |
| Texas ISS Knowledge Pack | Regulatory Knowledge Engine |
| LevelUp Adventures | First ISS customer/tenant |
| Participant and service records | Customer-owned operational data |

ISS Operations may use shared services for service records, documentation, evidence, validation, approvals, and reporting.

The Texas ISS Knowledge Pack supplies applicable authoritative regulatory definitions.

LevelUp Adventures' participant goals, schedules, adventures, staff assignments, service delivery records, and evidence remain customer-specific.

No shared contract may hardcode LevelUp Adventures as the owner of ISS functionality.

Operational templates, including activity libraries and goal templates, must not automatically be treated as regulatory requirements.

Scheduled service time must not automatically become billable time.

## 25. AI Responsibilities and Boundaries

AI may assist with:

- Evidence organization.
- Document classification suggestions.
- Draft summaries.
- Explanation of validation results.
- Identification of potentially missing information.
- Workflow guidance.
- Proposed mappings for human review.

AI must not:

- Invent regulatory or financial authority.
- Silently modify certified knowledge.
- Approve its own output.
- Replace required human authorization.
- Represent unsupported findings as verified.
- Bypass tenant security.
- Alter historical determinations without traceable versioning.

AI-generated suggestions must remain distinguishable from certified knowledge and finalized determinations.

## 26. Implementation Architecture Guidance

The initial implementation should preserve modular Nx and NestJS boundaries.

Shared intelligence capabilities should have explicit module ownership and contracts.

Physical service extraction should occur only when justified by operational requirements.

Before implementation, the team must reconcile these proposed contracts with the existing:

- Evidence and document models.
- Compliance result models.
- Regulatory knowledge models.
- Validation services.
- Authorization infrastructure.
- Audit mechanisms.
- Database migrations.
- Frontend data-access libraries.

Existing implementations are inputs to reconciliation, not automatic constraints on the target architecture.

No existing code should be deleted or replaced merely because the target design differs.

## 27. Implementation Readiness Requirements

Before coding a shared intelligence capability:

1. Confirm the authoritative owner.
2. Define its contract and data model.
3. Confirm tenant and authorization boundaries.
4. Identify required version references.
5. Define audit events.
6. Define error and retry behavior.
7. Identify affected existing modules.
8. Define migration and compatibility strategy.
9. Establish contract and security tests.
10. Record the work in the sprint software change register.
11. Obtain explicit implementation authorization.

Design acceptance alone does not authorize implementation.

## 28. Open Architecture Decisions

The following decisions remain subject to integration review:

- Exact shared contract schemas and naming conventions.
- Evidence integrity and retention mechanisms.
- Validation orchestration boundaries.
- Immutable history implementation strategy.
- Event delivery guarantees.
- Approval policy representation.
- Report artifact storage strategy.
- Cross-domain reporting composition.
- Historical replay guarantees.
- Long-running operation infrastructure.
- Surveyor identity federation and lifecycle.
- Detailed integration with existing repository modules.

These are implementation-level or integration-level decisions and must not be resolved through unsupported assumptions.

## 29. Acceptance Criteria

Document 08 is ready for design acceptance when:

- Both knowledge authorities remain independent.
- Shared service ownership is unambiguous.
- Validation results preserve complete authority and version attribution.
- Evidence and documents remain conceptually distinct.
- Historical determinations remain traceable.
- Tenant isolation applies across all shared services.
- Financial Binder and Survey Workspace retain separate domain ownership.
- ISS Operations remains reusable and independent of LevelUp Adventures.
- Reporting cannot redefine authoritative conclusions.
- AI cannot bypass knowledge governance.
- Existing implementation reconciliation is explicitly required.
- No implementation is authorized by this document alone.

---

## Document 08 Completion Statement

This document establishes the proposed shared intelligence contracts for the Regulatory Intelligence Platform.

The contracts provide a common execution, evidence, document, audit, versioning, approval, and reporting foundation for independent regulatory and financial knowledge authorities.

**Next architecture document:** Document 09 — Applied Intelligence and Operations.

**Status:** Proposed for architecture review and acceptance. No implementation authorization is granted.