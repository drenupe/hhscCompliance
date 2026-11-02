# Regulatory Intelligence Platform

# 04 — Platform Architecture

**Version:** 2.0  
**Status:** Proposed Architecture — Design Baseline  
**Architecture Scope:** Universal Regulatory and Financial Intelligence Platform  
**Initial Implementation Environment:** Texas HCS  
**Implementation Authorization:** Not Granted

---

# 1. Purpose

This document defines the target architecture of the Regulatory Intelligence Platform.

The platform is designed to support regulatory, financial, and operational intelligence across multiple jurisdictions, industries, programs, and organizations.

The architecture establishes:

- Platform layers and responsibilities.
- Domain ownership boundaries.
- Knowledge authority boundaries.
- Shared intelligence services.
- Applied intelligence capabilities.
- Workspace and user experience boundaries.
- Integration and communication principles.
- Security and tenant-isolation requirements.
- Binder management and document governance.
- Historical traceability and reproducibility.
- Architectural constraints.
- Technology and deployment direction.

This is a logical architecture. It defines capabilities and responsibilities, not a requirement to deploy every capability as a separate service.

The existing Nx monorepo, Angular frontend, NestJS backend, TypeORM persistence, PostgreSQL database, and NgRx frontend state management remain the starting technical environment unless a separately approved architecture decision changes them.

The architecture is jurisdiction-neutral. Texas HCS is the initial implementation environment, not the definition of the universal platform.

# 2. Architectural Vision

The platform consists of six logical layers:

1. Platform Foundation.
2. Business and Operational Domains.
3. Independent Knowledge Authorities.
4. Shared Intelligence Services.
5. Applied Intelligence.
6. Workspaces and User Experience.

The two knowledge authorities are independent:

- Regulatory Knowledge Engine.
- Financial Knowledge Engine.

They provide authoritative knowledge to their respective intelligence capabilities.

Shared services support both authorities without taking ownership of their knowledge.

## 2.1 Governing Architecture Principle

**Knowledge defines authority. Business data provides facts. Intelligence applies knowledge to facts. Workspaces present results and support action.**

The platform must preserve the distinction between:

- Authoritative knowledge.
- Operational and financial records.
- Evidence and supporting documentation.
- Execution results and determinations.
- User interaction and workflow.

## 2.2 Universal Architecture Principle

The platform defines reusable operational capabilities.

Knowledge packs define jurisdiction-specific requirements.

Applicability connects operational facts to the appropriate authoritative knowledge.

Applied Intelligence evaluates operational and financial information against approved knowledge.

No jurisdiction-specific implementation may redefine the universal platform's fundamental ownership boundaries.

## 2.3 Logical Architecture Overview

The six layers work together as follows:

| Layer | Name | Primary Responsibility |
|---|---|---|
| 1 | Platform Foundation | Identity, tenancy, authorization, infrastructure, security |
| 2 | Business and Operational Domains | Organization, people, locations, services, workforce, financial and operational records |
| 3 | Independent Knowledge Authorities | Regulatory and financial definitions, requirements, applicability and knowledge packs |
| 4 | Shared Intelligence Services | Evidence, validation execution, documents, audit, versioning, approvals, binders and reporting infrastructure |
| 5 | Applied Intelligence | Compliance Intelligence, Financial Intelligence, evaluation, financial reporting and workflow |
| 6 | Workspaces and User Experience | Operational, financial, regulatory, survey and executive workspaces |

These are logical responsibilities. They do not require six physical services or a microservice deployment.

# 3. Logical Architecture

## Layer 1 — Platform Foundation

**Purpose:** Provide the technical and organizational infrastructure required by every platform capability.

### 3.1.1 Responsibilities

- Application hosting and runtime.
- Tenant and organization infrastructure.
- Identity and authentication.
- Authorization and access control.
- API infrastructure.
- Database and persistence infrastructure.
- File and object storage.
- Encryption and secrets management.
- Background processing.
- Integration infrastructure.
- Monitoring and observability.
- Configuration and environment management.
- Backup and recovery.
- Platform-wide audit infrastructure.
- Shared security infrastructure.
- Session management.

### 3.1.2 Primary Ownership

- Platform identity.
- Tenant boundaries.
- Infrastructure configuration.
- Technical security controls.
- Platform availability and reliability.
- Shared authentication and authorization mechanisms.
- Secure infrastructure for internal and external users.

### 3.1.3 Identity Separation

The platform must support distinct identity contexts for different user populations.

These include:

- Provider users.
- Platform administrators.
- Knowledge administrators.
- External survey personnel.
- Other authorized external reviewers.

Surveyor identities must remain separate from provider employee identities.

An external surveyor must not become a provider employee or inherit provider employee permissions merely because the surveyor has access to a provider's Survey Workspace.

### 3.1.4 Authorization

Authorization must support:

- Tenant-level access.
- Organization membership.
- Role-based permissions.
- Resource-level permissions.
- Record-level permissions.
- Location and program scope.
- External reviewer assignments.
- Time-limited access.
- Access expiration and revocation.

Authorization decisions must be enforced by backend services.

The Platform Foundation must not contain regulatory requirements, financial classifications, or program-specific business rules.

---

## Layer 2 — Business and Operational Domains

**Purpose:** Maintain the factual records describing organizations and their activities.

Business and operational domains own the records representing what organizations, people, employees, and financial operations actually do.

They do not independently establish regulatory compliance or authoritative financial treatment.

Operational domains are reusable business capabilities. They must not be hardcoded as individual jurisdiction-specific regulatory applications.

### 3.2.1 Organization Management

Responsibilities include:

- Organizations.
- Organization profiles.
- Organization memberships.
- Contracts.
- Programs.
- Jurisdictions associated with operations.
- Organizational relationships.
- Customer and tenant relationships.

Organization Management maintains organizational facts and relationships.

It does not determine which regulatory or financial requirements apply.

### 3.2.2 Location Management

Responsibilities include:

- Locations.
- Facilities.
- Service locations.
- Location assignments.
- Location characteristics.
- Location status.
- Location relationships.

Location Management must support multiple types of facilities and service locations without requiring a specific regulatory program.

### 3.2.3 People and Workforce Operations

Responsibilities include:

- People.
- Employees.
- Users and their separate identities.
- Guardians and authorized representatives.
- Clinical and professional contacts.
- Workforce assignments.
- Employee credentials.
- Training records.
- Supervision records.
- Workforce schedules.

Employee and person records remain owned by their originating domains.

Identity and authentication remain Platform Foundation responsibilities.

### 3.2.4 Residential Operations

Residential Operations is a reusable operational domain.

It is not a Texas HCS-specific compliance module.

Potential capabilities include:

- Residential location management.
- Residential assignments.
- Safety management.
- Emergency management.
- Fire drills.
- Emergency plans.
- Inspections.
- Environmental monitoring.
- Residential documentation.
- Corrective operational actions.

Different jurisdictions and programs may use Residential Operations through different applicable knowledge packs.

The operational domain maintains factual records and processes. Regulatory Knowledge determines which obligations apply, and Compliance Intelligence evaluates the evidence.

### 3.2.5 ISS Operations

ISS Operations is a separate reusable operational domain.

It is not a subtype of Residential Operations and is not owned by LevelUp Adventures.

Potential capabilities include:

- Participant operational records.
- Individualized goals and objectives.
- Activity planning.
- Service delivery.
- Community participation.
- Staff support records.
- Assistance and prompting observations.
- Progress tracking.
- Participant reviews.
- Supporting documentation.

ISS Operations must support individualization and preserve the distinction between:

- Standardized objective templates.
- Customer-customized templates.
- Actual individualized participant objectives.
- Planned activities.
- Actual service delivery.
- Observed assistance and support.
- Recorded participant progress.

A standardized template is a starting structure, not an automatically assigned participant goal.

Each individualized objective must reflect the participant's circumstances and applicable person-directed outcomes.

### 3.2.6 Workforce Operations

Workforce Operations is a reusable operational domain.

Potential capabilities include:

- Employee records.
- Credentials.
- Training.
- Qualifications.
- Assignments.
- Supervision.
- Schedules.
- Workforce documentation.
- Operational staffing records.

Workforce Operations provides factual records. It does not independently determine whether those records satisfy a regulatory requirement.

### 3.2.7 Financial Operations

Financial Operations is a reusable operational domain responsible for factual financial records.

Potential records include:

- Financial accounts.
- Transactions.
- Transaction lines.
- Vendors.
- Payroll records.
- Compensation records.
- Time entries.
- Benefits.
- Revenue.
- Expenses.
- Payments.
- Claims.
- Financial periods.
- Imported financial records.
- Reconciliation records.

Financial Operations owns the source facts.

The Financial Knowledge Engine determines how those facts must be classified, treated, allocated, calculated, and reported for an applicable financial purpose.

A payroll record describes what was paid. It does not independently establish whether the payment is allowable or how it must be allocated for a particular reporting requirement.

### 3.2.8 Document and Record Management

Operational domains may create and maintain source records and their document relationships.

Responsibilities include:

- Source documents.
- Organizational records.
- Imported records.
- Attachments.
- Document metadata.
- Document relationships.
- Record references.

The shared Document Service provides common document infrastructure.

Binder Management organizes and references authorized records without taking ownership of the underlying source records.

### 3.2.9 Operational Domain Ownership Rules

Each operational domain must:

- Own its factual records and operational lifecycle.
- Provide verified facts through defined contracts.
- Maintain record identity and version history.
- Use shared evidence, document, validation, audit, and reporting infrastructure.
- Request regulatory applicability from the Regulatory Knowledge Engine when required.
- Request financial applicability from the Financial Knowledge Engine when required.
- Preserve source ownership.
- Enforce applicable authorization requirements.

Operational domains must not independently declare regulatory compliance, financial allowability, or authoritative reporting treatment.

---

## Layer 3 — Independent Knowledge Authorities

This layer contains two separate and independent authorities.

### 3.3.1 Regulatory Knowledge Engine

**Purpose:** Establish what regulatory requirements apply and what those requirements require.

The Regulatory Knowledge Engine owns:

- Jurisdictions.
- Regulatory authorities.
- Regulatory sources.
- Regulatory source versions.
- Regulatory provisions.
- Regulatory obligations.
- Applicability profiles.
- Regulatory applicability definitions.
- Regulatory applicability decisions.
- Regulatory interpretations.
- Regulatory knowledge packs.
- Regulatory publication and lifecycle.
- Regulatory effective dates.
- Regulatory change history.

Responsibilities include:

- Identify authoritative regulatory sources.
- Preserve source provenance and citations.
- Represent provisions and obligations.
- Define regulatory applicability conditions.
- Preserve effective dates.
- Manage regulatory versions.
- Support controlled knowledge review and publication.
- Identify regulatory changes and their potential impact.
- Preserve historical regulatory determinations.

**Output:** Approved, versioned regulatory knowledge consumed by Compliance Intelligence and authorized shared services.

The Regulatory Knowledge Engine is the sole authority for regulatory requirements and regulatory applicability.

### 3.3.2 Financial Knowledge Engine

**Purpose:** Establish how financial information must be classified, treated, allocated, calculated, and reported.

