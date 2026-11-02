# REC-010 — Architecture Reconciliation Closure and Implementation Readiness Assessment

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Document ID:** REC-010  
**Version:** 1.0 — Draft / Evidence-Qualified Assessment  
**Proposed repository path:** `docs/governance/reconciliation/rec-010-architecture-reconciliation-closure-and-implementation-readiness-assessment.md`  
**Assessment date:** 2026-11-02  
**Decision status:** **RECONCILIATION NOT CLOSED**  
**Implementation authorization:** **NOT GRANTED**

> **Decision statement:** Architectural *principles* AD-001–AD-012 and REC-001 policy decisions D1–D5 have sponsor approval. That approval does **not** close the contract-level discrepancies, establish a verified executable baseline, or authorize modifications. This document is a controlled closure assessment and outstanding-work register, not a completion certificate.

## 1. Executive decision

**Recommendation: HOLD at the reconciliation and verification gate.** Preserve the approved architecture baseline, reconcile the canonical registries, obtain reproducible build/test/security evidence, and ratify scoped work packages before any implementation authorization. A `HOLD` here is a governance status, not a claim that the existing application is unusable.

## 2. Scope

This assessment covers the approved platform ownership model, component and event identifiers, API and dependency contracts, operational and knowledge authority boundaries, security, certification, effective dating, historical replay, Binder Management, repository evidence, executable readiness, and acceptance-test coverage. It includes Texas HCS Emergency Preparedness and Texas HCS Cost Reporting as the first regulatory and financial vertical slices. ISS remains a subsequent domain-specific vertical slice.

## 3. Sources and precedence

1. Sponsor decisions **AD-001–AD-012** — approved principles.
2. Sponsor decisions **REC-001-D1–D5** — approved canonical registry policies.
3. **ENG-001–ENG-029** — proposed engineering designs; conflicting details still require reconciliation.
4. **REC-002 Sections 1–8** — static component-to-repository assessment and provisional treatment matrix.
5. **REC-003** — contract/dependency verification working register.
6. **REC-004–REC-007** — source inventories and evidence-qualified technical reviews.
7. **REC-008** — proposed historical determination/certification contract specification.
8. **REC-009** — 67 specified, **not executed**, acceptance cases.
9. Uploaded `hhscCompliance-develop.zip` — source snapshot, not a proven working deployment.

Where evidence conflicts, do not silently resolve it. Register the conflict, designate its owner, and obtain an explicit disposition.

## 4. Evidence taxonomy

| Status | Meaning | Acceptable basis |
|---|---|---|
| APPROVED_POLICY | Sponsor approved architectural principle | Decision record |
| DRAFT_SPECIFIED | Design or test case written | Versioned document |
| SOURCE_OBSERVED | File, class, migration, or declaration inspected | Repository path and commit/archive fingerprint |
| STATIC_REVIEWED | Contract or dependency assessed without execution | Review worksheet |
| VERIFIED_PASS | Executable criterion passed | Command, environment, timestamp, artifact, reviewer |
| VERIFIED_FAIL | Executable criterion failed | Reproducible evidence and defect |
| BLOCKED | Verification prevented by documented prerequisite | Blocker and owner |
| NOT_RUN | No execution evidence | Explicit nonclaim |
| NOT_ESTABLISHED | Evidence does not prove a capability | Gap register |

**Never** upgrade `SOURCE_OBSERVED` to `VERIFIED_PASS` without execution evidence.

## 5. Architecture baseline decision summary

| ID range | Approval | Remaining obligation |
|---|---|---|
| AD-001–AD-012 | Approved principles | Contract detail, integration, and acceptance verification |
| REC-001-D1–D5 | Approved policies | Actual component, API, and event mapping |
| REC-002 | Assessment drafted | Evidence-backed classifications and owners |
| REC-003 | Register drafted | Populate exact schemas, contracts, dependencies, tests |
| REC-004–007 | Static inspections documented | Resolve findings and run tests |
| REC-008 | Contract draft | Technical ratification |
| REC-009 | Acceptance tests specified | Execute and review results |

## 6. Current repository evidence summary

The uploaded source snapshot contains an Nx/Angular/NestJS/TypeORM/PostgreSQL-oriented codebase, with operational, regulatory, compliance, audit, and UI candidates identified in prior REC assessments. RKE models, validator/loader and in-memory repository are present; the in-memory replacement behavior does not establish durable immutable version history. Financial reporting UI placeholders and an incomplete/empty survey-binder service were identified. These observations are not a proof of the complete absence of other implementations. The previously attempted dependency installation was blocked by unavailable offline npm packages; build, migration, integration, and end-to-end passes remain **not established**.

