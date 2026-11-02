# ENG-013 — Testing and Quality Strategy

**Document ID:** ENG-013  
**Version:** 1.0  
**Status:** Engineering Blueprint — Draft  
**Platform:** Regulatory Intelligence Platform  
**Organization:** McCaskill Projects  
**Proposed Location:** `docs/engineering/13-testing-and-quality-strategy.md`  
**Implementation Authorization:** Not Granted

---

# 1. Purpose and Scope

## 1.1 WHAT

This document defines the enterprise testing and quality assurance strategy for the Regulatory Intelligence Platform.

It establishes:

- Testing principles and ownership.
- Quality requirements for all six architectural layers.
- Unit, integration, contract, and end-to-end testing.
- Regulatory Knowledge validation and certification testing.
- Financial Knowledge methodology testing.
- Compliance evaluation accuracy testing.
- Financial calculation and reporting verification.
- Operational domain testing.
- Shared Intelligence testing.
- Authorization and tenant isolation testing.
- Database and migration testing.
- Angular, NgRx, and NestJS testing.
- Performance, accessibility, and resilience testing.
- CI/CD quality gates.
- Defect classification and release blocking.
- Test evidence and traceability.
- Sprint acceptance and Definition of Done.
- Production verification and regression management.

This document defines the target quality system. It does not assert that every proposed test suite or pipeline already exists.

## 1.2 WHEN

These standards apply:

1. Before implementation begins.
2. During feature and service development.
3. Whenever a knowledge definition changes.
4. Whenever an API contract changes.
5. Whenever a database migration is introduced.
6. Before merging changes.
7. Before staging or production deployment.
8. After deployment.
9. During incident investigation.
10. During scheduled regression and recovery exercises.

## 1.3 WHERE

Testing operates across the existing Nx monorepo, Angular frontend, NestJS backend, PostgreSQL database, TypeORM migrations, knowledge packages, and deployment environments.

The approved deployment context includes Vercel for the frontend and Render for backend infrastructure.

## 1.4 WHY

The platform makes operational, regulatory, and financial determinations that customers may rely upon.

A technically functioning application is not sufficient.

The system must also demonstrate that:

- Its knowledge is authoritative and current.
- Its calculations are correct.
- Its decisions are reproducible.
- Its permissions are enforced.
- Its records remain consistent.
- Its historical outputs are preserved.
- Its workflows behave as approved.
- Its releases do not introduce unacceptable regressions.

## 1.5 HOW

Quality is established through layered testing, independent review where required, automated CI/CD gates, traceable evidence, and explicit release approval.

No single test category substitutes for the others.

## 1.6 VERIFICATION

The strategy is accepted when every architectural capability has a defined test owner, test level, acceptance criteria, and evidence requirement.

---

# 2. Quality Doctrine

## 2.1 WHAT

The Quality Doctrine establishes mandatory engineering principles.

## 2.2 WHEN

These principles apply to every sprint and release.

## 2.3 WHERE

All platform layers and engineering teams.

## 2.4 WHY

Quality must be built into the system rather than inspected only after development.

## 2.5 HOW

**QA-001 — Knowledge before features**

No regulatory feature may be implemented without its required Regulatory Knowledge representation.

No financial methodology-dependent feature may be implemented without its required Financial Knowledge representation.

**QA-002 — Test authoritative behavior**

Tests must verify business outcomes, not merely that functions return values.

**QA-003 — Preserve existing functionality**

Changes must not silently break verified working capabilities.

**QA-004 — Verify ownership boundaries**

A domain must not bypass another domain's authoritative service contract.

**QA-005 — Test authorization negatively**

Every protected operation requires tests demonstrating that unauthorized access is denied.

**QA-006 — Reproduce governed results**

Completed regulatory and financial executions must retain sufficient context for historical verification.

**QA-007 — Treat published knowledge as governed artifacts**

Published knowledge requires validation, review, approval or certification, and version integrity.

**QA-008 — Use realistic failure scenarios**

Testing must include invalid data, partial failures, concurrency, missing dependencies, and revoked access.

**QA-009 — Automate repeatable checks**

Builds, unit tests, integration tests, contract tests, and security checks should be automated where practical.

**QA-010 — Require evidence**

A passing claim must be supported by identifiable test execution evidence.

**QA-011 — No silent test bypass**

Skipped tests, disabled gates, and accepted exceptions must be documented and approved.

**QA-012 — Production readiness is separate from feature completion**

A feature may pass local tests without being approved for production.

**QA-013 — No invented verification**

Unexecuted tests must never be described as passing.

**QA-014 — Record changes**

Every implemented sprint must update the Software Change Register.

## 2.6 VERIFICATION

Architecture reviews and release checklists must confirm compliance with these principles.

---

# 3. Six-Layer Testing Model

## 3.1 WHAT

The testing model follows the platform's six logical architectural layers.

## 3.2 WHEN

It is used when creating test plans and defining release gates.

## 3.3 WHERE

Across the entire platform.

## 3.4 WHY

Each layer has different failure risks and quality responsibilities.

## 3.5 HOW

| Layer | Primary testing responsibility |
|---|---|
| 1. Platform Foundation | Identity, tenancy, authorization, infrastructure, API security |
| 2. Operational Domains | Business records, relationships, operational validation |
| 3. Knowledge Authorities | Regulatory and financial definitions, versions, governance |
| 4. Shared Intelligence | Evidence, validation execution, audit, documents, approval, binders |
| 5. Applied Intelligence | Compliance decisions, financial calculations, reports, remediation |
| 6. User Experience | Workflows, navigation, NgRx state, accessibility, usability |

### Cross-layer testing

Individual layer tests are necessary but insufficient.

The system must also verify complete paths such as:

**Operational Record → Published Knowledge → Execution → Result → Review → Binder → Authorized User**

## 3.6 VERIFICATION

Every major workflow in ENG-001 must have an assigned cross-layer verification strategy.

---

# 4. Test Levels and Responsibilities

## 4.1 WHAT

The platform uses multiple complementary test levels.

## 4.2 WHEN

The appropriate levels are selected during feature design.

## 4.3 WHERE

Nx projects, service modules, database integration environments, and deployed test environments.

## 4.4 WHY

Different test levels detect different classes of defects.

## 4.5 HOW

