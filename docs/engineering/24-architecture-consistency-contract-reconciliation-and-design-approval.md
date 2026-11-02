# ENG-024 — Architecture Consistency, Contract Reconciliation, and Design Approval Specifications

**Organization:** McCaskill Projects  
**Platform:** Regulatory Intelligence Platform  
**Document ID:** ENG-024  
**Version:** 1.0 — Draft  
**Proposed repository path:** `docs/engineering/24-architecture-consistency-contract-reconciliation-and-design-approval.md`  
**Design approach:** Architecture-first, repository-independent  
**Implementation authorization:** Not Granted

## 1. Purpose and Decision Boundary

ENG-024 defines the formal process for reconciling ENG-001 through ENG-023 into one coherent, approvable architecture baseline. It is a **design-governance specification**, not a claim that reconciliation has already been completed. Its inputs are the actual approved versions of those documents; a title or summary alone is insufficient evidence of their full contents. No repository inspection or implementation is authorized by this specification.

**Outcome:** an evidence-backed reconciliation register, resolved cross-document contracts, approved exceptions, and a signed architecture decision record. ENG-025 will independently define the acceptance-test blueprint; ENG-026 may inspect the repository only after architecture approval.

## 2. Foundational Invariants

1. Exactly **two independent knowledge authorities**: Regulatory Knowledge Engine (RKE) and Financial Knowledge Engine (FKE).
2. Operational Domains own source business facts and operational workflows.
3. Shared Intelligence owns reusable execution, evidence, documents, audit, approval orchestration, reporting infrastructure, and binder infrastructure; it is **not** a third knowledge authority.
4. Compliance Intelligence owns regulatory evaluation orchestration, compliance results, findings, CAPs, and reassessment.
5. Financial Intelligence owns financial calculation orchestration, reconciliation, and financial report instances.
6. The UX displays and initiates authorized workflows; it cannot bypass backend policy.
7. AI may assist drafting, explanation, and analysis but cannot autonomously certify authoritative knowledge or approve governed releases.
8. Every governed result pins the applicable knowledge version, source snapshot, execution engine version, and provenance.
9. Multi-tenant isolation, resource-level authorization, auditability, and historical integrity are non-negotiable.
10. Architecture is designed independently of existing code; later repository analysis cannot silently rewrite approved architecture.

## 3. Scope and Document Inventory

The review covers **ENG-001 through ENG-023**, including workflows, state machines, entities, ER models, Nx architecture, implementation standards, frontend state, services, APIs/events, authorization, UX, data, quality, work packages, sprints, RKE, FKE, Shared Intelligence, Operational Domains, Applied Intelligence, Platform Foundation, application shell, and integration.

### Required inventory fields

| Field | Meaning |
|---|---|
| Document ID | ENG identifier |
| Title | Exact approved title |
| Version / revision | Immutable review version |
| Artifact location | Accessible canonical file |
| Author / reviewer | Accountable roles |
| Status | Draft, In Review, Approved, Superseded |
| Dependencies | Documents and contracts consumed |
| Open issues | Unresolved reconciliation references |
| Evidence | Section, table, diagram, or contract citation |

**Entry gate:** obtain the actual text of each version under review. Missing artifacts are recorded as `SOURCE_UNAVAILABLE`; they are never treated as reconciled.

## 4. Reconciliation Method

### WHAT
Compare the actual document contents and trace every architectural assertion to its owning authority and downstream consumers.

### WHEN
After the independent subsystem specifications exist and before architecture approval.

### WHERE
A version-controlled design register, decision records, and contract inventory.

### WHY
Multiple individually coherent documents may conflict on ownership, naming, lifecycle, API semantics, sprint dependencies, or approval timing.

### HOW
1. Freeze review inputs by document version and digest.
2. Extract entities, service identifiers, states, endpoints, events, permissions, invariants, dependencies, and acceptance criteria.
3. Normalize terms **only as proposed mappings**, retaining original source wording.
4. Create a cross-document traceability matrix.
5. Classify discrepancies by severity and authority.
6. Assign a decision owner and remediation document.
7. Approve changes through controlled revisions.
8. Rerun affected comparisons and record verification evidence.
9. Produce a residual-risk and exception register.
10. Request formal architecture approval.

### VERIFICATION
Every `RESOLVED` finding cites the precise revised document version and a verification artifact. No finding may be closed merely by verbal agreement.

## 5. Discrepancy Taxonomy and Severity

