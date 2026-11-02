# ENG-029 — Architecture Reconciliation Decision Register and Remediation Roadmap

**Organization:** McCaskill Projects  
**Program:** Regulatory Intelligence Platform  
**Version:** 1.0 — Draft  
**Proposed repository path:** `docs/engineering/29-architecture-reconciliation-decision-register-and-remediation-roadmap.md`  
**Sources:** ENG-024, ENG-026, ENG-027, ENG-028; uploaded `hhscCompliance-develop.zip` assessed in ENG-027/028  
**Architecture approval:** PENDING  
**Implementation authorization:** **NOT GRANTED**  
**Repository modification:** None authorized by this document

## 1. Executive decision
The platform must not be declared implementation-ready. ENG-027 established a preliminary static inventory; ENG-028 recorded an offline dependency-installation blocker and did **not** establish build, test, migration, or runtime success. ENG-024 has not completed formal design reconciliation or approval. This document creates a controlled decision and remediation plan, **not** an approved change order.

## 2. Evidence hierarchy
1. Approved architecture decisions and signed reconciled contracts (currently absent).
2. Reproducible executed checks with commands, environment, logs, and timestamps (currently incomplete).
3. Inspected source files and configuration from the uploaded snapshot.
4. Historical user development reports and prior plans (context only).
5. Proposed designs and assumptions (not proof).

Never promote a lower evidence class to a higher one without new evidence. A source file's existence does not demonstrate correct execution.

## 3. Source snapshot and scope
The source artifact is `hhscCompliance-develop.zip`, not a verified live branch or deployed release. ENG-027 reports 1,814 archive entries, 1,344 files, 34 Nx project configurations, 25 backend module directories, 52 TypeORM migration files, and 56 test/spec files. These counts describe that snapshot and should be rechecked before implementation. ENG-028 reports Node 22.16.0 in the assessment environment versus Node 20 in repository CI, and an offline npm installation blocked by an uncached dependency. No successful application builds, tests, database migrations, or end-to-end executions were established.

## 4. Six-layer architecture decision boundary
| Layer | Authority and purpose | Nonnegotiable boundary |
|---|---|---|
| Platform Foundation | Tenant, identity, security, API, storage, integration, observability | Enforces access; does not define regulated knowledge |
| Operational Domains | Provider, location, person, workforce, service, payroll and transaction facts | Facts do not self-certify compliance or allowability |
| Regulatory Knowledge Engine (RKE) | Authoritative obligations, applicability, effective-dated regulatory knowledge | Separate regulatory approval chain |
| Financial Knowledge Engine (FKE) | Authoritative financial classifications, allowability, allocation, rates, formulas | Separate financial approval chain |
| Shared Intelligence | Evidence, audit, validation execution, approvals, binder and document infrastructure | Infrastructure is **not** a third knowledge authority |
| Applied Intelligence + UX | Compliance/financial determinations and their presentation | Consume governed knowledge; UI/AI do not become authority |

## 5. Decision status vocabulary
**Proposed** = candidate resolution; **Needs Evidence** = verification incomplete; **Under Review** = designated reviewers engaged; **Approved** = recorded accountable approval; **Rejected** = explicitly declined; **Superseded** = replaced by linked decision; **Blocked** = prerequisite unmet. No item below is marked Approved.

## 6. Severity and prioritization
P0: tenant isolation, protected information, authority integrity, irreversible data damage, or regulatory misstatement. P1: prevents a complete vertical slice or invalidates core contracts. P2: impedes maintainability, interoperability, performance, or reliable workflow. P3: cosmetic or documentation-only. Priority is provisional until impact and evidence are reviewed; P0 requires explicit risk-owner disposition.

## 7. Reconciliation register schema
Every decision must include: `DEC-ID`, issue statement, competing source references, authority owner, impacted services, affected contracts/entities/events, options, proposed choice, evidence, severity, dependencies, security/temporal impact, tests, accountable approver, status, date, ADR link, and migration/rollback strategy. Blank fields are **TBD**, not implied agreement.