| Test level | Purpose | Typical responsibility |
|---|---|---|
| Static analysis | Detect structural and typing issues | Engineering |
| Unit | Verify isolated behavior | Owning developer |
| Component | Verify UI behavior | Frontend engineering |
| Integration | Verify collaborating services and persistence | Domain engineering |
| Contract | Verify API and event compatibility | Contract owner and consumers |
| End-to-end | Verify complete user workflows | QA and engineering |
| Security | Verify access restrictions and misuse resistance | Security and engineering |
| Knowledge certification | Verify governed knowledge quality | Knowledge team |
| Financial accuracy | Verify calculation correctness | Financial domain experts and engineering |
| Migration | Verify schema evolution | Data engineering |
| Performance | Verify operational capacity | Engineering |
| Resilience | Verify failure and recovery | Engineering and operations |
| Accessibility | Verify usable accessible interfaces | Frontend and QA |
| Release smoke | Verify critical deployed behavior | Release owner |

### Test pyramid

Prefer a strong foundation of fast unit and integration tests, supported by focused contract and end-to-end suites.

Do not attempt to verify all business logic exclusively through browser tests.

## 4.6 VERIFICATION

Each sprint work package must identify its required test levels and owners.

---

# 5. Test Traceability Model

## 5.1 WHAT

Traceability links requirements, implementation, tests, and execution evidence.

## 5.2 WHEN

It is required for governed capabilities and critical platform workflows.

## 5.3 WHERE

Engineering documentation, test definitions, CI records, and Software Change Register.

## 5.4 WHY

A reviewer must be able to determine exactly which requirement a test verifies.

## 5.5 HOW

### Traceability chain

```text
Business Workflow
       |
       v
Requirement / Knowledge Definition
       |
       v
Entity and Service Contract
       |
       v
API / Event Contract
       |
       v
Authorization Policy
       |
       v
Test Case
       |
       v
Test Execution Evidence
       |
       v
Release Decision
```

### Required identifiers

Where applicable, tests reference:

- Workflow ID.
- Requirement or methodology ID.
- Service ID.
- API or event contract ID.
- Permission or policy ID.
- Test case ID.
- Execution or build identifier.
- Defect reference.

### Traceability matrix

| Field | Description |
|---|---|
| Requirement | Business or technical requirement |
| Owner | Responsible domain |
| Implementation | Service or component |
| Test case | Verification procedure |
| Expected result | Required behavior |
| Execution status | Passed, failed, blocked, not run |
| Evidence | Report, log, or artifact |
| Release impact | Blocking or nonblocking |

## 5.6 VERIFICATION

Critical requirements must not reach release without traceable passing evidence or a formally approved exception where exceptions are permitted.

---

# 6. Test Data and Environment Strategy

## 6.1 WHAT

Test data and environments must support reliable, repeatable verification.

## 6.2 WHEN

They are used throughout development, CI, staging, and release testing.

## 6.3 WHERE

Approved local and nonproduction environments.

## 6.4 WHY

Inconsistent data can hide defects and produce unreliable test results.

## 6.5 HOW

### Environment categories

- Local development.
- Automated CI.
- Integration testing.
- Staging or preproduction.
- Production smoke verification.

These are logical categories; actual deployed environments must be inventoried before assuming they exist.

### Test data requirements

Use:

- Synthetic tenant and organization records.
- Synthetic people and employee records.
- Known financial calculation fixtures.
- Approved regulatory test scenarios.
- Multiple tenant fixtures.
- Historical knowledge versions.
- Expired and revoked access assignments.
- Incomplete and malformed data.
- Large-volume datasets where appropriate.

### Isolation

Tests must not unintentionally modify production data.

### Repeatability

Test fixtures must support deterministic setup and cleanup.

### Time-sensitive tests

Effective dates, reporting periods, expiration, and time-zone behavior must use controlled clocks or deterministic time inputs where practical.

## 6.6 VERIFICATION

A test must be reproducible using documented setup and known expected results.

---

# 7. Nx Monorepo Quality Gates

## 7.1 WHAT

Nx provides the orchestration boundary for project-level quality checks.

## 7.2 WHEN

Checks run during development, pull requests, and release preparation.

## 7.3 WHERE

The existing Nx monorepo and CI configuration.

## 7.4 WHY

Project dependency boundaries and affected-project testing help control regression risk.

## 7.5 HOW

### Required categories

- Type checking.
- Linting.
- Unit testing.
- Integration testing where configured.
- Build verification.
- Dependency boundary validation.
- Contract verification.
- Critical end-to-end testing.

### Affected-project strategy

Use Nx affected-project capabilities when appropriate.

For foundational or shared changes, broaden the test scope to include relevant dependents.

### Cache correctness

CI caching must not substitute stale artifacts for tests that require fresh external state or database execution.

### Existing targets

The actual Nx project names, targets, and configurations must be verified before commands are finalized.

## 7.6 VERIFICATION

CI must report which projects were checked, which tests executed, and whether any required gate was skipped.

---

# 8. Angular Component and Workspace Testing

## 8.1 WHAT

Frontend testing verifies component rendering, interaction, navigation, and workflow presentation.

## 8.2 WHEN

It is required for new or modified Angular features.

## 8.3 WHERE

Angular 20 standalone components and approved frontend test infrastructure.

## 8.4 WHY

The interface must accurately reflect backend-confirmed state and authorized user actions.

## 8.5 HOW

### Component tests

Verify:

- Required inputs.
- Displayed values.
- User interactions.
- Validation messages.
- Loading states.
- Empty states.
- Error states.
- Disabled actions.
- Accessibility semantics.

### Workspace tests

Verify:

- Correct organization context.
- Role-aware navigation.
- Authorized deep links.
- Correct workflow status.
- Form submission.
- Conflict handling.
- Document viewing restrictions.
- Tenant switching.

### Critical behavior

A frontend component must not display an authoritative operation as successful before the backend confirms it.

## 8.6 VERIFICATION

Component and workspace tests must cover normal, error, unauthorized, and stale-state scenarios.

---

# 9. NgRx State Management Testing

## 9.1 WHAT

State tests verify frontend data flow and state consistency.

## 9.2 WHEN

They are required when actions, reducers, selectors, effects, or state boundaries change.

## 9.3 WHERE

Frontend NgRx libraries defined by ENG-007.

## 9.4 WHY

Incorrect state handling can display stale, cross-tenant, or misleading information.

## 9.5 HOW

### Reducer tests

