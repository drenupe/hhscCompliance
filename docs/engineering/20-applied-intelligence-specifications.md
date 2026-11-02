# ENG-020 — Applied Intelligence: Detailed Component Specifications

**Organization:** McCaskill Projects  
**Platform:** Regulatory Intelligence Platform  
**Document ID:** ENG-020  
**Version:** 1.0 — Draft  
**Proposed repository path:** `docs/engineering/20-applied-intelligence-detailed-component-specifications.md`  
**Design approach:** Architecture-first; independent of existing repository  
**Implementation authorization:** Not granted

---

## 1. Executive design statement

Applied Intelligence transforms authorized operational facts into governed regulatory and financial outcomes by orchestrating certified or approved knowledge definitions and shared execution services. It comprises **Compliance Intelligence** and **Financial Intelligence**, with distinct decision authority, result ownership, review processes, and release controls.

**Non-negotiable rule:** Applied Intelligence consumes approved knowledge. It cannot author, certify, amend, or silently reinterpret Regulatory Knowledge Engine (RKE) requirements or Financial Knowledge Engine (FKE) methodologies. Operational Domains own source facts. Shared Intelligence owns reusable execution, evidence, audit, approval, document, reporting-rendering, and binder infrastructure. Applied Intelligence owns the domain-specific evaluation orchestration and resulting business artifacts.

### 1.1 Goals

1. Produce traceable regulatory compliance results and corrective workflows.
2. Produce traceable financial classifications, allocations, calculations, reconciliations, and reporting instances.
3. Keep regulatory and financial authorities independent.
4. Make results reproducible from pinned knowledge, inputs, and execution versions.
5. Distinguish insufficient evidence, non-applicability, execution errors, and adverse findings.
6. Support provider-wide intelligence without mandatory `locationId`.
7. Support enterprise workflows, review, controlled publication, and tenant isolation.
8. Provide stable API and event contracts independent of current code.

## 2. Architecture and authority boundaries

| Capability | Authority / owner | Applied Intelligence responsibility |
|---|---|---|
| Regulatory definitions, applicability rules, effective dates | RKE | Resolve certified, applicable, version-pinned definitions |
| Financial classification, allowability, allocation and rate methodology | FKE | Resolve approved, applicable, version-pinned definitions |
| People, services, payroll, transactions, facilities and statistics | Operational Domains | Retrieve authorized, versioned facts |
| Declarative validation execution | Shared Intelligence | Submit governed execution requests and interpret typed results within domain rules |
| Evidence/document/audit/approval infrastructure | Shared Intelligence | Request and consume shared capabilities |
| Compliance results, findings and corrective actions | Compliance Intelligence | Own lifecycle and business interpretation |
| Financial runs, reconciliation and report instances | Financial Intelligence | Own lifecycle and business interpretation |
| Report rendering | Shared Reporting | Render approved specifications and snapshots |
| Binder lifecycle | Shared Binder Management | Request assembly and release under applicable policy |

**Boundary examples:** A fire-drill record is a Residential Operations fact; the Texas HCS Knowledge Pack specifies requirements; Compliance Intelligence evaluates and records the result. A payroll record is a source fact; FKE governs its regulated reporting classification; Financial Intelligence calculates and reconciles reporting outcomes. A payroll tax engine, if required, is a separately governed calculation authority and is not implied by FKE.

## 3. Logical component catalog

The component names below are proposed detailed-design identities. **CI-01–CI-07 and FI-01–FI-11 must be reconciled with ENG-008's canonical catalog before implementation; numbering alone does not prove identity.**

| ID | Component | Responsibility |
|---|---|---|
| CI-01 | Regulatory Evaluation Orchestrator | Plan and run regulatory evaluations |
| CI-02 | Applicability and Subject Resolution | Bind requirements to authorized subjects and dates |
| CI-03 | Compliance Result Registry | Store immutable result versions and current projections |
| CI-04 | Finding and Severity Management | Govern finding creation, status and severity |
| CI-05 | Corrective Action Plan Management | Manage remediation tasks, evidence and approvals |
| CI-06 | Reassessment and Closure | Re-evaluate corrected conditions and govern closure |
| CI-07 | Compliance Readiness and Intelligence | Aggregate provider/module/location readiness and signals |
| FI-01 | Financial Run Orchestrator | Plan and control financial execution |
| FI-02 | Financial Source Normalization | Map source facts to approved financial input contracts |
| FI-03 | Classification and Allowability Execution | Apply approved classification and allowability rules |
| FI-04 | Cost Pool and Allocation Execution | Build pools and allocate using approved bases |
| FI-05 | Rate and Formula Execution | Execute approved financial formulas and rate rules |
| FI-06 | Financial Reconciliation | Verify totals, balances and explain differences |
| FI-07 | Financial Result Registry | Persist versioned calculations and lineages |
| FI-08 | Reporting Period and Close Management | Govern period state and source cutoff |
| FI-09 | Financial Report Instance Management | Assemble official/management report instances |
| FI-10 | Financial Review and Approval Coordination | Enforce review, signoff and release prerequisites |
| FI-11 | Financial Readiness and Intelligence | Surface exceptions, readiness and trends |

