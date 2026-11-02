# ENG-025 — Architecture Verification and Acceptance Test Blueprint

**Organization:** McCaskill Projects  
**Platform:** Regulatory Intelligence Platform  
**Document ID:** ENG-025  
**Version:** 1.0 — Draft  
**Proposed repository path:** `docs/engineering/25-architecture-verification-and-acceptance-test-blueprint.md`  
**Design approach:** Architecture-first, repository-independent  
**Implementation authorization:** Not Granted  
**Verification status:** Test design only; no tests executed or approvals granted.

---

## 1. Executive purpose

This blueprint defines the objective evidence required to verify the intended architecture described in ENG-001 through ENG-024. It distinguishes **design verification** (checking specifications and contracts for consistency), **implementation verification** (checking the future system against the approved design), and **operational acceptance** (checking whether the system safely supports intended workflows). It is not a claim that the earlier specifications have been reconciled, that the repository has been inspected, or that any test has passed.

The platform has exactly **two independent knowledge authorities**: the Regulatory Knowledge Engine (RKE) and Financial Knowledge Engine (FKE). Shared Intelligence executes governed definitions and provides evidence, validation, audit, documents, approvals, reporting infrastructure, and binders; it is not a third authority. Operational Domains own operational facts. Compliance Intelligence and Financial Intelligence own applied determinations. Platform Foundation enforces security and tenancy. User Experience presents authorized workflows.

## 2. Verification goals

1. Demonstrate ownership boundaries and prohibited dependencies.
2. Demonstrate that approved, version-pinned knowledge governs all regulated determinations.
3. Demonstrate complete provenance from source through result and released artifact.
4. Demonstrate tenant isolation, least privilege, and secure external survey access.
5. Demonstrate deterministic financial calculations and explainable compliance evaluations.
6. Demonstrate reliable workflows, state transitions, retries, and recovery.
7. Demonstrate historical reproducibility and retention/legal-hold controls.
8. Demonstrate accessible, usable end-to-end workspaces.
9. Produce objective acceptance evidence and traceable decisions.

## 3. Scope and exclusions

**In scope:** architectural contract review, domain boundary tests, API/event contracts, data integrity, knowledge validation/certification, execution engines, compliance and financial workflows, binders, security, operational resilience, migration, accessibility, and end-to-end acceptance scenarios.

**Not in scope yet:** repository inspection, executing test suites, confirming regulatory source content or rates, performance benchmarking, deployment, and implementation authorization. Those activities require approved inputs and subsequent work.

## 4. Verification stages and gates

| Gate | Required evidence | Decision owner | Failure disposition |
|---|---|---|---|
| G0 — Specification inventory | ENG-001–025 identified, versions and owners recorded | Architecture owner | Block review |
| G1 — Contract reconciliation | Ownership, entity, API, event, state, and ID discrepancies resolved | Architecture review board | Record blocking design issue |
| G2 — Design acceptance | Approved architecture decisions, threat model, test oracle plan | Design authority | Remain draft |
| G3 — Component verification | Component and contract test evidence | Engineering + QA | Block integration |
| G4 — Integration verification | Cross-domain and security test evidence | Integration + Security | Block release candidate |
| G5 — Business acceptance | Verified HCS cost reporting, emergency preparedness, ISS, binder workflows | Domain owners | Block operational acceptance |
| G6 — Production readiness | Recovery, performance, security, accessibility, monitoring, rollback | Release authority | No production authorization |

**No gate is currently marked passed.** Passing a later gate cannot waive an earlier blocking failure.

## 5. Requirements traceability model

Every test case must link to a requirement and a decision, not merely a feature name.

```typescript
interface ArchitectureAcceptanceCase {
  caseId: string;
  requirementIds: string[];
  sourceDocumentIds: string[];
  componentIds: string[];
  preconditions: string[];
  fixtures: string[];
  actions: string[];
  expectedResults: string[];
  negativeAssertions: string[];
  evidenceArtifacts: string[];
  severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NOT_RUN' | 'PASS' | 'FAIL' | 'BLOCKED' | 'WAIVED';
  reviewerId?: string;
}
```

A waiver requires a named approver, scope, reason, expiry, and compensating control. Security isolation, knowledge-authority separation, and fabricated regulatory/financial results are non-waivable release blockers.