Verify deterministic state transitions.

### Selector tests

Verify derived view models and filtering.

### Effect tests

Verify:

- Correct API invocation.
- Success handling.
- Failure handling.
- Retry behavior where approved.
- Duplicate request handling.
- Cancellation or stale-response protection.

### Tenant switching

Verify that tenant-scoped state is cleared or invalidated when context changes.

### Authorization changes

Verify that revoked permissions affect visible actions and cached protected data.

## 9.6 VERIFICATION

State tests must demonstrate that old-context responses cannot overwrite current authorized state.

---

# 10. NestJS Service Testing

## 10.1 WHAT

Backend service tests verify business orchestration, authorization, validation, and persistence behavior.

## 10.2 WHEN

They are required for new or modified service operations.

## 10.3 WHERE

NestJS modules and services defined by ENG-008.

## 10.4 WHY

Backend services are the authoritative execution boundary for protected operations.

## 10.5 HOW

### Unit tests

Verify isolated business decisions and service coordination.

### Integration tests

Verify:

- Repository behavior.
- Transactions.
- Domain collaboration.
- Event handling.
- Error contracts.
- Audit recording.
- Authorization enforcement.

### Negative tests

Verify unauthorized access, invalid state transitions, missing knowledge, malformed inputs, and concurrency conflicts.

### Mocking

Mocks may isolate dependencies in unit tests.

Critical integration tests must also verify actual persistence and service behavior.

## 10.6 VERIFICATION

Every protected service operation must have positive and negative test coverage.

---

# 11. API Contract Testing

## 11.1 WHAT

API contract testing verifies that producers and consumers agree on request and response behavior.

## 11.2 WHEN

It applies whenever a protected endpoint or DTO changes.

## 11.3 WHERE

NestJS APIs and Angular data-access consumers.

## 11.4 WHY

An API may compile while breaking existing consumers.

## 11.5 HOW

### Contract verification

Test:

- Route and HTTP method.
- Request validation.
- Response schema.
- Required and optional fields.
- Error status and structure.
- Authentication.
- Authorization.
- Pagination.
- Filtering.
- Version compatibility.
- Idempotency where required.

### Compatibility

Breaking changes require explicit review and an approved transition plan.

### Existing API versioning

Preserve existing `/api/v1` behavior unless a contract change is explicitly approved.

## 11.6 VERIFICATION

Provider and consumer tests must confirm compatibility before merge.

---

# 12. Event Contract Testing

## 12.1 WHAT

Event contract tests verify asynchronous communication between services and domains.

## 12.2 WHEN

They apply whenever event definitions, publishers, or consumers change.

## 12.3 WHERE

The approved event infrastructure and services defined in ENG-008 and ENG-009.

## 12.4 WHY

Event-driven workflows must remain reliable under retries, duplicate delivery, and partial failure.

## 12.5 HOW

Test:

- Event identity.
- Schema.
- Producer.
- Consumer.
- Tenant context.
- Correlation ID.
- Event version.
- Idempotency.
- Retry handling.
- Failure handling.
- Duplicate delivery.
- Out-of-order delivery where relevant.

### Publication integrity

Where a transactional outbox is implemented, verify consistency between committed business records and published events.

## 12.6 VERIFICATION

Consumers must handle supported event versions and defined delivery failure scenarios.

---

# 13. Regulatory Knowledge Engine Testing

## 13.1 WHAT

Regulatory Knowledge testing verifies source provenance, structured requirements, applicability, validation definitions, knowledge pack integrity, and certification.

## 13.2 WHEN

It applies before a regulatory knowledge version is certified or published and whenever a knowledge change is introduced.

## 13.3 WHERE

Regulatory Knowledge Engine.

## 13.4 WHY

An incorrect or uncertified requirement can create inaccurate compliance determinations.

## 13.5 HOW

### Knowledge test categories

| Category | Required verification |
|---|---|
| Source provenance | Official source identity and citation |
| Structure | Required fields and relationships |
| Applicability | Correct target and effective conditions |
| Evidence definition | Appropriate required evidence |
| Validation definition | Executable and unambiguous logic |
| Dependencies | Referenced definitions exist |
| Versioning | Published versions remain immutable |
| Certification | Required review and independence |
| Publication | Only authorized certified versions |
| Historical resolution | Prior versions remain retrievable |

### KnowledgePackValidator

The KnowledgePackValidator must test approved structural and semantic invariants before certification.

A validator passing does not independently prove the legal accuracy of a requirement.

### Human review

Authorized regulatory reviewers must verify substantive interpretation against the governing source.

### Change testing

When a regulatory source changes:

1. Identify affected knowledge definitions.
2. Determine affected knowledge packs.
3. Revalidate applicable definitions.
4. Review changed interpretations.
5. Certify and publish the new version.
6. Preserve historical versions.
7. Evaluate downstream regression impact.

## 13.6 VERIFICATION

A knowledge pack cannot be published without required validator results, review evidence, certification authority, and version integrity.

---

# 14. Financial Knowledge Engine Testing

## 14.1 WHAT

Financial Knowledge testing verifies approved financial definitions, classification rules, allowability principles, allocation methodologies, rates, formulas, and reporting structures.

## 14.2 WHEN

It applies before methodology approval or publication and whenever financial knowledge changes.

## 14.3 WHERE

Financial Knowledge Engine.

## 14.4 WHY

Financial errors can materially distort reported costs and financial decisions.

## 14.5 HOW

### Required test categories

- Source provenance.
- Financial definition integrity.
- Classification logic.
- Allowability conditions.
- Allocation bases.
- Formula correctness.
- Numeric precision.
- Rounding.
- Effective periods.
- Rate selection.
- Reporting structure.
- Methodology dependencies.
- Approval separation.
- Published version immutability.

### Golden calculation fixtures

Approved financial examples must contain:

- Input values.
- Governing methodology version.
- Expected intermediate calculations.
- Expected final result.
- Precision and rounding rules.
- Expected exceptions.

### Independent verification

Material financial methodologies require review by an authorized financial subject-matter expert.

### Historical versions

A new methodology must not silently change a previously released report.

## 14.6 VERIFICATION

Financial knowledge publication requires passing structural tests, calculation fixtures, and required approval evidence.

---

# 15. Compliance Evaluation Accuracy Testing

## 15.1 WHAT

Compliance accuracy testing verifies that approved regulatory definitions produce correct evaluation results from operational facts.

