# REC-003 — Canonical Contract and Dependency Verification Register

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Verification Working Draft  
**Proposed repository path:** `docs/governance/reconciliation/rec-003-canonical-contract-and-dependency-verification-register.md`  
**Architecture principles:** AD-001–AD-012 approved by sponsor  
**REC-001 policies:** D1–D5 approved; individual mappings remain unverified  
**REC-002:** Sections 1–8 completed as static assessment drafts  
**Implementation authorization:** **NOT GRANTED**

## 1. Purpose and decision boundary

Provide one controlled, auditable register for reconciling component ownership, APIs, events, data contracts, cross-layer dependencies, security boundaries, and test evidence against the approved architecture and the uploaded `hhscCompliance-develop.zip` snapshot. This is a **verification plan and initial evidence-qualified register**, not a declaration that contracts are implemented or compatible. No source code changes are authorized by this document.

## 2. Source and evidence hierarchy

1. Sponsor-approved AD-001–AD-012: binding architectural principles.
2. Sponsor-approved REC-001-D1–D5: binding naming, event, API, dependency, and traceability policies.
3. ENG-001–ENG-029: design drafts requiring contract-level reconciliation; no implicit precedence for conflicting identifiers.
4. REC-002 Sections 1–8: static repository mapping observations, not executable acceptance evidence.
5. Uploaded repository snapshot: inspectable source only; a filename or class declaration is not proof of operational behavior.
6. Future reproducible build, test, database, and security evidence: required for verified-working classifications.

**This document has not executed a fresh build, test suite, migration, or API runtime.** Prior ENG-028 records dependency-installation blocking. All runtime statuses remain unverified until a signed evidence record exists.

## 3. Canonical contract types

| Type | Identifier pattern | Required ownership | Required proof |
|---|---|---|---|
| Component | `PF-##`, `OP-##`, `RKE-##`, `FKE-##`, `SII-##`, `CI-##`, `FI-##`, `BM-##`, `UX-##` | Architecture owner and implementing service | Catalog reconciliation, source paths, tests |
| API | `API-<domain>-###` | Single service/domain owner | OpenAPI/DTO, auth, compatibility tests |
| Event | `EVT-###` legacy alias; canonical event ID assigned after comparison | Producer/authority owner | Payload schema, consumer contract, idempotency test |
| Data | `DATA-<domain>-###` | System of record | Schema, migration, tenant scope, retention |
| Knowledge | `KN-RKE-###` / `KN-FKE-###` (proposed register keys) | Corresponding knowledge authority | Source provenance, certified immutable version |
| Dependency | `DEP-###` | Calling component and receiving owner | Import graph, runtime contract, policy test |
| Acceptance | `AT-###` | QA and domain owner | Executed result, environment, artifact hash |

Proposed registry keys are **working identifiers**, not approved mappings to repository symbols.

## 4. Canonical namespace and alias policy

Adopt REC-001-D1 prefixes: `PF`, `OP`, `RKE`, `FKE`, `SII`, `CI`, `FI`, `BM`, `UX`. `RK`, `FK`, and `SI` remain historical aliases until their individual responsibilities are compared with `RKE`, `FKE`, and `SII`. An identical numeric suffix is **not** sufficient to establish equivalence. The five canonical `UX` slots in ENG-008 must be reconciled with the expanded ENG-022 UX component inventory. Binder Management is a governed component family and must not duplicate SII infrastructure authority.

## 5. Master contract register schema

Each row must record: `contractId`, `contractType`, `canonicalComponentId`, `legacyId`, `name`, `description`, `authorityOwner`, `implementationOwner`, `sourceSpecification`, `repositoryPath`, `producerOrCaller`, `consumerOrCallee`, `version`, `schemaLocation`, `tenantScope`, `resourceScope`, `authorizationPolicy`, `effectiveDatePolicy`, `knowledgeVersionPolicy`, `dataClassification`, `compatibilityPolicy`, `errorPolicy`, `auditPolicy`, `acceptanceTestIds`, `evidenceId`, `verificationStatus`, `reviewer`, `decisionDate`, `openIssues`.

