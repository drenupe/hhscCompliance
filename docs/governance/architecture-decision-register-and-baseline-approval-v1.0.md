# Architecture Decision Register and Baseline Approval v1.0

**Organization:** McCaskill Projects  
**Program:** Regulatory Intelligence Platform  
**Document ID:** GOV-001  
**Version:** 1.0 — Recorded Decision Baseline  
**Decision authority:** Project owner (approvals provided in this conversation)  
**Decision scope:** Architectural principles AD-001–AD-012 only  
**Detailed contract reconciliation:** PENDING  
**Executable repository verification:** INCOMPLETE  
**Final design acceptance:** PENDING  
**Implementation authorization:** **NOT GRANTED**  
**Proposed repository path:** `docs/governance/architecture-decision-register-and-baseline-approval-v1.0.md`

## 1. Purpose
This document consolidates twelve architectural decisions expressly approved by the project owner during the current architecture reconciliation conversation. It records the binding design direction, separates approved principles from unresolved detailed contracts, and defines the conditions for final architecture ratification and implementation authorization.

It is a decision record, **not** evidence that changes have been committed to a repository, that implementation conforms, or that tests have passed. Approval dates, signatures, and a controlled repository revision must be added when this document is formally entered into the project records.

## 2. Approval declaration and limits
The project owner answered **“yes”** to each individually presented decision AD-001 through AD-012. Those responses constitute approval of the principles and conditions described in the respective decision proposals. They do **not** authorize implementation, waive security or regulatory requirements, resolve every contract discrepancy in ENG-024/029, or approve unreviewed source-code changes.

**Approved:** Architecture Baseline v1.0 *ownership and governance principles*, as enumerated below.  
**Not yet approved:** A fully reconciled API/event/entity contract set, verified repository implementation baseline, production deployment, or implementation work package.

## 3. Architecture baseline — system of authority
The platform follows these responsibility boundaries:

| Layer or authority | Owns | Must not own |
|---|---|---|
| Platform Foundation | Tenant, identity, authorization, security, API/integration infrastructure, observability | Regulatory or financial normative definitions |
| Operational Domains | Provider, location, person, workforce, service, payroll, transaction and other source facts | Compliance requirements or regulated financial treatment |
| Regulatory Knowledge Engine (RKE) | Regulatory sources, requirements, applicability, effective-dated certified knowledge | Financial methodology or operational source records |
| Financial Knowledge Engine (FKE) | Financial classification, allowability, allocation, rates, formulas, reporting methodology | Regulatory certification or operational source records |
| Shared Intelligence | Evidence, audit, validation execution, document/binder services, approvals, reliable workflow infrastructure | A third independent knowledge authority |
| Applied Intelligence | Compliance/financial evaluation, findings, remediation, reconciliation and reporting orchestration | Independent redefinition of certified rules |
| User Experience | Authorized presentation and interaction | Authoritative knowledge or independent security enforcement |

**Invariant:** Knowledge Engines define governing knowledge; Operational Domains maintain facts; Shared Intelligence provides governed execution infrastructure; Applied Intelligence makes traceable determinations; UX presents them; AI assists but cannot certify authoritative knowledge.

## 4. Approved architecture decision register

| Decision | Approved title | Binding decision | State |
|---|---|---|---|
| AD-001 | Platform Ownership Boundaries | Adopt the architecture authority boundaries in §3 | APPROVED |
| AD-002 | Knowledge Engine Independence | RKE and FKE remain independent authoritative systems, with separate validation, certification, approval and version histories | APPROVED |
| AD-003 | Knowledge Certification and Approval Authority | Draft → automated validation → independent review → authorized certification → controlled publication → supersession; AI cannot certify or publish independently | APPROVED |
| AD-004 | Effective Dating and Historical Reproducibility | Preserve effective, publication and supersession dates, immutable versions, source provenance and reproducible historical determinations | APPROVED |
| AD-005 | Cross-Engine Integration and Contract Ownership | Govern interactions through explicit versioned contracts, authorization context, auditability, traceability and failure handling without transferring ownership | APPROVED |
| AD-006 | Universal Binder Architecture | Shared binder infrastructure for Survey and Financial Binder types, with type-specific controls, secure access and immutable released history | APPROVED |
| AD-007 | Operational Data and Knowledge Authority Separation | Operational domains own facts; knowledge engines own authoritative definitions; applied services evaluate with certified versions | APPROVED |
| AD-008 | Provider-Wide Intelligence and Location-Level Workflows | Provider Intelligence Center is provider-wide without mandatory `locationId`; authorized location drilldown, correction-area-first Residential Workbench and actionable findings | APPROVED |
| AD-009 | Knowledge-First Development Enforcement | New regulatory/financial features require prior representation of governing requirements/definitions in the appropriate Knowledge Engine and end-to-end traceability | APPROVED |
| AD-010 | Architecture Contract and Component Registry | Maintain one canonical governed component/API/event/dependency registry with identifiers, versioning, compatibility and legacy mappings | APPROVED |
| AD-011 | Security, Tenant Isolation, and External Access | Enforce tenant, role, attribute, resource and document-level authorization at backend/data boundaries, including scoped external surveyor access and audit | APPROVED |
| AD-012 | Implementation Sequencing and Dependency Governance | Architecture and repository verification precede changes; dependency-aware work packages, vertical slices, migration controls, acceptance gates and separate authorization are mandatory | APPROVED |