## 15.2 WHEN

It applies when evaluation definitions, operational input contracts, or execution services change.

## 15.3 WHERE

Compliance Intelligence and Shared Validation execution.

## 15.4 WHY

A technically successful evaluation may still produce an incorrect compliance result.

## 15.5 HOW

### Required scenarios

For each governed requirement, test:

1. Compliant facts.
2. Noncompliant facts.
3. Missing required facts.
4. Not-applicable conditions.
5. Boundary dates.
6. Expired or superseded knowledge.
7. Invalid evidence references.
8. Execution failure.
9. Historical reassessment.
10. Tenant and resource scope.

### Expected-result fixtures

Each fixture identifies:

- Requirement version.
- Operational inputs.
- Expected applicability.
- Expected status.
- Expected findings.
- Expected evidence relationships.

### Result integrity

An execution result must preserve the exact knowledge and input context used.

## 15.6 VERIFICATION

Evaluation results must match approved expected outcomes and remain reproducible.

---

# 16. Financial Intelligence Accuracy Testing

## 16.1 WHAT

Financial Intelligence testing verifies classification, allowability, allocation, reconciliation, and reporting execution.

## 16.2 WHEN

It applies when financial services, source contracts, or Financial Knowledge definitions change.

## 16.3 WHERE

Financial Intelligence.

## 16.4 WHY

Financial correctness requires more than successful database persistence.

## 16.5 HOW

### Required scenarios

- Valid classification.
- Ambiguous classification.
- Unallowable cost.
- Partially allowable cost.
- Missing allocation basis.
- Zero denominator.
- Negative adjustment.
- Duplicate transaction.
- Out-of-period transaction.
- Rounding boundary.
- Reconciliation difference.
- Incomplete reporting inputs.
- Historical methodology.
- Repeated execution.
- Concurrent execution.

### Accuracy standards

Use exact decimal arithmetic appropriate to approved methodologies.

Expected values must be independently established.

### Reporting integrity

Released reports must preserve:

- Source references.
- Methodology version.
- Calculation outputs.
- Reconciliation status.
- Approval history.
- Release artifact.

## 16.6 VERIFICATION

Every critical financial calculation must pass approved golden fixtures and reconciliation checks.

---

# 17. HCS Cost Reporting Vertical-Slice Testing

## 17.1 WHAT

HCS Cost Reporting is the first planned financial vertical slice.

## 17.2 WHEN

It is tested during the approved financial implementation sprints.

## 17.3 WHERE

Financial Knowledge, Financial Operations, Financial Intelligence, Financial Reporting, and Financial Binder.

## 17.4 WHY

The first financial vertical slice must demonstrate that the platform can translate approved financial rules into reproducible operational reporting.

## 17.5 HOW

### End-to-end scenario

```text
Approved Financial Knowledge
            |
            v
Financial Source Data
            |
            v
Classification and Allowability
            |
            v
Allocation and Calculation
            |
            v
Reconciliation
            |
            v
Cost Report Generation
            |
            v
Independent Review
            |
            v
Approval and Release
            |
            v
Financial Binder
```

### Required verification

- Correct reporting period.
- Approved methodology version.
- Valid source data.
- Correct classifications.
- Correct cost treatment.
- Correct allocations.
- Accurate report totals.
- Reconciliation.
- Approval separation.
- Released report preservation.
- Binder completeness.
- Historical reproduction.

### Official reporting caution

A technically valid generated report must not be labeled officially accepted or submitted unless the applicable external reporting process confirms that status.

## 17.6 VERIFICATION

The vertical slice is complete only when the full approved workflow passes end-to-end tests and financial subject-matter review.

---

# 18. Operational Domain Testing

## 18.1 WHAT

Operational tests verify business records and operational workflows.

## 18.2 WHEN

They apply whenever operational entities or services change.

## 18.3 WHERE

Organization, Location, People, Workforce, Service, Residential, ISS, Contract, Payroll, and Financial Operations.

## 18.4 WHY

Incorrect operational records can invalidate downstream intelligence.

## 18.5 HOW

### Common tests

- Create and update.
- Required fields.
- Relationship integrity.
- Duplicate prevention.
- Effective dates.
- Assignment rules.
- Record-level authorization.
- Concurrency.
- History.
- Supporting documents.

### Residential-specific tests

- Location scope.
- Residential assignments.
- Fire drill record integrity.
- Emergency preparedness records.
- Hot water monitoring.
- Compliance deep links.

### ISS-specific tests

- Individualized goals.
- Participant plan relationships.
- Skill-domain templates.
- Activity planning.
- Support-level progression.
- Actual service documentation.
- Progress observations.
- Tenant and participant scope.

### Billing distinction

A planned six-hour ISS activity day must not automatically become six billable service hours.

## 18.6 VERIFICATION

Operational tests must confirm correct source records without embedding unapproved regulatory or financial determinations.

---

# 19. Shared Intelligence Testing

## 19.1 WHAT

Shared Intelligence tests verify reusable infrastructure.

## 19.2 WHEN

They apply when Shared Intelligence services or contracts change.

## 19.3 WHERE

Evidence, Validation, Audit, Document, Change, Approval, Reporting, and Binder Management.

## 19.4 WHY

A defect in shared infrastructure may affect multiple business capabilities.

## 19.5 HOW

| Capability | Critical tests |
|---|---|
| Evidence | Relationship integrity, scope, versioning |
| Validation | Correct definition execution, failure handling |
| Audit | Accurate immutable activity history |
| Document | Secure access, versioning, storage consistency |
| Change | Impact references and history |
| Approval | Required authority and independence |
| Reporting | Artifact integrity and historical references |
| Binder | Lifecycle, completeness, approval, release |

### Shared Validation boundary

Tests must confirm that Shared Validation executes approved definitions without independently creating regulatory or financial policy.

### Shared Approval boundary

Tests must confirm that approval infrastructure records decisions without bypassing domain-specific authorization.

## 19.6 VERIFICATION

Shared-service changes require regression testing across affected consuming domains.

---

# 20. Binder and Survey Testing

## 20.1 WHAT

Binder and Survey testing verifies preparation, approval, release, external access, and historical integrity.

## 20.2 WHEN

It applies to Financial Binder, Survey Binder, and Survey Workspace changes.

## 20.3 WHERE

