# ENG-012 — Data Architecture

**Document ID:** ENG-012  
**Version:** 1.0  
**Status:** Engineering Blueprint — Draft  
**Platform:** Regulatory Intelligence Platform  
**Organization:** McCaskill Projects  
**Proposed Location:** `docs/engineering/12-data-architecture.md`  
**Implementation Authorization:** Not Granted

---

# 1. Purpose and Scope

## 1.1 WHAT

This document defines the target data architecture for the Regulatory Intelligence Platform.

It establishes the standards governing:

- PostgreSQL and TypeORM persistence.
- Domain data ownership.
- Tenant and organization isolation.
- Operational data models.
- Regulatory Knowledge persistence.
- Financial Knowledge persistence.
- Shared Intelligence persistence.
- Compliance and Financial Intelligence results.
- Historical reproducibility.
- Evidence and document storage.
- Database transactions and concurrency.
- API data access and query boundaries.
- Schema migrations.
- Data import and validation.
- Security, retention, and deletion.
- Backup, recovery, and disaster readiness.
- Data lineage and auditing.
- Testing and implementation sequencing.

The architecture is jurisdiction-neutral. Texas HCS is the first regulatory and financial implementation context, not a structural limitation of the data model.

## 1.2 WHEN

These standards apply whenever engineering work introduces or changes:

1. A database entity.
2. A database table or column.
3. A relationship or foreign key.
4. A repository or query service.
5. A data import.
6. A knowledge version.
7. A compliance or financial execution.
8. An evidence or document relationship.
9. A database migration.
10. A retention, archive, or deletion operation.
11. A backup or recovery procedure.
12. A cross-domain data contract.

## 1.3 WHERE

The primary transactional persistence environment is PostgreSQL, accessed through approved NestJS services and TypeORM infrastructure.

The existing Render-hosted PostgreSQL environment is preserved unless a separate infrastructure decision authorizes a change.

Frontend applications access data through approved backend APIs, not through direct database connections.

## 1.4 WHY

The platform must support multiple organizations, regulatory authorities, financial methodologies, jurisdictions, and historical reporting periods without corrupting data ownership or losing the ability to explain prior decisions.

A compliant data architecture must answer:

- Who owns this record?
- Which organization does it belong to?
- Which version was used?
- Which facts supported the result?
- Who changed it?
- When did the change occur?
- What was approved?
- Can the original result be reproduced?
- Can another tenant access it?
- Can the record be recovered?

## 1.5 HOW

The architecture follows six governing principles:

1. **Domain ownership:** Each business domain owns its authoritative operational records.
2. **Knowledge authority:** The Regulatory and Financial Knowledge Engines independently own their approved definitions.
3. **Execution separation:** Shared services execute approved definitions without becoming their authority.
4. **Historical preservation:** Governed results retain sufficient context for audit and reproduction.
5. **Tenant isolation:** Every tenant-owned operation is explicitly scoped and authorized.
6. **Controlled evolution:** Schema changes occur through reviewed, tested TypeORM migrations.

## 1.6 VERIFICATION

The data architecture is acceptable only when ownership, isolation, integrity, history, migrations, and recovery are demonstrably enforced.

---

# 2. Data Architecture Principles

## 2.1 WHAT

The platform adopts mandatory data architecture rules.

## 2.2 WHEN

These rules apply to every new entity, repository, migration, and data integration.

## 2.3 WHERE

Operational Domains, both Knowledge Engines, Shared Intelligence, Applied Intelligence, and Platform Foundation.

## 2.4 WHY

Without common rules, independent teams can create conflicting records, duplicate authority, and inconsistent historical results.

## 2.5 HOW

**DATA-001 — One authoritative owner per business concept**

A business record has one designated domain owner.

**DATA-002 — No shared write ownership**

Multiple domains must not independently mutate the same authoritative table.

**DATA-003 — Two knowledge authorities**

Regulatory Knowledge and Financial Knowledge are independent authorities.

**DATA-004 — Jurisdiction-neutral core**

Jurisdiction-specific requirements belong in governed knowledge definitions and applicable extensions.

**DATA-005 — Explicit tenancy**

Tenant-owned records must be associated with an authorized tenant context.

**DATA-006 — Server-controlled authoritative changes**

Knowledge publication, approval, evaluation, financial execution, and release are backend-controlled operations.

**DATA-007 — Immutable governed history**

Published knowledge and completed governed executions cannot be silently rewritten.

**DATA-008 — Traceable relationships**

Results must reference their source facts, applicable knowledge, and execution context.

**DATA-009 — Migration-controlled schema**

Production schema changes must use reviewed migrations.

**DATA-010 — No direct frontend database access**

Angular applications consume authorized APIs.

**DATA-011 — Data minimization**

Persist only information required for legitimate business and regulatory purposes.

**DATA-012 — Recoverability**

Critical data must be included in tested backup and recovery procedures.

**DATA-013 — Privacy-aware observability**

Logs and diagnostics must not unnecessarily reproduce protected records or secrets.

**DATA-014 — Repository reconciliation**

Existing tables and migrations must be inventoried before new physical structures are created.

## 2.6 VERIFICATION

Architecture reviews must trace every proposed table to its owner, access policy, lifecycle, and migration strategy.

---

# 3. Logical Data Architecture

## 3.1 WHAT

The logical data architecture separates foundational records, operational records, knowledge authority, shared intelligence, and applied results.

## 3.2 WHEN

It is used when designing entities, relationships, persistence boundaries, and cross-domain queries.

## 3.3 WHERE

The existing PostgreSQL environment and approved domain persistence modules.

## 3.4 WHY

A clear logical model prevents a single database from becoming an uncontrolled collection of mutually dependent tables.

## 3.5 HOW

