# REC-029 — Final Gap Analysis and Implementation Priorities

## 1. Document control

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document:** REC-029 — Final Gap Analysis and Implementation Priorities  
**Date:** 2026-11-02  
**Status:** DRAFT — consolidation and prioritization, not a closure certificate  
**Proposed repository path:** `docs/governance/reconciliation/rec-029-final-gap-analysis-and-implementation-priorities.md`  
**Implementation authorization:** NOT GRANTED  
**Source basis:** REC-001–REC-028, particularly REC-017–REC-028, and prior static review of `hhscCompliance-develop.zip`. No fresh build, runtime test, or independent regulatory certification is claimed in this document.

## 2. Executive decision

The project should **stop expanding the reconciliation document series after REC-030** and transition to an explicitly approved, security-first implementation and verification plan. The Texas HCS Emergency Preparedness vertical slice is the first candidate, but it is **not release-ready**. Twelve P0 closure items remain open in the REC-026 register; this document groups them into implementable workstreams without changing their formal count or falsely marking any closed.

## 3. Scope and non-goals

Scope: RKE-to-evaluator integration, emergency-plan/fire-drill evidence, tenant authorization, deterministic outcomes, historical provenance, API/UI compatibility, audit, and acceptance-test execution. Out of scope: implementing code, ratifying regulations, declaring legal compliance, certifying knowledge, executing tests, or modifying the repository.

## 4. Evidence hierarchy

1. Source-level observations in the uploaded repository are **static evidence**. 2. REC design decisions are **proposals** until ratified. 3. Passing automated tests require recorded commands, environment, artifacts, and independently reviewable results. 4. Regulatory source verification requires official effective-dated text and designated reviewer signoff. 5. Production readiness requires all release gates, not merely a document marked complete.

## 5. Current state summary

| Capability | Current assessment | Evidence class |
|---|---|---|
| RKE knowledge pack models, validator, loader | Present in inspected source | Static |
| RKE immutable persistence/certification/temporal resolver | Not established | Gap / requires verification |
| Compliance engine and results persistence | Present in inspected source | Static |
| Emergency Plans evaluator | Unconditional findings reported in REC-017/018 | Static finding; revalidate against target commit |
| Fire-drill operational records | Present in inspected source | Static |
| Dedicated emergency-plan and staff-access evidence | Not established | Gap / requires verification |
| Provider context in inspected evaluator | Default/earliest provider selection reported in REC-023 | P0 security concern |
| Certified RKE → evaluator binding | Not established | Gap |
| Five-state outcomes | Proposed; existing result model reported as three-state | Compatibility gap |
| Historical replay, tenant safety, audit chain | Not demonstrated end-to-end | Unverified |
| REC-027 verification scenarios | 36 specified | Not executed |
| REC-028 test harness | Specified | Not implemented |

“Not established” means insufficient evidence in inspected scope, not proof of global absence.

## 6. Release-blocking rule

No Emergency Preparedness compliance result may be represented as a certified legal determination unless the evaluator uses an authorized tenant scope, certified effective-dated rule revision, appropriate evidence, explicit outcome semantics, and auditable provenance. Missing or unreviewed evidence must not be silently converted into a definitive violation.

## 7. P0 closure inventory

The controlling closure count is **12 P0 items in REC-026**. The table below is a **workstream grouping**, not a renumbering or replacement of that register.

| Workstream | P0 themes to close | Primary prerequisite |
|---|---|---|
| Security | Provider/location authorization, no implicit provider fallback | Trusted identity and scope contract |
| Regulatory | Citation, applicability, effective date, certification | Authoritative text and reviewer approval |
| Evidence | Emergency plans, staff access, fire drills, provenance | Operational source-of-truth decisions |
| Evaluation | RKE binding, predicates, five-state results, compatibility | Approved crosswalk and adapter |
| Reproducibility | Immutable evidence, version manifests, replay | Persistence and evaluator version contracts |
| Release evidence | CI execution, audit, binder and end-to-end proof | Harness and test environment |

**Closure authority:** only the item-by-item REC-026 register plus evidence and reviewer signoff can change an item from open to closed.

## 8. Priority scale

**P0:** blocks safe or accurate use; fix before production or any claim of regulatory compliance. **P1:** required for reliable operational release, observability, and support. **P2:** efficiency, UX refinements, or broader platform coverage after the vertical slice proves its contracts. Priorities are proposals subject to owner review.

## 9. Consolidated implementation backlog