## 6. Source-of-truth verification

**RKE:** Test that regulatory applicability, evidence requirements, evaluation definitions, effective dates, certification, and publication resolve only from an approved version. Reject unpublished, revoked, invalid, or temporally inapplicable definitions.

**FKE:** Test that classifications, allowability, allocation, rates, precision, formulas, and reporting definitions resolve only from an approved financial pack. Reject unapproved methodology, unsupported rates, and non-deterministic formulas.

**Shared Intelligence:** Test that execution services cannot author, amend, certify, or publish knowledge. They may record execution outcomes and approvals under owning-domain policy.

**Operational Domains:** Test that records represent factual activity without silently declaring regulatory compliance or regulated financial allowability.

**Applied Intelligence:** Test that a compliance or financial result cannot be finalized without a pinned governing knowledge version and source snapshot.

## 7. Component verification catalog

| Family | Component range | Verification focus |
|---|---|---|
| Platform Foundation | PF-01–09 | Identity, tenancy, authorization, API, security, persistence, messaging, monitoring, deployment/recovery |
| Operational Domains | OP-01–12 | Organizations, locations, people, workforce, services, contracts, payroll, transactions, statistics, evidence coordination, residential, ISS |
| Regulatory Knowledge | RK-01–11 / RKE-01–11 | Source provenance, applicability, pack validation, certification, publication, temporal resolution |
| Financial Knowledge | FK-01–13 / FKE-01–13 | Definitions, classification, allowability, allocation, rates, formulas, reporting, approval, publication |
| Shared Intelligence | SI-01–15 / SII-01–15 | Evidence, validation, audit, documents, change, approvals, reports, binders, exchange, events, reproducibility |
| Compliance Intelligence | CI-01–07 | Evaluations, compliance results, findings, CAP, reassessment, readiness |
| Financial Intelligence | FI-01–11 | Source ingestion, mapping, classification, calculations, allocations, reconciliation, reporting, review |
| Binder Management | BM-01–09 | Definitions, instances, assembly, completeness, review, release, external access, retention |
| User Experience | UX-01–05 plus ENG-022 extensions | App shell, navigation, workspaces, state, accessibility and resource scoping |

The alternative service prefixes above are **known reconciliation work**, not evidence that the identifiers already match. ENG-024 must establish canonical identifiers.

## 8. Contract reconciliation test suite

**AV-001 Ownership matrix:** Every entity, decision, and API has one accountable authority; shared read access does not confer ownership.

**AV-002 Service dependency graph:** No prohibited circular dependencies or cross-layer direct persistence access.

**AV-003 Entity contracts:** Identity, tenant, version, effective-date, and source-reference semantics agree across documents.

**AV-004 API contracts:** Paths, verbs, payloads, authorization, pagination, idempotency, and error codes reconcile with ENG-009.

**AV-005 Event contracts:** ENG-001 EVT-001–042 and ENG-009 proposed events are mapped without collision; producers and consumers are documented.

**AV-006 State machines:** Every transition is authorized, auditable, and consistent with ENG-002.

**AV-007 Sprint numbering:** ENG-015 numbering 0–47 is explicitly **48 sprint slots**, not 47; roadmap wording is corrected through design control.

**AV-008 Approval dependencies:** Reconcile early RKE certification needs with the later Shared Approval implementation phase; define an authorized interim or sequenced approach without bypassing governance.

## 9. Regulatory Knowledge verification

Test source authenticity, source-version immutability, effective-date applicability, conflicting provisions, supersession, jurisdiction/program scope, missing citations, pack validation, separation of author and certifier, rejected certifications, publication atomicity, rollback policy, and historical resolution. Use independently reviewed fixtures derived from verified authoritative sources. A fabricated example may test mechanics but cannot establish regulatory correctness.

## 10. Financial Knowledge verification

Test financial source provenance, framework applicability, mutually exclusive classification rules, allowability exclusions, allocation bases, rates and date boundaries, exact-decimal arithmetic, rounding stage, residual distribution, formula dependencies, cycle detection, reporting line mappings, segregation of duties, approval version-locking, publication, and historical reproduction. Golden financial fixtures require independent domain review.