Permitted statuses: **PROPOSED**, **SOURCE OBSERVED**, **MAPPING PENDING**, **CONTRACT REVIEWED**, **TESTED**, **APPROVED**, **BLOCKED**, **REJECTED**. A source observation cannot automatically advance to TESTED or APPROVED.

## 6. Initial component-family verification matrix

| Family | Slots | Source assessment | Contract reconciliation status | Runtime proof |
|---|---:|---|---|---|
| PF | 9 | Authentication, authorization, migrations, health, audit candidates | OPEN | Not established |
| OP | 12 | Provider, people, residential, fire drills, ISS candidates | OPEN | Not established |
| RKE | 11 | Models, validator, loader, knowledge-pack candidates | OPEN | Not established |
| FKE | 13 | Complete authority lifecycle not established | OPEN | Not established |
| SII | 15 | Evidence, audit, document candidates | OPEN | Not established |
| CI | 7 | Evaluators, findings, CAP, dashboard candidates | OPEN | Not established |
| FI | 11 | End-to-end financial determinations not established | OPEN | Not established |
| BM | 9 | Universal binder lifecycle not established | OPEN | Not established |
| UX | 5 canonical slots | Angular shell and workbench candidates; expanded ENG-022 list | OPEN | Not established |
| **Total** | **92** | Architecture slots, not proven implemented services | **OPEN** | **Not established** |

## 7. Component ownership verification

For every canonical slot, compare ENG-008 with detailed ENG-016–ENG-023 specifications and REC-002 source mappings. Record: definition, explicit exclusions, data owner, approval owner, package/service implementation, published contracts, and forbidden imports. Flag duplicate authority, missing ownership, overlapping components, or legacy name collisions. No component is accepted based solely on folder-name similarity.

## 8. API contract register — initial work queue

| ID | Interface family | Candidate source | Mandatory verification | Status |
|---|---|---|---|---|
| API-001 | Identity and sessions | `server/src/app/auth/` | DTOs, token lifecycle, revocation, errors, audit | OPEN |
| API-002 | Authorization and permissions | `server/src/app/security/` | Deny-by-default, role/resource/tenant checks | OPEN |
| API-003 | Provider management | `server/src/app/providers/` | Provider scope, create/read/update, ownership | OPEN |
| API-004 | Residential and fire drills | `server/src/app/residential/` | Location context, records, Form 4719 mapping | OPEN |
| API-005 | Compliance findings and CAP | Compliance services identified in REC-002 §6 | Status transitions, evidence, reassessment | OPEN |
| API-006 | RKE pack lifecycle | RKE models, loader and validator candidates | Draft/review/certify/publish/version | OPEN |
| API-007 | FKE knowledge lifecycle | No complete implementation established | Methodology/version/certification contracts | OPEN |
| API-008 | Financial calculations and reports | Not established | Precision, reporting period, audit | OPEN |
| API-009 | Binder lifecycle and secure sharing | Survey binder service candidate | Lifecycle, source ACL, external grant expiry | OPEN |
| API-010 | ISS operational workflow | ISS frontend/backend candidates | Consumer scope, service records, goals | OPEN |

These are **reconciliation work-item IDs**, not assertions that the named API endpoints exist. Extract actual HTTP methods and paths from controllers and compare against ENG-009. Preserve `/api/v1` where present; do not invent an endpoint.

## 9. API verification checklist

For each actual endpoint capture route, HTTP method, controller/service owner, request/response DTO, validation, version, authentication, tenant/record scope, idempotency requirements, pagination/filtering, error format, sensitive-field handling, audit record, consumers, deprecation policy, and executed positive/negative contract tests. A backend authorization check is mandatory even if the UI hides the action.

## 10. Event contract register — initial work queue

| Work item | Event family | Required reconciliation | Status |
|---|---|---|---|
| EVT-R01 | ENG-001 `EVT-001`–`EVT-042` | Compare each historical event to ENG-009 and later specs, one by one | OPEN |
| EVT-R02 | Knowledge certification and publication | Identify RKE/FKE producer, immutable version, effective date | OPEN |
| EVT-R03 | Operational record changes | Confirm producer, tenant scope, reassessment triggers | OPEN |
| EVT-R04 | Compliance findings and CAP | Verify lifecycle events and idempotent consumers | OPEN |
| EVT-R05 | Financial determination and report | Verify methodology and reporting-period references | OPEN |
| EVT-R06 | Binder review, release, revocation | Verify lifecycle, grants, and audit evidence | OPEN |
| EVT-R07 | Delivery infrastructure | Verify outbox/inbox, retry, dead-letter, ordering policy | OPEN |