| ID | Work package | Priority | Definition of done |
|---|---|---|---|
| IMP-01 | Tenant-scoped evaluator execution | P0 | Authorization contract, negative cross-tenant tests, audit evidence |
| IMP-02 | Regulatory citation and effective-date certification | P0 | Source snapshot, signed crosswalk, applicability tests |
| IMP-03 | Emergency-plan operational source of truth | P0 | Approved entity/DTO contract and fixture tests |
| IMP-04 | Staff access and acknowledgment evidence | P0 | Approved evidence predicates and negative tests |
| IMP-05 | Fire-drill evidence adapter | P0 | Adapter contract, edge-case fixture results |
| IMP-06 | Certified RKE-to-evaluator crosswalk | P0 | Versioned mapping and resolver tests |
| IMP-07 | Remove unconditional noncompliance | P0 | Five-state matrix tests and regression evidence |
| IMP-08 | Outcome and persistence compatibility | P0 | No-loss DTO/database/UI compatibility proof |
| IMP-09 | Immutable determination manifest and replay | P0 | Replay fixtures, tamper and retroactivity tests |
| IMP-10 | Approval, audit and evidence chain | P0 | Audit/event tests and approval artifacts |
| IMP-11 | Executable harness and CI evidence | P0 | Machine-readable pass/fail and independent review |
| IMP-12 | Backend and UI vertical slice | P1 | End-to-end demo, API contract and browser tests |
| IMP-13 | Observability and operations | P1 | Logs/metrics/alerts verified |
| IMP-14 | Cost reporting FKE vertical slice | P2 | Separate FKE approval and acceptance package |

## 10. IMP-01 — Tenant-scoped evaluator execution

**Priority:** P0  
**Required work:** Remove implicit provider selection; derive scope from authenticated principal and authorized location; fail closed.  
**Trace:** REC-023–027  
**Evidence needed:** Authorization contract, negative cross-tenant tests, audit evidence  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 11. IMP-02 — Regulatory citation and effective-date certification

**Priority:** P0  
**Required work:** Reconcile §565.23(e)/(f) against official effective-dated source, establish independently reviewed atomic requirements.  
**Trace:** REC-021–022  
**Evidence needed:** Source snapshot, signed crosswalk, applicability tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 12. IMP-03 — Emergency-plan operational source of truth

**Priority:** P0  
**Required work:** Define plan revision, validity, location ownership, review and document provenance.  
**Trace:** REC-018–025  
**Evidence needed:** Approved entity/DTO contract and fixture tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 13. IMP-04 — Staff access and acknowledgment evidence

**Priority:** P0  
**Required work:** Distinguish document availability, staff access, and acknowledgment without inventing statutory mandates.  
**Trace:** REC-018–025  
**Evidence needed:** Approved evidence predicates and negative tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 14. IMP-05 — Fire-drill evidence adapter

**Priority:** P0  
**Required work:** Reuse operational records through authorized, time-scoped adapter; reconcile shifts and dates.  
**Trace:** REC-018, REC-023  
**Evidence needed:** Adapter contract, edge-case fixture results  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 15. IMP-06 — Certified RKE-to-evaluator crosswalk

**Priority:** P0  
**Required work:** Bind each evaluated predicate to immutable approved rule and requirement revision.  
**Trace:** REC-015–023  
**Evidence needed:** Versioned mapping and resolver tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 16. IMP-07 — Remove unconditional noncompliance

**Priority:** P0  
**Required work:** Require evidence evaluation; distinguish insufficient evidence, verified violation, and review.  
**Trace:** REC-017, REC-022–023  
**Evidence needed:** Five-state matrix tests and regression evidence  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 17. IMP-08 — Outcome and persistence compatibility

**Priority:** P0  
**Required work:** Approve translation between proposed five-state determinations and existing three-state result consumers.  
**Trace:** REC-022–025  
**Evidence needed:** No-loss DTO/database/UI compatibility proof  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 18. IMP-09 — Immutable determination manifest and replay

**Priority:** P0  
**Required work:** Capture knowledge/evidence/evaluator digests and as-of context; preserve corrections.  
**Trace:** REC-007–015, REC-023–028  
**Evidence needed:** Replay fixtures, tamper and retroactivity tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 19. IMP-10 — Approval, audit and evidence chain

**Priority:** P0  
**Required work:** Independent certification, immutable audit, event idempotency and reviewer signoff.  
**Trace:** REC-006–015, REC-025–028  
**Evidence needed:** Audit/event tests and approval artifacts  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 20. IMP-11 — Executable harness and CI evidence