## 11. Shared Validation execution verification

**AV-020:** Regulatory execution uses certified RKE definition.

**AV-021:** Financial execution uses approved FKE definition.

**AV-022:** Operational validation uses a domain-owned definition.

**AV-023:** Arbitrary executable code and unapproved operators are rejected.

**AV-024:** Timeout, invalid input, and missing dependencies yield explicit errors—not false compliance outcomes.

**AV-025:** The same pinned inputs, definitions, and engine version reproduce the same result under supported replay conditions.

## 12. Operational data verification

Verify provider-scoped identifiers, person/profile separation, effective-dated assignments, conflicting active residential assignments, service encounter correction history, contract amendment lineage, payroll payment status independent of draft calculations, transaction import idempotency, service statistic units and period boundaries, and source-document authorization. Confirm no operational field is misrepresented as an authoritative compliance finding or financial allowability determination.

## 13. Compliance Intelligence acceptance scenarios

**AV-CI-01 Provider-wide dashboard:** Provider results load without a mandatory `locationId`; location-specific access remains scoped.

**AV-CI-02 Correction-area-first Residential Workbench:** Fire Drills, Emergency Plans, Hot Water, and Medication appear as correction areas with affected locations nested beneath.

**AV-CI-03 Finding lifecycle:** Findings link to source facts, certified rule, evidence, responsible actor, and status history.

**AV-CI-04 Corrective action:** CAP assignments, notes, evidence, due dates, approvals, and reassessment remain attributable.

**AV-CI-05 Reassessment:** Recheck uses explicitly selected current or historical approved knowledge and never overwrites the original result.

**AV-CI-06 Error semantics:** Missing evidence, execution failure, not-applicable, and noncompliance are distinct outcomes.

## 14. Financial Intelligence acceptance scenarios

**AV-FI-01:** Source payroll, transactions, contracts, and service statistics retain provenance.

**AV-FI-02:** Classification follows pinned approved FKE rules.

**AV-FI-03:** Allowability and exclusions are applied transparently with reasons.

**AV-FI-04:** Allocation uses approved bases and preserves numerator, denominator, source period, and rounding policy.

**AV-FI-05:** Reconciliation detects missing, duplicated, and mismatched records; unresolved material differences block approval under the governing policy.

**AV-FI-06:** Reports retain definition version, source snapshot, formula lineage, approval, and renderer version.

**AV-FI-07:** Financial Binder contains the authorized report instance and supporting records, not a silently regenerated substitute.

## 15. Binder acceptance scenarios

Test Financial, Provider Survey, Residential Survey, ISS Survey, and Personnel Survey binder types using one shared lifecycle: **Draft → Assembling → Under Review → Approved → Released → Closed → Archived**. Test changes-requested loops, required section completeness, conditional items, approved release, frozen release snapshots, post-release amendments, legal holds, retention, closure controls, and external access expiry. Binder membership alone must never authorize access to a protected underlying record.

## 16. External survey access and information exchange

Test individual external identities, MFA, provider/location/person/event scopes, short-lived grants, document-level authorization, streaming/large-file access, information requests and responses, audit of views/downloads, immediate revocation behavior, and denial of out-of-scope or cross-tenant access. Verify that surveyor access does not confer administrative, financial, or unrestricted clinical access.

## 17. Texas HCS Emergency Preparedness vertical slice

**Acceptance sequence:** Verify authoritative source → draft RKE definitions → validate → independent certification → publish pack → create operational emergency-plan and activity records → evaluate applicable requirements → preserve evidence → create findings where warranted → assign CAP → recheck → present provider-wide readiness → assemble authorized survey binder.

**Required negative tests:** outdated source, wrong location type, expired plan version, missing evidence, unauthorized document, execution error, and revised knowledge version. Official Texas HCS requirements must be independently verified before fixture approval; this blueprint does not certify specific requirements.

## 18. Texas HCS Cost Reporting vertical slice

**Acceptance sequence:** Verify official reporting sources and period → approve FKE definitions → collect authorized payroll/transactions/service statistics → classify → apply allowability → allocate → calculate using decimal-safe precision → reconcile → assemble report instance → independent approval → create Financial Binder → preserve historical execution and submission status separately.