**No new canonical EVT number is assigned until the historical event catalog is compared with the implementation and approved.**

## 11. Event schema requirements

Each published event must specify: canonical ID/name, schema version, event ID, producer, tenant ID, aggregate ID/version, timestamp, correlation and causation IDs, effective period, knowledge version where applicable, minimal payload, sensitive-data classification, authorized consumers, delivery guarantees, retry policy, idempotency key, retention, and failure handling. Avoid embedding unnecessary PHI/PII. Consumers must tolerate duplicate delivery and defined ordering limitations.

## 12. Data contract verification

Trace each operational entity to its owning domain, migration, database table, tenant scoping rule, lifecycle, audit history, retention, and downstream read model. Source records must not store independently invented regulatory or financial authority. Knowledge definitions require immutable certified versions and provenance. Determinations must reference the exact input snapshot and knowledge version used.

## 13. Dependency rules — required architecture tests

| ID | Boundary | Expected enforcement | Status |
|---|---|---|---|
| DEP-001 | RKE ↔ FKE | No direct import of each other's internals; explicit contracts only | NOT TESTED |
| DEP-002 | OP → CI/FI | Operational source ownership independent of applied determinations | NOT TESTED |
| DEP-003 | SII → RKE/FKE | Shared infrastructure does not own or hard-code certified rules | NOT TESTED |
| DEP-004 | CI → RKE | Consume certified, effective-dated regulatory contracts | NOT TESTED |
| DEP-005 | FI → FKE | Consume certified, effective-dated financial methodologies | NOT TESTED |
| DEP-006 | UX → backend | Frontend through approved API/data-access contracts | NOT TESTED |
| DEP-007 | BM → document source | Binder access must not bypass source document ACL | NOT TESTED |
| DEP-008 | All domains → PF | Consistent tenant, identity, authorization, audit context | NOT TESTED |
| DEP-009 | RKE/FKE → certification | Independent human review and publication authority | NOT TESTED |
| DEP-010 | Events → consumers | Explicit schema/version and reliable delivery | NOT TESTED |

## 14. Nx workspace dependency verification

After dependencies can be installed, record `nx show projects`, each project's configuration/tags, project graph, `nx affected` output, import boundary rules, and architecture test results. Review `nx.json`, root and project-level ESLint configurations, `tsconfig` aliases, and actual TypeScript imports. **Do not treat Nx project graph configuration alone as proof that runtime dependencies are safe.** Compare declared edges and source-level imports.

## 15. NestJS module verification

Inventory modules, controllers, providers, injected services, exported tokens, circular dependencies, runtime guards/interceptors, TypeORM repositories, and global middleware. Verify provider-wide routes do not demand a `locationId` unless the operation is genuinely location-scoped. Confirm route-level tenancy and entity-level ownership checks.

## 16. Angular and NgRx contract verification

Inventory standalone routes, API clients, data-access libraries, NgRx state/action/effect/selectors, guards, deep-link metadata, and provider/location scope handling. Verify workbench navigation preserves authorization and correction-area-first Residential workflows. Frontend route guards do not substitute for server enforcement.

## 17. Knowledge authority and time-version contracts

Require separate RKE and FKE certified versions, independent approvers, source citations, effective date, publication date, supersession record, and historical resolution rules. Define how a downstream evaluation selects a version and handles retroactive corrections. Never silently recompute or overwrite a historical finding, financial report, or released binder.

## 18. Compliance Intelligence contracts

Trace operational facts → RKE certified rule → evaluation → compliance result → finding → CAP → evidence → recheck. Require a persisted reference to rule/version, evaluator version, subject, provider/location scope, evaluation timestamp, and result history. Verify that each UI deep link resolves to an authorized record.