```text
                        REGULATORY INTELLIGENCE PLATFORM
                                      |
          +---------------------------+---------------------------+
          |                           |                           |
   PLATFORM FOUNDATION        OPERATIONAL DOMAINS        KNOWLEDGE AUTHORITIES
          |                           |                           |
   Identity / Tenancy          Organizations / People      Regulatory Knowledge
   Authorization               Locations / Workforce      Financial Knowledge
   Configuration               Services / Residential
                               ISS / Contracts
                               Payroll / Transactions
          |                           |                           |
          +---------------------------+---------------------------+
                                      |
                              SHARED INTELLIGENCE
                                      |
                         Evidence / Validation / Audit
                         Documents / Versions / Approval
                         Binder Management
                                      |
                              APPLIED INTELLIGENCE
                                      |
                          Compliance Evaluations
                          Financial Executions
                          Findings / Corrective Actions
                          Reports / Survey Operations
                                      |
                              USER WORKSPACES
```

### Physical database principle

Logical domains may initially share one PostgreSQL database.

Logical separation does not require an immediate database-per-domain deployment.

However, each domain must retain explicit ownership of its tables, migrations, repositories, and business mutations.

## 3.6 VERIFICATION

Every entity in ENG-003 and relationship in ENG-004 must map to a defined logical owner.

---

# 4. PostgreSQL Persistence Strategy

## 4.1 WHAT

PostgreSQL is the primary relational persistence engine.

## 4.2 WHEN

It is used for transactional records, governed metadata, relationships, and execution history.

## 4.3 WHERE

The existing PostgreSQL environment, accessed by the NestJS backend through approved data-access infrastructure.

## 4.4 WHY

The platform requires relational integrity, transactions, indexed queries, and reliable persistence of structured business information.

## 4.5 HOW

### Database standards

- Use UUID identifiers where compatible with existing entity conventions.
- Use explicit primary keys.
- Use foreign keys for appropriate relational integrity.
- Define unique constraints for business invariants.
- Use check constraints where practical.
- Use database transactions for atomic changes.
- Index common tenant, owner, status, and date queries.
- Store timestamps consistently.
- Preserve effective dates separately from creation timestamps.
- Use controlled JSONB only where justified.

### Naming

Physical naming conventions must first be reconciled with the existing schema.

The target convention is:

- Tables: `snake_case`.
- Columns: `snake_case`.
- Foreign keys: consistently named.
- Indexes: descriptive and collision-resistant.
- Unique constraints: descriptive and stable.

### Timestamp conventions

Use timezone-aware timestamps for instants.

Store local dates separately where they represent business-effective dates or reporting periods.

Do not treat a reporting date as equivalent to a UTC execution timestamp.

### Monetary values

Use PostgreSQL `numeric` with documented precision and scale.

Do not use binary floating-point values for authoritative financial amounts.

### Sensitive identifiers

Sensitive personal identifiers must use approved protection and masking practices.

## 4.6 VERIFICATION

Database tests must validate constraints, numeric precision, timestamp behavior, and indexed query plans.

---

# 5. TypeORM Entity and Repository Standards

## 5.1 WHAT

TypeORM provides the approved persistence mapping and migration mechanism.

## 5.2 WHEN

It is used when implementing relational entities, repositories, and schema changes.

## 5.3 WHERE

Existing NestJS domain persistence modules and TypeORM infrastructure.

## 5.4 WHY

A consistent persistence approach reduces duplication and preserves compatibility with the current codebase.

## 5.5 HOW

### Entity responsibilities

An entity defines:

- Identity.
- Persisted fields.
- Relationships.
- Database constraints.
- Persistence metadata.

An entity must not become the sole location for regulatory interpretation or financial methodology logic.

### Repository responsibilities

Repositories perform controlled persistence and queries for their owning domain.

### Service responsibilities

Application and domain services coordinate:

- Authorization.
- Business validation.
- Transactions.
- Lifecycle transitions.
- Domain events.
- Audit context.

### Migration policy

Production schema synchronization must not replace migration-based change control.

### Existing implementation

The existing backend source structure, including `server/src/app/...`, must be respected until verified architecture changes are approved.

## 5.6 VERIFICATION

Tests must verify repository behavior, transaction boundaries, and migration compatibility.

---

# 6. Tenant and Organization Data Isolation

## 6.1 WHAT

Tenant isolation prevents one customer from accessing or modifying another customer's data.

## 6.2 WHEN

It applies to every tenant-owned read, write, export, execution, and background operation.

## 6.3 WHERE

Platform Authorization, domain services, repository queries, and database integrity rules.

## 6.4 WHY

Tenant isolation is a foundational security requirement.

## 6.5 HOW

### Tenant hierarchy

The target model distinguishes:

- Platform.
- Tenant.
- Organization.
- Location.
- Person or employee.
- Business record.

The exact physical relationship must follow the approved entity catalog and verified repository model.

### Query rules

Every tenant-owned query must receive a verified tenant context.

Client-provided tenant identifiers cannot be trusted without authorization.

### Ownership rules

A location must belong to an authorized organization.

A person or employee relationship must be validated against the applicable organizational and assignment scope.

### Shared reference data

Platform-wide reference data and published knowledge may be shared through controlled read access without being treated as tenant-owned operational records.

### Defense in depth

Database-level row security may be evaluated as an additional control, but is not assumed to exist or mandated as an unverified replacement for existing authorization.

## 6.6 VERIFICATION

Tests must include:

- Cross-tenant reads.
- Cross-tenant updates.
- Forged tenant identifiers.
- Cross-tenant relationship creation.
- Tenant switching.
- Background job scope.
- Export isolation.

---

# 7. Domain Data Ownership Matrix

## 7.1 WHAT

The ownership matrix identifies which domain controls each data family.

## 7.2 WHEN

It is used during schema design, service development, and cross-domain integration.

## 7.3 WHERE

Domain persistence modules and their public service contracts.

## 7.4 WHY

Ownership must remain clear even when multiple workspaces display the same record.

## 7.5 HOW