## 8. Initial architecture decision register — candidates, not approved outcomes
| ID | Decision to reconcile | Provisional direction | Priority | State |
|---|---|---|---|---|
| DEC-001 | ENG-001 EVT-001–042 versus later event proposals | One canonical versioned event catalog and compatibility map | P1 | Proposed |
| DEC-002 | ENG-008 RK/FK/SI names versus RKE/FKE/SII detailed specs | Adopt one canonical identifier and alias/deprecation table | P2 | Proposed |
| DEC-003 | Service catalog versus work packages and sprint ownership | One component-to-package-to-gate crosswalk | P1 | Proposed |
| DEC-004 | RKE certification planned before shared approval infrastructure | Resolve dependency; no uncertified shortcut | P1 | Proposed |
| DEC-005 | Sprint 0–47 count described inconsistently | State **48 numbered sprint slots** | P3 | Proposed |
| DEC-006 | Effective dates and historical knowledge resolution | Explicit as-of, version, provenance and snapshot contracts | P0 | Proposed |
| DEC-007 | RKE/FKE/Shared ownership and cross-authority invocation | Explicit no-ownership-transfer interfaces | P0 | Proposed |
| DEC-008 | Universal binder lifecycle versus binder-type specifics | Common lifecycle with controlled type extensions | P1 | Proposed |
| DEC-009 | Payroll operations versus regulated FKE reporting rules | Operational payroll facts; FKE governs regulated treatment | P1 | Proposed |
| DEC-010 | Surveyor/binder access versus underlying source ACL | Separate grants, scopes, revocation and audit | P0 | Proposed |
| DEC-011 | ENG-022 UX expansion versus ENG-008 UX-01–05 | Distinguish logical capabilities from deployable components | P2 | Proposed |
| DEC-012 | ENG-016–023 endpoints/events versus ENG-009 | Canonical versioned API/event contracts | P1 | Proposed |

## 9. Decision record requirements
An ADR must document the current conflict, source excerpts/identifiers, considered alternatives, consequences, reversibility, acceptance tests, owners, and approval signatures. Do not merge competing specifications by silent editorial changes. Update impacted documents only after an ADR is approved.

## 10. Repository gap classification
| Class | Meaning | Minimum evidence before final classification |
|---|---|---|
| REUSE | Fits approved contract without material redesign | Source review, passing relevant tests, security and tenant checks |
| MODIFY | Existing code viable but requires bounded changes | Defined delta, dependency impact, regression tests |
| REPLACE | Existing design violates a foundational invariant or is uneconomical to repair | Verified defect/constraint, alternatives, migration and rollback |
| BUILD NEW | No sufficient implementation exists | Complete inventory/search, contract and acceptance criteria |
| RETIRE | Redundant or unsafe asset can be removed | Reference scan, data retention, migration and compatibility plan |
| UNDETERMINED | Evidence insufficient | Evidence acquisition task and owner |

**Current default for unverified component-level dispositions: UNDETERMINED.** No blanket REPLACE decision is justified by the available evidence.

## 11. Current evidence-to-decision crosswalk
| Assessment area | Evidence from ENG-027/028 | Decision permitted now |
|---|---|---|
| Nx/Angular/NestJS stack | Declared projects, targets and dependencies | Inventory and verification planning only |
| Operational and compliance modules | Source paths and selected files inspected | Candidate mapping; no runtime acceptance |
| RKE and Texas HCS rule sources | Files present | Review provenance, evaluator behavior and certification flow |
| FKE and cost reporting | Complete implementation not established | Gap investigation; do not assume absence or completion |
| Database migrations | 52 files in archive | Review ordering and safety; do not apply to production |
| Automated tests | 56 test/spec files | Coverage inventory; no passing status established |
| Dependency installation | Offline cache blocker | Retry in authorized networked reference environment |
| Builds and runtime | Blocked/not verified | No production readiness claim |

## 12. Remediation workstream A — architecture reconciliation
**Inputs:** ENG-001–028. **Tasks:** reconcile twelve DEC candidates, define authoritative ownership, resolve canonical service identifiers, update contracts and diagrams, trace every change. **Deliverables:** approved ADR set, revised canonical catalogs, versioned architecture baseline. **Gate:** signed ENG-024 approval. **Implementation:** none.

## 13. Workstream B — reproducible verification environment
Establish Node 20 reference environment; record OS, npm, lockfile integrity, environment variable names (not secrets), installation registry policy, package checksums, and build cache settings. Execute `npm ci` in an isolated checkout with authorized network access. Record exact command, exit status, complete logs and timestamps. Offline cache absence must remain classified **BLOCKED**, not application **FAILED**.

## 14. Workstream C — Nx graph and build correctness
After dependencies are available: run Nx project discovery and graph checks, validate project names and tags, then server/web builds, type checks, lint and unit tests. Track per-project outcomes and detect conflicting project names or path aliases. The snapshot's `server/project.json` declares webpack build and `web/project.json` declares Vite build; confirm output paths before attempting a runtime launch.