Shared Binder Management, Survey Operations, Document Management, and Angular workspaces.

## 20.4 WHY

Binders and surveys involve sensitive records and controlled external access.

## 20.5 HOW

### Binder tests

- Create binder.
- Select binder type.
- Assemble sections.
- Detect missing required content.
- Review.
- Approve.
- Release.
- Close.
- Archive.
- Preserve released version.

### Survey tests

- Individual surveyor authentication.
- MFA enforcement.
- Event assignment.
- Provider and location scope.
- Person and record scope.
- Document viewing.
- Download restrictions.
- Information requests.
- Provider responses.
- Access expiration.
- Revocation.
- Audit history.

### Critical security test

Binder access must not grant unauthorized access to the underlying source records.

## 20.6 VERIFICATION

Negative access tests and complete lifecycle tests are required before survey capabilities are released.

---

# 21. Authorization and Tenant Isolation Testing

## 21.1 WHAT

Security tests verify identity, permission, resource scope, and separation of duties.

## 21.2 WHEN

They apply to every protected operation.

## 21.3 WHERE

Existing authentication and authorization infrastructure and protected domain services.

## 21.4 WHY

A correct business feature is unacceptable if an unauthorized actor can access it.

## 21.5 HOW

### Mandatory negative scenarios

- Unauthenticated request.
- Missing permission.
- Forged tenant ID.
- Cross-tenant record access.
- Unauthorized location.
- Unauthorized person.
- Unauthorized employee record.
- Unauthorized reporting period.
- Unauthorized knowledge certification.
- Unauthorized financial approval.
- Prohibited self-approval.
- Unauthorized binder release.
- Expired surveyor access.
- Revoked surveyor access.
- Direct API access bypassing frontend controls.
- Stale JWT or cached permission context.

### Existing security continuity

Tests must preserve verified JWT, role, permission, authorization service, and guard behavior.

## 21.6 VERIFICATION

No critical authorization bypass may remain open at release.

---

# 22. PostgreSQL and TypeORM Testing

## 22.1 WHAT

Database tests verify persistence integrity and schema compatibility.

## 22.2 WHEN

They apply to entity, repository, query, and migration changes.

## 22.3 WHERE

PostgreSQL and TypeORM integration environments.

## 22.4 WHY

Database errors can persist even when application-level unit tests pass.

## 22.5 HOW

### Required categories

- Primary key integrity.
- Foreign keys.
- Unique constraints.
- Check constraints.
- Tenant-scoped queries.
- Transaction rollback.
- Numeric precision.
- Timestamp handling.
- Effective-date handling.
- Concurrency.
- Index performance.
- Migration compatibility.

### Migration verification

Test against a representative pre-migration schema and dataset.

Verify:

1. Existing data survives.
2. New constraints are satisfied.
3. Application queries remain compatible.
4. Backfills are correct.
5. Recovery procedures are documented.

### Production caution

Do not run destructive test migrations against production data.

## 22.6 VERIFICATION

Database changes require passing migration and integration tests.

---

# 23. Historical Reproducibility Testing

## 23.1 WHAT

Historical tests verify that prior governed results remain explainable and reproducible after source or knowledge changes.

## 23.2 WHEN

They apply whenever knowledge, evaluation logic, financial methodology, or historical persistence changes.

## 23.3 WHERE

Both Knowledge Engines, Applied Intelligence, and Shared Traceability.

## 23.4 WHY

A new version must not silently rewrite the past.

## 23.5 HOW

### Regulatory scenario

1. Publish regulatory knowledge version A.
2. Execute an evaluation.
3. Preserve the result.
4. Publish version B.
5. Retrieve the original evaluation.
6. Confirm that it still references version A.
7. Reproduce the original result from preserved inputs.

### Financial scenario

1. Publish financial methodology A.
2. Execute a calculation.
3. Release the report.
4. Publish methodology B.
5. Retrieve the released report.
6. Confirm that it still references A.
7. Reproduce the original calculation.

### Version integrity

Tests must verify that published versions cannot be silently modified.

## 23.6 VERIFICATION

Historical regression suites must demonstrate reproducibility across multiple knowledge versions.

---

# 24. End-to-End Workflow Testing

## 24.1 WHAT

End-to-end testing verifies complete user-visible business workflows.

## 24.2 WHEN

It is required for critical cross-domain capabilities and release readiness.

## 24.3 WHERE

Approved frontend, backend, and database test environments.

## 24.4 WHY

Individual components can pass while the complete workflow fails.

## 24.5 HOW

### Critical workflow families

| Workflow | Required end-to-end verification |
|---|---|
| WF-01 Regulatory Knowledge | Source through certification and publication |
| WF-02 Financial Knowledge | Source through approval and publication |
| WF-03 Customer/Organization | Authorized organization onboarding |
| WF-04 Operational Management | Record creation through authorized consumption |
| WF-05 Compliance Intelligence | Evaluation through finding and reassessment |
| WF-06 Financial Intelligence | Source through report release |
| WF-07 Binder/Survey | Binder release and controlled survey access |
| WF-08 Governance/Intelligence | Audit, reporting, and authorized intelligence |

### Test behavior

Each critical E2E scenario should verify:

- Actor identity.
- Tenant context.
- Initial state.
- User actions.
- Backend-confirmed transitions.
- Final state.
- Audit history.
- Negative or recovery scenario.

## 24.6 VERIFICATION

Critical release workflows must pass in the approved preproduction environment.

---

# 25. Performance and Scalability Testing

## 25.1 WHAT

Performance testing evaluates responsiveness and capacity.

## 25.2 WHEN

It applies before production release of high-volume or computationally intensive capabilities.

## 25.3 WHERE

Frontend, APIs, PostgreSQL, document delivery, and execution services.

## 25.4 WHY

Large provider datasets and complex evaluations must remain operationally usable.

## 25.5 HOW

### Representative workloads

- Provider-wide dashboard loading.
- Large compliance result lists.
- Financial reporting execution.
- Historical execution queries.
- Knowledge pack validation.
- Bulk import.
- Large binder assembly.
- Protected document streaming.
- Concurrent surveyor sessions.

### Metrics

Measure:

- Response latency.
- Throughput.
- Error rate.
- Database query duration.
- Memory consumption.
- CPU utilization.
- Execution completion time.
- Queue depth where applicable.

### Thresholds

Numeric performance thresholds must be approved for each critical workflow based on realistic usage and infrastructure capacity.