| Data family | Authoritative owner | Permitted consumers |
|---|---|---|
| Identity and user assignments | Platform Foundation | Authorized domains |
| Tenant and access scope | Platform Foundation | Authorized domains |
| Organization records | Organization Operations | Intelligence and reporting |
| Location records | Location Operations | Residential, compliance, reporting |
| Person records | People Operations | Authorized service and compliance domains |
| Employee records | Workforce Operations | Authorized operations and reporting |
| Service records | Service Operations | Compliance and Financial Intelligence |
| Residential records | Residential Operations | Compliance Intelligence |
| ISS records | ISS Operations | Compliance and Financial Intelligence |
| Contract records | Contract Operations | Financial and Compliance Intelligence |
| Payroll source records | Payroll Operations | Financial Intelligence |
| Financial transactions | Financial Operations | Financial Intelligence |
| Regulatory definitions | Regulatory Knowledge Engine | Compliance Intelligence |
| Financial methodologies | Financial Knowledge Engine | Financial Intelligence |
| Evidence metadata | Shared Evidence | Authorized workflows |
| Document metadata | Shared Document Management | Authorized workflows |
| Compliance evaluations | Compliance Intelligence | Dashboards, findings, audit |
| Financial executions | Financial Intelligence | Reports, binders, audit |
| Corrective actions | Compliance Operations | Compliance Intelligence |
| Binder instances | Shared Binder Management | Financial and Survey capabilities |
| Survey events | Survey Operations | Survey Workspace and audit |
| Approval history | Shared Approval with owning workflow | Authorized consumers |
| Audit records | Shared Audit | Authorized audit queries |

### Cross-domain mutation rule

A consuming domain requests changes through the owning domain's approved contract.

Direct writes to another domain's authoritative tables are prohibited.

## 7.6 VERIFICATION

Every repository write path must have one designated owner.

---

# 8. Operational Data Architecture

## 8.1 WHAT

Operational Domains persist real-world organizational and service facts.

## 8.2 WHEN

These records are created and maintained during normal business operations.

## 8.3 WHERE

The relevant Operational Domain.

## 8.4 WHY

Regulatory and financial intelligence depend on accurate operational facts but must not take ownership of those facts.

## 8.5 HOW

### Common record characteristics

Where applicable, operational records include:

- Stable identity.
- Owning organization.
- Related person, location, employee, or service.
- Effective dates.
- Current operational status.
- Created and updated timestamps.
- Responsible actor.
- Supporting document references.
- Change history.

### Residential Operations

Residential records include relevant location assignments, safety activities, fire drills, emergency plans, hot water monitoring, and other approved operational facts.

### ISS Operations

ISS records include individualized plans, goals, activities, service documentation, support levels, and progress observations.

### Financial Operations

Transactions and payroll records preserve source amounts, periods, source identifiers, and reconciliation relationships.

### Operational validation

Operational domains may enforce structural and business-record integrity.

They must not independently define regulatory compliance or financial allowability.

## 8.6 VERIFICATION

Tests must confirm operational record integrity, relationship constraints, and independence from knowledge-specific determinations.

---

# 9. Regulatory Knowledge Data Architecture

## 9.1 WHAT

The Regulatory Knowledge Engine persists authoritative regulatory sources, structured requirements, applicability definitions, validation definitions, and certified knowledge packs.

## 9.2 WHEN

Data is created and changed through the governed regulatory knowledge lifecycle.

## 9.3 WHERE

Regulatory Knowledge Engine persistence.

## 9.4 WHY

Regulatory knowledge must remain traceable to authoritative sources and reproducible across historical versions.

## 9.5 HOW

### Logical data families

| Data family | Purpose |
|---|---|
| Regulatory Source | Official source identity and provenance |
| Source Version | Source revision and retrieval context |
| Requirement | Structured regulatory obligation |
| Applicability Definition | Conditions under which a requirement applies |
| Validation Definition | Approved evaluation logic |
| Evidence Definition | Required or expected evidence |
| Knowledge Pack | Governed collection of requirements |
| Knowledge Pack Version | Immutable certified release |
| Review Record | Independent review history |
| Certification Record | Certification decision |
| Change Record | Source or requirement change history |

### Versioning

Draft versions may be edited under authorized workflow controls.

Certified and published versions must be preserved.

A correction to published knowledge creates a new governed version rather than silently rewriting the old one.

### Source provenance

Preserve enough metadata to identify:

- Authority.
- Jurisdiction.
- Program.
- Source citation.
- Source version.
- Effective date.
- Retrieval or publication context.
- Review and certification history.

### Knowledge pack references

Compliance executions must reference the exact applicable published knowledge version.

## 9.6 VERIFICATION

Tests must confirm source provenance, version immutability, effective-date resolution, and historical knowledge retrieval.

---

# 10. Financial Knowledge Data Architecture

## 10.1 WHAT

The Financial Knowledge Engine persists authoritative financial definitions, cost principles, classifications, allocation methodologies, rates, formulas, and reporting structures.

## 10.2 WHEN

Data is created and governed through the Financial Knowledge lifecycle.

## 10.3 WHERE

Financial Knowledge Engine persistence.

## 10.4 WHY

Financial decisions must be reproducible from approved methodologies rather than undocumented calculations embedded in application code.

## 10.5 HOW

### Logical data families

| Data family | Purpose |
|---|---|
| Financial Source | Governing financial source |
| Source Version | Source revision and provenance |
| Financial Definition | Defined financial concept |
| Classification Rule | Financial classification logic |
| Cost Principle | Allowability or treatment rule |
| Allocation Methodology | Allocation basis and method |
| Rate Definition | Applicable rate and period |
| Formula Definition | Approved calculation |
| Reporting Definition | Required reporting structure |
| Financial Knowledge Pack | Governed methodology collection |
| Financial Knowledge Version | Approved immutable release |
| Review and Approval Record | Governance history |

### Calculation precision

Financial knowledge must define applicable:

- Numeric precision.
- Rounding.
- Units.
- Effective periods.
- Required inputs.
- Calculation dependencies.
- Exception handling.

### Versioning

Published financial knowledge is immutable.

A methodology change requires a new approved version.

### Reporting definition

A reporting definition describes report structures and calculations.

The resulting report remains an Applied Financial Intelligence artifact.

## 10.6 VERIFICATION

Tests must verify methodology versioning, effective-period selection, precision, approval history, and reproducibility.

---

# 11. Shared Intelligence Data Architecture

## 11.1 WHAT

Shared Intelligence persists reusable execution, evidence, audit, approval, document, version, and binder infrastructure.

## 11.2 WHEN

It is used by multiple business domains under approved contracts.

## 11.3 WHERE

Shared Intelligence persistence modules.

## 11.4 WHY

Cross-cutting infrastructure should be reusable without becoming the owner of regulatory or financial policy.

## 11.5 HOW

### Shared data families

| Capability | Persisted information |
|---|---|
| Evidence | Evidence identity, metadata, relationships |
| Validation | Execution metadata and validation outcomes |
| Audit | Actor, action, resource, timestamp, outcome |
| Document | Metadata, versions, storage references |
| Change Management | Change requests, versions, impact references |
| Approval | Review and approval decisions |
| Reporting Infrastructure | Report execution and artifact metadata |
| Binder Management | Binder types, instances, sections, references, lifecycle |

### Authority boundary

Shared Validation executes definitions approved by the relevant authority or operational owner.

Shared Approval records governed decisions but does not independently determine who may certify regulatory knowledge or approve financial methodologies.

### Reference integrity

Shared records must retain typed references to their owning business objects.

Where direct foreign keys are not feasible across a polymorphic relationship, the system must use explicit reference validation and orphan-detection controls.

## 11.6 VERIFICATION

Tests must confirm shared-service reuse without authority leakage or unauthorized cross-domain mutation.

---

# 12. Compliance Execution Data Model

## 12.1 WHAT

Compliance Intelligence persists evaluation executions and results.

## 12.2 WHEN

A result is created when an authorized compliance evaluation executes.

## 12.3 WHERE

Compliance Intelligence persistence.

## 12.4 WHY

A compliance result must explain which requirement was evaluated, against which facts, and under which knowledge version.

## 12.5 HOW

### Logical execution record

| Field | Purpose |
|---|---|
| Execution ID | Unique execution identity |
| Tenant/Organization | Authorized execution scope |
| Target Reference | Evaluated entity |
| Knowledge Pack Version | Governing published knowledge |
| Requirement Version | Exact requirement |
| Evaluation Definition Version | Exact evaluation logic |
| Execution Time | When evaluation occurred |
| Effective Context | Relevant as-of date |
| Input References | Operational records considered |
| Input Snapshot or Hash | Reproducibility evidence |
| Result Status | Evaluation outcome |
| Findings | Resulting findings |
| Errors | Execution failure information |
| Correlation ID | Traceability |

### Existing compliance results

The existing `compliance_results` model and its fields, including provider, location, module, rule code, status, severity, message, and navigation metadata, must be inventoried and preserved where appropriate.

The target execution model should extend or relate to existing records rather than assuming a replacement.

### Reassessment

A reassessment creates a new execution linked to earlier results.

It must not silently overwrite the historical evaluation.

## 12.6 VERIFICATION

Tests must confirm exact knowledge-version references, source lineage, historical preservation, and reassessment relationships.

---

# 13. Financial Execution Data Model

## 13.1 WHAT

Financial Intelligence persists calculation executions, classifications, allocations, reconciliations, and report outputs.

## 13.2 WHEN

Data is created during authorized financial execution and reporting workflows.

## 13.3 WHERE

Financial Intelligence persistence.

## 13.4 WHY

Financial outputs must be explainable and reproducible from source data and approved methodologies.

## 13.5 HOW

### Logical execution record

| Field | Purpose |
|---|---|
| Execution ID | Unique calculation execution |
| Tenant/Organization | Authorized scope |
| Reporting Period | Applicable financial period |
| Financial Knowledge Version | Approved methodology |
| Input Dataset Reference | Source data set |
| Input Snapshot or Hash | Reproducibility |
| Calculation Definition | Applied methodology |
| Output Reference | Result |
| Precision Policy | Numeric and rounding behavior |
| Exceptions | Unresolved or resolved issues |
| Execution Time | Execution timestamp |
| Status | Execution state |
| Correlation ID | Traceability |

### Financial result relationships

A financial report must be able to reference:

- Source financial records.
- Service statistics.
- Payroll records.
- Classification decisions.
- Allocation outcomes.
- Reconciliation outcomes.
- Financial Knowledge version.
- Approval and release history.

### Reporting periods

Reporting periods must have explicit start and end boundaries.

Historical reporting periods must not be recalculated silently when financial knowledge changes.

## 13.6 VERIFICATION

Tests must verify deterministic calculations, reporting-period boundaries, financial lineage, and historical reproduction.

---

# 14. Historical Reproducibility and Temporal Data

## 14.1 WHAT

Historical reproducibility means a prior authoritative result can be explained and, where required, re-executed using its original governing context.

## 14.2 WHEN

It applies to regulatory evaluations, financial calculations, published knowledge, approvals, and released reports.

## 14.3 WHERE

Both Knowledge Engines, Shared Version and Audit infrastructure, and Applied Intelligence persistence.

## 14.4 WHY

Current records and current rules may differ from those that existed when an earlier result was produced.

## 14.5 HOW

### Required historical dimensions

Preserve:

1. Knowledge version.
2. Relevant source version.
3. Effective date or reporting period.
4. Execution timestamp.
5. Input identities.
6. Input values or recoverable snapshot.
7. Execution definition version.
8. Result.
9. Review and approval context.
10. Relevant software or evaluator version where needed.

### Temporal distinctions

**Valid time:** When a fact or rule applies in the business world.

**Transaction time:** When the platform recorded or changed the information.