| Type | Examples |
|---|---|
| AUTHORITY | A shared service defines a financial or regulatory rule |
| OWNERSHIP | Two services claim the same authoritative entity |
| CONTRACT | API, event, DTO, or schema mismatches |
| TEMPORAL | Effective dates or historical version resolution differ |
| STATE | Incompatible lifecycle transitions |
| SECURITY | Inconsistent tenant or resource authorization |
| GOVERNANCE | Missing certification, approval, or separation of duties |
| DEPENDENCY | Sprint consumes capability not yet available |
| NAMING | Conflicting service IDs or glossary terms |
| TESTABILITY | Invariant has no verifiable acceptance criterion |
| OPERABILITY | No failure, recovery, or observability behavior |
| SOURCE | Underlying document or authoritative source missing |

**Blocker:** could undermine authority boundaries, privacy, correctness, legal compliance, or reproducibility.  
**Major:** breaks an essential workflow or contract.  
**Minor:** localized inconsistency with controlled workaround.  
**Editorial:** terminology or presentation only.

Blockers and Majors require resolution before baseline approval. Minor exceptions require named ownership, expiration, and approved mitigation; editorial findings can be tracked for controlled cleanup.

## 6. Authoritative Ownership Matrix

| Concern | Authoritative owner | Allowed consumer or infrastructure role |
|---|---|---|
| Regulatory sources, definitions, applicability, certification | RKE | Compliance Intelligence and Shared Validation consume published definitions |
| Financial methodology, rates, formulas, allowability, reporting definitions | FKE | Financial Intelligence and Shared Validation consume approved definitions |
| Organization, location, person, employee, service, contract, payroll, transaction facts | Operational Domains | Intelligence services request authorized snapshots |
| Regulatory evaluation results and CAP | Compliance Intelligence | UX, Binder, Reporting consume scoped results |
| Financial calculation results and report instances | Financial Intelligence | UX, Binder, Reporting consume scoped results |
| Evidence metadata and links | Shared Evidence | Source record remains owned by original domain |
| Document versions and secure delivery | Shared Document | Access requires owning-resource authorization |
| Approval workflow execution | Shared Approval | Domain owns approval policy and substantive decision authority |
| Binder instance and lifecycle | Shared Binder | Knowledge authority owns governed content requirements |
| Identity, tenancy, authorization policy enforcement | Platform Foundation | All services must enforce relevant decisions |

**Cross-authority contracts:** RKE and FKE may reference one another's approved facts through explicit versioned contracts; neither silently becomes owner of the other's definitions.

## 7. Service Catalog and Identifier Reconciliation

The working architecture includes PF-01–09, OP-01–12, RK-01–11, FK-01–13, SI-01–15, CI-01–07, FI-01–11, BM-01–09, and UX service identifiers in ENG-008. Later detailed specifications use RKE-01–11, FKE-01–13, SII-01–15, OP-01–12, and proposed UX component identifiers.

**Required decision:** designate a canonical **service ID** namespace and separate **component ID** aliases. Recommended mapping:

- `RK-nn` (catalog service) ↔ `RKE-nn` (detailed component), subject to actual one-to-one review.
- `FK-nn` ↔ `FKE-nn`, subject to actual one-to-one review.
- `SI-nn` ↔ `SII-nn`, subject to actual one-to-one review.
- `BM-nn` must map explicitly to binder subcomponents; it must **not** be assumed to equal `SII-08` or `SII-09` without inspecting ENG-008.
- UX-01–05 catalog services and ENG-022 proposed UX components may have different granularity; establish parent/child relationships rather than forcing numeric equivalence.

**Deliverable:** service crosswalk with `canonicalId`, `alias`, `sourceDocument`, `owner`, `responsibility`, `consumers`, `status`, and `decisionId`.

## 8. API and Event Contract Reconciliation

ENG-001's EVT-001–EVT-042 catalog must be mapped against ENG-009 and later proposed named events. Never assign new canonical numeric IDs by guesswork.

For each event record:

- Canonical identifier and version.
- Producer and aggregate owner.
- Triggering committed transition.
- Payload schema and sensitive-field classification.
- Tenant and resource scope.
- Correlation, causation, and idempotency keys.
- Ordering guarantees and delivery semantics.
- Consumer expectations, retries, and replay safety.
- Deprecation and migration strategy.

For each API record:

- Canonical method/path and contract version.
- Owning service.
- Request/response schema and error taxonomy.
- Required authorization scope.
- Idempotency and optimistic concurrency semantics.
- Pagination and historical version semantics.
- Consumer and contract tests.

**Release rule:** no endpoint or event is accepted without one authoritative producer/owner and a compatible consumer contract.

## 9. Entity and Data Ownership Reconciliation

Review ENG-003, ENG-004, ENG-012, and subsystem entity catalogs for:

- Duplicate identities and conflicting authoritative tables.
- Provider versus tenant versus organization scope.
- Person/consumer/employee relationship semantics.
- Location/provider effective dating.
- Operational source facts versus derived intelligence results.
- Financial exact-decimal representation and rounding policy ownership.
- Immutable knowledge pack releases and historical source snapshots.
- Document version identity versus source-record identity.
- Binder item references versus actual document access grants.
- Audit append-only and retention/legal-hold semantics.

**Deliverable:** entity ownership ledger with cardinality, temporal model, identifier scheme, authoritative service, and reference-only consumers.

## 10. State Machine Reconciliation

Compare ENG-002 against later subsystem specifications. Each governed state machine must specify allowed transitions, actor permissions, prerequisites, side effects, immutable snapshots, rejection/correction paths, and recovery behavior.

Mandatory state machines include:

1. RKE validation → review → certification → publication.
2. FKE validation → review → approval → publication.
3. Approval workflow and stale-subject handling.
4. Evidence review and supersession.
5. Compliance result → finding → CAP → recheck → closure.
6. Financial execution → reconciliation → review → report approval.
7. Binder Draft → Assembling → Under Review → Approved → Released → Closed → Archived.
8. Survey information request/response and access revocation.
9. Operational payroll, service delivery, and record correction.

A technical execution failure must never be represented as a negative regulatory or financial determination.

## 11. Authorization and Privacy Reconciliation

Reconcile ENG-010, ENG-018, ENG-019, ENG-020, ENG-021, ENG-022, and ENG-023 against the same permission and resource matrix. Include:

- Actor, tenant, provider, location, person, employee, document, report, binder, and survey-event scope.
- Provider-wide dashboard access **without requiring `locationId`** while still enforcing record-level access.
- Separation of regulatory certification and financial methodology approval.
- Segregation of duties for approvals and binder release.
- External surveyor individual identity, MFA, time limits, and scoped document access.
- Source-resource authorization for documents referenced in binders.
- Service-to-service authentication and delegation limits.
- Revocation behavior for cached or streamed access.
- Auditable access and data minimization.

**Blocking test:** a valid binder link cannot grant unauthorized access to an underlying person, employee, or document.

## 12. Temporal and Reproducibility Reconciliation

A governed execution manifest must identify the knowledge authority, definition/version, published pack version where applicable, source snapshot reference/digest, engine version, time basis, result digest, and correlation ID.

Distinguish:

- **Effective time:** when a rule or fact applies.
- **Recorded time:** when the platform learned or stored it.
- **Publication time:** when a knowledge version became available.
- **Execution time:** when the result was computed.
- **Historical replay:** reproduce the original computation.
- **Current reassessment:** evaluate old facts against newer approved knowledge, creating a new result.

**Blocking test:** an amended financial formula or regulatory rule must not silently alter a previously released result or binder snapshot.

## 13. Binder and Reporting Reconciliation

Confirm that Financial Binder and Survey Binder are peer capabilities using shared Binder Management. ENG-008 BM-01–09 must be mapped to ENG-018 binder capabilities and ENG-020/022/023 consumers.

For each binder type, reconcile definition ownership, required sections, conditional completeness rules, source references, approval, release snapshot, closure, archive, retention, legal holds, and external access. Financial report methodology belongs to FKE; report calculations and report instances belong to Financial Intelligence; rendering belongs to Shared Reporting. Survey document assembly does not transfer source-record ownership.

## 14. Vertical-Slice Reconciliation

### Texas HCS Cost Reporting

Trace official source → FKE source version → approved classification/allowability/allocation/rate/formula/report definitions → operational payroll/transaction/service-statistics snapshots → Shared Validation execution → Financial Intelligence reconciliation → report instance → approval → Financial Binder → historical replay.

**Source gate:** official requirements and rates must be verified before certification; no unverified methodology is treated as authoritative.

### Texas HCS Emergency Preparedness

Trace official source → RKE source version → certified requirement and applicability → residential emergency-plan and drill records → Shared Validation → Compliance Intelligence result → finding/CAP/recheck → Survey Binder → audit and historical replay.

### Texas ISS

Trace approved individual goal and plan linkage → activity/session/progress records → relevant certified Texas ISS knowledge → Compliance Intelligence when required → authorized binder or survey disclosure. A six-hour conceptual activity plan must never be presumed to equal six billable hours. Confirm nine skill domains and 72 objective templates against the approved ISS curriculum artifact before declaring them reconciled.

## 15. Roadmap and Dependency Reconciliation

**Known discrepancy:** Sprint 0 through Sprint 47 inclusive comprises **48 numbered sprint slots**. Any reference to a “47-sprint roadmap” must be corrected or explicitly defined as a different count.