The Financial Knowledge Engine owns:

- Financial authorities.
- Financial sources.
- Financial source versions.
- Financial concepts.
- Financial classifications.
- Cost categories.
- Allowability rules.
- Allocation methodologies.
- Allocation definitions.
- Reimbursement methodologies.
- Rate definitions.
- Financial formulas.
- Reporting definitions.
- Reporting schedules.
- Reporting lines.
- Statistical definitions.
- Financial validation rules.
- Financial applicability definitions.
- Financial applicability decisions.
- Financial knowledge packs.
- Financial publication and lifecycle.
- Financial effective dates.
- Financial change history.

Responsibilities include:

- Establish authoritative financial sources.
- Define financial concepts and classifications.
- Define cost treatment and allowability.
- Define allocation methodologies.
- Define financial calculations.
- Define reporting structures.
- Define financial validation requirements.
- Preserve reporting-period applicability.
- Support controlled knowledge review and publication.
- Identify financial changes and their potential impact.
- Preserve historical financial determinations.

**Output:** Approved, versioned financial knowledge consumed by Financial Intelligence and authorized shared services.

The Financial Knowledge Engine is the sole authority for financial definitions, methodologies, and financial applicability.

### 3.3.3 Knowledge Authority Separation

The two engines must remain independent.

Regulatory knowledge must not become a substitute for financial knowledge.

Financial knowledge must not become a substitute for regulatory knowledge.

Where regulatory and financial requirements intersect, the platform must preserve both authorities and their individual source references.

Neither knowledge engine may silently rewrite, replace, or reinterpret definitions owned by the other.

### 3.3.4 Applicability Ownership

Applicability is an authoritative determination, not a shared third authority.

- Regulatory Knowledge Engine determines regulatory applicability.
- Financial Knowledge Engine determines financial applicability.
- Operational domains provide factual context.
- Shared services execute approved definitions and preserve traceability.
- Applied Intelligence coordinates and presents the resulting determinations.

Regulatory applicability cannot be established by Financial Knowledge.

Financial applicability cannot be established by Regulatory Knowledge.

Operational domains cannot independently declare either determination.

If required facts are missing or insufficient, the platform must preserve an unresolved or insufficient-information result rather than assume applicability.

Every applicability result must preserve:

- Determining knowledge authority.
- Applicability definition identifier.
- Definition version.
- Knowledge pack version.
- Relevant source references.
- Input facts and record versions.
- Effective date or reporting period.
- Determination result.
- Execution context.

---

## Layer 4 — Shared Intelligence Services

**Purpose:** Provide reusable execution and infrastructure capabilities to both knowledge authorities, operational domains, and applied intelligence systems.

Shared services provide common execution infrastructure. They do not become additional regulatory or financial authorities.

### 3.4.1 Evidence Service

Responsibilities include:

- Evidence requirements.
- Evidence records.
- Evidence collection.
- Evidence relationships.
- Evidence provenance.
- Evidence review.
- Evidence sufficiency execution.
- Evidence expiration.
- Evidence retention.
- Evidence references.

Evidence may support:

- Operational validation.
- Regulatory obligations.
- Financial classifications.
- Financial calculations.
- Regulatory evaluations.
- Financial reporting.
- Binder assembly and review.

Evidence ownership and sufficiency requirements must remain consistent with the originating domain and applicable knowledge authority.

### 3.4.2 Validation Service

The shared Validation Service provides reusable validation execution.

It supports three distinct validation responsibilities.

**Operational Validation**

Owned by the originating operational domain.

Examples:

- Required fields are present.
- Dates are valid.
- Records are internally consistent.
- Required operational relationships exist.
- Required documentation has been recorded.

Operational validation does not establish regulatory compliance or financial allowability.

**Regulatory Validation**

Governed by the Regulatory Knowledge Engine.

It evaluates whether approved regulatory requirements have been satisfied using applicable operational records and evidence.

**Financial Validation**

Governed by the Financial Knowledge Engine.

It evaluates whether approved financial definitions, methodologies, calculations, and reporting requirements have been satisfied.

**Shared Execution Responsibility**

The shared Validation Service executes approved validation definitions and preserves results.

It does not create or own the regulatory or financial meaning of a validation.

Every material validation result must preserve:

- Validation responsibility type.
- Originating domain or knowledge authority.
- Validation definition identifier.
- Validation definition version.
- Applicable knowledge pack version.
- Execution date and context.
- Relevant business-record identifiers and versions.
- Inputs and supporting evidence references.
- Result and findings.
- Exceptions and unresolved conditions.

### 3.4.3 Document Service

Responsibilities include:

- Document registration.
- Document metadata.
- Document versioning.
- Secure storage.
- Document relationships.
- Document retrieval.
- Document presentation.
- Document access history.
- Document integrity.
- Controlled document delivery.

The Document Service provides shared infrastructure.

Source-document ownership remains with the originating domain.

### 3.4.4 Audit and Traceability Service

Responsibilities include:

- User activity.
- System activity.
- Knowledge publication events.
- Financial calculation events.
- Compliance evaluation events.
- Applicability determinations.
- Validation execution.
- Approval history.
- Binder assembly and lifecycle history.
- Document access history.
- Report generation history.
- Change history.
- Access expiration and revocation.
- Retention and legal-hold events.

Audit records must preserve who performed an action, what occurred, when it occurred, and the relevant record or execution context.

Audit history must not be silently overwritten.

### 3.4.5 Change and Version Service

Responsibilities include:

- Version identification.
- Source change tracking.
- Knowledge version relationships.
- Effective-date transitions.
- Impact analysis support.
- Historical version preservation.
- Execution-version references.
- Record-version relationships.