Both may be needed for accurate historical reconstruction.

### Snapshot strategy

A result may use immutable snapshots, versioned source references, or a combination.

A reference alone is insufficient if its underlying content can later change without historical preservation.

### Historical corrections

Correcting a source record must not erase a prior governed result.

A corrected evaluation or report must be linked as a new execution or revision.

## 14.6 VERIFICATION

Historical tests must reproduce selected prior results after source and knowledge versions have changed.

---

# 15. Data Lineage and Provenance

## 15.1 WHAT

Data lineage records how a result was derived from source records and governing definitions.

## 15.2 WHEN

It applies to evaluations, financial calculations, reports, evidence, and binder assembly.

## 15.3 WHERE

Applied Intelligence and Shared Traceability infrastructure.

## 15.4 WHY

A result without lineage cannot be reliably audited or explained.

## 15.5 HOW

### Lineage chain

```text
Authoritative Knowledge Version
             +
Operational Source Records
             |
             v
     Execution Definition
             |
             v
      Execution Instance
             |
             v
       Result / Finding
             |
             v
    Review / Approval
             |
             v
   Report / Binder Artifact
```

### Lineage requirements

Each relationship must identify the relevant source and version.

Lineage queries must respect authorization to underlying records.

A user may be permitted to see that supporting evidence exists without being permitted to open the evidence content.

## 15.6 VERIFICATION

Traceability tests must traverse from result to source references and back while enforcing authorization.

---

# 16. Document and Object Storage Architecture

## 16.1 WHAT

Documents are managed through metadata in PostgreSQL and protected binary storage.

## 16.2 WHEN

It applies to uploaded documents, evidence files, generated reports, binder exports, and survey materials.

## 16.3 WHERE

Shared Document Management and an approved object-storage provider.

## 16.4 WHY

Large binary files should not automatically be embedded in ordinary transactional records.

## 16.5 HOW

### Document metadata

A logical document record may contain:

- Document ID.
- Tenant and organization.
- Owning domain.
- Related business record.
- Document type.
- Storage reference.
- File size.
- Content type.
- Checksum.
- Version.
- Created timestamp.
- Access classification.
- Retention classification.
- Legal hold status.

### Binary storage

The specific object-storage provider must be selected or verified separately.

Do not assume that Render PostgreSQL is the approved long-term binary file store.

### Access

Document retrieval must pass through approved authorization.

Temporary download URLs, if used, must be scoped and time-limited.

### Versioning

A new document version must not silently replace an evidentiary version used in a historical execution.

## 16.6 VERIFICATION

Tests must verify protected retrieval, checksum integrity, versioning, tenant isolation, and unavailable-file recovery behavior.

---

# 17. Evidence Relationships

## 17.1 WHAT

Evidence relationships connect documents and other supporting information to business records, findings, executions, and binders.

## 17.2 WHEN

They are created when supporting material is attached to a governed workflow.

## 17.3 WHERE

Shared Evidence and Document Management.

## 17.4 WHY

Evidence must remain reusable without duplicating ownership of the underlying source record.

## 17.5 HOW

Evidence relationships should identify:

- Evidence ID.
- Source type.
- Source record.
- Target type.
- Target record.
- Relationship purpose.
- Version or snapshot.
- Created timestamp.
- Responsible actor.

### Integrity

Evidence relationships must not permit unauthorized cross-tenant linking.

### Deletion

Removing an evidence relationship must not automatically delete a document used by another authorized workflow.

## 17.6 VERIFICATION

Tests must verify relationship integrity, access scope, version retention, and safe unlinking.

---

# 18. Binder Data Architecture

## 18.1 WHAT

Binder Management persists reusable binder definitions, instances, sections, references, approvals, and lifecycle history.

## 18.2 WHEN

It is used during Financial Binder and Survey Binder workflows.

## 18.3 WHERE

Shared Binder Management.

## 18.4 WHY

Binder types must share common infrastructure while preserving type-specific business rules.

## 18.5 HOW

### Logical binder entities

| Entity | Responsibility |
|---|---|
| Binder Type | Defines binder category |
| Binder Definition Version | Governs required sections |
| Binder Instance | Specific binder |
| Binder Section | Organized content |
| Binder Item | Document or record reference |
| Binder Review | Review activity |
| Binder Approval | Approval decision |
| Binder Release | Released artifact and context |
| Binder Lifecycle Event | State history |

### Lifecycle

Draft → Assembling → Under Review → Approved → Released → Closed → Archived.

### Released binder integrity

A released binder must preserve its approved contents and references.

Later source changes must not silently alter the historical released package.

### Binder access

Access to binder metadata is not equivalent to access to every underlying source document.

## 18.6 VERIFICATION

Tests must confirm lifecycle integrity, released artifact preservation, and source authorization.

---

# 19. Survey Event Data Architecture

## 19.1 WHAT

Survey Operations persists survey events, surveyor assignments, requests, responses, and protected activity.

## 19.2 WHEN

It is used before, during, and after an authorized survey event.

## 19.3 WHERE

Survey Operations and Shared Audit.

## 19.4 WHY

External survey access must be individually scoped, time-limited, and traceable.

## 19.5 HOW

### Logical data families

- Survey Event.
- Survey Scope.
- Surveyor Assignment.
- Authorized Resource Reference.
- Information Request.
- Provider Response.
- Document Access Event.
- Survey Activity Event.
- Event Closure.

### Assignment fields

An assignment must identify:

- Individual surveyor.
- Survey event.
- Authorized organization.
- Authorized resource scope.
- Permissions.
- Start and expiration.
- Revocation status.
- Assignment history.

### Revocation

Revocation must be enforced by authorization services, not merely by changing a frontend indicator.

## 19.6 VERIFICATION

Tests must verify assignment scope, expiration, revocation, protected document access, and audit history.

---

# 20. Transactions and Consistency

## 20.1 WHAT