**Priority:** P0  
**Required work:** Implement REC-028 fixtures and execute REC-027 36 scenarios with environment manifest.  
**Trace:** REC-026–028  
**Evidence needed:** Machine-readable pass/fail and independent review  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 21. IMP-12 — Backend and UI vertical slice

**Priority:** P1  
**Required work:** Wire RKE, operational evidence, evaluation, persistence and frontend without bypassing authorization.  
**Trace:** REC-016–020  
**Evidence needed:** End-to-end demo, API contract and browser tests  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 22. IMP-13 — Observability and operations

**Priority:** P1  
**Required work:** Correlate decisions, audit events, resolver failures, and support workflows.  
**Trace:** REC-006, REC-027–028  
**Evidence needed:** Logs/metrics/alerts verified  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 23. IMP-14 — Cost reporting FKE vertical slice

**Priority:** P2  
**Required work:** Begin only after first-slice security, knowledge governance and replay patterns are validated.  
**Trace:** REC-001–010  
**Evidence needed:** Separate FKE approval and acceptance package  
**Gate:** No implementation until corresponding design/security/regulatory contracts are ratified and an accountable owner authorizes the work. Any tests must be run against a pinned commit and recorded environment.

## 24. Dependency order

1. Confirm repository commit and reconcile all draft assumptions against it. 2. Ratify regulatory source and tenant authorization. 3. Ratify operational evidence and five-state compatibility. 4. Ratify immutable RKE publication and resolver contracts. 5. Implement storage, authorization, adapters, and evaluator behind feature controls. 6. Implement harness and execute security, rule, evidence, replay, and UI tests. 7. Collect independent approvals; only then consider release.

## 25. First implementation increment

**Recommended first increment (after authorization):** enforce explicit authenticated provider/location scope at the evaluator boundary and add negative cross-tenant tests. This is intentionally narrow, independently verifiable, and prevents building additional compliance logic atop unsafe context selection. Do not mix it with broad UI redesign.

## 26. Second implementation increment

Build an evidence adapter that reads authorized fire-drill and emergency-plan records as of the requested assessment time. If the plan record does not exist, represent that as insufficient evidence until the applicable certified predicate establishes otherwise. Record source record IDs, revisions, and access decisions.

## 27. Third implementation increment

Connect an approved RKE crosswalk to deterministic evaluation, remove unconditional findings, and return the five proposed states through a ratified compatibility layer. Preserve old clients only through explicit documented translation; do not coerce unknown states into noncompliant.

## 28. Fourth implementation increment

Persist immutable determination manifests and demonstrate as-of/known-at historical replay. Corrections produce linked new revisions and determinations; existing evidence packages must not silently mutate.

## 29. Fifth implementation increment

Run the 36 REC-027 scenarios through the REC-028 harness, collect results, triage failures, retest, and obtain independent security/regulatory/engineering acceptance. Test definitions do not count as passing evidence.

## 30. Required owner decisions

| Decision | Proposed owner | Status |
|---|---|---|
| Regulatory atomic crosswalk and legal interpretation | Regulatory authority | Pending |
| Provider/location authorization boundary | Security + platform owner | Pending |
| Operational evidence record schemas | Domain owner | Pending |
| RKE certification and immutable store | Knowledge governance owner | Pending |
| Five-state persistence/API translation | API + compliance owner | Pending |
| Replay and retention policy | Architecture + security | Pending |
| Test evidence acceptance and release | QA + designated approver | Pending |

Roles are proposed; no person is assigned or implied to have approved.

## 31. Test execution ledger template

| Scenario ID | Commit | Environment | Command | Result | Evidence URI | Reviewer | Date |
|---|---|---|---|---|---|---|---|
| REC-027 scenarios | — | — | — | NOT RUN | — | — | — |

Do not populate results from inference or static code review.

## 32. Security acceptance gates

Prove denial for cross-provider read/write/evaluate, forged location IDs, missing tenant scope, altered authorization claims, and historical replay access outside a tenant. Use synthetic data; redact protected identifiers in CI artifacts. A single failing cross-tenant test is a P0 blocker.

## 33. Regulatory acceptance gates

Capture official source URL, effective dates, retrieved snapshot digest, section text, crosswalk version, review rationale, approver identity, and certification event. Resolve temporal overlaps and gaps explicitly. No fabricated rates, rules, dates, or approvals.

## 34. Evidence acceptance gates

Verify document ownership, revision, applicable period, status, staff access, fire-drill dates/shifts, and evidence conflicts. Preserve a trace from every determination to source record IDs and digests. Test absent, stale, contradictory, and superseded evidence.