## 7. Canonical architecture coverage

| Family | Slots | Preliminary assessment | Closure state |
|---|---:|---|---|
| PF | 9 | Existing authentication/security/infrastructure candidates | OPEN |
| OP | 12 | Substantial operational source candidates | OPEN |
| RKE | 11 | Models, validation and loading candidates | OPEN |
| FKE | 13 | End-to-end governance/calculation not established | OPEN |
| SII | 15 | Audit/evidence candidates; shared orchestration incomplete or unverified | OPEN |
| CI | 7 | Compliance evaluation/remediation candidates | OPEN |
| FI | 11 | End-to-end financial determinations not established | OPEN |
| BM | 9 | Universal binder lifecycle not established | OPEN |
| UX | 5 | Application shell/workbench candidates; extended UX catalog requires mapping | OPEN |
| **Total** | **92** | **Architecture slots, not verified implementations** | **OPEN** |

## 8. Reconciliation issue register — twelve required dispositions

| Issue | Conflict / question | Closure evidence | Status |
|---|---|---|---|
| R-01 | ENG-001 EVT-001–042 versus later event proposals | Canonical event registry, aliases, owner and schema | OPEN |
| R-02 | RK/RKE, FK/FKE, SI/SII identifiers | Approved mapping per component, stable aliases | OPEN |
| R-03 | ENG-008 services versus ENG-014 work packages and ENG-015 sprints | Traceability crosswalk | OPEN |
| R-04 | RKE certification Sprint 11 versus shared approval infrastructure Sprint 15 | Dependency-safe delivery sequencing | OPEN |
| R-05 | ENG-015 sprint count 0–47 = 48 slots | Corrected plan labels and baselines | OPEN |
| R-06 | Regulatory and financial temporal resolution | Ratified resolver semantics and fixtures | OPEN |
| R-07 | Cross-authority contract ownership | Producer/consumer contract and no hidden ownership transfer | OPEN |
| R-08 | Binder type extension and lifecycle | Universal lifecycle and typed policy extensions | OPEN |
| R-09 | Payroll factual calculation versus FKE reporting methodology | Domain responsibility and contract mapping | OPEN |
| R-10 | Binder/survey authorization versus source ACL | Backend access matrix and adversarial tests | OPEN |
| R-11 | ENG-022 UX expansion versus ENG-008 UX-01–05 | Canonical UX mapping and aliases | OPEN |
| R-12 | ENG-016–023 APIs/events versus ENG-009 | Contract-by-contract reconciled registry | OPEN |

**Closure rule:** Each issue needs a named decision owner, chosen disposition, rationale, impacted documents, updated contract artifacts, reviewer approval, and verification reference. A policy approval alone does not close any issue above.

## 9. Mandatory cross-cutting invariants

- Two independent knowledge authorities: RKE and FKE. Shared Intelligence is **not** a third authority.
- Operational domains own factual records; Applied Intelligence owns determinations using pinned certified knowledge.
- Tenant and resource authorization is enforced on backend and data access paths.
- Knowledge publication is certified, versioned, immutable, and effective-dated.
- Historical replay must preserve the original knowledge, facts, evaluator, and evidence identity.
- Binder authorization is distinct from underlying source-document authorization.
- No regulatory or financial feature proceeds without its governing knowledge definition.
- No migration or contract replacement proceeds without a rollback and compatibility plan.

## 10. Contract registry closure criteria

For every component, API, event, data contract, and dependency: record canonical ID, aliases, owner, producer/consumer, schema and version, tenant and authorization context, error semantics, idempotency/retry policy where applicable, effective-date semantics, source file, acceptance tests, approval status, and deprecation plan. Reject incomplete entries as `DRAFT`, not `RATIFIED`.

## 11. API verification gate

Inventory all actual NestJS controller routes and their effective guards (including global and module-scoped guards), DTO validation behavior, provider scoping, response schemas, error codes, and version prefixes. Verify negative authorization and cross-tenant tests. Source declaration alone is insufficient.

## 12. Event verification gate

Resolve legacy EVT aliases, define the canonical event schemas and ownership, and test outbox/inbox durability or an approved equivalent, duplicate delivery, ordering assumptions, retries, dead-letter handling, idempotency, replay, and audit correlation. Prior REC-006 did not establish a reliable event-delivery mechanism.

## 13. Nx and service dependency gate

Generate a project graph from a reproducible dependency installation; compare actual import edges to approved layer rules. Record allowed edges, violations, exemptions, circular dependencies, and testable enforcement rules. No exception is implicitly approved.

## 14. Certification governance gate

