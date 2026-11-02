# Regulatory Intelligence Platform
# Document 06 — Regulatory Knowledge Engine Architecture

**Document Version:** 1.0  
**Status:** Proposed Architecture Baseline  
**Architecture Scope:** Universal, jurisdiction-neutral Regulatory Knowledge Engine  
**Related Documents:** 01 Current Architecture Baseline; 02 Security and Tenant Isolation; 03 Master Sprint Roadmap; 04 Platform Architecture; 05 Universal Domain Model  
**Implementation Status:** Design only — no implementation authorization

---

## 1. Purpose

The Regulatory Knowledge Engine is the platform's authoritative source of regulatory knowledge.

Its responsibility is to continuously translate authoritative regulatory sources into structured, validated, versioned, and governed operational knowledge.

The engine must support multiple jurisdictions, regulatory authorities, industries, programs, and regulatory frameworks without redesigning its underlying architecture.

Its purpose is to answer:

- What regulatory requirements exist?
- Which authority issued them?
- Which source and version establish them?
- What does each requirement require?
- Which organizations, programs, people, services, or circumstances are subject to the requirement?
- When does the requirement become effective?
- What evidence demonstrates that the requirement has been met?
- How can the requirement be evaluated consistently?
- What changed when a source or interpretation was updated?

The Regulatory Knowledge Engine owns the authoritative regulatory definitions used by Compliance Intelligence.

Customer operational records provide the facts against which those definitions are evaluated.

The engine does not own customer operational data.

## 2. Architectural Position

The Regulatory Knowledge Engine is an independent knowledge authority within the Regulatory Intelligence Platform.

It is separate from:

- The Financial Knowledge Engine.
- Customer tenants and organizations.
- Operational business domains.
- Compliance evaluation execution.
- Shared evidence and validation infrastructure.
- AI assistance and user-interface workspaces.

Its position in the architecture is:

**Authoritative Sources → Regulatory Knowledge Pipeline → Governed Regulatory Knowledge → Compliance Intelligence → Operational Workflows**

The engine defines what is required.

Compliance Intelligence applies those requirements to customer operational facts.

Shared services support evidence collection, validation execution, audit, and traceability without becoming owners of regulatory rules.

## 3. Core Architectural Principles

The Regulatory Knowledge Engine must follow these principles:

1. **Authority first:** Every regulatory requirement must be traceable to an authoritative source.
2. **Source preservation:** Original source material and source versions must be retained or referenced appropriately.
3. **Structured knowledge:** Requirements must be represented as structured, machine-readable knowledge.
4. **Jurisdiction neutrality:** The engine must not assume Texas or any single regulatory framework.
5. **Explicit applicability:** Requirements must identify their applicable jurisdiction, program, population, service, or circumstances.
6. **Version control:** Regulatory knowledge must be versioned and historically reproducible.
7. **Effective dating:** Publication dates, effective dates, and retirement dates must be distinct.
8. **Human governance:** AI-generated extraction and interpretation must undergo defined review and approval.
9. **Controlled publication:** Draft knowledge must never be treated as approved operational authority.
10. **Traceability:** Every operational evaluation must identify the exact knowledge used.
11. **Separation of authorities:** Regulatory knowledge must not absorb financial rules owned by the Financial Knowledge Engine.
12. **No customer ownership of law:** Customers use applicable knowledge packs but do not become owners of the underlying regulatory authority.

## 4. Regulatory Knowledge Domain Model

The engine is composed of the following principal domain concepts.

### 4.1 Jurisdiction

Represents the governmental or geographic jurisdiction in which a regulatory authority operates.

Examples:

- Federal.
- State.
- Provincial.
- Regional.
- Local.

Jurisdictions may have parent-child relationships.

### 4.2 RegulatoryAuthority

Represents an agency, department, commission, legislature, or other recognized regulatory authority.

It identifies the body responsible for issuing or administering regulatory material.

### 4.3 RegulatorySource

Represents an authoritative regulatory source.

Examples:

