# REC-014 — RKE Contract Ratification Register and Migration Readiness Checklist

**Proposed repository path:** `docs/governance/reconciliation/rec-014-rke-contract-ratification-register-and-migration-readiness-checklist.md`

**Document status:** DRAFT / FOR RATIFICATION. **Implementation authorization:** NOT GRANTED.

## 1. Purpose
Convert the 15 proposed decisions in REC-013 into a controlled ratification register, repository touchpoint map, evidence plan and go/no-go migration checklist. This document records proposed requirements, not completed implementation.

## 2. Source basis and evidence limits
Primary source: REC-013 decision record; upstream REC-007–REC-012. Static repository observations previously reported include RKE models, validator, loader and an in-memory repository that replaces a pack registered under the same ID. Durable version history, independent certification and temporal resolution were not established in that inspected scope. Do not equate absence of evidence with a repository-wide proof of absence.

## 3. Governing architecture
AD-001–AD-012 and REC-001 D1–D5 govern component ownership, knowledge-first development, contract registry, event names, tenant security and implementation sequencing. RKE and FKE remain separate authorities; Shared Intelligence supplies reusable audit/approval plumbing without certifying regulatory content.

## 4. Approval states and interpretation
`PROPOSED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `DEFERRED`, `SUPERSEDED` are register states only. All 15 decisions start `PROPOSED`. No owner, approval signature, test result, or deployed state is presumed.

## 5. Decision ownership and sign-off roles
Assign a named regulatory authority owner, RKE technical owner, security reviewer, data/migration reviewer and release authority. A role label is a proposed accountability slot, not a claim that the individual is appointed. Certification authority for knowledge content must be distinct from code release authority.

## 6. Ratification register — master index
| ID | Proposed decision | State | Primary approval role | Blocking dependency |
|---|---|---|---|---|
| RKE-D01 | Identity model | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D02 | Durable storage | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D03 | Append-only publication | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D04 | Approval separation | PROPOSED | Regulatory governance + architecture | Signed contract and evidence |
| RKE-D05 | Validation versus certification | PROPOSED | Regulatory governance + architecture | Signed contract and evidence |
| RKE-D06 | Time semantics | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D07 | Deterministic resolver | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D08 | Snapshot provenance | PROPOSED | Regulatory governance + architecture | Signed contract and evidence |
| RKE-D09 | Tenant boundary | PROPOSED | Security + architecture | Signed contract and evidence |
| RKE-D10 | API versioning | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D11 | Events | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D12 | Historical replay | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D13 | Migration strategy | PROPOSED | RKE architecture + data engineering | Signed contract and evidence |
| RKE-D14 | Retention and legal hold | PROPOSED | Regulatory governance + architecture | Signed contract and evidence |
| RKE-D15 | Release gate | PROPOSED | Release authority + architecture | Signed contract and evidence |

## 7. RKE-D01 — Identity model
**Decision to ratify:** Stable pack ID, immutable version ID, digest and certification reference.
**Repository touchpoints to inspect or modify after authorization:** RKE models and repository interfaces. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Identity collision, same-label/different-digest, replay lookup. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 8. RKE-D02 — Durable storage
**Decision to ratify:** Select PostgreSQL JSONB versus content-addressed payload storage and integrity scheme.
**Repository touchpoints to inspect or modify after authorization:** TypeORM entities/migrations; knowledge repository. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Restart durability, hash integrity, concurrent writes. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 9. RKE-D03 — Append-only publication
**Decision to ratify:** Immutable released payloads and explicit supersession/revocation links.
**Repository touchpoints to inspect or modify after authorization:** Knowledge loader/repository; publication service (proposed). These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Mutation rejection, correction lineage, audit trail. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 10. RKE-D04 — Approval separation
**Decision to ratify:** Distinct author, reviewer and certifier with scoped roles.
**Repository touchpoints to inspect or modify after authorization:** Auth/permissions; proposed certification service. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Self-approval denied, role revocation, cross-scope denial. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 11. RKE-D05 — Validation versus certification
**Decision to ratify:** Bind human certification to exact validated digest.
**Repository touchpoints to inspect or modify after authorization:** KnowledgePackValidator; proposed validation report. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Digest mismatch, stale validation, validator-only cannot publish. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 12. RKE-D06 — Time semantics
**Decision to ratify:** Specify valid time, recorded time, publication time and interval boundaries.
**Repository touchpoints to inspect or modify after authorization:** Metadata models; proposed temporal tables. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Retroactive change, boundary instants, timezone normalization. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 13. RKE-D07 — Deterministic resolver
**Decision to ratify:** As-of applicableAt and knownAt; fail closed on gaps/overlap.
**Repository touchpoints to inspect or modify after authorization:** KnowledgeEngineService; repository query contract. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** As-of fixtures, overlap/gap, no latest fallback. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 14. RKE-D08 — Snapshot provenance
**Decision to ratify:** Source snapshot identifiers, digests, amendment chain, citations.
**Repository touchpoints to inspect or modify after authorization:** RegulatorySource model; proposed source store. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Missing source, altered source, amendment lineage. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 15. RKE-D09 — Tenant boundary
**Decision to ratify:** Global regulatory authority and optional tenant overlay scope.
**Repository touchpoints to inspect or modify after authorization:** Auth guards; tenant context; knowledge APIs. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Cross-tenant access, global mutation denial. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 16. RKE-D10 — API versioning
**Decision to ratify:** Ratify routes, DTOs, errors and compatibility.
**Repository touchpoints to inspect or modify after authorization:** NestJS backend integration; contract registry. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** DTO rejection, guard coverage, version compatibility. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 17. RKE-D11 — Events
**Decision to ratify:** Ratify registry IDs, transactional outbox and idempotent consumers.
**Repository touchpoints to inspect or modify after authorization:** Event registry; outbox/integration modules. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Duplicate/reordered delivery, retry, atomic publication. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 18. RKE-D12 — Historical replay
**Decision to ratify:** Pin certified revisions, evaluator build, input digest, evidence.
**Repository touchpoints to inspect or modify after authorization:** Determination manifest; compliance evaluation integration. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Exact replay, evidence reconstruction, missing dependency. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 19. RKE-D13 — Migration strategy
**Decision to ratify:** Adapter rollout and evidence-based historical backfill.
**Repository touchpoints to inspect or modify after authorization:** MemoryKnowledgeRepository; TypeORM migrations. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Dry run, rollback, no invented certification. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 20. RKE-D14 — Retention and legal hold
**Decision to ratify:** Set approved retention, encryption, hold and deletion boundaries.
**Repository touchpoints to inspect or modify after authorization:** Storage/security/audit services. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Hold blocks deletion, controlled access, retention policy. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 21. RKE-D15 — Release gate
**Decision to ratify:** Require approved contracts, tested migrations and sign-offs.
**Repository touchpoints to inspect or modify after authorization:** CI gates; release checklist; verification ledger. These are candidate locations or responsibilities, not assertions that all components exist.
**Evidence required for ratification:** written choice with alternatives, rationale, contract/schema version, security impact, rollback implications, and named approving authority.
**Acceptance evidence required before release:** Negative gate test, artifact completeness, rollback rehearsal. Record test ID, commit SHA, environment, result, and reviewer.
**Current state:** PROPOSED; approval pending; execution NOT RUN.
**Go/no-go:** NO-GO until owner approval and the corresponding executable evidence are recorded.

## 22. Decision dependencies and critical path
1. Ratify D01 identity, D06 time semantics and D08 provenance before finalizing physical schema.
2. Ratify D02 storage and D03 immutability before migration implementation.
3. Ratify D04/D05 certification and D09 authorization before publication APIs.
4. Ratify D07 resolver before enabling new knowledge-based determinations.
5. Ratify D10/D11 integration, D12 replay and D14 retention before production release.
6. D13 migration and D15 release gate remain blocked by all applicable earlier decisions.

## 23. Contract registry records required
Each decision must map to canonical contract ID, version, owner, input/output schemas, compatibility policy, threat model, validation tests and consumers. Canonical IDs remain unassigned until the REC-001 registry is populated and ratified.

## 24. Evidence ledger schema
| Field | Required content |
|---|---|
| Decision ID | RKE-D01…RKE-D15 |
| Approval | named approver, date, signed rationale |
| Source baseline | archive/repository commit SHA and path |
| Contract | canonical ID and version |
| Migration | ID, checksum, dry-run output |
| Test | test ID, environment, fixture, result |
| Security | threat review, tenant scope and authorization checks |
| Release | rollback evidence, monitoring, release sign-off |

## 25. Repository verification checklist
- [ ] Pin repository commit SHA and dependency lockfile.
- [ ] Inventory `libs/regulatory/knowledge` models, validators, loader, repositories and services.
- [ ] Trace NestJS endpoints and guards end to end.
- [ ] Inventory TypeORM entities and migration history.
- [ ] Search for existing approval/certification and source snapshot storage before creating anything new.
- [ ] Locate evaluation write path and historical determination persistence.
- [ ] Identify event/outbox and audit facilities.
- [ ] Capture build/test commands and reproducible execution environment.

## 26. Proposed persistence migration readiness
- [ ] Approve schema and immutable identity rules.
- [ ] Define append-only constraints and digest canonicalization.
- [ ] Verify transaction isolation and concurrency control.
- [ ] Produce forward and rollback migrations.
- [ ] Dry-run against sanitized production-like data.
- [ ] Reconcile record counts and content digests.
- [ ] Document how legacy packs without verified certification are labeled.
- [ ] Demonstrate zero fabricated historical approvals.

## 27. Certification workflow readiness
- [ ] Approve role separation and scoped permissions.
- [ ] Version validation reports and bind reports to content digests.
- [ ] Require distinct review and certification principals.
- [ ] Audit each transition and rejection.
- [ ] Define revocation, re-certification and emergency correction policy.
- [ ] Prevent loader success from implying certification.

## 28. Temporal resolver readiness
- [ ] Ratify `applicableAt`/`knownAt` meanings and UTC normalization.
- [ ] Specify inclusive/exclusive interval boundaries.
- [ ] Return immutable revision IDs and resolution traces.
- [ ] Reject unresolved gaps and overlaps explicitly.
- [ ] Preserve earlier known-as-of answers after retroactive publication.
- [ ] Test scope precedence and cross-jurisdiction isolation.

## 29. Historical replay readiness
- [ ] Persist exact RKE version/digest and evaluator build.
- [ ] Persist input digest, source/evidence references and resolution context.
- [ ] Distinguish exact computational replay from evidentiary reconstruction.
- [ ] Define behavior when dependencies are unavailable.
- [ ] Keep FKE version provenance separate for financial determinations.
- [ ] Prevent newer rules from silently rewriting historical binders.

## 30. Security and privacy readiness
- [ ] Tenant authorization on every read/write path.
- [ ] Separation of global certified content and tenant overlays.
- [ ] PHI/PII minimization and encryption at rest/in transit.
- [ ] Audit integrity and least-privilege access to replay artifacts.
- [ ] Approved retention, legal holds and redaction strategy.

## 31. API and event readiness
- [ ] Ratify DTO schemas, API routes and typed errors.
- [ ] Register canonical event IDs and payload versions.
- [ ] Transactionally commit publication and outbox records.
- [ ] Verify idempotent delivery, duplicate handling and dead-letter recovery.
- [ ] Capture contract tests for old and new consumers.

## 32. Testing and evidence policy
REC-009 defines 67 planned acceptance cases across certification, immutability, resolution, replay, security, events and binder integration. This register does not claim that any of those cases have run. Each passing result must be linked to an exact test case and immutable run artifact.

## 33. Migration phases (proposed)
**M0 — Discover:** freeze source baseline and complete repository trace. **M1 — Ratify:** approve decisions, contracts and security model. **M2 — Design:** approve schema and rollback plan. **M3 — Implement (requires separate authorization):** build persistence/approval/resolver behind compatibility boundaries. **M4 — Verify:** execute tests and migration rehearsal. **M5 — Release (requires separate authorization):** controlled rollout, monitoring and rollback readiness.

## 34. Cutover and rollback safeguards
Use staged dual-read comparison where feasible; do not dual-write authoritative history without an approved consistency model. Block publication if durable storage or outbox commit fails. Preserve old adapter behavior until the compatibility contract is tested. Rollback must not delete or mutate already certified historical artifacts.

## 35. Exception handling
An exception must identify affected decision/test, severity, evidence, compensating controls, expiry and approver. Security isolation, fabricated certification, silent latest fallback and immutable-history violations are non-waivable release blockers absent a separately ratified policy change.

## 36. Go/no-go decision table
| Gate | Pass condition | Current evidence | Result |
|---|---|---|---|
| G1 Source inventory | Reproducible commit-level trace | Partial static findings | OPEN |
| G2 Ratification | 15 decisions signed or explicitly dispositioned | Proposals only | OPEN |
| G3 Contracts | Registry IDs and schemas approved | Pending | OPEN |
| G4 Security | Authorization/retention review signed | Not verified | OPEN |
| G5 Migrations | Dry run and rollback successful | Not run | OPEN |
| G6 Acceptance | Applicable REC-009 tests pass | Not run | OPEN |
| G7 Release | Independent release authorization | Not granted | NO-GO |

## 37. Risks and controls
**False provenance:** prohibit retroactive invention of approval records. **Mutable release:** enforce append-only payloads and digest checks. **Temporal ambiguity:** typed failure on gaps/overlaps. **Tenant leakage:** guard and isolation tests. **Split-brain publication:** atomic persistence/outbox. **Unrepeatable findings:** immutable replay manifest and dependency retention.

## 38. Decision record template
```yaml
decision_id: RKE-D01
state: PROPOSED
owner: UNASSIGNED
approver: UNASSIGNED
approved_at: null
contract_ids: []
repository_commit: UNVERIFIED
alternatives: []
rationale: PENDING
security_review: PENDING
migration_impact: PENDING
test_evidence: []
exceptions: []
```

## 39. Approval packet contents
Each ratification packet should contain the selected alternative, rejected alternatives, exact schema/DTO or interface diff, security and regulatory rationale, dependency graph, test mapping, migration/rollback effects and signature. Avoid approving a narrative summary without its referenced contract artifacts.

## 40. Current readiness assessment
**Contract design:** proposed, not ratified. **Repository evidence:** partial static inspection. **Build/runtime:** not established by this document. **Tests:** NOT RUN. **Migration:** not authorized. **Production publication:** NO-GO. These are evidence-status statements, not claims that the proposed system is defective in deployment.

## 41. Open questions requiring accountable resolution
Where will immutable payload bytes live? Who can certify and revoke? What source authority hierarchy applies? How are overlapping scopes resolved? Are tenant overlays permitted? Which retention periods apply? What exact event IDs and API paths are canonical? How is migration history validated against real deployments?

## 42. Traceability and related records
REC-007 version/history verification; REC-008 historical determination contract proposal; REC-009 acceptance matrix; REC-010 closure/readiness assessment; REC-011 RKE evidence register; REC-012 repository trace; REC-013 fifteen-decision proposal. Maintain reciprocal references when canonical registry IDs are issued.

## 43. Explicit authorization boundary
This document does not authorize migrations, new services, publication endpoints, production data changes, or releases. Ratification of a decision is separate from authorization to implement it, and implementation is separate from authorization to deploy.

## 44. Next artifact
**REC-015 — RKE Canonical Contract Registry Population and Source-to-Contract Mapping**. Verify exact repository symbols and paths, then register only contracts supported by source evidence; mark proposed interfaces as proposed and unresolved items as open.