Ratify author/reviewer/certifier separation, version state transitions, source provenance, certification authority, publication atomicity, revocation/withdrawal semantics, and audit records independently for RKE and FKE. Shared approval services can implement mechanics but cannot own the knowledge definitions.

## 15. Temporal and historical replay gate

Define and test the distinction between legal effective date, publication time, supersession, as-of resolution, and retroactive correction. A replay must pin the knowledge version, evaluator version, source fact snapshot or immutable references, tenant, execution context, and result hash. New publication must not silently rewrite a historical finding or released binder.

## 16. Data and migration gate

Review all TypeORM migrations for ordering, repeatability, schema compatibility, foreign keys, tenant boundaries, and rollback feasibility. Test migrations on a disposable database with synthetic data. Do not apply unreviewed migrations to a production database.

## 17. Security gate

Prove cross-tenant denial, privilege escalation resistance, least-privilege service identities, MFA for external survey access, bounded token lifetime, access revocation, document-level ACL enforcement, secure audit access, and protection of sensitive records. Negative tests are mandatory.

## 18. Binder Management gate

Verify universal lifecycle Draft → Assembling → Under Review → Approved → Released → Closed → Archived, type-specific policy extensions, released-version immutability, document authorization, surveyor access, and complete binder reconstruction. An empty service stub is not an implemented workflow.

## 19. Financial Knowledge and Intelligence gate

Ratify FKE classification, allowability, allocations, rates, formula precision/rounding, effective-period resolution, source provenance, and independent approval. Demonstrate Financial Intelligence using operational facts without changing FKE authority. Do not invent Texas HCS rates or allowability rules; use certified authoritative sources.

## 20. Regulatory and Compliance Intelligence gate

Demonstrate Texas HCS Emergency Preparedness: authoritative source → certified pack → operational evidence → applicability/evaluation → finding → remediation/recheck → historical replay and binder. Every determination must reference a certified rule version.

## 21. ISS gate

Verify the jurisdiction-neutral operational model supports ISS without embedding customer-specific program design in core knowledge. Separate planned activity duration from regulated billing eligibility. Preserve LevelUp Adventures as a customer/program configuration, not a universal domain authority.

## 22. REC-009 acceptance inventory

| Category | Specified cases | Execution evidence |
|---|---:|---|
| Knowledge certification | 14 | NOT RUN |
| Immutability and supersession | 8 | NOT RUN |
| Effective-dated resolution | 10 | NOT RUN |
| Historical determination and replay | 12 | NOT RUN |
| Security and tenant isolation | 9 | NOT RUN |
| Events and audit | 9 | NOT RUN |
| Binder integration | 5 | NOT RUN |
| **Total** | **67** | **0 passes claimed** |

Do not treat passing a subset as acceptance of an entire category unless an approved risk-based exception explicitly identifies the omitted cases.

## 23. Build and runtime evidence gate

Required evidence: exact repository snapshot fingerprint, Node/npm versions, lockfile-based install outcome, Nx project list and graph, lint/build/test command logs and exit codes, API startup logs, disposable PostgreSQL migration results, UI smoke test, integration suite, security suite, and reviewer sign-off. The previous offline dependency-installation blocker remains open until a controlled connected or fully cached environment succeeds.

## 24. Readiness status by gate

| Gate | Requirement | Current evidence-qualified status |
|---|---|---|
| G0 | Approved architecture principles | **PASS — policy approvals only** |
| G1 | Canonical component and event mapping | OPEN |
| G2 | Ratified API/data/dependency contracts | OPEN |
| G3 | Build and automated test reproducibility | BLOCKED / NOT VERIFIED |
| G4 | Knowledge certification and replay tests | NOT RUN |
| G5 | Tenant, binder, and external-access security | NOT RUN |
| G6 | Regulatory and financial vertical-slice acceptance | NOT RUN |
| G7 | Signed scoped implementation authorization | NOT GRANTED |

**Overall: NOT IMPLEMENTATION-READY.** This is a conclusion about missing verification/approvals, not a claim that all existing code is defective.

## 25. Provisional treatment policy

`REUSE`, `MODIFY`, `REPLACE`, and `BUILD NEW` are implementation classifications, not architectural findings. Require file-level evidence, acceptance coverage, compatibility impact, estimated effort, risk, migration plan, and decision owner before assigning final treatment. `INVESTIGATE` is the default when evidence is insufficient.

## 26. Dependency-ordered closure plan