## 15. Workstream D — database and migration assurance
Inventory each migration with order, purpose, tables/columns, data transform, rollback strategy, and compatibility window. Use disposable PostgreSQL only; compare fresh-schema and upgrade-path outcomes. Check tenant scoping, unique constraints, foreign keys, protected data retention, and historical versions. No production database or live customer data may be used in initial verification.

## 16. Workstream E — canonical API and event contracts
Generate a contract inventory from controllers, DTOs, event publishers/consumers and existing docs. Reconcile against ENG-009 and detailed specs. Identify method/path collisions, versioning, error envelopes, idempotency, correlation IDs, tenant context and event replay semantics. Approve breaking changes before code modifications.

## 17. Workstream F — RKE validation
Verify authoritative source references, applicability, effective dates, immutable certification, rule evaluation, historical reproduction, approval separation and audit. Use Texas HCS Emergency Preparedness as a bounded acceptance slice; authoritative rule content must be verified independently before any certification claim.

## 18. Workstream G — FKE validation
Inspect actual financial source and cost-reporting code before classifying gaps. Require governed definitions for allowable costs, allocations, rates, formulas, rounding, source citations, independent approval, versioning and as-of calculation. Texas HCS Cost Reporting is the first financial slice; do not invent rates, reimbursement amounts, or filing requirements.

## 19. Workstream H — shared and applied intelligence
Verify evidence linkage, validation execution, approvals, audit trails, findings, CAP/recheck, financial reconciliation, reporting, notifications and binder workflows. Confirm Shared provides infrastructure rather than regulated definitions. A released binder must preserve a reproducible manifest and access history.

## 20. Workstream I — tenant isolation, privacy and external access
Test provider boundaries across API, queries, events, documents and caches. Review role/permission enforcement, MFA for external surveyor identities, explicit binder and document grants, revocation, expiration, audit, secure storage, and incident recovery. No sensitive real-world data in test fixtures.

## 21. Workstream J — UX and workflow acceptance
Verify provider-wide dashboard without mandatory `locationId`, correction-area-first Residential Workbench (Fire Drills, Emergency Plans, Hot Water, Medication), deep links, finding/CAP flow, Financial Workbench, Knowledge Admin, Survey/Financial Binders, and ISS. Confirm keyboard accessibility and NgRx state consistency. A route's existence alone is not acceptance.

## 22. Critical path and dependency ordering
1. ENG-024 reconcile and approve architecture baseline.
2. Establish trusted source snapshot and reference Node 20 environment.
3. Install dependencies, generate project graph, build and run baseline tests.
4. Validate database and API/event compatibility in isolation.
5. Resolve P0/P1 design and security issues with ADRs.
6. Assign evidence-backed REUSE/MODIFY/REPLACE/BUILD NEW dispositions.
7. Prove one end-to-end regulatory and one financial vertical slice.
8. Prepare change packages, migration plans and acceptance gates.
9. Seek separate explicit implementation authorization.

Workstreams may be investigated in parallel; gates cannot be bypassed by parallel execution.

## 23. Remediation backlog template
| Task ID | Decision/gap | Workstream | Required evidence | Dependency | Owner | Estimate | Status |
|---|---|---|---|---|---|---|---|
| REM-001 | DEC-001 / event IDs | A/E | Canonical catalog and producer/consumer crosswalk | ENG-024 review | TBD | Not estimated | Proposed |
| REM-002 | DEC-006 / temporal semantics | A/F/G | Historical replay contract and tests | Knowledge owners | TBD | Not estimated | Proposed |
| REM-003 | Dependency install blocker | B | Node 20 `npm ci` logs | Networked isolated environment | TBD | Not estimated | Blocked |
| REM-004 | Build/test baseline | C | Per-project command logs | REM-003 | TBD | Not estimated | Blocked |
| REM-005 | Migration validation | D | Disposable DB results | REM-003 | TBD | Not estimated | Proposed |
| REM-006 | FKE implementation map | G | File-level trace and tests | Approved FKE contracts | TBD | Not estimated | Needs Evidence |
| REM-007 | Surveyor document ACL | I | Threat model and isolation tests | DEC-010 | TBD | Not estimated | Proposed |
| REM-008 | Vertical-slice acceptance | F/G/H/J | End-to-end fixtures and logs | Prior gates | TBD | Not estimated | Blocked |