They are not assumed in this document.

## 25.6 VERIFICATION

Performance reports must compare measured results against approved thresholds.

---

# 26. Accessibility and Usability Testing

## 26.1 WHAT

Accessibility and usability testing verify that authorized users can successfully complete workflows.

## 26.2 WHEN

It applies to new or materially changed workspaces.

## 26.3 WHERE

Angular frontend and shared UI components.

## 26.4 WHY

An interface that technically functions may still be difficult or inaccessible to use.

## 26.5 HOW

### Target baseline

WCAG 2.2 AA, subject to formal product acceptance.

### Required checks

- Keyboard navigation.
- Focus management.
- Accessible labels.
- Screen-reader compatibility.
- Form errors.
- Status announcements.
- Color contrast.
- Responsive behavior.
- Document viewer accessibility.
- Complex table navigation.

### Usability scenarios

Test whether users can:

- Identify priority work.
- Open the correct record.
- Understand governing knowledge.
- Complete permitted actions.
- Recognize blocked workflows.
- Find supporting evidence.
- Confirm successful completion.

## 26.6 VERIFICATION

Critical workflows require accessibility review and documented usability acceptance.

---

# 27. Resilience and Failure Recovery Testing

## 27.1 WHAT

Resilience testing verifies behavior during dependency failures and interruptions.

## 27.2 WHEN

It applies before releasing critical workflows and after major infrastructure changes.

## 27.3 WHERE

Backend services, PostgreSQL, integrations, event infrastructure, and document storage.

## 27.4 WHY

Failures must not produce corrupted records, false approvals, or misleading completion states.

## 27.5 HOW

### Failure scenarios

- Database unavailable.
- Network interruption.
- API timeout.
- Duplicate request.
- Event delivery failure.
- Document storage unavailable.
- Knowledge version unavailable.
- Partial financial execution.
- Interrupted binder release.
- Session expiration.
- Concurrent approval attempts.

### Expected behavior

- Fail safely.
- Preserve committed data.
- Roll back atomic operations when required.
- Record appropriate errors.
- Support controlled retry.
- Prevent duplicate governed outputs.
- Display accurate user-facing status.

## 27.6 VERIFICATION

Resilience tests must demonstrate safe failure and documented recovery.

---

# 28. Backup and Disaster Recovery Testing

## 28.1 WHAT

Recovery testing verifies that critical records and artifacts can be restored.

## 28.2 WHEN

It occurs according to an approved recovery exercise schedule and after material infrastructure changes.

## 28.3 WHERE

PostgreSQL, document storage, backup systems, and approved recovery environments.

## 28.4 WHY

A backup is not proven useful until it can be restored.

## 28.5 HOW

### Recovery scenarios

- Restore operational records.
- Restore published knowledge versions.
- Restore historical compliance executions.
- Restore financial reports.
- Restore document metadata and binary content.
- Restore binder history.
- Validate referential integrity.

### Recovery objectives

RPO and RTO values must be defined through approved business continuity requirements.

## 28.6 VERIFICATION

Recovery exercises must produce documented evidence of restored data integrity and measured recovery time.

---

# 29. CI/CD Quality Gate Architecture

## 29.1 WHAT

CI/CD gates prevent unverified changes from progressing through the deployment pipeline.

## 29.2 WHEN

They apply to pull requests, merges, release candidates, and production deployments.

## 29.3 WHERE

The existing Git-based CI/CD process and approved deployment systems.

## 29.4 WHY

Automated gates reduce the likelihood of regressions and unsafe releases.

## 29.5 HOW

### Proposed pipeline

```text
Code Change
     |
     v
Static Analysis and Type Check
     |
     v
Nx Dependency Boundary Validation
     |
     v
Unit and Component Tests
     |
     v
Integration and Contract Tests
     |
     v
Security and Tenant Isolation Tests
     |
     v
Build Verification
     |
     v
Preproduction Deployment
     |
     v
Critical End-to-End Tests
     |
     v
Release Approval
     |
     v
Production Deployment
     |
     v
Smoke Verification and Monitoring
```

### Knowledge-specific gates

Regulatory Knowledge publication and Financial Knowledge publication require their own governed validation and approval gates.

A successful software build does not certify knowledge.

### Migration-specific gates

A schema-changing release requires migration verification and an approved recovery plan.

### Gate failure

A failed required gate blocks progression until corrected or handled under an explicitly authorized exception policy.

## 29.6 VERIFICATION

CI reports must identify required gates, execution results, and release approval evidence.

---

# 30. Defect Classification and Release Blocking

## 30.1 WHAT

Defect classification determines severity and release impact.

## 30.2 WHEN

It applies when testing or production monitoring identifies an issue.

## 30.3 WHERE

Engineering issue tracking and release governance.

## 30.4 WHY

Teams need consistent criteria for deciding whether a defect blocks release.

## 30.5 HOW

| Severity | Description | Default release impact |
|---|---|---|
| Critical | Unauthorized disclosure, severe data corruption, materially incorrect authoritative result | Block |
| High | Major workflow failure, incorrect financial calculation, invalid approval or certification behavior | Block |
| Medium | Significant defect with controlled workaround and no unacceptable integrity risk | Review required |
| Low | Minor presentation or noncritical usability issue | May be scheduled |

### Mandatory blockers

The following are release-blocking unless the affected capability is demonstrably disabled and isolated under an approved release plan:

- Cross-tenant access vulnerability.
- Unauthorized certification or approval.
- Incorrect material financial calculation.
- Incorrect authoritative compliance determination.
- Loss of governed historical results.
- Unrecoverable data corruption.
- Failed critical migration.
- Broken critical authentication.
- Uncontrolled external survey access.

### Defect closure

A defect is not closed solely because code was changed.

The correction must be verified, and relevant regression tests must pass.

## 30.6 VERIFICATION

Release reviews must identify unresolved defects and document their dispositions.

---

# 31. Test Coverage and Quality Metrics

## 31.1 WHAT

Quality metrics provide evidence of testing completeness and reliability.

## 31.2 WHEN

They are reviewed during sprint acceptance and release preparation.

## 31.3 WHERE

CI reports, test management, and engineering dashboards.

## 31.4 WHY

Passing test counts alone do not establish adequate coverage.

## 31.5 HOW

### Required metrics