Regulatory and financial authorities remain responsible for their respective knowledge changes.

Shared version infrastructure does not own the meaning or approval of those changes.

### 3.4.6 Approval Service

Responsibilities include:

- Review workflows.
- Approval assignments.
- Approval decisions.
- Rejection and return.
- Publication authorization.
- Report certification workflows.
- Binder approval workflows.
- Release authorization.
- Approval history.

Approval infrastructure is shared, but approval authority remains domain-specific.

The relevant domain or knowledge authority defines who may approve a particular determination, publication, report, or release.

Automated assembly and validation may prepare an item for review. They must not independently perform an approval reserved for an authorized human or domain authority.

### 3.4.7 Reporting Infrastructure

Responsibilities include:

- Report execution infrastructure.
- Report snapshots.
- Export generation.
- Report version history.
- Report access.
- Report audit history.
- Cross-domain report execution.
- Historical report preservation.

Financial and regulatory report definitions remain owned by their appropriate knowledge authorities.

Shared Reporting Infrastructure executes approved report definitions and preserves outputs. It does not create authoritative reporting rules.

### 3.4.8 Binder Management

Binder Management is a reusable, extensible platform capability within the existing architecture.

It is not a seventh architecture layer and does not become a new knowledge authority.

Its purpose is to organize, assemble, govern, review, and preserve collections of records and evidence for defined business purposes.

Initial binder families include:

- Provider Survey Binder.
- Residential Survey Binder.
- ISS Survey Binder.
- Personnel Survey Binder.
- Financial Binder.

The platform must support additional binder families through governed configuration and defined capabilities without redesigning the platform.

**Common Binder Management responsibilities**

- Binder type registration and configuration.
- Binder instance creation.
- Binder identification.
- Binder ownership and scope.
- Binder lifecycle management.
- Record and document references.
- Evidence organization.
- Access assignments.
- Assembly and completeness checks.
- Review workflow.
- Approval and release workflow.
- Version preservation.
- Retention and legal-hold coordination.
- Audit history.

**Binder ownership boundary**

A binder organizes and references records.

It does not own, replace, or silently duplicate the authoritative source records.

Each originating domain retains ownership of its source records.

Binder access does not automatically grant access to every referenced record.

Users must be authorized for the binder and for each underlying record.

If access to a source record is revoked, the binder must respect that restriction while preserving permitted reference and audit history.

**Automatic Binder Assembly**

Binder Management may automatically:

1. Identify required records and evidence based on binder type and scope.
2. Retrieve authorized references from originating domains.
3. Check completeness and applicable evidence requirements.
4. Identify missing, expired, incomplete, or inaccessible records.
5. Preserve source ownership and record-level authorization.
6. Assemble the binder for human review.
7. Present outstanding gaps and exceptions.
8. Preserve the assembled version and assembly history.

Automatic assembly does not authorize automatic certification or release.

An authorized human must complete required review and approval before certification or release.

**Common Binder Lifecycle**

The common lifecycle includes:

1. Draft.
2. Assembling.
3. Under Review.
4. Approved.
5. Released.
6. Closed.
7. Archived.

Individual binder families may introduce specialized states where their business purpose requires them.

Shared Binder Management governs the common lifecycle. The relevant business capability governs specialized behavior.

**Binder Approval Requirements**

Each binder type defines whether formal approval is required and identifies its approval authority.

Examples:

- Financial Binders require applicable financial review and approval before certification or release.
- Survey Binders require applicable provider review and release authorization before external surveyor access.
- Other binder types may define their own approval requirements.

The platform must prevent closure or release while mandatory approvals remain outstanding.

**Binder Retention and Legal Holds**

- Each binder type must have an applicable retention policy.
- Source records retain their originating domain's retention policies.
- Binder retention cannot shorten or replace source-record retention.
- Legal holds may apply to an individual record, a binder, or both.
- Archiving or disposing of a binder cannot bypass source-record or audit-history retention requirements.
- Legal holds prevent unauthorized deletion or alteration until properly released.
- Retention, legal-hold, and disposal actions must be auditable.

**Binder Types and Instances**

The platform must support multiple binder families and multiple instances within each family.

A binder instance must identify, as applicable:

- Binder identifier.
- Binder type.
- Owner.
- Tenant and organization scope.
- Location or program scope.
- Reporting period or survey event.
- Lifecycle status.
- Access assignments.
- Document and record relationships.
- Version history.
- Approval history.
- Audit history.

### 3.4.9 Survey Binder and Survey Workspace Boundary

The Survey Binder and Survey Workspace are separate capabilities.

**Survey Binder**

Organizes records, evidence, requests, responses, and history for an authorized survey or review.

**Survey Workspace**

Provides the secure access and interaction environment for external survey personnel and authorized provider users.

**Binder Management**

Creates and governs the Survey Binder type and its instances.

**Identity and Authorization**

Determines who may access the workspace, binder, and individual source records.

A Survey Workspace may support multiple binders within the same survey event when authorized and appropriate. Separate binders must not be merged merely because they share a workspace.

### 3.4.10 Surveyor Access and Document Presentation

Surveyor access must support:

- Individual external identities.
- Independent authentication.
- Multi-factor authentication.
- Assigned survey event.
- Assigned provider scope.
- Assigned location scope.
- Record-level authorization.
- Secure document presentation.
- Document requests.
- Provider responses.
- Comments and clarification.
- Session management.
- Access expiration.
- Immediate revocation.
- Complete activity history.

Surveyor identity must remain separate from provider employee identity.

Surveyor access must be limited to assigned work and must not grant access to unrelated provider records or other survey events.