## 19. Financial Intelligence contracts

Trace operational financial records → FKE certified classification/allowability/allocation/rate/formula → calculation → reconciliation → cost report → Financial Binder. Require decimal precision, reporting-period resolution, source provenance, allocation explanation, versioned methodology, reproducibility, and exception management. Texas HCS rates and reporting requirements must come from verified authoritative sources, not assumptions.

## 20. Binder Management contracts

Define one shared binder core with specialized Survey and Financial Binder policies. Lifecycle: Draft → Assembling → Under Review → Approved → Released → Closed → Archived. Record version, manifest, document provenance, approval authority, access grants, revocation, release snapshot, and historical retrieval. Binder membership does not override source ACL.

## 21. External access and tenant isolation

Test same-tenant authorized access, cross-tenant denial, wrong-location denial, external surveyor scoped access, MFA where required, expired/revoked grants, document direct-URL denial, and audit of allowed/denied requests. Verify enforcement at service/data access, not just UI.

## 22. Security and privacy contract fields

Every API, event, and data contract must document PHI/PII classification, minimization, transport/storage protection, retention, export controls, redaction, access logs, and breach/incident hooks as applicable. Never put real consumer data into fixtures or public contract examples.

## 23. Reliability and failure semantics

Specify transaction boundaries, outbox/inbox needs, idempotency, retry/backoff, dead-letter handling, reconciliation jobs, failure visibility, and compensation. A failed knowledge lookup or unauthorized cross-engine request must fail closed; never substitute a default regulatory/financial determination.

## 24. Acceptance evidence model

Each test evidence record must include `evidenceId`, commit/archive hash, environment, Node/npm versions, dependency lockfile hash, command, timestamp, test fixture, result, logs, reviewer, and linked contract IDs. Outcomes: PASS, FAIL, BLOCKED, NOT RUN. An unavailable dependency is BLOCKED, not a failing application test.

## 25. Contract verification matrix — exemplar

| Contract | Source evidence | Verification task | Result |
|---|---|---|---|
| API-001 | Auth source candidates | Enumerate routes/DTOs; run auth tests | NOT RUN |
| API-004 | Residential source candidates | Verify provider/location authorization and fire-drill contracts | NOT RUN |
| API-006 | RKE validator/loader candidates | Test draft→certified→published transitions | NOT RUN |
| API-007 | FKE full lifecycle not established | Locate code or document build gap | NOT RUN |
| EVT-R01 | Historical EVT-001–042 catalog | Crosswalk to ENG-009 and repository producers | NOT RUN |
| DEP-001 | Independent RKE/FKE architecture approved | Import graph and boundary tests | NOT RUN |
| DEP-007 | Binder architecture approved | Document ACL and surveyor tests | NOT RUN |

## 26. Open reconciliation issue register

| Issue | Required decision/evidence | Status |
|---|---|---|
| R-01 | Reconcile `RK`↔`RKE`, `FK`↔`FKE`, `SI`↔`SII` semantics | OPEN |
| R-02 | Reconcile ENG-001 EVT-001–042 against ENG-009 and ENG-016–023 | OPEN |
| R-03 | Reconcile ENG-008 service catalog to ENG-014 work packages | OPEN |
| R-04 | Resolve RKE certification Sprint 11 vs shared approval Sprint 15 | OPEN |
| R-05 | Correct sprint count wording: 0–47 means 48 slots | OPEN |
| R-06 | Resolve regulatory and financial temporal/version contracts | OPEN |
| R-07 | Prove no cross-authority ownership transfer | OPEN |
| R-08 | Reconcile binder core, type extensions, and lifecycle | OPEN |
| R-09 | Separate payroll source calculations from FKE reporting authority | OPEN |
| R-10 | Reconcile binder grants with source ACL | OPEN |
| R-11 | Reconcile ENG-022 expanded UX components with UX-01–05 | OPEN |
| R-12 | Reconcile ENG-016–023 API/events against ENG-009 | OPEN |

## 27. Priority order and dependencies