1. Freeze the approved principles and REC-001 policies as a versioned decision baseline.
2. Close R-02 and R-11 component/UX naming crosswalks; do not rename source code automatically.
3. Close R-01 and R-12 event/API reconciliation; populate REC-003 with actual contracts.
4. Resolve R-03–R-05 planning/dependency inconsistencies and update the sprint/work-package crosswalk.
5. Ratify REC-008 knowledge certification, temporal resolution, and replay contracts (R-06–R-07).
6. Resolve Binder and Payroll boundaries and security contracts (R-08–R-10).
7. Restore reproducible dependency installation; run builds, tests, migrations, and security suites.
8. Execute REC-009 tests, resolve defects, and assemble immutable evidence packages.
9. Approve a narrowly scoped first implementation work package **only after** its prerequisites and acceptance criteria are satisfied.

Parallelize independent reviews where possible; do not skip dependency gates.

## 27. Required issue closure record template

```yaml
issue_id: R-XX
owner: UNASSIGNED
status: OPEN
source_documents: []
conflicting_contracts: []
proposed_disposition: PENDING
rationale: PENDING
canonical_registry_changes: []
repository_evidence: []
acceptance_test_ids: []
security_review: PENDING
architecture_approval: PENDING
verification_result: NOT_RUN
closed_at: null
```

## 28. Required test evidence record template

```yaml
case_id: REC009-PLACEHOLDER
repository_fingerprint: UNRECORDED
contract_version: UNRATIFIED
environment: NOT_PROVISIONED
command: NOT_RUN
exit_code: null
result: NOT_RUN
logs_or_artifacts: []
defect_id: null
reviewer: UNASSIGNED
reviewed_at: null
```

## 29. Implementation work package authorization template

```yaml
work_package_id: PENDING
scope: PENDING
architecture_decisions: []
ratified_contract_ids: []
source_files_in_scope: []
knowledge_pack_dependencies: []
security_requirements: []
acceptance_tests: []
rollback_plan: PENDING
approver: UNASSIGNED
authorization_status: NOT_GRANTED
```

## 30. Decision rights and separation of duties

Sponsor approves architecture policy and implementation scope. Architecture owner ratifies technical contracts. RKE and FKE certifiers independently approve their respective knowledge. Security owner signs off authorization/tenant boundaries. QA verifies test evidence. Repository owner authorizes merges/deployments. These roles may be held by appropriately authorized individuals but may not bypass the separation-of-duties policy approved under AD-003.

## 31. Risk register

| Risk | Impact | Mitigation | Current disposition |
|---|---|---|---|
| Contract naming drift | Broken integration/traceability | Canonical aliases and crosswalk | OPEN |
| Historical pack replacement | Non-reproducible decisions | Immutable durable versions | OPEN |
| Unverified tenant isolation | Cross-customer exposure | Backend negative tests | OPEN |
| Event loss/duplicates | Inconsistent outcomes | Durable delivery and idempotency tests | OPEN |
| Binder ACL inheritance | Unauthorized document access | Explicit source ACL enforcement | OPEN |
| Financial methodology ambiguity | Incorrect reports | FKE source/certification/precision tests | OPEN |
| Offline dependency blocker | No reproducible build proof | Controlled CI or connected install | BLOCKED |
| Premature code changes | Regression and architecture drift | Explicit work package authorization | CONTROLLED BY HOLD |

## 32. Exit criteria for REC-010 closure

All 12 reconciliation issues have signed dispositions; canonical registry mappings and contract versions are ratified; the repo baseline and build/test environment are reproducible; critical security and historical replay cases have reviewed PASS evidence or explicit documented exception; vertical-slice scope is approved; and the first work package has a separate signed authorization. **Until then, REC-010 remains OPEN.**

## 33. Sign-off matrix

| Approval | Owner | Status | Date |
|---|---|---|---|
| Architecture principles AD-001–AD-012 | Sponsor | APPROVED (in conversation) | Prior discussion |
| REC-001 D1–D5 policies | Sponsor | APPROVED (in conversation) | Prior discussion |
| Contract registry ratification | Architecture owner | PENDING | — |
| Security review | Security owner | PENDING | — |
| Executable verification | QA/engineering | PENDING | — |
| Reconciliation closure | Architecture governance | PENDING | — |
| Implementation authorization | Sponsor/authorized owner | **NOT GRANTED** | — |

## 34. Immediate next deliverable

Create a **populated canonical registry crosswalk** for the first bounded slice: RKE certification, immutable publication, effective-dated resolver, and compliance determination replay. Use actual repository paths, schemas, and tests, then seek technical ratification. Do **not** create a new feature or modify the repository merely because this assessment exists.

## 35. Final controlled statement

**Architecture direction:** Approved.  
**Contract reconciliation:** Open.  
**Repository executable readiness:** Not established.  
**REC-009 acceptance execution:** Not run.  
**REC-010 closure:** Not approved.  
**Implementation authorization:** Not granted.

This document records what must be proven before the platform advances; it does not represent unperformed verification as complete.