Review all dependency gates in ENG-015, including:

- Regulatory knowledge certification planned before the full shared approval infrastructure: define a minimum compliant interim governance capability or revise sequencing; no certification bypass.
- Shared Validation availability before Compliance Intelligence and Financial Intelligence integrations.
- Financial methodology publication before HCS Cost Reporting execution.
- Binder approval/release prerequisites before survey external access.
- Authorization, audit, and immutable source-version prerequisites before production governed results.
- Software Change Register as a mandatory deliverable every sprint.

**Deliverable:** dependency DAG, critical path, approved sequencing exceptions, and updated sprint crosswalk. Do not change the baseline without an approved decision record.

## 16. UX and State Management Reconciliation

Verify ENG-007, ENG-011, ENG-022, and ENG-023 agree on:

- Angular standalone routing and application shell boundaries.
- NgRx global/feature state versus local component state.
- Server-state invalidation and version-aware caching.
- Provider-wide Provider Intelligence Center.
- Residential correction-area-first view (Fire Drills, Emergency Plans, Hot Water, Medication; affected locations nested beneath).
- Regulatory and Financial Workbenches.
- Financial Binder, Survey Workspace, ISS Operations, and Knowledge Administration.
- Loading, empty, error, access-denied, stale-version, and partial-failure states.
- Accessibility and responsive enterprise desktop behavior.

The UI must never implement an alternative rule engine or treat a displayed result as authority without its governing version and status.

## 17. Technology and Deployment Reconciliation

Confirm target decisions consistently across ENG-005/006/012/021/022: Nx, Angular 20 standalone, NgRx, NestJS, PostgreSQL, TypeORM, Vercel frontend, Render backend, versioned APIs, event reliability, storage, observability, CI/CD, and security controls. These are **target design choices**, not assertions about the current repository. Any deployment-specific assumptions require explicit approval and evidence before implementation.

## 18. Reconciliation Register Schema

| Field | Required meaning |
|---|---|
| Finding ID | `ARC-REC-####` |
| Category | Taxonomy from §5 |
| Severity | Blocker/Major/Minor/Editorial |
| Source A | Document version and exact section |
| Source B | Document version and exact section |
| Conflict | Exact incompatible assertions |
| Authority owner | Accountable decision role |
| Proposed resolution | Change and rationale |
| Affected artifacts | Documents, contracts, tests |
| Decision ID | Approved ADR reference |
| Status | Open/Investigating/Decision Pending/Remediating/Verified/Closed/Accepted Exception |
| Verification | Exact revision and test/review evidence |
| Residual risk | Explicit impact and mitigation |

No finding may move directly from Open to Closed without a decision and verification record.

## 19. Initial Reconciliation Candidates — Not Yet Verified Findings

The following candidates arise from the design sequence and **must be checked against actual ENG files**:

| Candidate | Investigation | Proposed disposition |
|---|---|---|
| RC-01 | “47-sprint” vs 0–47 numbering | Normalize to 48 slots or explain count |
| RC-02 | ENG-001 EVT IDs vs later named events | Publish canonical event crosswalk |
| RC-03 | RK/FK/SI vs RKE/FKE/SII identifiers | Canonical IDs plus aliases |
| RC-04 | BM-01–09 vs shared binder components | Map services to subcomponents explicitly |
| RC-05 | UX catalog services vs ENG-022 component granularity | Parent/child component map |
| RC-06 | Sprint 11 certification vs Sprint 15 shared approval | Approve interim governance or resequence |
| RC-07 | Financial methodology vs payroll tax calculation authority | Explicit authority boundary and integration |
| RC-08 | Knowledge effective dates vs historical execution | Uniform temporal semantics |
| RC-09 | Binder access vs underlying document access | Independent authorization enforcement |
| RC-10 | Regulatory and financial cross-authority references | Explicit pinned cross-authority contract |
| RC-11 | ENG-013 and ENG-008 writing-block ID collision in prior drafting | Ensure canonical artifacts have distinct IDs and paths |
| RC-12 | Texas ISS curriculum source and nine domains/72 templates | Verify approved curriculum artifact |

**Status of every candidate above: `UNVERIFIED — REVIEW REQUIRED`.** None is asserted as resolved.

## 20. Architecture Decision Records (ADR)

Each material resolution requires an ADR containing:

- ADR ID, title, date, status, and accountable approver.
- Decision context and conflicting source references.
- Options considered and rejected.
- Selected decision and reasoning.
- Security, tenancy, historical, and governance consequences.
- Affected specifications and migration implications.
- Verification plan and rollback/reconsideration triggers.