- Required tests executed.
- Tests passed and failed.
- Critical requirement coverage.
- API contract coverage.
- Authorization negative-case coverage.
- Knowledge validation results.
- Financial golden-fixture results.
- Open defect severity.
- Build success.
- Migration test status.
- Critical E2E status.
- Flaky test count.
- Test execution duration.

### Code coverage

Coverage thresholds should be approved by component risk and test maturity.

A high line-coverage percentage cannot substitute for missing business assertions.

### Test reliability

Flaky tests must be investigated rather than routinely ignored.

## 31.6 VERIFICATION

Quality reports must distinguish verified evidence from estimated or incomplete coverage.

---

# 32. Test Evidence and Audit Records

## 32.1 WHAT

Test evidence documents what was executed and what the result was.

## 32.2 WHEN

Evidence is required for critical quality gates and governed release decisions.

## 32.3 WHERE

Approved CI artifact storage, test reports, and engineering change records.

## 32.4 WHY

Engineering teams must be able to substantiate release readiness.

## 32.5 HOW

### Evidence fields

- Test suite.
- Test case or requirement.
- Build or commit identifier.
- Environment.
- Execution timestamp.
- Outcome.
- Relevant logs or reports.
- Responsible reviewer.
- Defect reference where applicable.

### Evidence integrity

Test evidence must not be altered to imply a passing result that did not occur.

### Confidentiality

Evidence must avoid unnecessary sensitive production data.

## 32.6 VERIFICATION

A release reviewer must be able to locate evidence for required critical gates.

---

# 33. Sprint Testing Workflow

## 33.1 WHAT

Every sprint follows a controlled testing sequence.

## 33.2 WHEN

It applies to all approved implementation sprints.

## 33.3 WHERE

The owning team, Nx projects, CI, and test environments.

## 33.4 WHY

Testing requirements must be known before development begins.

## 33.5 HOW

### Sprint sequence

1. Confirm approved sprint scope.
2. Identify governing knowledge requirements.
3. Identify workflows and contracts.
4. Define acceptance criteria.
5. Define test cases.
6. Verify baseline behavior.
7. Implement authorized changes.
8. Execute focused tests.
9. Execute affected regression tests.
10. Execute security and integration tests.
11. Verify migrations if applicable.
12. Execute critical E2E tests.
13. Review defects.
14. Record evidence.
15. Update Software Change Register.
16. Approve or reject sprint completion.

### Baseline preservation

Existing verified behavior must be tested before modification where practical.

## 33.6 VERIFICATION

Sprint closure requires evidence of completed acceptance criteria and required tests.

---

# 34. Definition of Done

## 34.1 WHAT

The Definition of Done establishes minimum completion requirements.

## 34.2 WHEN

It applies before an implementation work package is marked complete.

## 34.3 WHERE

All engineering teams and work packages.

## 34.4 WHY

Code completion is not equivalent to verified feature completion.

## 34.5 HOW

A work package is Done only when:

- [ ] The scope was explicitly approved.
- [ ] The implementation follows approved architecture.
- [ ] Required knowledge representation exists.
- [ ] Domain ownership is respected.
- [ ] API and event contracts are documented.
- [ ] Authorization is implemented and tested.
- [ ] Unit tests pass.
- [ ] Required integration tests pass.
- [ ] Required contract tests pass.
- [ ] Relevant regression tests pass.
- [ ] Critical E2E tests pass where applicable.
- [ ] Database migrations are verified where applicable.
- [ ] Historical integrity is verified where applicable.
- [ ] Financial or regulatory accuracy review is complete where applicable.
- [ ] Accessibility requirements are satisfied where applicable.
- [ ] No unresolved release-blocking defects remain.
- [ ] Required CI gates pass.
- [ ] Test evidence is recorded.
- [ ] Documentation is updated.
- [ ] Software Change Register is updated.
- [ ] The work package is accepted by its authorized owner.

## 34.6 VERIFICATION

The sprint owner must verify completion against actual evidence rather than developer assertion alone.

---

# 35. Release Readiness and Production Verification

## 35.1 WHAT

Release readiness determines whether an approved build may enter production.

## 35.2 WHEN

It occurs after implementation verification and before production deployment.

## 35.3 WHERE

Release governance and deployment infrastructure.

## 35.4 WHY

A locally passing feature may still be unsuitable for production.

## 35.5 HOW

### Release checklist

- Approved scope.
- Verified build.
- Required test gates passed.
- Knowledge governance gates passed where applicable.
- Migration plan approved.
- Recovery plan available.
- Security review completed.
- Blocking defects resolved.
- Deployment configuration verified.
- Monitoring enabled.
- Release owner approval recorded.

### Post-deployment verification

Execute approved smoke tests for:

- Authentication.
- Tenant selection.
- Critical APIs.
- Provider Intelligence Center.
- Relevant operational workflows.
- Knowledge retrieval.
- Compliance or financial execution where safe.
- Document access.
- Health and monitoring endpoints.

Do not perform destructive production test operations without explicit authorization.

## 35.6 VERIFICATION

A release is considered operationally verified only after required deployment checks complete successfully.

---

# 36. Testing Ownership Matrix

## 36.1 WHAT

Testing ownership assigns accountability for quality.

## 36.2 WHEN

It is used during team planning and sprint assignment.

## 36.3 WHERE

Engineering, Knowledge Operations, QA, Security, and Release Management.

## 36.4 WHY

Shared responsibility must not become unclear responsibility.

## 36.5 HOW

| Test responsibility | Primary owner | Supporting reviewers |
|---|---|---|
| Nx and architecture boundaries | Platform Engineering | Architecture |
| Angular and NgRx | Frontend Engineering | QA |
| NestJS services | Backend Engineering | QA |
| Operational records | Domain Engineering | Operations SME |
| Regulatory Knowledge | Regulatory Knowledge Team | Regulatory Reviewer/Certifier |
| Financial Knowledge | Financial Knowledge Team | Financial Reviewer/Approver |
| Compliance accuracy | Compliance Engineering | Regulatory SME |
| Financial accuracy | Financial Engineering | Financial SME |
| Database migrations | Data Engineering | Backend/Operations |
| Authorization | Security Engineering | Domain Owner |
| Binder and Survey | Workflow Engineering | Security/QA |
| End-to-end workflows | QA | Domain Owners |
| Performance and recovery | Platform Operations | Engineering |
| Release acceptance | Authorized Release Owner | Engineering/QA |