Relevant document views, requests, responses, downloads, and access events must be auditable.

Expiration or revocation of workspace access must not delete the underlying binder, provider records, or survey history.

---

## Layer 5 — Applied Intelligence

This layer applies authoritative knowledge to actual organizational and operational records.

Applied Intelligence consumes approved knowledge and verified facts. It does not create authoritative knowledge.

### 3.5.1 Compliance Intelligence

Consumes:

- Regulatory Knowledge Engine.
- Regulatory applicability decisions.
- Organization and location records.
- People and service delivery records.
- Operational domain records.
- Evidence.
- Validation results.
- Document records.

Responsibilities:

- Obtain applicable regulatory obligations.
- Evaluate operational records.
- Identify compliance gaps.
- Generate findings.
- Support corrective actions.
- Track remediation.
- Perform reassessment.
- Produce compliance status and reporting.
- Preserve regulatory evaluation traceability.

Compliance Intelligence must not invent regulatory obligations or independently redefine regulatory applicability.

### 3.5.2 Financial Intelligence

Consumes:

- Financial Knowledge Engine.
- Financial applicability decisions.
- Accounting and transaction records.
- Payroll records.
- Compensation records.
- Service delivery statistics.
- Location records.
- Evidence.
- Validation results.

Responsibilities:

- Map financial source records.
- Classify costs.
- Evaluate allowability.
- Apply approved allocation methodologies.
- Execute financial formulas.
- Reconcile financial records.
- Identify exceptions.
- Prepare financial reports.
- Preserve calculation traceability.

Financial Intelligence must not invent financial methodologies, redefine financial applicability, or silently alter approved financial treatment.

### 3.5.3 Financial Reporting

Responsibilities:

- Reporting period management.
- Reporting schedule preparation.
- Reporting line calculation.
- Statistical reporting.
- Financial reconciliation.
- Financial validation.
- Review and approval.
- Report generation.
- Historical report preservation.

Official reporting values must remain distinguishable from internal management accounting values.

Financial reporting must preserve the originating financial authority, definitions, inputs, calculations, validations, review, and approval history.

### 3.5.4 Compliance Evaluation and Workflow

Responsibilities:

- Obligation evaluation.
- Finding creation.
- Finding assignment.
- Corrective action plans.
- Remediation evidence.
- Status management.
- Reassessment.
- Closure and reopening.
- Compliance history.

Compliance evaluation must use approved regulatory knowledge and preserve the relevant applicability and validation results.

### 3.5.5 Financial Binder

The Financial Binder is a first-class financial reporting and review capability.

It organizes and preserves the financial reporting package and its review history.

It is authoritative for the assembled package and its documented review history, but it does not own the originating financial records or financial rules.

It must preserve:

- Original imported records.
- Source data and source versions.
- Financial knowledge versions.
- Account and transaction mappings.
- Classifications.
- Financial applicability decisions.
- Allowability decisions.
- Allocation methods and inputs.
- Calculation inputs and outputs.
- Validation results.
- Reconciliation.
- Evidence and documents.
- Reviewer notes.
- Approvals.
- Report snapshots.
- Audit history.

A reviewer must be able to trace a reported value back to its originating records, applicable financial definitions, calculation inputs, and supporting evidence.

The Financial Binder remains distinct from Survey Binder families while using shared Binder Management infrastructure.

### 3.5.6 Cross-Domain Reporting and Executive Intelligence

The platform may combine approved information from multiple operational and intelligence domains.

Cross-domain reporting must preserve:

- Originating record ownership.
- Source references.
- Authorization context.
- Reporting period.
- Applicable knowledge versions.
- Regulatory determinations.
- Financial determinations.
- Report generation history.
- Required approvals.

Originating domains remain responsible for the accuracy of their source records.

Regulatory determinations retain Regulatory Knowledge Engine authority.

Financial classifications, calculations, and official reporting values retain Financial Knowledge Engine authority.

A management report may combine information from multiple domains, but it cannot independently certify regulatory compliance or official financial results.

Where a report requires multiple authoritative determinations, each determination and its approval must remain independently identifiable.

Approval of a combined management report does not imply approval of its underlying regulatory or financial conclusions.

---

## Layer 6 — Workspaces and User Experience

The user experience is organized around user roles, responsibilities, and authorized access.

### 3.6.1 Provider Intelligence Center

Provides organization-wide operational, regulatory, and financial visibility.

Potential capabilities:

- Organization overview.
- Compliance status.
- Financial status.
- Findings and corrective actions.
- Outstanding tasks.
- Deadlines.
- Location-level visibility.
- Alerts and exceptions.
- Management indicators.

The provider-wide dashboard must not require a location identifier to retrieve organization-wide information.

Location-level filtering may be applied when the user requests a specific location view.

### 3.6.2 Compliance Workbench

Provides:

- Regulatory modules.
- Applicable obligations.
- Applicability results.
- Findings.
- Evidence requirements.
- Remediation tasks.
- Corrective action plans.
- Reassessment.
- Compliance history.

### 3.6.3 Financial Workbench

Provides:

- Financial reporting periods.
- Financial data intake.
- Account mapping.
- Cost classification.
- Allowability review.
- Allocation review.
- Calculations.
- Reconciliation.
- Validation.
- Reporting status.
- Financial exceptions.

### 3.6.4 Financial Binder Workspace

Provides:

- Financial document organization.
- Reporting package assembly.
- Review.
- Reconciliation visibility.
- Approval.
- Certification workflow where required.
- Traceability.
- Historical package access.

### 3.6.5 Survey Workspace

Provides authorized external reviewers with secure, scoped access to assigned records.