**Required negative tests:** unsupported rate, wrong effective period, double-counted transaction, missing payroll source, zero allocation denominator, rounding discrepancy, material reconciliation difference, stale report approval, and unauthorized binder access. No unverified Texas rate or cost-report line is assumed authoritative.

## 19. ISS Operations vertical slice

Test individual plan linkage, configurable nine skill domains, 72 objective templates, individualized measurable goals, Guided/Supported/Independent progression, weekly activity planning, community participation, six-hour conceptual day planning, progress observations, and authorized service documentation. A scheduled six-hour day must **not** automatically generate six billable hours. Texas ISS compliance evaluation requires a separately certified Texas ISS Knowledge Pack; LevelUp Adventures remains a customer organization, not the universal engine.

## 20. Security verification matrix

| Control | Positive test | Negative test |
|---|---|---|
| Tenant isolation | Authorized tenant sees own resources | Cross-tenant ID rejected |
| Provider scope | Provider-wide authorized view | Other provider denied |
| Person/employee scope | Assigned user sees permitted records | Unrelated records denied |
| Service-to-service auth | Scoped machine request succeeds | Forged or expired context denied |
| Knowledge certification | Independent authorized certifier approves | Self-certification prohibited |
| Financial approval | Authorized reviewer approves current version | Stale version and self-approval rejected |
| Document access | Authorized preview/download succeeds | Binder reference cannot bypass source ACL |
| Surveyor access | Event-scoped external access succeeds | Revoked/expired access denied |
| Audit | Critical actions recorded | Tampering and unauthorized audit reads denied |
| Sensitive exports | Authorized, logged export succeeds | Bulk export without permission denied |

## 21. Data integrity and historical verification

Verify revision conflicts, effective-date boundary conditions, append-only audit, document content digests, immutable released artifacts, execution manifests, source snapshot integrity, migration reversibility where supported, backup restoration, and legal-hold enforcement. Historical inspection, deterministic replay, and current-methodology reassessment are separate operations and must never be conflated.

## 22. Event and asynchronous workflow verification

Test transactional outbox, inbox deduplication, at-least-once delivery, ordering assumptions, retries, dead-letter handling, replay authorization, causation and correlation, partial failures, and compensation. Verify that retries do not create duplicate findings, payroll records, financial reports, approval decisions, or binder releases.

## 23. Frontend and accessibility verification

Verify Angular shell navigation, authenticated session handling, role-aware menus, NgRx state boundaries, stale cache invalidation, deep links, unsaved-change protection, concurrency feedback, accessible forms and tables, keyboard navigation, focus management, meaningful error messages, and WCAG 2.2 AA acceptance criteria. A hidden control is not a substitute for backend authorization.

## 24. Performance and reliability verification

Define approved workload profiles before benchmarking: tenants, providers, locations, users, records, document sizes, concurrent validations, report jobs, and survey sessions. Test p95/p99 latency, throughput, queue depth, large-file streaming, bulk imports, recovery time, and tenant isolation under load. Numerical thresholds are **TBD by approved nonfunctional requirements**, not invented here.

## 25. Disaster recovery and operational readiness

Test backup restoration, database consistency, protected object recovery, event replay, key rotation, credential revocation, monitoring alerts, incident escalation, and rollback. Production acceptance requires approved RPO/RTO targets, documented runbooks, on-call ownership, and successful recovery exercises.

## 26. Test environment and fixture governance

Use isolated environments and synthetic or appropriately de-identified data. Maintain versioned fixtures with provenance, expected outputs, reviewer, and change history. Separate mechanics-only fixtures from authoritative regulatory/financial golden fixtures. Golden fixtures require review by qualified domain owners; never use invented regulations, rates, or tax rules as proof of correctness.

## 27. Automation and CI/CD gates

Recommended future gates: static analysis → architecture dependency checks → unit tests → contract tests → integration tests → security scans → migration checks → E2E tests → accessibility checks → performance/resilience tests → approval evidence. No automation is presumed implemented. Fail closed on blocking governance or security checks.

## 28. Test evidence package

For each acceptance run, preserve:

- Specification version and requirement IDs.
- Test case version and fixture hashes.
- Build/commit and environment identifiers.
- Knowledge pack and definition versions.
- Input snapshot and engine version.
- Actual and expected outputs.
- Logs, traces, and audit references with secrets redacted.
- Defects, waivers, and rerun history.
- Reviewer identity, decision, and timestamp.

## 29. Defect classification

**Blocker:** authority boundary violation, cross-tenant data leak, unauthorized publication/approval, incorrect authoritative financial/regulatory result, lost critical audit history, or corrupted released artifact.

**High:** materially broken workflow, missing source lineage, unreliable recovery, or failed access revocation.

**Medium:** noncritical functional deviation with approved workaround.

**Low:** minor presentation or documentation issue without material operational risk.

No unresolved Blocker is eligible for release approval.

## 30. Architecture verification register

Maintain one record per discrepancy: issue ID, source documents, conflicting clauses, impacted components, severity, proposed resolution, architecture decision record, owner, reviewer, approval, and verification evidence. Specifically reconcile:

1. ENG-001 event IDs versus ENG-009 and later proposed event names.
2. ENG-008 RK/FK/SI identifiers versus ENG-016–018 RKE/FKE/SII identifiers.
3. ENG-008 service catalog versus ENG-014 work packages and ENG-015 sprint assignments.
4. Sprint 11 knowledge certification versus Sprint 15 Shared Approval infrastructure.
5. Sprint 0–47 wording: 48 numbered slots.
6. Regulatory and financial temporal version resolution.
7. Cross-authority references without transferring ownership.
8. Binder type-specific requirements versus universal binder lifecycle.
9. Payroll operational calculations versus FKE regulated reporting methodology.
10. Source record access versus binder/survey access.
11. ENG-022 expanded UX components versus ENG-008 UX-01–05.
12. Proposed APIs/events in ENG-016–023 versus ENG-009 canonical contracts.

This list identifies review targets, **not resolved findings**.

## 31. Decision and approval records

```typescript
interface ArchitectureGateDecision {
  gateId: string;
  specificationBaseline: string[];
  evidenceReferences: string[];
  blockingDefectIds: string[];
  decision: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  conditions?: string[];
  approvedBy: string[];
  decidedAt: string;
}
```

Required signoffs should include Architecture, Security, QA, Regulatory Knowledge Governance, Financial Knowledge Governance, Operational Domain ownership, and Release Operations where applicable. The approving body and individual authorities must be formally designated; no names or approvals are assumed.

## 32. Exit criteria for independent architecture design

Independent design may be declared complete only when:

- [ ] ENG-001–025 have controlled versions and owners.
- [ ] ENG-024 discrepancies are adjudicated and approved.
- [ ] Canonical component, entity, API, and event catalogs exist.
- [ ] Every critical requirement maps to acceptance tests.
- [ ] Domain authority boundaries are unambiguous.
- [ ] Security and threat model decisions are approved.
- [ ] Regulatory and financial fixture approval responsibilities are assigned.
- [ ] End-to-end vertical-slice acceptance criteria are approved.
- [ ] Nonfunctional targets and recovery objectives are defined.
- [ ] Formal design acceptance is recorded.

Drafting this document does **not** satisfy these exit criteria by itself.

## 33. Transition to ENG-026

**ENG-026 — Repository Gap Analysis and Implementation Readiness** begins only after the independent design baseline is approved. ENG-026 must inventory actual source files, libraries, migrations, builds, tests, and deployed dependencies, then classify each against the approved target as **Reuse / Modify / Replace / Build / Retire / Unknown**. It must not retroactively redefine the target architecture merely to match existing code. Any proposed design change requires explicit architecture change control.

## 34. Implementation authorization

**NOT GRANTED.** This specification does not authorize source-code changes, database migrations, deployment, production access, or claims that tests have passed. It specifies how future evidence will be collected and assessed.

## 35. Final engineering position

The Regulatory Intelligence Platform is acceptable only when its authoritative knowledge, operational facts, shared execution, applied determinations, user workspaces, and platform controls can be verified together—with security, provenance, reproducibility, and independent approval intact. **ENG-025 establishes the verification blueprint; actual verification and design approval remain outstanding.**

---

**End of ENG-025 — Architecture Verification and Acceptance Test Blueprint**