Transaction boundaries preserve consistency during multi-record changes.

## 20.2 WHEN

They apply when one business operation changes multiple records that must succeed or fail together.

## 20.3 WHERE

Owning NestJS domain services and PostgreSQL transactions.

## 20.4 WHY

Partial updates can create invalid business states and incomplete historical records.

## 20.5 HOW

### Transaction examples

- Creating an operational record and its required relationships.
- Recording a governed approval and workflow transition.
- Persisting an execution result and its required lineage.
- Releasing a binder with its immutable release record.

### Cross-domain operations

Avoid uncontrolled transactions spanning unrelated domain ownership.

Where asynchronous coordination is necessary, define:

- Initiating event.
- Idempotency key.
- Retry policy.
- Failure state.
- Compensation or reconciliation procedure.

### Outbox consideration

A transactional outbox is a recommended design for reliable event publication when event delivery must be coupled to a database commit.

Its adoption requires reconciliation with existing infrastructure.

## 20.6 VERIFICATION

Tests must verify rollback, partial failure handling, idempotency, and event consistency.

---

# 21. Concurrency and Optimistic Locking

## 21.1 WHAT

Concurrency controls prevent conflicting updates from silently overwriting one another.

## 21.2 WHEN

They apply to editable records and governed workflow transitions.

## 21.3 WHERE

Domain services, TypeORM persistence, and API contracts.

## 21.4 WHY

Multiple users may edit the same record or attempt the same approval simultaneously.

## 21.5 HOW

### Concurrency options

- Version columns.
- Conditional updates.
- Database locking for critical transitions.
- Unique constraints.
- Idempotency keys.

### High-risk operations

Approval, certification, publication, release, and closure must verify current state at execution time.

### Conflict behavior

A stale request must return a defined conflict outcome rather than silently overwriting current data.

## 21.6 VERIFICATION

Concurrent-request tests must demonstrate that conflicting operations cannot produce invalid states.

---

# 22. Indexing and Query Performance

## 22.1 WHAT

Indexing and query design support predictable performance as data volume grows.

## 22.2 WHEN

They apply during entity design and query implementation.

## 22.3 WHERE

PostgreSQL schemas and approved repository queries.

## 22.4 WHY

Large tenant datasets, reporting periods, and historical executions can produce expensive queries.

## 22.5 HOW

### Common index candidates

- Tenant ID.
- Organization ID.
- Location ID.
- Person ID.
- Reporting period.
- Status.
- Effective date.
- Created timestamp.
- Knowledge version.
- Execution ID.
- Binder instance.
- Survey event.

Indexes must be selected based on actual query patterns rather than added indiscriminately.

### Query standards

- Avoid unrestricted full-table retrieval.
- Use pagination.
- Select only required fields.
- Avoid uncontrolled N+1 relationship loading.
- Evaluate complex queries using execution plans.
- Preserve tenant filters.

## 22.6 VERIFICATION

Performance tests must use representative data volumes and inspect query plans for critical workloads.

---

# 23. Data Import and Staging

## 23.1 WHAT

The import architecture supports controlled ingestion of operational and financial source data.

## 23.2 WHEN

It is used during provider onboarding, historical imports, payroll ingestion, transaction ingestion, and other approved workflows.

## 23.3 WHERE

Existing import infrastructure and the owning operational domain.

## 23.4 WHY

Imported data must be validated before it becomes authoritative operational data.

## 23.5 HOW

### Import lifecycle

```text
Upload
  |
  v
Staging
  |
  v
Structure Validation
  |
  v
Mapping and Normalization
  |
  v
Business Validation
  |
  v
Review and Approval
  |
  v
Commit to Owning Domain
  |
  v
Import Audit and Reconciliation
```

### Required import metadata

- Import job ID.
- Tenant and organization.
- Source file reference.
- Mapping version.
- Validation results.
- Row counts.
- Rejected records.
- Duplicate detection.
- Responsible actor.
- Commit outcome.

### Existing infrastructure

Existing provider onboarding, import engine, and CSV import wizard capabilities must be inventoried before extending or replacing them.

### Idempotency

Reimporting the same source must not silently duplicate records.

## 23.6 VERIFICATION

Tests must cover malformed files, duplicate rows, partial failures, tenant isolation, reconciliation, and reimport behavior.

---

# 24. Database Migration Governance

## 24.1 WHAT

Database migrations control changes to the physical schema.

## 24.2 WHEN

A migration is required for approved structural changes to persistent data.

## 24.3 WHERE

The existing TypeORM migration infrastructure.

## 24.4 WHY

Uncontrolled schema changes can corrupt data, break deployments, and invalidate historical results.

## 24.5 HOW

### Migration lifecycle

1. Inspect the existing schema.
2. Identify affected domain ownership.
3. Define the proposed change.
4. Assess compatibility.
5. Write migration.
6. Test against a representative database.
7. Validate data preservation.
8. Validate application compatibility.
9. Approve deployment sequence.
10. Execute in the approved environment.
11. Verify the result.
12. Record the change.

### Expand-and-contract

For potentially breaking changes, prefer:

- Add new compatible structure.
- Deploy compatible application behavior.
- Backfill and validate.
- Transition reads and writes.
- Remove obsolete structure only after verification.

### Rollback

Every migration must have a documented recovery strategy.

A reverse migration is not always safe for destructive or data-transforming changes.

### Existing migrations

Do not edit already-applied migrations as though they had never been executed.

## 24.6 VERIFICATION

Migration tests must confirm compatibility, integrity, deployment ordering, and recovery behavior.

---

# 25. Data Retention, Archival, and Deletion

## 25.1 WHAT

Retention rules govern how long records remain available and when they may be archived or deleted.

## 25.2 WHEN

They apply throughout the data lifecycle.

## 25.3 WHERE

Owning domains, Document Management, Binder Management, and Platform Foundation.

## 25.4 WHY

Regulatory, financial, personnel, and service records may have different legal and operational retention obligations.