## 35. Outcome acceptance gates

Assert COMPLIANT, NONCOMPLIANT, INSUFFICIENT_EVIDENCE, NOT_APPLICABLE, and REQUIRES_REVIEW on approved synthetic fixtures. Verify legacy result persistence and API consumers do not misrepresent unknown outcomes.

## 36. Replay acceptance gates

Replay using frozen operational snapshots, RKE revision, evaluator artifact, as-of time, and known-at time. Verify output digest equivalence or documented non-determinism, and distinguish exact computational replay from evidentiary reconstruction.

## 37. Build and test environment limitation

Earlier attempts to install/build the uploaded repository were blocked by missing packages in an offline npm cache. That is an environment limitation, **not** proof the repository compiles or fails. A new reproducible run in a properly provisioned environment is required.

## 38. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Cross-tenant determination | Critical | Explicit scope + negative tests |
| False regulatory deficiency | Critical | Certified rule + evaluated evidence |
| Wrong effective-date rule | Critical | Bitemporal resolver + source review |
| Historical evidence overwritten | High | Append-only revisions + manifest |
| API three-state/five-state mismatch | High | Approved compatibility adapter |
| Test plan mistaken for pass | High | Signed execution ledger |
| Documentation diverges from code | High | Commit-pinned source mapping |
| Overextended planning | Medium | End series at REC-030 and execute approved backlog |

## 39. Seven release gates

**G1 Source baseline:** pinned repository commit and inventory. **G2 Contract ratification:** security, RKE, evidence, outcome, replay. **G3 Regulatory certification:** source and crosswalk approved. **G4 Implementation verification:** code and migrations reviewed. **G5 Security and data integrity:** tenant isolation, audit, replay tests pass. **G6 End-to-end acceptance:** 36-scenario run and frontend/API verification. **G7 Independent release approval:** signed evidence package and explicit authorization. No gate is asserted complete here.

## 40. Definition of readiness versus done

**Ready for implementation:** scope, owner, approved contracts, dependencies, fixtures, migration/rollback plan, and authorization. **Done:** code merged, reproducible tests passing, evidence archived, regulatory/security approvals complete, and release authorized. Documentation completion alone meets neither definition.

## 41. Suggested delivery slices

**Slice A:** authorization safety boundary. **Slice B:** operational evidence capture and adapters. **Slice C:** certified RKE resolver and rule binding. **Slice D:** evaluator and outcome compatibility. **Slice E:** historical manifest/replay and audit. **Slice F:** integrated UI and release evidence. These are suggested sequencing units, not authorized sprints or delivery dates.

## 42. Migration and rollback guardrails

Use additive migrations where feasible, backfill only verifiable facts, never manufacture past certification events, and retain original result records. Design rollback that disables new evaluation paths without erasing historical determinations. Validate tenant-scoped indexes and temporal uniqueness constraints before deployment.

## 43. Evidence package requirements

Each closed blocker needs a pinned commit, relevant diff, approved contract version, migration identifier, fixture set, exact test command, logs/results, audit event samples, reviewer signature, and disposition of known limitations. Store immutable manifests with access controls and retention policy.

## 44. Change-control policy

Any change to a certified predicate, effective-date rule, evidence meaning, tenant scope, or replay schema requires versioned review. New work must be represented in the Knowledge Engine before the corresponding compliance feature is implemented, consistent with the program's knowledge-first development rule.

## 45. What REC-030 must close

REC-030 should consolidate the master index, reconcile duplicate identifiers, list approved versus pending decisions, enumerate all open P0s, hand off the prioritized backlog, identify verification evidence that is still missing, and provide a clear **conditional** development authorization decision point. It must not declare technical closure where evidence is absent.

## 46. Recommended final disposition

**Planning sequence:** one document remaining (REC-030). **Engineering readiness:** conditional/not yet approved. **P0 closure:** 0 of 12 reported closed. **Test execution:** not demonstrated. **Recommended action:** ratify the first narrow security and regulatory contracts, then begin implementation only after explicit authorization.

## 47. References and traceability

REC-001 governance; REC-007–015 RKE version/certification/persistence; REC-016–018 source and evaluator tracing; REC-019–025 crosswalk/evidence/security proposals; REC-026 P0 closure register; REC-027 36-scenario execution runbook; REC-028 fixture and harness specification. The uploaded `hhscCompliance-develop.zip` is the repository evidence baseline for prior static assessments; revalidate findings against the implementation branch before making changes.