## 5. AD-003 — Certification control requirements
1. Certified knowledge is version-specific and immutable; any revision creates a new candidate version.
2. Author, reviewer and certifier roles are appropriately separated under the governing policy.
3. Validation must include structure, source references, applicability, temporal consistency and applicable domain-specific checks.
4. Publication requires explicit authorization and produces a durable audit record.
5. Rejected or superseded versions remain traceable; historical determinations must resolve the correct applicable version.
6. RKE and FKE maintain distinct approval authorities even when using common workflow infrastructure.

## 6. AD-004 — Temporal resolution and reproducibility
Every determination must identify the organization/tenant, relevant period or as-of date, knowledge authority, exact knowledge version, source-record/evidence references, execution version, and outcome. New publication must not silently rewrite prior findings, calculations or released binders. Authorized corrections require explicit reason, audit history and preservation of original records.

## 7. AD-005 and AD-010 — Contract governance
A canonical registry must define component ownership, API request/response schemas, event producers/consumers, event IDs, schema versions, authorization, idempotency/retry policies, temporal references, backward compatibility, and change approvals. The registry is authoritative for **software contracts**, not for regulatory or financial knowledge content. Previously used `RK/RKE`, `FK/FKE`, and `SI/SII` identifiers require explicit alias mappings and migration decisions.

## 8. AD-006 — Binder governance
The shared default lifecycle is **Draft → Assembling → Under Review → Approved → Released → Closed → Archived**. Transitions require authorized roles and auditable evidence; binder-type extensions may add stricter requirements but must not bypass shared controls. A binder grant is not a blanket grant to its underlying documents. Released versions are immutable or changed through a documented versioned correction process.

## 9. AD-008 — Provider Intelligence Center acceptance principles
- The provider-wide dashboard works without a required `locationId` and respects the user's authorized scope.
- Location and service drilldowns retain tenant and resource authorization.
- Residential correction areas lead navigation: Fire Drills, Emergency Plans, Hot Water and Medication, with affected locations beneath them.
- Findings deep-link to underlying record, evidence, corrective action, status and reassessment where authorized.
- Financial, regulatory, residential, ISS and survey workspaces share consistent shell and interaction patterns.

## 10. AD-009 — Knowledge-first implementation gate
A regulated feature work package cannot pass design readiness unless it identifies: authoritative source; certified or explicitly pre-certification knowledge definition as appropriate for development/testing; applicability; owning engine; versioned contract; operational input facts; evaluation path; evidence and audit; authorization; acceptance tests. A draft knowledge definition may support nonproduction prototyping, but **must not** be represented as certified or used to issue authoritative production determinations.

## 11. AD-011 — Security acceptance principles
Enforce backend and data-layer tenant isolation, role/attribute/resource authorization, least privilege, sensitive-data protection, secure service authentication, document-specific access, scoped/time-limited external reviewer grants, revocation, and audit of both access and denial. Require negative tests for cross-tenant access, privilege escalation, unauthorized document access and revoked access. Security claims require executed evidence, not just configuration presence.

## 12. AD-012 — Controlled execution gates
| Gate | Required evidence | Current state |
|---|---|---|
| A — Principle approval | AD-001–AD-012 explicit owner decisions | **APPROVED** |
| B — Contract reconciliation | ENG-024/029 discrepancy resolution, canonical registries and approved ADR crosswalk | PENDING |
| C — Repository executable baseline | Reproducible environment, dependency install, Nx builds/tests, database checks, logs | INCOMPLETE |
| D — Security and data integrity | Tenant/authorization tests, migration assurance, audit and rollback evidence | PENDING |
| E — Work package readiness | Scope, dependencies, acceptance criteria, owner, risks, migration plan | PENDING |
| F — Implementation authorization | Separate explicit approval of a named work package | **NOT GRANTED** |