These are logical team responsibilities. Actual personnel assignments belong in ENG-014.

## 36.6 VERIFICATION

Every critical test suite must have a named accountable role before implementation begins.

---

# 37. Repository Reconciliation

## 37.1 WHAT

Repository reconciliation identifies which tests and quality infrastructure already exist.

## 37.2 WHEN

It occurs after blueprint approval and before corresponding implementation work.

## 37.3 WHERE

The existing Nx monorepo and CI configuration.

## 37.4 WHY

The platform must preserve existing working test infrastructure rather than replacing it unnecessarily.

## 37.5 HOW

### Required inventory

| Item | Verification requirement |
|---|---|
| Nx test targets | Actual project targets |
| Angular tests | Existing suites and framework |
| NestJS tests | Existing suites and framework |
| Regulatory Knowledge tests | Existing validator and knowledge tests |
| Financial tests | Existing or missing suites |
| Database tests | Existing PostgreSQL integration coverage |
| Migration tests | Existing migration validation |
| Authorization tests | Existing JWT, role, permission, guard coverage |
| E2E tests | Existing workflows and framework |
| CI pipelines | Actual gates and execution history |
| Coverage reporting | Existing configuration |
| Test environments | Verified available environments |

### Status classification

Each item must be classified:

- Verified complete.
- Verified partial.
- Missing.
- Blocked.
- Not yet inspected.

### Existing knowledge tests

Previously reported passing Regulatory Knowledge tests are useful historical information, but their current status must be verified through a fresh repository test run before being recorded as passing in a new release.

## 37.6 VERIFICATION

The test inventory must cite actual files, configurations, commands, and execution evidence.

---

# 38. Implementation Sequence for Quality Infrastructure

## 38.1 WHAT

This section defines the sequence for approved testing infrastructure improvements.

## 38.2 WHEN

It applies when implementing missing test capabilities or strengthening CI gates.

## 38.3 WHERE

Existing Nx, testing, and CI infrastructure.

## 38.4 WHY

Quality improvements should build on verified infrastructure and minimize disruption.

## 38.5 HOW

| Step | Activity | Output |
|---|---|---|
| 1 | Inventory existing tests | Verified current state |
| 2 | Identify critical gaps | Risk-ranked gap list |
| 3 | Map workflows to tests | Traceability matrix |
| 4 | Prioritize security and authority | Critical test backlog |
| 5 | Define fixtures | Repeatable test data |
| 6 | Define test environments | Environment requirements |
| 7 | Extend unit and integration tests | Focused suites |
| 8 | Extend API and event contracts | Compatibility suites |
| 9 | Add knowledge-specific gates | Governed publication verification |
| 10 | Add critical E2E tests | Cross-layer verification |
| 11 | Strengthen CI gates | Automated enforcement |
| 12 | Verify recovery and resilience | Operational evidence |
| 13 | Update Software Change Register | Change history |

## 38.6 VERIFICATION

Every quality infrastructure change must be tested and documented before becoming a mandatory release gate.

---

# 39. Testing and Quality Acceptance Criteria

ENG-013 is ready for implementation planning when:

- [ ] Quality principles are defined.
- [ ] Six-layer testing responsibilities are defined.
- [ ] Unit, integration, contract, and E2E test levels are defined.
- [ ] Test traceability requirements are defined.
- [ ] Test data and environment standards are defined.
- [ ] Nx quality gates are defined.
- [ ] Angular and NgRx testing is defined.
- [ ] NestJS testing is defined.
- [ ] API and event contract testing is defined.
- [ ] Regulatory Knowledge validation and certification testing is defined.
- [ ] Financial Knowledge methodology testing is defined.
- [ ] Compliance evaluation accuracy testing is defined.
- [ ] Financial calculation accuracy testing is defined.
- [ ] HCS Cost Reporting vertical-slice verification is defined.
- [ ] Operational domain testing is defined.
- [ ] Shared Intelligence testing is defined.
- [ ] Binder and Survey testing is defined.
- [ ] Authorization and tenant isolation testing is defined.
- [ ] PostgreSQL and TypeORM testing is defined.
- [ ] Historical reproducibility testing is defined.
- [ ] Critical E2E workflows are identified.
- [ ] Performance and accessibility testing is defined.
- [ ] Resilience and recovery testing is defined.
- [ ] CI/CD release gates are defined.
- [ ] Defect severity and release blocking are defined.
- [ ] Test evidence requirements are defined.
- [ ] Sprint Definition of Done is defined.
- [ ] Production verification is defined.
- [ ] Testing ownership is defined.
- [ ] Repository reconciliation is required before implementation.

---

# 40. Relationship to Other Engineering Documents

| Document | Relationship |
|---|---|
| ENG-001 — Master Workflow Catalog | Defines workflows requiring verification |
| ENG-002 — Workflow Diagrams and State Machines | Defines expected transitions |
| ENG-003 — Master Entity Catalog | Defines data integrity requirements |
| ENG-004 — Entity Relationship Model | Defines relationship testing |
| ENG-005 — Nx Workspace Architecture | Defines project and dependency gates |
| ENG-006 — Technology Implementation Standards | Defines engineering conventions |
| ENG-007 — Frontend State Management Architecture | Defines NgRx test requirements |
| ENG-008 — Service and Module Catalog | Defines service test ownership |
| ENG-009 — API and Event Contracts | Defines contract tests |
| ENG-010 — Authorization and Permission Matrix | Defines security tests |
| ENG-011 — User Interface and Workspace Specification | Defines UI and accessibility tests |
| ENG-012 — Data Architecture | Defines persistence, migration, and recovery tests |
| ENG-014 — Team Work Packages | Assigns testing responsibilities |
| ENG-015 — Sprint Implementation Packages | Defines sprint-specific acceptance gates |

---

# 41. Implementation Authorization

**Status: Not Granted**

This document defines the proposed testing and quality strategy.

It does not authorize:

- Modifying existing test suites.
- Introducing a new testing framework.
- Changing Nx targets.
- Changing CI/CD pipelines.
- Creating or modifying production infrastructure.
- Running database migrations.
- Changing knowledge certification workflows.
- Changing release policies.
- Beginning implementation.

Existing working tests, configurations, and CI processes must be preserved until approved changes are scheduled and verified.

---

**End of ENG-013 — Testing and Quality Strategy**