- Statutes.
- Administrative codes.
- Regulations.
- Official rules.
- Official agency manuals.
- Official forms and instructions.
- Official guidance, when its authority and status are established.

Every source must identify its issuing authority and source type.

### 4.4 RegulatorySourceVersion

Represents a specific version of a regulatory source.

It preserves:

- Source identifier.
- Version identifier.
- Publication date.
- Effective date.
- Supersession date, when applicable.
- Retrieval date.
- Source location or official reference.
- Original document reference or preserved source content.
- Integrity metadata.
- Review status.

A source update must create a traceable historical version rather than silently replacing the previous version.

### 4.5 RegulatoryProvision

Represents a specific provision within a regulatory source.

Examples include:

- Section.
- Subsection.
- Paragraph.
- Subparagraph.
- Rule.
- Article.
- Appendix.
- Official form instruction.

A provision must retain its source and source-version relationship.

### 4.6 RegulatoryObligation

Represents a structured requirement derived from an authoritative provision.

An obligation should describe:

- What must or must not happen.
- Who is responsible.
- Who or what is affected.
- Applicable conditions.
- Required timing or frequency, when established.
- Required documentation or evidence, when established.
- Applicable exceptions.
- Source provision.
- Effective period.
- Review and approval status.

The obligation must not claim more than the source supports.

### 4.7 RegulatoryDefinition

Represents a defined term or concept used in regulatory knowledge.

It should preserve:

- Defined term.
- Definition.
- Source provision.
- Applicable jurisdiction and program.
- Effective period.
- Relationship to other definitions.

### 4.8 RegulatoryInterpretation

Represents an approved interpretation or explanation of regulatory material.

Interpretations must be distinguished from the source text itself.

They must preserve:

- Interpretation author or reviewer.
- Supporting source provisions.
- Rationale.
- Scope.
- Approval status.
- Version.
- Effective or review date.

An interpretation must never be presented as verbatim law.

### 4.9 ApplicabilityDefinition

Represents the conditions under which a regulatory obligation applies.

Applicability may depend on:

- Jurisdiction.
- Program.
- Organization type.
- License or authorization.
- Service type.
- Location type.
- Individual circumstances.
- Effective dates.
- Other source-supported conditions.

Applicability must be explicit and testable where possible.

### 4.10 RegulatoryKnowledgePack

Represents a governed collection of regulatory knowledge for a defined jurisdiction, program, authority, or regulatory scope.

A knowledge pack may contain:

- Source references.
- Source versions.
- Provisions.
- Definitions.
- Obligations.
- Applicability definitions.
- Approved interpretations.
- Evidence expectations.
- Validation definitions.
- Dependencies on other packs.

A knowledge pack is not a customer account or provider profile.

## 5. Regulatory Knowledge Pack Architecture

### 5.1 Knowledge Pack Identity

Every knowledge pack must have a stable identity independent of its versions.

A pack should identify:

- Unique pack ID.
- Name.
- Description.
- Jurisdiction.
- Regulatory authority or authorities.
- Program or regulatory scope.
- Maintainer.
- Current lifecycle status.

### 5.2 Knowledge Pack Version

Every published knowledge pack must have an immutable version.

A version must preserve:

- Included source versions.
- Included provisions.
- Included obligations.
- Applicability definitions.
- Interpretations.
- Validation definitions.
- Dependencies.
- Approval record.
- Publication date.
- Effective date.
- Change summary.

Published versions must not be silently modified.

### 5.3 Knowledge Pack Dependencies

Some regulatory requirements may depend on other authorities, programs, or related knowledge packs.

Dependencies must be explicit.

The engine must identify:

- Required pack.
- Required version or compatible version range.
- Dependency type.
- Effective period.
- Validation status.

A pack must not be published with unresolved mandatory dependencies.

### 5.4 Pack Composition

Knowledge packs should be composed from reusable regulatory knowledge components.

The architecture should avoid duplicating the same source or obligation merely because multiple operational capabilities use it.

Where one requirement applies across multiple programs, its applicability and program relationships must be represented explicitly.

## 6. Regulatory Knowledge Pipeline