These are logical boundaries, not a mandate for 18 independently deployed services.

## 4. Common execution contract

### 4.1 WHAT / WHEN / WHERE / WHY

Every governed execution requires an attributable request, explicit authority, effective date, source scope, knowledge version, and reproducibility manifest. This applies to both regulatory and financial runs, through versioned internal contracts.

### 4.2 HOW — conceptual types

```typescript
interface AppliedExecutionRequest {
  requestId: string;
  correlationId: string;
  tenantId: string;
  providerId: string;
  actorId: string;
  subject: { type: string; id: string; locationId?: string };
  authority: 'REGULATORY' | 'FINANCIAL';
  knowledgeArtifactId: string;
  knowledgeVersionId: string;
  asOfDate: string; // effective-date applicability
  inputSnapshotId: string;
  idempotencyKey: string;
}

type ExecutionState =
  | 'REQUESTED' | 'AUTHORIZED' | 'PREPARING' | 'RUNNING'
  | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED';

interface AppliedExecutionManifest {
  executionId: string;
  authority: 'REGULATORY' | 'FINANCIAL';
  knowledgeVersionId: string;
  definitionVersionIds: string[];
  inputSnapshotId: string;
  inputDigest: string;
  executionEngineVersion: string;
  outputDigest?: string;
  evaluatedAt: string;
  effectiveAsOf: string;
  correlationId: string;
}
```

**Invariants:** No execution against an unapproved definition; no implicit “latest” after run creation; no current data substituted into a historical run; no cross-tenant input references; no success result when execution failed. Decimal financial values must use exact decimal arithmetic with specified precision and rounding per approved methodology.

### 4.3 VERIFICATION

Contract tests must reject missing or revoked authorization, wrong authority, unapproved knowledge, invalid effective dates, inconsistent input digests, and repeated idempotency keys with different payloads.

## 5. CI-01 — Regulatory Evaluation Orchestrator

**WHAT:** Coordinates compliance evaluations for a provider, location, person, service, or other regulated subject.  
**WHEN:** On authorized manual request, relevant source changes, knowledge changes, scheduled checks, or reassessment.  
**WHERE:** Compliance Intelligence.  
**WHY:** Separate regulatory workflow coordination from knowledge authorship and generic execution.

**HOW:** (1) Authorize request and subject; (2) resolve certified RKE pack and applicability; (3) pin effective versions; (4) retrieve source snapshots; (5) identify missing facts; (6) call Shared Validation; (7) persist execution manifest and results; (8) trigger finding reconciliation and event publication. Runs may be partitioned by provider, module, location, or subject, with bounded concurrency and retry-safe execution.

**States:** REQUESTED → PREPARING → RUNNING → COMPLETED/PARTIAL/FAILED/CANCELLED. A retry creates an attributable attempt, not a silent overwrite.

**VERIFICATION:** Complete, partial, failed, retried, duplicate, and cross-tenant execution tests.

## 6. CI-02 — Applicability and Subject Resolution

**WHAT:** Resolves subjects, scope, jurisdiction, program, and effective date for evaluation.  
**WHEN:** Before any regulatory execution.  
**WHERE:** Compliance Intelligence consuming RKE and Operational Domain contracts.  
**WHY:** A requirement can be certified yet inapplicable to a particular subject.

**HOW:** Resolve tenant/provider/program enrollment, location type, relevant service or person, and `asOfDate`; request RKE applicability decision; preserve its explanation and version. Distinguish `APPLICABLE`, `NOT_APPLICABLE`, `UNDETERMINED`, and `ERROR`. A missing enrollment or missing fact cannot automatically be treated as not applicable.

**VERIFICATION:** Effective-date boundary, program-specific, missing-fact, and historical applicability tests.

## 7. CI-03 — Compliance Result Registry

**WHAT:** Persists versioned compliance determinations and current projections.  
**WHEN:** After each authorized evaluation.  
**WHERE:** Compliance Intelligence-owned persistence.  
**WHY:** Results must support remediation and historical reconstruction without rewriting earlier conclusions.