## 24. Estimation policy
Do not assign invented calendar durations, staffing needs, or dollar amounts. Estimate only after baseline build evidence, dependency graph, component disposition, data migration impact, and acceptance tests are known. Each estimate must include optimistic/likely/pessimistic range, confidence, assumptions and accountable estimator.

## 25. Risks and controls
| Risk | Impact | Control | Current disposition |
|---|---|---|---|
| False claim of readiness | Premature release | Evidence gates and explicit statuses | Open |
| Cross-tenant disclosure | P0 security harm | Isolation tests and scoped grants | Not verified |
| Incorrect historical regulatory/financial result | P0 trust/compliance harm | Immutable version and as-of replay | Not verified |
| Destructive migration | Data loss | Disposable DB, backup, rollback rehearsal | Not verified |
| Source contract drift | Broken integrations | Canonical versioned catalogs and CI | Open |
| Offline dependency blocker | No executable evidence | Authorized Node 20 networked install | Blocked |
| Unknown live-branch differences | Misleading assessment | Verify commit SHA and fresh inventory | Open |

## 26. Approval and separation of duties
Architecture authority approves definitions and ownership; security/privacy authority approves access controls; domain owners approve RKE/FKE domain semantics independently; engineering lead approves technical execution evidence; product/business owner authorizes scope and spend. No single drafting assistant or test run may substitute for those approvals.

## 27. Gate G0 — source and evidence integrity
**Pass when:** source SHA/branch verified, archive inventory reproducible, evidence references traceable, credentials excluded. **Current:** PENDING; ZIP snapshot inspected but live provenance unverified.

## 28. Gate G1 — architecture reconciliation
**Pass when:** all material ENG-024 discrepancies have approved ADRs and canonical specifications. **Current:** PENDING.

## 29. Gate G2 — executable baseline
**Pass when:** Node 20 dependency install, Nx graph, builds, lint, unit tests, and startup checks have documented results and blocking defects are triaged. **Current:** BLOCKED / NOT ESTABLISHED.

## 30. Gate G3 — data and security integrity
**Pass when:** migration rehearsals, tenant isolation, authorization, source ACL, historical versioning, and audit tests pass. **Current:** NOT VERIFIED.

## 31. Gate G4 — vertical-slice acceptance
**Pass when:** Texas HCS Emergency Preparedness, Texas HCS Cost Reporting and relevant ISS workflows meet signed acceptance criteria with reproducible evidence. **Current:** NOT VERIFIED.

## 32. Gate G5 — implementation readiness decision
**Pass when:** approved architecture, per-component disposition, estimated remediation backlog, dependency order, owners, rollback plans, and acceptance gates are signed. **Current:** NOT GRANTED.

## 33. Change-control requirements
Any proposed code change requires an approved linked decision, scope, acceptance criteria, test plan, rollback strategy, and change owner. No migrations, secrets, production access, deployments, or repository refactors are authorized by this roadmap.

## 34. Required evidence bundle
Maintain `source-manifest`, `project-inventory`, `dependency-install-log`, `nx-graph`, `build-matrix`, `test-matrix`, `migration-matrix`, `api-event-crosswalk`, `security-test-results`, `vertical-slice-results`, `adr-register`, `risk-register`, and `approval-record`. Every evidence item should record date, environment, exact command, input snapshot, result, reviewer and artifact location.

## 35. Immediate next actions
**First:** convene ENG-024 architecture reconciliation and resolve DEC-001–012 with recorded decisions. **Second:** obtain authorized Node 20 environment with dependencies and rerun ENG-028 executable checks. **Third:** refine ENG-027 into file-level verified dispositions. **Fourth:** prioritize only evidence-backed remediation packages. These actions are assessment and governance work, not blanket implementation authorization.

## 36. Definition of done for ENG-029
The decision register is complete when all conflicts are either approved/resolved or explicitly deferred with owners and risks; every repository gap has evidence and disposition; each remediation item has a dependency, acceptance test and owner; and approval status is recorded. **This draft does not yet meet that final completion condition.**

## 37. Handoff to ENG-030
Proposed next document: **ENG-030 — Implementation Work Package Authorization and Controlled Execution Plan**. It must remain a *proposed* authorization framework until ENG-024 and ENG-029 gates are satisfied; it must not imply permission to change code.

---
**Final status:** Draft decision framework and evidence-grounded preliminary roadmap. **No design approval, executable readiness certification, or implementation authorization has been granted.**