## 25.5 HOW

### Retention metadata

Where applicable, preserve:

- Record category.
- Retention policy reference.
- Retention start date.
- Retention end date.
- Legal hold.
- Archive status.
- Deletion eligibility.
- Disposal authorization.

### Jurisdictional requirements

Specific retention periods must be derived from verified applicable requirements or approved organizational policy.

Do not embed unverified Texas retention periods into the universal platform.

### Legal holds

Records under legal hold must not be deleted through ordinary retention jobs.

### Historical integrity

Deleting a source record must not silently invalidate required historical evidence or released reports.

### Privacy

Deletion and minimization policies must account for lawful privacy requests and applicable preservation obligations.

## 25.6 VERIFICATION

Tests must verify retention eligibility, legal holds, authorized deletion, and preserved audit relationships.

---

# 26. Security and Data Protection

## 26.1 WHAT

Data protection controls secure persisted information and data movement.

## 26.2 WHEN

They apply during storage, retrieval, export, integration, backup, and deletion.

## 26.3 WHERE

PostgreSQL, backend services, object storage, infrastructure configuration, and authorization boundaries.

## 26.4 WHY

The platform may process sensitive operational, person, workforce, financial, and survey information.

## 26.5 HOW

### Required controls

- Authenticated access.
- Tenant isolation.
- Least-privilege database credentials.
- Encryption in transit.
- Appropriate encryption at rest.
- Secure secret management.
- Restricted administrative access.
- Protected backups.
- Audited sensitive operations.
- Controlled exports.
- Data minimization.

### Application logs

Do not log passwords, tokens, full protected identifiers, or unnecessary confidential record contents.

### Production data

Production records must not be copied into development or testing environments without approved protection and authorization.

## 26.6 VERIFICATION

Security reviews must include credential scope, data exposure, logging, backup access, and cross-tenant isolation.

---

# 27. Backup, Recovery, and Disaster Readiness

## 27.1 WHAT

Backup and recovery controls preserve the ability to restore critical platform information after failure.

## 27.2 WHEN

They apply continuously in production and during disaster recovery exercises.

## 27.3 WHERE

PostgreSQL infrastructure, object storage, and approved backup systems.

## 27.4 WHY

Historical knowledge, financial reporting, operational records, and audit evidence are business-critical.

## 27.5 HOW

### Recovery planning

The recovery plan must define:

- Backup scope.
- Backup frequency.
- Retention.
- Encryption.
- Access controls.
- Restore procedures.
- Recovery Point Objective (RPO).
- Recovery Time Objective (RTO).
- Recovery ownership.
- Verification schedule.

RPO and RTO values must be approved based on business requirements; they are not invented in this blueprint.

### Backup scope

Include:

- Transactional PostgreSQL data.
- Published knowledge versions.
- Execution and audit history.
- Document metadata.
- Object-storage content.
- Required configuration and secrets recovery procedures.

### Restore consistency

A database restore and object-storage restore must be coordinated so that document metadata and binary content remain consistent.

### Testing

Backups are not considered verified until restoration has been tested.

## 27.6 VERIFICATION

Documented restore exercises must demonstrate recovery of representative operational records, knowledge versions, financial reports, and protected documents.

---

# 28. Observability and Data Quality

## 28.1 WHAT

Data observability identifies integrity failures, missing relationships, failed imports, and unusual persistence behavior.

## 28.2 WHEN

It operates during normal production activity and scheduled integrity checks.

## 28.3 WHERE

Owning domains, Shared Audit, monitoring infrastructure, and approved operational tooling.

## 28.4 WHY

Data quality issues can affect downstream regulatory and financial results.

## 28.5 HOW

### Recommended monitored conditions

- Failed migrations.
- Failed imports.
- Duplicate source records.
- Orphaned references.
- Missing knowledge versions.
- Failed execution persistence.
- Unresolved financial reconciliation.
- Document storage mismatches.
- Unexpected tenant-scope violations.
- Long-running database queries.
- Backup failures.

### Alert ownership

Each alert must identify the responsible operational or engineering owner.

### Corrective action

Data repair must be controlled, authorized, and audited.

## 28.6 VERIFICATION

Monitoring tests must demonstrate detection and appropriate escalation of representative data failures.

---

# 29. Data Architecture Testing Strategy

## 29.1 WHAT

Data testing verifies integrity, isolation, migration safety, and historical reproducibility.

## 29.2 WHEN

It is required during implementation and before production deployment.

## 29.3 WHERE

Domain tests, integration tests, migration tests, and end-to-end test environments.

## 29.4 WHY

Application-level tests alone cannot guarantee database integrity.

## 29.5 HOW

### Test categories

| Category | Required verification |
|---|---|
| Entity constraints | Primary keys, foreign keys, uniqueness |
| Tenant isolation | Unauthorized cross-tenant access denied |
| Transactions | Atomic commit and rollback |
| Concurrency | Conflicting updates handled |
| Knowledge versions | Published versions preserved |
| Compliance history | Prior evaluations remain reproducible |
| Financial precision | Decimal and rounding correctness |
| Financial history | Prior calculations remain reproducible |
| Evidence | Valid source and target references |
| Documents | Metadata and binary consistency |
| Binder | Released content preserved |
| Survey | Assignment scope and revocation |
| Import | Validation, idempotency, reconciliation |
| Migrations | Compatibility and data preservation |
| Retention | Legal hold and disposal enforcement |
| Recovery | Successful restoration |

### Test data

Use synthetic or appropriately protected data.

### Failure testing

Include deliberate partial failures and invalid relationships.

## 29.6 VERIFICATION

ENG-013 must translate these categories into automated suites and explicit acceptance gates.

---

# 30. Repository Reconciliation and Physical Schema Inventory

## 30.1 WHAT

Repository reconciliation maps this logical data architecture to the actual existing database entities, repositories, and migrations.

## 30.2 WHEN

After blueprint approval and before implementation.