The Regulatory Knowledge Pipeline governs the transformation of source material into certified operational knowledge.

The pipeline is:

**Official Sources → Source Intake → Extraction → Structuring → Regulatory Review → Validation → Approval → Publication → Monitoring → Change Management**

Each stage must have defined inputs, outputs, responsible roles, and quality gates.

### 6.1 Stage 1 — Official Source Identification

Identify the authoritative source and issuing authority.

Required outputs:

- Source identity.
- Authority.
- Jurisdiction.
- Source type.
- Official location or reference.
- Retrieval information.
- Initial authority assessment.

Quality gate:

The source's authority and relevance must be established before it is used to create regulatory obligations.

### 6.2 Stage 2 — Source Intake

Capture the source document or official source reference.

Required outputs:

- Source record.
- Source version record.
- Original source reference.
- Retrieval date.
- Publication and effective dates, when available.
- Integrity information.
- Intake status.

Quality gate:

The source must be identifiable and traceable to its issuing authority.

### 6.3 Stage 3 — Extraction

Extract source text and structure.

AI may assist with:

- Text extraction.
- Section identification.
- Definition detection.
- Cross-reference identification.
- Potential obligation identification.
- Change detection.
- Initial classification.

AI extraction is a draft-processing function. It does not establish approved regulatory knowledge.

Required outputs:

- Extracted text.
- Provision structure.
- Candidate definitions.
- Candidate obligations.
- Candidate applicability conditions.
- Extraction confidence and exceptions.

Quality gate:

Extracted material must be traceable to the original source and reviewed for completeness.

### 6.4 Stage 4 — Structuring

Convert extracted source content into structured regulatory knowledge.

Required outputs:

- Regulatory provisions.
- Candidate obligations.
- Definitions.
- Applicability definitions.
- Source relationships.
- Cross-references.
- Evidence expectations where supported.

Quality gate:

Each structured requirement must have a source reference and must distinguish source language from interpretation.

### 6.5 Stage 5 — Regulatory Review

A qualified regulatory reviewer examines the structured content.

Review includes:

- Source accuracy.
- Requirement meaning.
- Scope.
- Applicability.
- Exceptions.
- Timing and frequency.
- Responsible party.
- Evidence expectations.
- Cross-references.
- Conflicts or ambiguity.

Required outputs:

- Review findings.
- Corrections.
- Approved draft or rejection.
- Reviewer identity.
- Review timestamp.

Quality gate:

Unresolved material ambiguity prevents approval.

### 6.6 Stage 6 — Knowledge Validation

Validate the internal consistency and completeness of the knowledge pack.

Validation may include:

- Required field checks.
- Source-reference checks.
- Provision hierarchy checks.
- Applicability completeness.
- Duplicate detection.
- Dependency checks.
- Effective-date consistency.
- Rule schema validation.
- Test execution.
- Cross-reference integrity.

Required outputs:

- Validation report.
- Validation findings.
- Test results.
- Pack readiness status.

Quality gate:

A pack cannot proceed to publication with unresolved blocking validation findings.

### 6.7 Stage 7 — Approval

An authorized approver reviews the validated knowledge pack.

Approval must be separate from ordinary extraction and editing permissions.

Required outputs:

- Approval decision.
- Approver identity.
- Approval timestamp.
- Approved version.
- Approval scope.
- Conditions or restrictions.

Quality gate:

Only authorized approval can move a pack into the publication process.

### 6.8 Stage 8 — Publication

Publish the approved knowledge pack version for operational use.

Required outputs:

- Published pack version.
- Publication timestamp.
- Effective date.
- Publication record.
- Version integrity information.

Quality gate:

Only a published and applicable version may be used as operational regulatory authority.

### 6.9 Stage 9 — Monitoring

Monitor authoritative sources for updates, corrections, repeals, and new guidance.

Monitoring may include:

- Scheduled source checks.
- Official update feeds.
- Source page comparisons.
- Manual regulatory review.
- Change notifications.

Required outputs:

- Monitoring event.
- Potential source change.
- Affected provisions.
- Affected obligations.
- Review task.

Quality gate:

A detected change must be assessed before it changes published operational knowledge.

### 6.10 Stage 10 — Change Management

Evaluate the effect of a regulatory source change.

The process must identify:

- Previous source version.
- New source version.
- Added provisions.
- Changed provisions.
- Removed or repealed provisions.
- Affected obligations.
- Affected knowledge packs.
- Affected validation definitions.
- Potential customer impact.
- Required effective-date changes.

Required outputs:

- Change assessment.
- Impact analysis.
- Proposed knowledge update.
- Review and approval records.
- New published version when approved.

A source change must not silently rewrite previous compliance results.

## 7. Regulatory Obligation Structure

Every operational regulatory obligation must have a consistent structure.

At minimum, the model should support:

| Attribute | Purpose |
|---|---|
| Obligation ID | Stable identifier |
| Obligation version | Historical definition version |
| Title | Human-readable requirement name |
| Description | Structured explanation |
| Requirement type | Required, prohibited, conditional, or other defined type |
| Jurisdiction | Applicable jurisdiction |
| Authority | Issuing authority |
| Program | Applicable program, when relevant |
| Source ID | Originating source |
| Source version | Exact source version |
| Provision reference | Specific provision |
| Effective date | Start of applicability |
| End date | End of applicability, when applicable |
| Applicability definition | Conditions governing application |
| Responsible party | Entity or role responsible, when established |
| Evidence expectation | Supporting evidence, when established |
| Validation definition | Associated evaluation logic |
| Approval status | Governance status |

The model must distinguish:

- Source text.
- Structured obligation.
- Approved interpretation.
- Validation logic.
- Customer-specific evidence.

These are related but separate records.

## 8. Applicability Engine

The Applicability Engine determines whether a regulatory obligation applies to a particular operational context.

### 8.1 Inputs

Potential inputs include:

- Tenant.
- Organization.
- Provider profile.
- Jurisdiction.
- Program.
- Contract.
- Location.
- Facility.
- Person.
- Service.
- License or authorization.
- Relevant dates.
- Other source-supported conditions.

### 8.2 Applicability Results

The engine should support outcomes such as:

- Applicable.
- Not applicable.
- Conditionally applicable.
- Insufficient information.
- Requires regulatory review.

The result must preserve the conditions and evidence used to reach the determination.

### 8.3 Applicability Traceability

Every applicability decision must identify:

- Obligation and version.
- Knowledge pack and version.
- Source provision.
- Business context.
- Input record identifiers and versions.
- Evaluation date.
- Result.
- Explanation.
- Any unresolved conditions.

### 8.4 No Unsupported Applicability

The engine must not infer applicability from a provider's name, industry label, or assumed business model.

Where required facts are missing, the result must indicate insufficient information rather than assume the requirement applies or does not apply.

## 9. Regulatory Validation Definitions

The Regulatory Knowledge Engine owns regulatory validation definitions.

The shared Validation Service executes them.

A validation definition should identify:

- Stable definition ID.
- Definition version.
- Related obligation.
- Required input data.
- Applicability conditions.
- Evaluation logic or rule reference.
- Expected evidence.
- Result categories.
- Severity mapping, where appropriate.
- Effective period.
- Test cases.
- Approval status.

Validation logic must be traceable to the regulatory obligation it evaluates.

The shared service must not create its own independent regulatory requirements.

## 10. Evidence Expectations

The engine may define the types of evidence relevant to an obligation when supported by the source or an approved interpretation.

Evidence expectations may describe:

- Required record type.
- Required content.
- Relevant date or period.
- Responsible party.
- Required relationship to a person, location, service, or organization.
- Review requirements.
- Retention references, where established.

The engine defines regulatory evidence expectations.

The Shared Evidence Service stores and links actual evidence.

Customer records supply the evidence.

The engine must not claim that a document proves compliance merely because the document exists.

## 11. Regulatory Interpretations and Ambiguity

Regulatory source language may require interpretation.

The platform must preserve the difference between:

1. Official source language.
2. Structured obligation derived from that source.
3. Approved regulatory interpretation.
4. Operational validation logic.
5. AI-generated explanation.

Interpretations must include supporting source references and approval history.

When the source is ambiguous or conflicting:

- Record the ambiguity.
- Identify affected obligations.
- Identify conflicting provisions or authorities.
- Escalate for qualified review.
- Prevent unsupported assumptions from becoming approved rules.

AI-generated summaries and explanations must not be presented as authoritative legal determinations.

## 12. Regulatory Change Intelligence

Regulatory Change Intelligence identifies and evaluates changes to authoritative sources.

### 12.1 Change Detection

Potential changes include:

- New rules.
- Amended rules.
- Repealed rules.
- Corrected publications.
- Revised official forms.
- Updated official instructions.
- New agency guidance.

### 12.2 Change Impact Analysis

The engine must identify affected:

- Sources.
- Source versions.
- Provisions.
- Obligations.
- Applicability definitions.
- Validation definitions.
- Knowledge packs.
- Operational capabilities.
- Existing customer evaluations.

### 12.3 Customer Impact

The platform may identify which customer organizations could be affected by a published change based on their jurisdiction, program, and operational profile.

This is an impact notification capability, not a transfer of knowledge ownership to the customer.

### 12.4 Historical Results

Existing evaluations must retain the knowledge version originally used.

A new regulatory version may trigger a new evaluation, but must not rewrite the historical result.

## 13. Knowledge Governance and Roles

The Regulatory Knowledge Engine requires controlled governance.

### 13.1 Source Researcher

Responsibilities:

- Identify official sources.
- Capture source versions.
- Monitor updates.
- Prepare source records.
- Identify potential changes.

### 13.2 Regulatory Analyst

Responsibilities:

- Review extracted provisions.
- Structure obligations.
- Define applicability.
- Identify cross-references.
- Prepare interpretations for review.

### 13.3 Regulatory Reviewer

Responsibilities:

- Review source accuracy.
- Validate requirement meaning.
- Review applicability and exceptions.
- Resolve or escalate ambiguity.
- Approve regulatory content for final approval.

### 13.4 Knowledge Pack Approver

Responsibilities:

- Review validation results.
- Approve pack versions.
- Authorize publication.
- Establish effective dates and publication status.

### 13.5 Platform Administrator

Responsibilities:

- Manage platform-level access and configuration.
- Maintain technical operation.
- Enforce governance permissions.

Platform administration must not automatically grant regulatory approval authority.

### 13.6 Separation of Duties

The system should support separation between:

- Source intake.
- Knowledge editing.
- Regulatory review.
- Final approval.
- Publication.

Small teams may assign multiple roles to one person only where the approved governance policy permits it and the resulting audit trail remains clear.

## 14. Knowledge Pack Lifecycle

A knowledge pack must have a controlled lifecycle.

Proposed lifecycle states:

1. Draft.
2. In Research.
3. Structuring.
4. Under Review.
5. Validation Failed.
6. Ready for Approval.
7. Approved.
8. Scheduled.
9. Published.
10. Superseded.
11. Retired.

Transitions must be controlled.

A published pack version must be immutable.

A correction must produce a new version or an explicitly governed correction record.

A retired pack must remain available for historical traceability.

## 15. Regulatory Knowledge Testing

Every knowledge pack must have a defined testing strategy.

### 15.1 Structural Tests

Verify:

- Required metadata.
- Source relationships.
- Provision hierarchy.
- Version integrity.
- Effective-date consistency.
- Applicability references.
- Dependency integrity.

### 15.2 Regulatory Logic Tests

Verify:

- Obligation interpretation.
- Applicability conditions.
- Exceptions.
- Effective-date behavior.
- Validation logic.
- Expected outcomes.

### 15.3 Regression Tests

Previously approved test cases must be retained.

A change to a knowledge pack must identify tests affected by that change.

### 15.4 Negative Tests

Tests must verify that the engine does not:

- Apply a requirement outside its scope.
- Apply a requirement before its effective date.
- Apply a retired requirement as current.
- Treat draft content as published authority.
- Treat missing data as proof of compliance.
- Treat an AI suggestion as approved knowledge.
- Change historical results when a pack is updated.

## 16. Regulatory Knowledge APIs and Contracts

The engine must expose controlled application interfaces.

Potential contracts include:

### 16.1 Source Registry

Supports:

- Registering sources.
- Retrieving sources.
- Managing source versions.
- Reviewing source metadata.
- Identifying source changes.

### 16.2 Provision Registry

Supports:

- Retrieving provisions.
- Navigating provision hierarchy.
- Resolving source references.
- Identifying related provisions.

### 16.3 Obligation Registry

Supports:

- Retrieving obligations.
- Retrieving obligation versions.
- Searching obligations.
- Resolving source relationships.
- Identifying applicable obligations.

### 16.4 Applicability Evaluation

Supports:

- Evaluating obligation applicability.
- Retrieving applicability definitions.
- Returning explainable results.
- Preserving evaluation traceability.

### 16.5 Knowledge Pack Registry

Supports:

- Retrieving packs.
- Retrieving pack versions.
- Checking publication status.
- Resolving dependencies.
- Identifying effective versions.

### 16.6 Validation Definition Registry

Supports:

- Retrieving regulatory validation definitions.
- Retrieving definition versions.
- Resolving associated obligations.
- Supplying approved definitions to the shared Validation Service.

### 16.7 Change Intelligence

Supports:

- Registering change events.
- Retrieving impact assessments.
- Identifying affected packs.
- Tracking proposed updates.

API names and endpoint paths will be finalized during implementation readiness.

## 17. Relationship to Shared Intelligence Services

The Regulatory Knowledge Engine defines regulatory knowledge.

Shared services provide reusable execution and infrastructure.

| Shared service | Regulatory Knowledge Engine responsibility |
|---|---|
| Evidence Service | Defines evidence expectations; does not store customer evidence |
| Validation Service | Supplies approved validation definitions; does not own regulatory rules |
| Document Service | Supplies source-document metadata and references; does not determine legal authority |
| Audit Service | Supplies governance events and traceability infrastructure |
| Change Service | Supplies version and change infrastructure; regulatory team determines regulatory impact |
| Approval Service | Supplies approval workflow infrastructure; regulatory governance defines approval authority |
| Reporting Service | Supplies reporting infrastructure; regulatory definitions remain owned by the engine |

The Regulatory Knowledge Engine must not duplicate shared infrastructure unnecessarily.

## 18. Relationship to the Financial Knowledge Engine

The Regulatory Knowledge Engine and Financial Knowledge Engine are independent authorities.

The Regulatory Knowledge Engine owns:

- Regulatory sources.
- Regulatory provisions.
- Regulatory obligations.
- Regulatory applicability.
- Regulatory interpretations.
- Regulatory validation definitions.

The Financial Knowledge Engine owns:

- Financial authorities and sources.
- Financial concepts.
- Financial classifications.
- Allowability rules.
- Allocation methodologies.
- Financial formulas.
- Reimbursement definitions.
- Financial reporting schedules.
- Financial validation definitions.

A regulatory requirement may reference financial activity, but the financial treatment remains governed by the Financial Knowledge Engine.

Shared workflows may combine results from both authorities without merging their authority or conclusions.

## 19. Texas HCS Knowledge Pack Strategy

Texas HCS is the first regulatory implementation environment.

It is a knowledge pack within the universal Regulatory Knowledge Engine.

The engine must not contain Texas HCS assumptions in its universal domain model or execution infrastructure.

### 19.1 Texas HCS Pack Scope

The initial pack is intended to represent the applicable Texas HCS regulatory framework and related authoritative material.

Its scope may include:

- Texas statutes and administrative rules.
- HHSC regulatory requirements.
- Applicable licensing requirements.
- Service requirements.
- Provider operational requirements.
- Required documentation.
- Applicable forms and official instructions.
- Relevant program guidance, with authority and status identified.