**Gate A — Canonical identity:** resolve component mappings and owners (R-01, R-11).  
**Gate B — Contract identity:** API/event/data registries (R-02, R-12).  
**Gate C — Authority and temporal correctness:** certification, effective dates, cross-engine contracts (R-04, R-06, R-07, R-09).  
**Gate D — Security and binder access:** source ACL and external access (R-08, R-10).  
**Gate E — Delivery alignment:** sprint/work-package mapping and counting (R-03, R-05).  
**Gate F — Executable proof:** dependency install, builds, tests, migrations, integration and security verification.

These are dependency gates, not necessarily sequential calendar phases. Work may proceed in parallel only when prerequisites and separate authorization are satisfied.

## 28. Repository verification commands — controlled execution plan

Run in an authorized, isolated environment with appropriate secrets management; record exact outputs rather than assuming success:

```bash
node --version
npm --version
npm ci
npx nx show projects
npx nx graph --file=nx-project-graph.json
npx nx run-many -t lint --all
npx nx run-many -t test --all
npx nx run-many -t build --all
```

Project target names must be confirmed before running commands. Database migrations require a disposable test database and reviewed rollback/backup procedures. Do not connect to production or publish deployment artifacts as part of verification without separate permission.

## 29. Evidence capture and provenance

Record SHA-256 of source archive, commit hash if known, extraction date, source path, exact line ranges or symbols, build command, environment, result, and reviewer. Link each conclusion to its evidence ID. Source paths cited from REC-002 are candidates until rechecked against the actual snapshot.

## 30. Decision rights and review workflow

- **Architecture owner:** validates canonical component/contract ownership.
- **Regulatory authority owner:** approves RKE semantic contracts and source provenance.
- **Financial authority owner:** approves FKE methodology and calculation semantics.
- **Security reviewer:** approves tenancy, access, and data protection controls.
- **Technical lead:** verifies implementation mapping and dependency graph.
- **QA lead:** signs test evidence and coverage.
- **Sponsor:** accepts final reconciliation baseline and separately authorizes implementation.

A single person's policy approval does not automatically certify an untested technical contract.

## 31. Definition of contract-ready

A contract is ready only if: canonical ID and aliases are reconciled; owner and scope are clear; schemas and compatibility policy are documented; tenant/auth/privacy controls are defined; knowledge/version rules are explicit; implementation path and consumers are mapped; negative and positive acceptance tests are written and executed where applicable; evidence is attached; required reviewers approve. Anything less remains OPEN or BLOCKED.

## 32. Deliverables from REC-003

1. Approved canonical component/alias crosswalk.
2. Actual endpoint inventory and versioned API contract catalog.
3. Canonical event registry and historical EVT-001–042 mapping.
4. Data ownership and temporal version contract catalog.
5. Nx import/dependency graph and violation register.
6. RKE/FKE/Shared/Applied boundary verification report.
7. Security, binder ACL, and external-access contract evidence.
8. Traceability matrix linking contracts to tests and implementation work packages.
9. Signed open-issue disposition and approved remediation decisions.

**These are required outputs; they are not represented as already completed by this working draft.**

## 33. Exit criteria and formal disposition

REC-003 may close only when all mandatory mappings are resolved or explicitly waived with rationale; high-severity authority/security contradictions are eliminated; the registries are version-controlled; executed verification evidence is available or blockers are formally accepted; and the designated reviewers sign the reconciliation record. **Current disposition: OPEN — NOT READY FOR SIGN-OFF.**

## 34. Implementation control

No source changes, schema migrations, production deployments, feature implementations, or approval-state changes are authorized by REC-003. Any subsequent work package must separately specify scope, affected components, tests, rollback, accountable owner, and explicit sponsor authorization.

## 35. Immediate next action

Populate the canonical **component alias crosswalk** first, then extract the actual API and event inventories from the uploaded repository and compare them against ENG-009. Record every mismatch with a traceable evidence ID. Do not assign PASS or APPROVED to a contract until the stated proof exists.

---

**Document status:** Version 1.0 — Verification Working Draft  
**Architecture principle approval:** AD-001–AD-012 approved  
**REC-001 policy approval:** D1–D5 approved  
**Detailed contract verification:** OPEN  
**Executable tests:** NOT RUN in this document  
**Implementation authorization:** NOT GRANTED