Capabilities include:

- Surveyor authentication.
- Assigned survey event access.
- Assigned provider and location scope.
- Record-level authorization.
- Secure document presentation.
- Document requests.
- Provider responses.
- Comments and clarification.
- Session management.
- Access expiration and revocation.
- Activity history.

### 3.6.6 Knowledge Administration Workspace

Provides authorized knowledge administrators with controlled tools for:

- Source registration.
- Knowledge authoring.
- Knowledge validation.
- Review.
- Approval.
- Publication.
- Version management.
- Retirement.
- Change impact review.

Regulatory and financial knowledge administration must preserve independent authority boundaries.

### 3.6.7 Operational Workspaces

Operational workspaces provide role-appropriate interfaces for the reusable operational domains.

Examples include:

- Residential Operations Workspace.
- ISS Operations Workspace.
- Workforce Operations Workspace.
- Financial Operations Workspace.

These workspaces support operational processes and records.

They must not embed authoritative regulatory or financial rules that belong to the knowledge engines.

### 3.6.8 Executive Intelligence

Provides approved management-level insights across operational, regulatory, and financial domains.

Management indicators must be clearly distinguished from:

- Official regulatory determinations.
- Official financial reporting values.
- Unapproved or preliminary results.
- Operational indicators.

# 4. Cross-Layer Communication

The architecture uses explicit contracts between logical layers.

## 4.1 Expected Communication Direction

1. Workspaces request information or actions from applied intelligence or operational capabilities.
2. Applied Intelligence retrieves business and operational facts.
3. Operational domains provide verified factual context.
4. Applied Intelligence requests or consumes approved knowledge from the appropriate knowledge authority.
5. The appropriate knowledge authority determines its own applicability and authoritative definitions.
6. Shared services execute approved evidence, validation, document, audit, approval, binder, and reporting infrastructure.
7. Applied Intelligence returns structured results and traceability references.
8. Workspaces display results and support authorized user actions.

## 4.2 Communication Rules

- Business domains do not directly modify knowledge definitions.
- Applied Intelligence does not create authoritative knowledge.
- Shared services do not own regulatory or financial rules.
- User interfaces do not contain authoritative business rules.
- AI does not independently publish authoritative knowledge.
- Cross-domain communication must use defined contracts.
- Sensitive operations must enforce authorization at the service boundary.
- Results must identify the knowledge version used.
- Applicability determinations must identify their originating authority.
- Validation results must identify their responsibility type and definition owner.
- Binder references must preserve source ownership and record-level authorization.
- Report outputs must preserve originating domain and authority references.
- Approval must follow the authority assigned to the specific decision or report type.

## 4.3 Shared Contract Boundaries

| Capability | Authority or owner |
|---|---|
| Operational facts | Originating operational domain |
| Regulatory definitions | Regulatory Knowledge Engine |
| Regulatory applicability | Regulatory Knowledge Engine |
| Financial definitions | Financial Knowledge Engine |
| Financial applicability | Financial Knowledge Engine |
| Operational validation | Operational domain |
| Regulatory validation | Regulatory Knowledge Engine |
| Financial validation | Financial Knowledge Engine |
| Validation execution | Shared Validation Service |
| Document infrastructure | Shared Document Service |
| Binder lifecycle infrastructure | Binder Management |
| Source-record authorization | Originating domain and Platform Authorization |
| External surveyor identity | Platform Identity and Authorization |
| Compliance conclusions | Compliance Intelligence using approved regulatory knowledge |
| Financial conclusions | Financial Intelligence using approved financial knowledge |
| Cross-domain presentation | Applied Intelligence and Reporting Infrastructure |

Shared services execute approved responsibilities without assuming the authority of the originating domain.

# 5. Traceability and Historical Reproducibility

Every material intelligence result must be explainable using the source information, knowledge versions, inputs, definitions, and execution context that produced it.

## 5.1 Regulatory Traceability

Regulatory evaluation must preserve the relationship:

Regulatory Source  
→ Source Version  
→ Provision  
→ Obligation  
→ Applicability Definition  
→ Applicability Decision  
→ Operational Records  
→ Evidence  
→ Validation  
→ Compliance Evaluation  
→ Finding  
→ Corrective Action  
→ Reassessment

## 5.2 Financial Traceability

Financial reporting must preserve the relationship:

Financial Source  
→ Source Version  
→ Financial Definition  
→ Financial Applicability  
→ Imported Record  
→ Classification  
→ Allowability  
→ Allocation  
→ Calculation  
→ Validation  
→ Review  
→ Approval  
→ Report

## 5.3 Binder Traceability

Binder history must preserve:

- Binder type and instance.
- Binder scope and ownership.
- Source-record references.
- Source-record versions where applicable.
- Document references and versions.
- Assembly history.
- Completeness and exception results.
- Review decisions.
- Approval history.
- Release history.
- Access history.
- Retention and legal-hold events.
- Historical binder versions.

## 5.4 Historical Reproducibility

The platform must preserve the information required to explain historical results.

For each historical compliance evaluation, financial calculation, validation, binder, or report, preserve as applicable:

- Exact knowledge pack version.
- Exact definition version.
- Source records and relevant record versions.
- Inputs.
- Effective dates or reporting periods.
- Applicability determinations.
- Validation definitions and results.
- Calculation or evaluation outputs.
- Evidence references.
- Approval decisions.
- Execution context.
- Report or binder snapshots.

Changes to current knowledge, templates, or operational records must not silently rewrite historical results.

Re-running an evaluation or calculation must create a new execution record. It must not overwrite the original.