## 13. Reconciliation crosswalk: prior ENG-024/029 issues
The twelve approved AD decisions establish direction, but do not automatically close all twelve detailed discrepancies in ENG-029. The crosswalk below states what remains to be done.

| ENG-029 issue | Related approved ADs | Required closure artifact | Closure status |
|---|---|---|---|
| DEC-001 Event ID conflicts | AD-005, AD-010 | Canonical event registry and aliases | OPEN |
| DEC-002 RK/FK/SI identifier mismatch | AD-001, AD-010 | Component registry and alias table | OPEN |
| DEC-003 Services/work packages/sprints | AD-010, AD-012 | Component-to-package-to-gate mapping | OPEN |
| DEC-004 Certification versus approval infrastructure sequencing | AD-003, AD-012 | Dependency plan and approved transitional design | OPEN |
| DEC-005 Sprint count discrepancy | AD-012 | Correct documentation: Sprint 0–47 = **48 slots** | OPEN — editorial |
| DEC-006 Temporal resolution | AD-004 | Exact as-of/version/provenance contracts and tests | OPEN |
| DEC-007 Cross-authority ownership | AD-001, AD-002, AD-005, AD-007 | Explicit integration schemas and boundary tests | OPEN |
| DEC-008 Binder lifecycle/extensions | AD-006, AD-011 | State-machine contract, type policy and ACL tests | OPEN |
| DEC-009 Payroll versus FKE | AD-002, AD-007 | Data ownership and regulated-treatment contract | OPEN |
| DEC-010 Surveyor versus source ACL | AD-006, AD-011 | Access matrix, expiry/revocation tests | OPEN |
| DEC-011 UX catalog expansion | AD-008, AD-010 | Logical-to-deployable component mapping | OPEN |
| DEC-012 Later APIs/events versus ENG-009 | AD-005, AD-010 | Canonical API/event contracts and compatibility tests | OPEN |

**Interpretation:** AD approval settles the principle; a DEC item closes only after its precise competing specifications are reconciled, recorded, and verified against agreed acceptance criteria.

## 14. Evidence and repository status
The earlier assessment of uploaded `hhscCompliance-develop.zip` in ENG-027/028 is a **snapshot inspection**, not a live-branch attestation. ENG-028 recorded that dependency installation was blocked in the assessment environment, and application build, automated test, database migration and runtime success were not established. No source modifications are claimed in this register. Re-run checks in a reproducible compatible environment and preserve command, environment, timestamp and output evidence.

## 15. Source document hierarchy and change control
- This register governs the **twelve approved architectural principles**.
- ENG-001–ENG-023 remain detailed draft specifications requiring alignment where conflicts exist.
- ENG-024 governs consistency and reconciliation procedures.
- ENG-025 governs verification and acceptance-test planning.
- ENG-026–ENG-029 contain repository assessment procedures, evidence and remediation planning.
- Any future canonical component/API/event registry must be explicitly approved before it supersedes conflicting draft details.

Do not silently edit an earlier specification to appear reconciled. Record each change with issue ID, affected sections, rationale, owner, approval and test impact.

## 16. Open items requiring accountable resolution
1. Complete each DEC-001–DEC-012 closure artifact.
2. Establish canonical API/event/component registries and version mappings.
3. Verify certification infrastructure dependency ordering.
4. Execute reproducible build/test/database/security verification.
5. Establish a named, approved first implementation work package with rollback and acceptance criteria.
6. Record document control metadata (approval date, responsible owner, repository commit and formal sign-off method) when filing this document.

## 17. Approval record
| Approval field | Record |
|---|---|
| Approving authority | Project owner, as represented in this conversation |
| Decisions presented and approved | AD-001 through AD-012 |
| Approval evidence | Individual affirmative “yes” responses to each decision |
| Approval scope | Architecture ownership and governance principles only |
| Decision date | To be entered in controlled project register |
| Formal signature or repository commit | NOT YET RECORDED |
| Final reconciled architecture approval | PENDING |
| Implementation authorization | **NOT GRANTED** |

## 18. Formal disposition
**Architecture Baseline v1.0 — PRINCIPLES APPROVED, CONDITIONAL.** The project owner has approved AD-001–AD-012 as binding architectural direction. Detailed specification reconciliation, executable readiness and implementation authorization are separate gates and remain outstanding.

**Next authorized activity:** Documentation reconciliation, evidence collection and verification planning. **No implementation work is authorized by this document.**