**HOW:** Store result ID, tenant/provider/subject, module, rule code, certified requirement and version, status, severity, explanatory message, evaluated time, source snapshot, evidence references, manifest ID, and deep-link route metadata. Suggested result statuses: `COMPLIANT`, `NONCOMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, `REVIEW_REQUIRED`, `EVALUATION_ERROR`. A “current result” is a projection over immutable evaluation history.

**VERIFICATION:** Historical version preservation, current projection accuracy, and failure-versus-noncompliance distinction.

## 8. CI-04 — Finding and Severity Management

**WHAT:** Creates and manages actionable findings derived from supported evaluation results.  
**WHEN:** When a result meets the approved finding policy.  
**WHERE:** Compliance Intelligence.  
**WHY:** Not every failed evaluation or missing input is a confirmed violation.

**HOW:** Maintain finding identity, linked result(s), requirement version, severity source, owner, due dates, status, and evidence. Proposed states: `OPEN`, `ACKNOWLEDGED`, `REMEDIATION_IN_PROGRESS`, `READY_FOR_RECHECK`, `VERIFIED`, `CLOSED`, `REOPENED`, `DISPUTED`. Severity rules must derive from certified knowledge or approved domain policy, not hardcoded UI labels. Deduplicate by stable issue identity while preserving repeated occurrences.

**VERIFICATION:** Finding creation policy, deduplication, dispute, reassignment, and history tests.

## 9. CI-05 — Corrective Action Plan Management

**WHAT:** Coordinates corrective actions, owners, deadlines, notes, and evidence.  
**WHEN:** After a finding requires remediation.  
**WHERE:** Compliance Intelligence using Shared Evidence, Tasks, Audit and Approval.  
**WHY:** Documented action is not equivalent to verified correction.

**HOW:** CAP includes linked findings, action steps, responsible actors, planned dates, completion evidence, review decisions, and recheck request. Suggested lifecycle: `DRAFT → SUBMITTED → APPROVED → IN_PROGRESS → READY_FOR_RECHECK → VERIFIED → CLOSED`, with `CHANGES_REQUESTED` and `REOPENED` branches. Preserve each action revision and evidence version. Authorization must distinguish preparer, reviewer, and closer.

**VERIFICATION:** Missing evidence, unauthorized approval, overdue action, version conflict, and recheck-blocking tests.

## 10. CI-06 — Reassessment and Closure

**WHAT:** Runs fresh governed evaluations after remediation and controls finding closure.  
**WHEN:** On recheck request, approved schedule, or relevant new evidence.  
**WHERE:** Compliance Intelligence.  
**WHY:** Closure requires a supported current assessment, not merely a task marked done.

**HOW:** Pin the knowledge version and effective-date policy applicable to reassessment; capture new operational snapshot; run evaluation; link old and new results; apply closure policy. Reassessment must not erase original noncompliance. If a regulation changed, explicitly identify whether the operation is a historical recheck or current-requirement reassessment.

**VERIFICATION:** Successful correction, persistent issue, changed regulation, missing evidence, and unauthorized closure scenarios.

## 11. CI-07 — Compliance Readiness and Intelligence

**WHAT:** Aggregates compliance signals for provider-wide and scoped workspaces.  
**WHEN:** Dashboard, module workbench, executive review, and survey preparation.  
**WHERE:** Compliance Intelligence read models and authorized APIs.  
**WHY:** Users need prioritized correction areas, not raw rule execution logs.

**HOW:** Provide provider-wide views without requiring `locationId`; group residential issues first by **Fire Drills, Emergency Plans, Hot Water, Medication**, then list affected locations beneath each area. Support status, severity, owner, due date, evidence gap, and last-checked filters. Distinguish “not evaluated” from “compliant.” Report freshness and knowledge version. Readiness indicators are management signals, not official regulator certification.

**VERIFICATION:** Provider-wide query, grouped residential view, authorization, stale-data labeling, and drill-down tests.

## 12. Financial Intelligence execution principles

Financial Intelligence is independent from Compliance Intelligence. It must not treat financial reporting compliance as identical to financial arithmetic correctness. Financial outcomes require source provenance, approved FKE methods, exact decimal arithmetic, documented adjustments, and reconciliation before approval.

Financial values must carry currency, units, period, precision, rounding policy, source, and methodology version. Reconciliation differences must never be silently suppressed.

## 13. FI-01 — Financial Run Orchestrator

**WHAT:** Coordinates financial execution runs for a reporting scope and period.  
**WHEN:** On authorized draft preparation, recalculation, amendment, or reporting-period close.  
**WHERE:** Financial Intelligence.  
**WHY:** Ensure consistent, repeatable execution across classification, allocation, and reporting.

**HOW:** Authorize run; resolve period, provider, report type, and approved FKE pack; pin versions; capture input cutoff and snapshot; invoke normalization, classification, allocation, formula, and reconciliation stages; persist manifest and outputs. State: `DRAFT → PREPARING → CALCULATING → RECONCILING → READY_FOR_REVIEW`, with `FAILED`, `CANCELLED`, and `SUPERSEDED` paths.

**VERIFICATION:** Complete run, restart, version pinning, concurrent runs, and partial failure tests.

## 14. FI-02 — Financial Source Normalization

**WHAT:** Transforms authorized operational financial facts into typed calculation inputs.  
**WHEN:** Before classification or allocation.  
**WHERE:** Financial Intelligence adapters to Operational Domains.  
**WHY:** Source formats vary, but financial calculations need consistent semantics.

**HOW:** Normalize transaction lines, payroll records, service statistics, contracts, and period boundaries while retaining original IDs, amounts, currencies, signs, dates, units, and source digests. Do not modify original records. Reject unbalanced or unmappable input as an explicit exception; allow approved mapping overrides with provenance.

**VERIFICATION:** Duplicate detection, missing source, currency/units mismatch, import corrections, and provenance tests.

## 15. FI-03 — Classification and Allowability Execution

**WHAT:** Applies approved FKE classification and allowability definitions.  
**WHEN:** After source normalization.  
**WHERE:** Financial Intelligence through Shared Validation.  
**WHY:** Regulated classifications are methodology decisions, not ordinary bookkeeping labels.

**HOW:** Resolve FKE version and rule applicability; evaluate each line; persist classification, allowability status, explanation, exceptions, and knowledge references. Suggested outcomes: `CLASSIFIED`, `UNCLASSIFIED`, `ALLOWABLE`, `UNALLOWABLE`, `CONDITIONALLY_ALLOWABLE`, `REVIEW_REQUIRED`, `EXECUTION_ERROR`; use separate fields where classification and allowability are different dimensions. Human overrides require authorized, auditable policy-defined procedures and must not mutate FKE definitions.

**VERIFICATION:** Approved mapping, conflicting classification, conditional allowability, override, and version-change tests.

## 16. FI-04 — Cost Pool and Allocation Execution

**WHAT:** Constructs cost pools and allocates costs using approved FKE methodology.  
**WHEN:** After source classification and prerequisite data checks.  
**WHERE:** Financial Intelligence.  
**WHY:** Allocations must be explainable and reproducible.

**HOW:** Determine eligible pool members, approved allocation bases, denominators, periods, and rounding rules. Preserve source-to-pool-to-allocation lineage. Zero or missing denominators generate explicit exceptions. Ensure total allocated amounts reconcile to the pool within approved tolerances; residual handling must be specified by the approved methodology.

**VERIFICATION:** Zero denominator, negative adjustment, mixed periods, rounding residual, and allocation reconciliation tests.

## 17. FI-05 — Rate and Formula Execution

**WHAT:** Executes approved rates and financial formulas.  
**WHEN:** During financial calculations after required inputs are available.  
**WHERE:** Financial Intelligence invoking governed Shared Validation or calculation execution.  
**WHY:** Formulas must be stable, versioned, and free from implicit floating-point behavior.

**HOW:** Use decimal arithmetic, explicit units, input validation, FKE formula version, effective date, and approved rounding points. Record intermediate results when required for audit. Never silently substitute default rates. Formula execution errors remain errors, not zero-valued results.

**VERIFICATION:** Precision, rounding, date boundaries, missing rates, division-by-zero, and deterministic replay tests.

## 18. FI-06 — Financial Reconciliation

**WHAT:** Checks financial consistency and explains differences.  
**WHEN:** After calculation and before report approval.  
**WHERE:** Financial Intelligence.  
**WHY:** Numerically completed calculations are not necessarily report-ready.

**HOW:** Compare source totals, classified totals, allowable totals, pool totals, allocated totals, report lines, and applicable control balances. Store checks, tolerances, exceptions, adjustments, reviewer decisions, and status: `BALANCED`, `OUT_OF_BALANCE`, `REVIEW_REQUIRED`, `ERROR`. Tolerances must be approved, explicit, and versioned. Material unresolved exceptions block release.

**VERIFICATION:** Balanced, rounding difference, omitted line, duplicate source, unauthorized adjustment, and material variance tests.

## 19. FI-07 — Financial Result Registry

**WHAT:** Stores versioned financial outcomes and lineage.  
**WHEN:** After each execution stage and finalized run.  
**WHERE:** Financial Intelligence-owned persistence.  
**WHY:** Results must be explainable without rewriting operational source data.

**HOW:** Persist run ID, provider, period, source snapshot, FKE pack, rule versions, classification decisions, allocation outputs, formula outputs, reconciliation, execution manifest, and approval references. Recalculations create new result versions. Historical results are immutable after publication under the applicable retention policy.

**VERIFICATION:** Result immutability, lineage completeness, supersession, and historical retrieval tests.

## 20. FI-08 — Reporting Period and Close Management

**WHAT:** Governs reporting periods, source cutoffs, and controlled close/reopen.  
**WHEN:** During financial reporting preparation and release.  
**WHERE:** Financial Intelligence.  
**WHY:** Period scope and source cutoff must be reproducible.

**HOW:** Proposed states: `OPEN → PREPARING → UNDER_REVIEW → CLOSED`, with controlled `REOPENED` and `AMENDED` paths. Record reporting dates, input cutoff, approved source snapshot, review status, and authorized actor. Reopening creates attributable revisions and cannot silently replace released reports.

**VERIFICATION:** Late transaction, closed-period update, authorized reopen, amendment, and historical cutoff tests.

## 21. FI-09 — Financial Report Instance Management

**WHAT:** Builds versioned report instances from approved FKE reporting definitions and FI results.  
**WHEN:** When a financial run meets report assembly prerequisites.  
**WHERE:** Financial Intelligence using Shared Reporting Infrastructure.  
**WHY:** Report content and methodology must be distinct from file rendering.

**HOW:** Resolve approved report definition; map reconciled result lines to report fields; validate completeness; create immutable report data snapshot; request PDF/spreadsheet rendering; attach renderer version and digest. Label management reports distinctly from official/submission-ready reports. An exported file is not automatically submitted to an authority.

**VERIFICATION:** Field completeness, definition version, artifact integrity, official-vs-management labeling, and amended report tests.

## 22. FI-10 — Financial Review and Approval Coordination

**WHAT:** Coordinates required financial review and release decisions.  
**WHEN:** Before final report approval, binder release, or official submission workflow.  
**WHERE:** Financial Intelligence using Shared Approval.  
**WHY:** Financial calculations require accountable governance, not only successful computation.

**HOW:** Enforce reviewer roles, separation of duties, reconciliation gates, report snapshot locking, decision attribution, and stale-approval invalidation. Proposed report lifecycle: `DRAFT → READY_FOR_REVIEW → UNDER_REVIEW → APPROVED → RELEASED`, with `CHANGES_REQUESTED`, `REJECTED`, `SUPERSEDED`, and `AMENDED` transitions. The owning financial policy defines who may approve and when.

**VERIFICATION:** Self-approval denial, changed report after review, unresolved material variance, and authorized release tests.

## 23. FI-11 — Financial Readiness and Intelligence

**WHAT:** Provides financial workflow visibility, exceptions, trends, and reporting readiness.  
**WHEN:** Financial Workbench, executive review, and binder preparation.  
**WHERE:** Financial Intelligence read models and authorized APIs.  
**WHY:** Users need actionable financial exceptions and traceable status.

**HOW:** Display period, methodology version, run state, missing sources, unclassified lines, allocation exceptions, reconciliation status, pending approvals, report readiness, and binder status. Management indicators must not be presented as audited or officially submitted results. Apply strict payroll/transaction field-level authorization.

**VERIFICATION:** Period-scoped views, authorization, freshness indicators, drill-down lineage, and exception counts.

## 24. HCS Cost Reporting — first financial vertical slice

**WHAT:** First end-to-end financial application of FKE + Financial Intelligence.  
**WHEN:** Per the approved roadmap, in the financial vertical-slice phase (Sprints 21–28, subject to roadmap reconciliation).  
**WHERE:** FKE, Operational Domains, Shared Intelligence, Financial Intelligence, Financial Workbench, and Financial Binder.  
**WHY:** Validate the complete architecture against a substantial regulated reporting workflow.

**HOW:** Import and verify payroll, transactions, contracts, and service statistics; resolve the approved Texas HCS financial Knowledge Pack; classify expenses; evaluate allowability; construct pools; allocate costs; calculate report lines; reconcile; review; render a versioned report; assemble the Financial Binder. Specific Texas HCS report line definitions, instructions, dates, and submission rules must be sourced and approved within FKE, not invented in FI.

**VERIFICATION:** Trace a selected report line back to source transaction(s), FKE rule version, calculation execution, reconciliation check, and approval.

## 25. Emergency Preparedness — first regulatory vertical slice

**WHAT:** First complete regulatory demonstration of RKE + Compliance Intelligence.  
**WHEN:** Per the approved roadmap, Sprints 35–37, after prerequisite infrastructure.  
**WHERE:** RKE, Residential Operations, Shared Intelligence, Compliance Intelligence, and Regulatory Workbench.  
**WHY:** Demonstrate requirement-to-evidence-to-result-to-remediation traceability.

**HOW:** Resolve certified Texas HCS Emergency Preparedness requirements; capture applicable locations and plan/drill source records; evaluate approved rules; create results; open findings when justified; assign CAPs; collect evidence; reassess; preserve historical versions. Do not assume the operational presence of a plan proves regulatory sufficiency.

**VERIFICATION:** Demonstrate compliant, noncompliant, insufficient-evidence, not-applicable, and execution-error scenarios with complete traceability.

## 26. Shared state and domain-specific state machines

| Artifact | Draft lifecycle | Important constraint |
|---|---|---|
| Compliance evaluation | Requested → Running → Completed/Partial/Failed | Failed ≠ noncompliant |
| Compliance finding | Open → Remediating → Recheck → Verified → Closed | Closure requires supported decision |
| Corrective action | Draft → Approved → In Progress → Recheck → Closed | Evidence and review retained |
| Financial run | Draft → Calculating → Reconciling → Ready for Review | Pinned source and methodology |
| Financial report | Draft → Under Review → Approved → Released | Revisions invalidate stale approvals |
| Reporting period | Open → Preparing → Under Review → Closed | Reopening is governed |

State transitions must be enforced in owning backend services and audited; frontend controls alone are insufficient.

## 27. Cross-domain data model

**Compliance-owned entities:** ComplianceEvaluationRun, ComplianceResult, ComplianceResultVersion, Finding, FindingOccurrence, CorrectiveActionPlan, CorrectiveActionStep, Reassessment, ComplianceReadinessProjection.

**Financial-owned entities:** FinancialRun, FinancialInputSnapshotReference, FinancialClassificationResult, AllowabilityDecision, CostPoolResult, AllocationResult, FormulaResult, ReconciliationCheck, ReconciliationException, FinancialResultVersion, ReportingPeriod, FinancialReportInstance, FinancialReadinessProjection.

**Cross-domain references:** Tenant, Provider, Location, Person, Employee, Contract, Service, SourceRecord, KnowledgeArtifact, KnowledgeVersion, ValidationExecution, Evidence, DocumentVersion, ApprovalWorkflow, BinderInstance, ExecutionManifest.

No cross-domain service may directly mutate another domain's authoritative tables. Use versioned APIs/events and stable references. All stored result versions include source snapshot and knowledge provenance.

## 28. APIs and commands — proposed contract families

```text
/api/v1/compliance/evaluations
/api/v1/compliance/results
/api/v1/compliance/findings
/api/v1/compliance/corrective-actions
/api/v1/compliance/reassessments
/api/v1/compliance/readiness