## 30.3 WHERE

The existing Nx monorepo and its configured PostgreSQL environment.

## 30.4 WHY

The target architecture must extend verified working code rather than recreate structures that already exist.

## 30.5 HOW

### Required inventory fields

| Field | Description |
|---|---|
| Domain | Logical owner |
| Entity | Existing TypeORM entity |
| Physical table | Actual PostgreSQL table |
| Primary key | Existing identifier |
| Tenant scope | Actual isolation mechanism |
| Relationships | Existing foreign keys and references |
| Repository | Existing data-access implementation |
| Migration | Migration creating or changing structure |
| Current status | Verified implementation state |
| Gap | Missing target requirement |
| Proposed action | Preserve, extend, migrate, or retire |
| Verification | Build, test, or database evidence |

### Important existing areas

The inventory must explicitly inspect:

- Provider and organization entities.
- People and Consumer Record entities.
- Residential Locations.
- Residential Assignments.
- Fire Drills.
- Compliance Results.
- Security and authorization entities.
- Regulatory Knowledge models.
- Knowledge Pack validation models.
- Existing import and onboarding infrastructure.

### No assumed physical changes

Logical entities described in this document are not automatically instructions to create new tables.

Existing equivalents must be identified first.

## 30.6 VERIFICATION

The inventory must be supported by actual repository files, migration history, and database evidence where available.

---

# 31. Data Implementation Sequence

## 31.1 WHAT

This section defines the required implementation order for approved data changes.

## 31.2 WHEN

It is used during authorized sprint work.

## 31.3 WHERE

Owning domains and existing TypeORM infrastructure.

## 31.4 WHY

Schema implementation must follow approved ownership, contracts, and lifecycle requirements.

## 31.5 HOW

| Step | Activity | Output |
|---|---|---|
| 1 | Identify workflow | ENG-001/ENG-002 reference |
| 2 | Identify entity | ENG-003 reference |
| 3 | Identify relationships | ENG-004 reference |
| 4 | Identify owner | ENG-008 service/domain |
| 5 | Identify API usage | ENG-009 contract |
| 6 | Identify authorization | ENG-010 policy |
| 7 | Inspect repository | Verified existing implementation |
| 8 | Define schema change | Approved physical design |
| 9 | Define migration | Reviewed TypeORM migration |
| 10 | Define transaction behavior | Consistency contract |
| 11 | Define historical requirements | Versioning and lineage |
| 12 | Define tests | Integrity and isolation coverage |
| 13 | Implement after approval | Domain-owned persistence |
| 14 | Run migrations in test | Verified migration result |
| 15 | Run integration and security tests | Verification evidence |
| 16 | Update Software Change Register | Recorded change |

## 31.6 VERIFICATION

No data change is complete without migration verification, ownership review, integrity tests, and a Software Change Register entry.

---

# 32. Data Architecture Acceptance Criteria

The data architecture is ready for implementation planning when:

- [ ] PostgreSQL remains the approved transactional persistence foundation.
- [ ] TypeORM remains the approved migration and mapping mechanism.
- [ ] Domain ownership is defined.
- [ ] Tenant isolation rules are defined.
- [ ] Organization and resource scoping are defined.
- [ ] Operational record ownership is preserved.
- [ ] Regulatory Knowledge persistence is defined.
- [ ] Financial Knowledge persistence is defined independently.
- [ ] Shared Intelligence persistence is defined.
- [ ] Compliance execution history is defined.
- [ ] Financial execution history is defined.
- [ ] Historical reproducibility requirements are defined.
- [ ] Effective dates and execution timestamps are distinguished.
- [ ] Financial precision requirements are defined.
- [ ] Evidence relationships are defined.
- [ ] Document metadata and binary storage are separated appropriately.
- [ ] Binder persistence and lifecycle are defined.
- [ ] Survey event persistence is defined.
- [ ] Transactions and concurrency rules are defined.
- [ ] Import staging and idempotency are defined.
- [ ] Migration governance is defined.
- [ ] Retention and legal hold controls are defined.
- [ ] Backup and recovery requirements are defined.
- [ ] Data integrity and isolation tests are defined.
- [ ] Existing repository entities and migrations are reconciled before implementation.

---

# 33. Relationship to Other Engineering Documents

| Document | Relationship |
|---|---|
| ENG-001 — Master Workflow Catalog | Defines data-producing workflows |
| ENG-002 — Workflow Diagrams and State Machines | Defines lifecycle transitions |
| ENG-003 — Master Entity Catalog | Defines logical entities |
| ENG-004 — Entity Relationship Model | Defines relationships |
| ENG-005 — Nx Workspace Architecture | Defines persistence library boundaries |
| ENG-006 — Technology Implementation Standards | Defines TypeORM and backend conventions |
| ENG-007 — Frontend State Management Architecture | Defines client-side data state |
| ENG-008 — Service and Module Catalog | Defines data ownership and service responsibilities |
| ENG-009 — API and Event Contracts | Defines data exchange contracts |
| ENG-010 — Authorization and Permission Matrix | Defines access enforcement |
| ENG-011 — User Interface and Workspace Specification | Defines data presentation and interaction |
| ENG-013 — Testing and Quality Strategy | Defines verification suites |
| ENG-014 — Team Work Packages | Assigns implementation ownership |
| ENG-015 — Sprint Implementation Packages | Sequences implementation work |

---

# 34. Implementation Authorization

**Status: Not Granted**

This document defines the proposed data architecture.

It does not authorize:

- Creating or modifying database tables.
- Running database migrations.
- Changing TypeORM entities.
- Modifying repository implementations.
- Replacing existing persistence infrastructure.
- Changing production data.
- Changing tenant isolation rules.
- Introducing a new storage provider.
- Changing retention or deletion behavior.
- Beginning implementation.

All changes require approved engineering work packages, verified repository reconciliation, and explicit implementation authorization.

---

**End of ENG-012 — Data Architecture**