Historical reproducibility means that the original result can be explained using its original rules, inputs, decisions, and outputs. It does not mean historical results must be recalculated under today's rules.

# 6. Security and Tenant Isolation

All layers must enforce the platform security architecture.

## 6.1 Security Requirements

- Tenant isolation.
- Organization membership.
- Role-based authorization.
- Resource-level authorization.
- Record-level authorization.
- Least privilege.
- Secure API access.
- Encryption in transit and at rest.
- Protected document storage.
- Auditable privileged operations.
- Separation of provider and surveyor identities.
- Multi-factor authentication for external survey personnel.
- Time-limited external access.
- Access expiration and revocation.
- Session controls.
- Secure document presentation.
- Retention and legal-hold controls.

## 6.2 Authorization Boundaries

Authorization must be enforced by backend services, not merely by hiding interface controls.

A user must be authorized for the requested binder and each underlying source record.

Binder access must not bypass source-record authorization.

External surveyor permissions must be limited to assigned survey events, providers, locations, and records.

Revoked or expired access must no longer permit access to protected content.

## 6.3 Tenant Isolation

Customer-owned operational records must remain isolated by tenant and applicable organizational scope.

LevelUp Adventures is a customer using the ISS operational capability.

Its participant records, objectives, activities, staff records, templates, and business procedures remain within its authorized tenant scope.

Other customers must not inherit access to LevelUp Adventures' records, templates, branding, or customer-specific configuration.

## 6.4 Identity Separation

Provider employee identities and external surveyor identities must remain distinct.

External survey access must not create implicit provider employment or organizational membership.

Platform administrators, knowledge administrators, provider users, and survey personnel must receive only the permissions required for their assigned responsibilities.

# 7. Technology and Deployment Architecture

The logical architecture does not require immediate microservice deployment.

The initial implementation direction remains:

- Nx monorepo.
- Angular standalone frontend.
- NestJS backend.
- TypeORM persistence.
- PostgreSQL database.
- NgRx where appropriate for frontend state.
- Shared API contracts.
- Modular domain boundaries.

Logical domains should be organized into independently understandable modules with explicit ownership and contracts.

Physical service separation may be considered later when justified by:

- Scale.
- Security.
- Deployment independence.
- Operational requirements.
- Reliability.
- Resource isolation.

The platform must avoid premature distributed-system complexity.

The architecture establishes logical separation without requiring every capability to become an independently deployed service.

# 8. Architectural Constraints

The following constraints are mandatory:

1. Regulatory and financial knowledge remain separate authorities.
2. Business and operational records remain separate from knowledge definitions.
3. Operational domains are reusable capabilities, not jurisdiction-specific regulatory applications.
4. Applied Intelligence consumes approved knowledge.
5. Shared services execute reusable capabilities without owning domain rules.
6. Regulatory applicability remains owned by Regulatory Knowledge.
7. Financial applicability remains owned by Financial Knowledge.
8. Operational, regulatory, and financial validation remain distinct responsibilities.
9. Historical knowledge versions remain preserved.
10. Historical calculations, evaluations, reports, and binders remain explainable.
11. Tenant and resource authorization are enforced server-side.
12. Surveyor identities remain separate from provider employee identities.
13. Binder access cannot bypass source-record authorization.
14. Binder Management does not replace source-record ownership.
15. Binder assembly cannot independently certify or release a binder.
16. Required human and domain approvals must be preserved.
17. Cross-domain reports must preserve originating authority references.
18. Management accounting values must not be confused with official reporting values.
19. AI-generated knowledge requires authorized review and approval.
20. No new feature may bypass its authoritative knowledge engine.
21. No implementation may begin without approved sprint design and explicit implementation authorization.
22. Existing implementation and uncommitted work must be preserved during architecture reconciliation.
23. Existing capabilities must be assessed for reuse before creating duplicate entities or services.
24. Changes to historical records, knowledge, templates, or execution results must preserve required historical versions and audit history.

# 9. Initial Implementation Sequence

The architecture will be validated through the approved 47-sprint roadmap.

The existing roadmap remains the governing baseline. Sprint sequencing may be adjusted only when an actual dependency or demonstrable architectural improvement justifies the change.

## 9.1 First Financial Vertical Slice

The first complete vertical slice is Texas HCS Cost Reporting.

The first financial implementation must establish:

- Financial Knowledge Engine.
- Texas HCS financial knowledge pack.
- Financial data intake.
- Cost classification and allowability.
- Cost allocation.
- Financial calculations.
- Financial validation.
- Financial Binder.
- HCS Cost Reporting preparation and review.
- Historical financial traceability.

## 9.2 Subsequent Regulatory Vertical Slice

Texas HCS Emergency Preparedness remains the subsequent regulatory vertical slice.

It will demonstrate how reusable Residential Operations capabilities are evaluated against approved Texas HCS regulatory knowledge.

## 9.3 ISS Operations

ISS Operations remains a reusable operational domain.

The Texas ISS Knowledge Pack remains independently governed by the Regulatory Knowledge Engine.

LevelUp Adventures is the first customer implementation, not the owner of the universal ISS capability.

The complete ISS implementation sequence will be determined through roadmap dependency analysis after required shared operational, applicability, validation, template-governance, and security foundations are established.

## 9.4 Existing Platform Preservation

Existing entities, services, modules, APIs, and migrations must be preserved and assessed before any replacement or refactoring.

The governing approach is:

**Preservation first. Reuse second. Extension third. Refactoring only when justified.**

Any proposed code changes must be documented in the applicable sprint software change register.

No implementation is authorized by this document.

# 10. Remaining Detailed Design Work

The major architecture boundaries and integration decisions have been established.

The following detailed design subjects remain subject to their respective domain and sprint design reviews:

- Universal organization, tenancy, and identity contracts.
- Universal domain identifiers and entity relationships.
- Regulatory and financial knowledge authority interfaces.
- Knowledge pack publication and lifecycle implementation.
- Financial source and reporting-period data models.
- Financial data import and reconciliation contracts.
- Operational, regulatory, and financial validation interfaces.
- Evidence ownership and evidence-sufficiency implementation.
- Calculation execution and reproducibility implementation.
- Binder data model and type-specific configuration.
- Survey Workspace document streaming and session implementation.
- Cross-domain reporting data contracts.
- AI assistance boundaries and human approval workflows.
- Retention, legal-hold, and disposal implementation details.

These subjects do not reopen the approved authority, ownership, and separation decisions in this architecture.

They define the detailed contracts and implementation designs needed to realize them.

# 11. Architecture Acceptance Criteria

This architecture document establishes the following design baseline:

- All six logical layers have defined responsibilities.
- Both knowledge authorities have independent ownership.
- Business and operational domains have clear boundaries.
- Reusable operational domains are explicitly established.
- Shared services have defined responsibilities.
- Applicability ownership is clear.
- Operational, regulatory, and financial validation responsibilities are distinct.
- Applied Intelligence capabilities have defined inputs and outputs.
- Binder Management responsibilities and boundaries are documented.
- Survey Binder and Survey Workspace responsibilities are separate.
- Financial Binder remains a first-class financial capability.
- Binder lifecycle, approval, retention, and authorization principles are established.
- Workspace responsibilities are documented.
- Cross-layer communication rules are established.
- Cross-domain reporting boundaries are established.
- Traceability and historical reproducibility requirements are established.
- Security and tenant-isolation principles are incorporated.
- Existing implementation preservation requirements are established.
- Remaining detailed design work is identified.
- No implementation authorization is implied.

# 12. Governing Principle

**One platform. Two independent knowledge authorities. Reusable operational capabilities. Shared intelligence. Traceable operational outcomes.**

This document establishes the proposed logical architecture.

It does not authorize implementation.

# 13. Architecture Boundary Clarifications

The following clarifications are governing design requirements for this architecture.

## 13.1 Universal and Program-Specific Business Domains

Universal business and operational domains must remain independent of individual regulatory programs or jurisdictions.

Universal entities such as Organization, Location, Person, Employee, Contract, Document, and FinancialTransaction must not require Texas HCS-specific attributes.

Program-specific requirements must be represented through appropriate extensions, relationships, configurations, knowledge packs, or domain-specific models.

The universal domain model must support multiple jurisdictions, programs, and regulatory environments without requiring changes to its foundational entities for each new program.

## 13.2 Independent Knowledge Authority Ownership

The Regulatory Knowledge Engine and Financial Knowledge Engine independently own their respective:

- Source registries.
- Source versions and historical records.
- Domain definitions and classifications.
- Applicability definitions and determinations.
- Knowledge validation rules.
- Knowledge pack structures.
- Review and approval requirements.
- Publication and retirement lifecycles.
- Effective-date and historical applicability decisions.

Shared platform infrastructure may provide reusable storage, security, audit, versioning, and approval capabilities.

Shared infrastructure must not make regulatory or financial domain decisions.

Neither knowledge authority may modify, replace, or silently reinterpret definitions owned by the other.

## 13.3 Shared Validation Execution

The shared Validation Service executes approved validation definitions supplied by the appropriate knowledge authority or originating operational domain.

Every validation result must preserve:

- Validation responsibility type.
- Originating knowledge authority or operational domain.
- Validation definition identifier.
- Validation definition version.
- Knowledge pack version where applicable.
- Execution date and context.
- Applicable business-record identifiers and versions.
- Result, findings, and supporting evidence references.

The shared service executes validation. It does not own the regulatory or financial meaning of the validation.

## 13.4 Separation of Applied Intelligence

Compliance Intelligence and Financial Intelligence remain separate applied capabilities.

Compliance Intelligence applies Regulatory Knowledge to applicable organizational and operational records.

Financial Intelligence applies Financial Knowledge to financial records, classifications, allocations, calculations, and reporting.

Cross-domain reporting may present approved outputs from both capabilities.

Cross-domain reporting must not merge their underlying authorities, replace their conclusions, or remove their independent source and knowledge-version references.

## 13.5 Operational Domain Reuse

Residential Operations, ISS Operations, Workforce Operations, and Financial Operations are reusable business capabilities.

Their records and processes remain separate from jurisdiction-specific knowledge requirements.

A capability may serve multiple programs and jurisdictions through the applicable knowledge packs and approved configurations.

Customer-specific records, templates, branding, and procedures remain within their authorized tenant boundaries.

## 13.6 Binder Management Boundaries

Binder Management is a shared platform capability within the existing logical architecture.

It supports multiple binder families and instances without becoming a new architecture layer or knowledge authority.

A binder organizes and references source records but does not replace their originating domain ownership.

Binder assembly may be automated. Required certification and release approvals remain subject to authorized human and domain-specific approval.

## 13.7 Historical Preservation

Historical knowledge, source records, applicability decisions, validation results, calculations, evaluations, binder versions, approvals, and reports must remain explainable using their original versions and execution context.

New executions must create new historical records rather than overwrite prior results.

## 13.8 Design Baseline Status

This document incorporates the approved architectural integration decisions and boundary clarifications.

Its status is **Proposed Architecture — Design Baseline**.

Detailed domain contracts, entity relationships, validation interfaces, data models, and execution workflows remain subject to their respective design and implementation-readiness work.

Design baseline acceptance does not authorize implementation.