### 19.2 Source Verification

Every Texas HCS source must be verified against an authoritative publication.

The knowledge team must record:

- Issuing authority.
- Official source location.
- Source version.
- Publication date.
- Effective date.
- Applicable provisions.
- Supersession or repeal information.
- Retrieval and verification date.

Prior research notes and earlier conversations may identify candidate sources, but do not substitute for current authoritative verification.

### 19.3 Texas ISS Knowledge Pack

Texas ISS requirements belong in the Regulatory Knowledge Engine as an independently governed Texas ISS Knowledge Pack or an appropriately scoped component of a broader Texas knowledge pack.

The pack must identify the applicable authorities, provisions, service definitions, licensing requirements, and supporting official material after verification.

Candidate source areas identified for research include:

- 26 TAC §559.201.
- 26 TAC Chapter 559, Subchapter H.
- 26 TAC §§260.503, 262.903, and 263.2003.
- Applicable official HHSC forms and instructions.
- Other provisions governing the relevant provider, service, documentation, safety, and billing requirements.

These are research candidates, not certified statements of current law.

Their current text, applicability, effective dates, and relationships must be verified before obligations are approved.

### 19.4 Customer Independence

The Texas ISS Knowledge Pack is independent of LevelUp Adventures.

LevelUp Adventures is a customer organization using the ISS capability and applicable knowledge.

The knowledge pack must not contain customer-specific:

- Participant records.
- Employee records.
- Service schedules.
- Individualized objectives.
- Service delivery records.
- Evidence.
- Financial records.
- Operational documents.

The same approved knowledge may serve multiple eligible customer organizations.

## 20. Relationship to Operational Capabilities

The Regulatory Knowledge Engine supplies approved knowledge to operational capabilities.

Examples include:

- Residential Operations.
- ISS Operations.
- Emergency Preparedness.
- Service Documentation.
- Incident Management.
- Personnel and Training.
- Other regulatory workflows.

An operational capability must not invent or independently own regulatory obligations.

Its responsibility is to:

1. Collect relevant business facts.
2. Associate those facts with applicable regulatory context.
3. Request applicability evaluation.
4. Execute approved validation definitions through shared services.
5. Collect and link evidence.
6. Present results and findings.
7. Support remediation and reassessment.
8. Preserve historical traceability.

No regulatory feature should be treated as compliance-ready until its governing requirements are represented in the Regulatory Knowledge Engine and have passed the required governance process.

## 21. AI Responsibilities and Boundaries

AI may assist the Regulatory Knowledge Pipeline.

Permitted assistance includes:

- Source discovery suggestions.
- Document extraction.
- Provision classification suggestions.
- Candidate obligation drafting.
- Cross-reference identification.
- Change comparison.
- Potential impact identification.
- Plain-language explanations.
- Test-case suggestions.
- Knowledge gap identification.

AI must not independently:

- Declare a source authoritative.
- Certify a regulatory interpretation.
- Approve a knowledge pack.
- Publish regulatory requirements.
- Override an approved obligation.
- Decide legal applicability without governed rules and sufficient facts.
- Change historical evaluation results.

AI outputs must be identifiable as generated assistance and must retain review status.

## 22. Security, Integrity, and Audit

The engine must protect the integrity of authoritative knowledge.

Requirements include:

- Controlled knowledge editing.
- Role-based governance permissions.
- Approval separation.
- Immutable published versions.
- Source integrity metadata.
- Audit history.
- Historical retrieval.
- Controlled publication.
- Restricted administrative operations.
- Traceable corrections and retirements.

Customer tenants may consume published knowledge but must not alter the centrally governed authoritative pack.

Customer-specific configuration must remain separate from the authoritative knowledge definition.

## 23. Implementation Architecture Guidance

The initial implementation should remain consistent with the existing modular monolith architecture.

The engine should be implemented as a well-bounded domain capability with explicit contracts.

It should not be split into microservices solely because its logical components are independently named.

Implementation should consider:

- Domain models.
- Source and pack repositories.
- Version management.
- Knowledge loaders.
- Structural validators.
- Regulatory test runners.
- Applicability evaluation.
- Publication lifecycle.
- Change detection.
- Audit integration.
- API contracts.
- Knowledge pack administration.

Existing Regulatory Knowledge Engine code must be reconciled with this design before changes are authorized.

No destructive refactoring is implied.

## 24. Implementation Readiness Requirements

Before implementation of a Regulatory Knowledge Engine capability, the team must define:

1. The domain entities and ownership boundaries.
2. Database schema and migration approach.
3. Source storage and source integrity strategy.
4. Knowledge pack file and database relationship.
5. Versioning and immutable publication strategy.
6. Applicability evaluation contract.
7. Validation definition contract.
8. Governance roles and permissions.
9. Approval and publication workflow.
10. Audit events.
11. API contracts.
12. Unit, integration, and regression tests.
13. Existing-code reconciliation.
14. Software change register entries.
15. Rollback and recovery approach where relevant.

Implementation readiness does not itself authorize implementation.

## 25. Open Regulatory Architecture Decisions

The following matters require resolution during design review:

1. Which source types are eligible for authoritative knowledge?
2. How will conflicting authorities be ranked or reconciled?
3. How will federal, state, and local requirements interact?
4. How will jurisdiction hierarchy affect applicability?
5. How will source corrections differ from formal amendments?
6. How will emergency or immediately effective changes be handled?
7. What approval roles and separation-of-duties rules are mandatory?
8. How will interpretations be versioned and retired?
9. How will knowledge pack dependencies be resolved?
10. How will effective-date changes affect existing customers?
11. How will regulatory source monitoring be performed?
12. What source content may be stored, indexed, or redistributed?
13. How will official forms and instructions be versioned?
14. How will conflicting or incomplete source material be represented?
15. How will customer-specific configuration interact with centrally governed applicability?
16. How will validation definitions be tested and certified?
17. How will a pack be rolled back or withdrawn without destroying historical records?
18. How will cross-program obligations be reused without duplicating authority?
19. How will regulatory change impact be communicated to customers?
20. What is the minimum governance evidence required for publication?

These decisions must be resolved or explicitly deferred with documented controls before the affected capabilities enter implementation.

## 26. Regulatory Knowledge Engine Acceptance Criteria

The architecture is acceptable when:

- The engine is jurisdiction-neutral.
- Regulatory sources and versions are independently represented.
- Provisions are traceable to source versions.
- Obligations are structured and source-linked.
- Source language is distinguished from interpretation.
- Applicability is explicit and explainable.
- Regulatory validation definitions are owned by the engine.
- Knowledge packs have immutable published versions.
- Draft knowledge cannot be used as approved authority.
- AI assistance cannot independently approve or publish knowledge.
- Regulatory change impact can be assessed.
- Historical evaluations preserve the original knowledge version.
- Shared services execute definitions without owning regulatory rules.
- The Financial Knowledge Engine remains independent.
- Texas HCS is implemented as a knowledge pack rather than universal architecture.
- Texas ISS knowledge is separate from LevelUp Adventures operational records.
- Reusable operational capabilities consume approved knowledge through defined contracts.
- Existing implementation can be reconciled without destructive assumptions.
- Implementation readiness and implementation authorization remain separate decisions.

---

## Document 06 Completion Statement

This document defines the proposed architecture of the Regulatory Knowledge Engine as the independent regulatory authority within the Regulatory Intelligence Platform.

It establishes how authoritative sources become structured, reviewed, validated, approved, versioned, and published regulatory knowledge.

It also establishes the separation between:

1. Regulatory sources and customer business records.
2. Regulatory obligations and operational validation execution.
3. Regulatory knowledge and financial knowledge.
4. Shared platform services and regulatory authority.
5. Texas ISS regulatory knowledge and LevelUp Adventures customer operations.
6. AI-assisted research and human-governed regulatory approval.

**Next document:** Document 07 — Financial Knowledge Engine Architecture.

**Approval boundary:** This document is a proposed design baseline. It does not authorize implementation.