An ADR does not automatically revise the specifications; referenced documents must be updated and re-reviewed.

## 21. Roles and Approval Separation

| Role | Responsibility |
|---|---|
| Architecture owner | Overall consistency and final technical recommendation |
| RKE owner | Regulatory authority boundaries and certification semantics |
| FKE owner | Financial methodology and approval semantics |
| Operational domain owners | Source record ownership and workflow facts |
| Shared Intelligence owner | Execution, evidence, document, approval, binder infrastructure |
| Security owner | Tenant, resource, external access, and audit controls |
| QA owner | Traceability and verification evidence |
| Product owner | Scope and acceptance of business workflows |
| Design approver | Formal baseline decision |

A reviewer may recommend approval, but may not bypass applicable separation-of-duties controls. Specific personnel assignments are a future governance decision.

## 22. Approval Gates

### Gate A — Source completeness
All ENG-001–023 source files, versions, and digests available; gaps logged.

### Gate B — Ownership and authority
No unresolved Blocker or Major ownership conflicts; two-authority rule intact.

### Gate C — Contracts
Canonical service, entity, API, event, state, and authorization crosswalks approved.

### Gate D — Cross-layer workflows
HCS Cost Reporting, Emergency Preparedness, and ISS traced end-to-end with no undocumented handoffs.

### Gate E — Security and historical integrity
Tenant isolation, external access, immutable versions, replay, and binder release controls verified at design level.

### Gate F — Roadmap and quality
Dependencies and 48-slot sprint count reconciled; acceptance tests trace to ENG-025.

### Gate G — Final design approval
Architecture owner, security owner, knowledge authority owners, and designated approver sign the baseline or record approved exceptions.

**Approval cannot be inferred from document creation.** Every gate requires recorded evidence.

## 23. Design Acceptance Tests

| Test ID | Required result |
|---|---|
| T-ARC-01 | Every ENG-001–023 input version inventoried |
| T-ARC-02 | Every service has exactly one accountable owner |
| T-ARC-03 | No third knowledge authority introduced |
| T-ARC-04 | All event aliases map to canonical contracts |
| T-ARC-05 | API consumers and producers agree on schemas and auth |
| T-ARC-06 | Entities have unambiguous authoritative ownership |
| T-ARC-07 | State transitions and approvals agree across documents |
| T-ARC-08 | Historical replay provenance is complete |
| T-ARC-09 | Binder release cannot bypass approvals or source authorization |
| T-ARC-10 | HCS Cost Reporting slice has no missing contract |
| T-ARC-11 | Emergency Preparedness slice has no missing contract |
| T-ARC-12 | ISS workflow preserves operational/regulatory/billing distinctions |
| T-ARC-13 | Roadmap dependency graph is consistent |
| T-ARC-14 | Sprint 0–47 counting discrepancy resolved |
| T-ARC-15 | Every Blocker/Major finding resolved and verified |
| T-ARC-16 | Every accepted exception has owner, mitigation, and expiry |
| T-ARC-17 | Every architecture invariant maps to ENG-025 acceptance coverage |

## 24. Final Deliverable Package

Completion of ENG-024 requires the following **separate artifacts**, not merely this specification:

1. Frozen ENG-001–023 source inventory.
2. Reconciliation findings register.
3. Canonical service and component crosswalk.
4. Entity ownership and temporal semantics ledger.
5. API and event contract registry.
6. State machine and authorization crosswalk.
7. Vertical-slice traceability matrices.
8. Dependency and sprint reconciliation.
9. Architecture Decision Records.
10. Revised affected ENG documents.
11. Verified exceptions and residual-risk register.
12. Signed architecture baseline approval record.

## 25. Exit Criteria and Handoff

ENG-024 is complete only when all approval gates pass, Blocker and Major findings are verified closed, all source documents are available, and the approved baseline has immutable version references. If any condition fails, the architecture remains **Draft / Not Approved**.

**Handoff to ENG-025:** approved invariants, canonical contracts, traceability, and acceptance obligations.  
**Handoff to ENG-026:** only an approved architecture baseline and explicit authorization to inspect actual repository state.

## 26. Implementation Authorization

**NOT GRANTED.** This specification does not authorize coding, repository modification, migrations, deployment, or knowledge publication. It also does not claim that ENG-001–023 have been independently inspected or reconciled.

## 27. Final Engineering Position

The objective of ENG-024 is to transform a sequence of draft specifications into **one internally consistent, evidence-backed, formally approved architecture**. Design completion is a verifiable governance outcome, not a document count.

**End of ENG-024 — Architecture Consistency, Contract Reconciliation, and Design Approval Specifications**