/api/v1/financial/runs
/api/v1/financial/classifications
/api/v1/financial/allocations
/api/v1/financial/reconciliations
/api/v1/financial/periods
/api/v1/financial/reports
/api/v1/financial/readiness
```

**Example commands:** `RequestComplianceEvaluation`, `CreateCorrectiveActionPlan`, `SubmitReassessment`, `StartFinancialRun`, `RequestFinancialReconciliation`, `SubmitFinancialReportForApproval`, `ReleaseApprovedFinancialReport`.

**Contract rules:** Backend authorization; tenant/provider/subject/period scoping; typed errors; idempotency for commands; optimistic concurrency for state changes; pagination; correlation IDs; immutable history; explicit asynchronous job status. Proposed endpoints must reconcile with ENG-009.

## 29. Domain events — proposed names

**Compliance:** `ComplianceEvaluationRequested`, `ComplianceEvaluationCompleted`, `ComplianceEvaluationFailed`, `ComplianceResultRecorded`, `FindingOpened`, `CorrectiveActionSubmitted`, `ReassessmentCompleted`, `FindingClosed`.

**Financial:** `FinancialRunStarted`, `FinancialRunCompleted`, `FinancialClassificationCompleted`, `CostAllocationCompleted`, `FinancialReconciliationCompleted`, `FinancialReportCreated`, `FinancialReportApproved`, `FinancialReportReleased`, `ReportingPeriodClosed`.

Events represent committed state, use the ENG-009 envelope, and must support idempotent consumers. Their identifiers and names must be reconciled with ENG-001's EVT catalog before implementation. Event payloads should carry references rather than unnecessary sensitive data.

## 30. Authorization and separation of duties

**WHAT:** Protect decisions, data and approvals across providers and sensitive scopes.  
**WHEN:** Every command, query, review, export, and cross-service call.  
**WHERE:** Platform Authorization, Applied Intelligence services, Shared Intelligence, and UI.  
**WHY:** A dashboard viewer is not automatically a reviewer, approver, payroll analyst, or external surveyor.

**HOW:** Enforce tenant, provider, location, person, employee, reporting period, finding, and binder scope. Distinguish evaluation initiator, remediation owner, verifier, financial preparer, financial reviewer, and report releaser. Require explicit privileges and separation of duties for sensitive decisions. Revalidate source document access on each protected retrieval. Audit denials and privileged actions.

**VERIFICATION:** Cross-tenant denial, source-level authorization, privilege escalation, self-approval, expired access, and revoked-session tests.

## 31. Evidence, audit and reproducibility

Every final compliance or financial outcome must be explainable through:

1. Authoritative definition and version.
2. Effective-date and applicability decision.
3. Authorized source records and immutable snapshot reference.
4. Evidence references and document versions, when applicable.
5. Shared execution ID and engine version.
6. Domain-specific result and interpretation.
7. Human overrides, review and approval decisions.
8. Historical audit events and resulting published artifact.

Historical inspection, deterministic replay, and current-methodology reassessment are distinct operations. A new methodology must create a new result, not rewrite the historical one.

## 32. UX and state-management integration

**Compliance workspace:** Provider-wide Provider Intelligence Center, module workbench, finding detail, CAP/evidence/notes/status/recheck, Message Center, regulatory knowledge/version drill-down. Residential module groups correction areas first and shows affected locations beneath each.

**Financial workspace:** Reporting period selector, run status, source mapping, classifications, cost pools, allocations, reconciliation exceptions, report preview, approval, Financial Binder, and lineage drill-down.

Angular/NgRx state must distinguish server-owned authoritative results from local view state. Effects handle asynchronous requests; selectors provide derived read models. UI must show loading, stale, partial, failed, not-evaluated, and unauthorized states distinctly. No compliance or financial methodology is authored in frontend components.

## 33. Error handling and recovery

| Failure | Required behavior |
|---|---|
| Unapproved knowledge version | Reject run and record reason |
| Missing source data | Return insufficient-input or review-required state; do not fabricate |
| Inapplicable requirement | Record not-applicable with RKE decision provenance |
| Validation engine error | Record execution error, not adverse finding by default |
| Financial zero denominator | Record explicit allocation exception |
| Missing financial rate | Fail relevant calculation; never silently default |
| Reconciliation mismatch | Preserve exception and block release when policy requires |
| Stale approval | Invalidate approval and require review |
| Duplicate event | Process idempotently |
| Concurrent update | Reject with version conflict |
| Authorization failure | Deny, minimize disclosure, and audit |
| Downstream outage | Retry boundedly; preserve committed state and recovery metadata |

No automatic retry may change a pinned knowledge version, source snapshot, or business decision without creating a new attributable run.

## 34. Performance, scale and observability

Support provider-wide evaluations, targeted subject evaluations, large financial periods, and asynchronous report preparation. Use bounded job queues, batching, indexed read models, incremental recomputation where safe, and tenant workload isolation. Cache only with version-aware invalidation.

**Metrics:** Evaluation latency, pending runs, failed executions, stale results, open findings, overdue CAPs, financial run duration, unclassified lines, allocation exceptions, reconciliation variance counts, approval backlog, event delivery lag, and replay failures.

Numeric service-level objectives must be approved separately; none are presumed by this draft.

## 35. Testing and quality strategy

| Test ID | Area | Required evidence |
|---|---|---|
| T-AI-01 | Regulatory orchestration | Approved definitions, authorized facts, pinned versions |
| T-AI-02 | Applicability | Correct date/scope, undetermined vs not-applicable |
| T-AI-03 | Compliance results | Immutable history and current projection |
| T-AI-04 | Findings | Policy-based creation, severity, deduplication |
| T-AI-05 | CAP | Assignment, evidence, review, separation of duties |
| T-AI-06 | Reassessment | Recheck and closure without erasing history |
| T-AI-07 | Provider dashboard | No mandatory locationId, correction-area grouping |
| T-AI-08 | Financial run | Pinned sources/methodology and retry safety |
| T-AI-09 | Classification | Allowability, exceptions and lineage |
| T-AI-10 | Allocation | Denominators, precision, rounding and balancing |
| T-AI-11 | Formulas | Decimal precision and effective dates |
| T-AI-12 | Reconciliation | Totals, material variance and release blocking |
| T-AI-13 | Report instance | Snapshot, renderer and approval provenance |
| T-AI-14 | Period close | Cutoffs, amendments and reopening |
| T-AI-15 | Security | Tenant/resource scope and approval separation |
| T-AI-16 | Historical replay | Original input/knowledge/engine reproducibility |
| T-AI-17 | Failure recovery | Retries, event duplicates and partial failures |
| T-AI-18 | HCS cost reporting | End-to-end financial vertical slice |
| T-AI-19 | Emergency preparedness | End-to-end regulatory vertical slice |

All tests align with ENG-013. Certification tests belong to their respective Knowledge Engines, not to Applied Intelligence.

## 36. Implementation dependencies and sequencing

**Prerequisites:** Platform Foundation identity/authorization; stable Operational Domain contracts; RKE/FKE approved definition contracts; Shared Validation, Evidence, Audit, Approval, Reporting, and Execution Manifest contracts.

**Recommended design-to-implementation sequence:**

1. Approve common execution/result contracts and cross-domain ownership.
2. Implement Compliance Evaluation and Financial Run orchestration contracts.
3. Implement versioned result registries and provenance.
4. Add findings, CAPs, rechecks, financial classification and allocation.
5. Add reconciliation, period close, report instances and approvals.
6. Build read models and workspaces.
7. Validate HCS Cost Reporting and Emergency Preparedness vertical slices according to roadmap dependencies.

This sequence describes dependency logic, not permission to begin coding. ENG-015 sprint assignments must be reconciled with the final approved component dependencies.

## 37. Acceptance criteria

- [ ] Compliance Intelligence and Financial Intelligence have independent ownership and state.
- [ ] No regulatory or financial knowledge is authored or certified by Applied Intelligence.
- [ ] Only certified/approved, effective, pinned definitions execute.
- [ ] Source facts remain owned by Operational Domains.
- [ ] Generic execution remains owned by Shared Intelligence.
- [ ] Compliance statuses distinguish noncompliance, insufficient evidence, non-applicability and errors.
- [ ] Findings, CAPs, rechecks and closures preserve history.
- [ ] Provider-wide dashboard does not require `locationId`.
- [ ] Residential correction areas are grouped before locations.
- [ ] Financial classification, allowability, allocation, formulas and reconciliation preserve lineage.
- [ ] Exact decimal and approved rounding semantics are enforced.
- [ ] Unresolved material financial exceptions block release as required.
- [ ] Report instances preserve methodology, source, approval and rendering versions.
- [ ] Financial Binder and Survey Binder remain shared-infrastructure capabilities with domain-specific requirements.
- [ ] Backend authorization, tenant isolation and separation of duties are enforced.
- [ ] Events are reliable and consumers idempotent.
- [ ] Historical inspection and replay are supported with explicit limitations.
- [ ] Required unit, integration, contract, security, recovery and vertical-slice tests pass.
- [ ] ENG-008, ENG-009, ENG-010, ENG-013, ENG-014 and ENG-015 references are reconciled before implementation.

## 38. Governance and design reconciliation

ENG-020 must be reviewed alongside ENG-001–ENG-019. Specifically:

- **Service IDs:** Confirm proposed CI/FI identities against ENG-008.
- **API/event names:** Reconcile proposed routes and events against ENG-001 and ENG-009.
- **Entity ownership:** Reconcile with ENG-003, ENG-004 and ENG-012.
- **Security:** Reconcile approval and resource scopes with ENG-010.
- **UX:** Reconcile provider-wide dashboard, Financial Workbench and correction-area navigation with ENG-011.
- **Quality:** Reconcile acceptance evidence with ENG-013.
- **Roadmap:** Sprints **0–47 inclusive represent 48 numbered sprint slots**, despite prior shorthand referring to a “47-sprint roadmap.” Resolve this naming discrepancy through governance without silently changing sprint assignments.
- **Knowledge certification dependencies:** Ensure early knowledge-specific governance does not assume later shared Approval infrastructure is already deployed; use approved interfaces and an explicit transition plan.

These are design-review actions, not reasons to constrain the target architecture to legacy code.

## 39. Implementation authorization

**Status: NOT GRANTED.**

This document does not authorize source-code changes, Nx project creation, database migrations, API changes, deployments, knowledge publication, or operational data modifications. The target design is established independently of existing repository state. Repository gap analysis, reuse decisions, and implementation work packages follow formal design approval.

## 40. Final engineering position

**Operational Facts + Approved Knowledge + Shared Execution → Applied Intelligence Results → Governed Review and Action.**

Compliance Intelligence owns regulatory evaluation outcomes, findings, corrective action, and reassessment. Financial Intelligence owns financial execution outcomes, reconciliation, report instances, and reporting readiness. Both remain accountable to independent Knowledge Engines, protected operational sources, shared governance infrastructure, and complete historical traceability.

**End of ENG-020 — Applied Intelligence: Detailed Component Specifications**
