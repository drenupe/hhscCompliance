# REC-002 — Component-to-Service Mapping and Dependency Reconciliation
## Section 8: Consolidated Component Mapping, Dependency Gap Register, and Implementation Treatment Matrix

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Status:** Consolidated static assessment; not a final design or implementation sign-off  
**Implementation authorization:** NOT GRANTED  
**Assessment basis:** REC-002 Sections 1–7 and uploaded `hhscCompliance-develop.zip`; no new executable verification is asserted in this consolidation.

## 1. Purpose
Consolidate all seven component mapping assessments into one actionable but evidence-qualified reconciliation register. Distinguish observed source artifacts, unverified behavior, architectural gaps, proposed treatment, prerequisites, and decision authority. This is not permission to edit the repository.

## 2. Evidence and confidence legend
- **Observed:** A specific path or artifact was identified in an earlier section. Existence does not establish correct behavior.
- **Candidate:** Source may support the architectural component; compatibility remains to be proven.
- **Not established:** The reviewed evidence does not demonstrate the capability. This is not proof of absence across every file.
- **Verified working:** Requires executable tests and acceptance evidence; **none is claimed by this report**.
- **Treatment:** `Reuse`, `Modify`, `Replace`, `Build New`, or `Investigate`. Every treatment here is **provisional**, not authorized.

## 3. Source documents and precedence
1. REC-002 Section 1 — Platform Foundation Component Mapping.
2. REC-002 Section 2 — Operational Domains Component Mapping.
3. REC-002 Section 3 — Regulatory Knowledge Engine Component Mapping.
4. REC-002 Section 4 — Financial Knowledge Engine Component Mapping.
5. REC-002 Section 5 — Shared Intelligence Infrastructure Component Mapping.
6. REC-002 Section 6 — Applied Intelligence Component Mapping.
7. REC-002 Section 7 — Binder Management and User Experience Component Mapping.
8. Architecture Decision Register v1.0, AD-001–AD-012, and REC-001 policy approvals.

Earlier sections are the source of file-level evidence; this consolidated document must not be used to infer a runtime test result.

## 4. Consolidated architecture coverage
| Family | Expected IDs | Count | Static assessment summary | Decision readiness |
|---|---|---:|---|---|
| Platform Foundation | PF-01–PF-09 | 9 | Authentication, authorization, migrations, health and audit code candidates; tenancy, storage and events require verification | Not ready |
| Operational Domains | OP-01–OP-12 | 12 | Provider, people, residential, fire drills and ISS source candidates; payroll/statistics not established | Not ready |
| Regulatory Knowledge Engine | RKE-01–RKE-11 | 11 | Models, validator, loader, repository interface and service candidates; certification/version resolution unverified | Not ready |
| Financial Knowledge Engine | FKE-01–FKE-13 | 13 | No complete FKE authority or methodology lifecycle established | Not ready |
| Shared Intelligence | SII-01–SII-15 | 15 | Evidence, audit and document candidates; approvals, binder, reliable events and historical execution unverified | Not ready |
| Compliance Intelligence | CI-01–CI-07 | 7 | Evaluators, results, CAP and dashboard source candidates | Not ready |
| Financial Intelligence | FI-01–FI-11 | 11 | End-to-end financial determination and cost reporting not established | Not ready |
| Binder Management | BM-01–BM-09 | 9 | Universal binder lifecycle not established; inspected survey-binder service reported empty | Not ready |
| User Experience | UX-01–UX-05 canonical family | 5 | Angular shell, dashboard and workbenches exist; expanded UX inventory needs canonical reconciliation | Not ready |
| **Total canonical slots** | | **92** | Counts represent architecture slots, **not implemented components** | **Not ready** |

**Naming caveat:** ENG-022 expands the UX component vocabulary beyond the five ENG-008 canonical slots. Do not infer a one-to-one mapping until the REC-001 registry is populated and approved.

## 5. Platform Foundation — PF treatment matrix
| ID | Observed evidence / gap | Provisional treatment | Next proof |
|---|---|---|---|
| PF-01 | `server/src/app/auth/` JWT, token, session, password source | Modify candidate | Authentication and revocation tests |
| PF-02 | `server/src/app/security/` permissions, guards, authorization | Modify candidate | Tenant/resource denial tests |
| PF-03 | Provider records present; isolation not established | Investigate | Tenant context and cross-tenant tests |
| PF-04 | Backend modules, project config, frontend data-access | Modify candidate | API contract and authorization inventory |
| PF-05 | `server/migrations/` | Modify candidate | Clean DB migration/rollback tests |
| PF-06 | Dedicated document storage boundary not established | Investigate | Storage adapter and retention review |
| PF-07 | Universal integration/event bus not established | Investigate | Producer/consumer and outbox inventory |
| PF-08 | Health and observability modules | Modify candidate | Readiness, tracing, safe logging tests |
| PF-09 | Audit, security and MFA-related source | Modify candidate | Immutable audit and security controls tests |

## 6. Operational Domains — OP treatment matrix
| ID | Observed evidence / gap | Provisional treatment | Next proof |
|---|---|---|---|
| OP-01 | `server/src/app/providers/` | Modify candidate | Provider lifecycle and tenancy |
| OP-02 | `server/src/app/residential/` | Modify candidate | Location ownership and API contracts |
| OP-03 | `server/src/app/people/` | Modify candidate | Relationship integrity and access |
| OP-04 | Employee profile entity | Modify candidate | Workforce lifecycle and protected fields |
| OP-05 | `server/src/app/consumers/` | Investigate | Service-delivery semantics |
| OP-06 | Provider source candidate | Investigate | Contract/authorization entities and rules |
| OP-07 | No matching payroll TS paths in targeted scan | Investigate, then Build if absent | Expanded repository search |
| OP-08 | Financial source files present | Investigate | Transaction ownership and ledger semantics |
| OP-09 | No matching statistics TS paths in targeted scan | Investigate, then Build if absent | Expanded repository search |
| OP-10 | Evidence source files present | Modify candidate | Operational document ownership |
| OP-11 | `server/src/app/fire-drills/` | Modify candidate | Form 4719 and RKE traceability |
| OP-12 | `server/src/app/iss/` | Modify candidate | ISS data model, workflows, billing separation |

## 7. Regulatory Knowledge Engine — RKE treatment matrix
| ID | Observed evidence / gap | Provisional treatment | Next proof |
|---|---|---|---|
| RKE-01 | `models/regulatory-source.model.ts` | Modify candidate | Source provenance |
| RKE-02 | `models/regulatory-rule.model.ts` | Modify candidate | Normalization and lineage |
| RKE-03 | `models/regulatory-requirement.model.ts` | Modify candidate | Applicability semantics |
| RKE-04 | RKE models | Reuse/Modify candidate | Canonical schema and invariants |
| RKE-05 | `validators/knowledge-pack.validator.ts` | Modify candidate | Run validator tests and negative cases |
| RKE-06 | Dedicated certification not confirmed | Investigate / likely Build | Review/approval workflow inventory |
| RKE-07 | `loaders/knowledge-pack.loader.ts` | Modify candidate | Pack loading and publication gates |
| RKE-08 | Knowledge-pack model | Investigate / likely Modify | Effective-time resolution tests |
| RKE-09 | Repository interface; earlier assessment notes in-memory repository | Modify candidate | Durable storage and immutable versions |
| RKE-10 | Change impact publisher not confirmed | Investigate / likely Build | Event/change impact tracing |
| RKE-11 | `services/regulatory-knowledge.service.ts` | Modify candidate | Certified knowledge resolution and explanation |

## 8. Financial Knowledge Engine — FKE treatment matrix
The targeted assessment did not verify a dedicated FKE implementation for any of FKE-01–FKE-13. **Do not automatically classify all 13 as Build New:** first inspect generic financial modules and reusable shared infrastructure.

| IDs | Capability grouping | Provisional treatment | Required evidence |
|---|---|---|---|
| FKE-01–03 | Financial authority intake, interpretation, taxonomy | Investigate / likely Build | Authoritative source models and provenance |
| FKE-04–05 | Cost classification and allowability | Investigate / likely Build | Certified, effective-dated definitions |
| FKE-06–08 | Allocation, rates, formulas | Investigate / likely Build | Decimal precision, versioned deterministic methods |
| FKE-09 | Reporting schedules and schemas | Investigate / likely Build | Texas HCS reporting authority and schema |
| FKE-10–11 | Validation, review, certification | Investigate / likely Build | Independent human approval gates |
| FKE-12–13 | Pack publication, change impact, history | Investigate / likely Build | Durable immutable versions and historical replay |

The observed cost-report UI placeholders and financial-health service are **not** evidence of FKE certification or methodology implementation.

## 9. Shared Intelligence — SII treatment matrix
| IDs | Evidence summary | Provisional treatment | Next proof |
|---|---|---|---|
| SII-01 | CAP evidence and related entities | Modify candidate | Universal evidence provenance/ACL |
| SII-02 | Import validation engine | Investigate | Generalized governed validation execution |
| SII-03 | Multiple audit services | Modify/consolidate candidate | Unified immutable audit contract |
| SII-04 | RKE document generator | Modify/extract candidate | Generic document rendering boundary |
| SII-05–07 | Storage, change management, shared approval not established | Investigate / likely Build | Lifecycle, review and retention |
| SII-08 | Reporting/export candidates | Investigate | Shared reporting contract |
| SII-09 | Survey binder service reported empty | Build candidate | Universal binder lifecycle |
| SII-10–12 | External exchange, notifications, durable events not established | Investigate / likely Build | MFA, revocation, outbox/idempotency |
| SII-13 | Audit/recheck fragments; historical execution not established | Investigate / likely Build | Reproducible execution context |
| SII-14 | Security/audit context candidates | Modify candidate | End-to-end auth propagation |
| SII-15 | Health controller | Modify candidate | Metrics and incident operations |

## 10. Applied Intelligence — CI/FI treatment matrix
| IDs | Evidence summary | Provisional treatment | Next proof |
|---|---|---|---|
| CI-01–02 | Compliance engine and residential evaluators | Modify candidate | Replace hardcoded authority with certified RKE references where needed |
| CI-03 | Results entity/service/controller | Modify candidate | Version provenance, tenancy and history |
| CI-04–05 | Finding workspace, remediation, CAP evidence | Modify candidate | State machine, deep links, audit |
| CI-06 | Recheck-related code candidates | Investigate | Repeatable reassessment and prior-result linkage |
| CI-07 | Provider intelligence/dashboard services | Modify candidate | Provider-wide authorized scope |
| FI-01–09 | Financial ingestion through cost reporting not established | Investigate / likely Build | FKE-governed end-to-end financial slice |
| FI-10 | Finance and financial-health service candidates | Investigate | Calculation meaning, lineage, permissions |
| FI-11 | Financial binder handoff not established | Investigate / likely Build | Universal binder release integration |

## 11. Binder Management — BM treatment matrix
| IDs | Evidence summary | Provisional treatment | Next proof |
|---|---|---|---|
| BM-01–03 | No universal registry, lifecycle, manifest established | Investigate / likely Build | Durable tenant-scoped binder model |
| BM-04 | CAP evidence integration candidate | Modify/integrate candidate | Per-document ACL and provenance |
| BM-05–07 | Validation, approval, immutable release not established | Investigate / likely Build | State machine and release snapshot tests |
| BM-08 | Survey backend candidate | Investigate | External identity, MFA, expiry, revocation |
| BM-09 | Survey retrieval/export candidate | Investigate | Export, retention, redaction, audit |

## 12. User Experience — UX reconciliation
The earlier assessments establish Angular application shell, provider dashboard, module/entity workbenches, Residential and ISS workspaces. Their existence does not establish complete accessibility, security, or end-to-end behavior. Maintain `UX-01`–`UX-05` as provisional canonical family slots pending the ENG-022-to-ENG-008 mapping. **Do not invent specific one-to-one assignments.** Proposed treatment for existing shell/workbench code: **Modify candidate**, subject to route, NgRx, API contract, provider-wide scope, and accessibility verification. Survey/Financial Binder screens remain unverified end-to-end.

## 13. Cross-layer dependency gap register
| Gap | Severity* | Affected families | Required resolution | Evidence gate |
|---|---|---|---|---|
| DG-01 Certified rule resolution | Critical | RKE, CI, OP | Evaluators must bind to immutable applicable RKE version | RKE → CI vertical test |
| DG-02 Financial methodology authority | Critical | FKE, FI | Establish FKE certification before regulated calculations | FKE → FI calculation test |
| DG-03 Tenant isolation | Critical | PF, all | Prove provider/location/document isolation | Negative access tests |
| DG-04 Cross-layer API/event contracts | High | All | Canonical owners, schemas, versions and consumers | Registry and contract tests |
| DG-05 Certification and separation of duties | Critical | RKE, FKE, SII | Authorized human review and immutable publication | Approval lifecycle tests |
| DG-06 Historical reproducibility | Critical | RKE, FKE, CI, FI, BM | Snapshot effective versions and execution context | Replay tests |
| DG-07 Durable events and retry | High | PF, SII, applied | Outbox/inbox, idempotency, DLQ policies | Fault-injection tests |
| DG-08 Universal binder lifecycle | High | SII, BM, UX | One shared lifecycle, type-specific manifests | Survey/financial binder tests |
| DG-09 External survey access | Critical | PF, BM, UX | MFA, scoped grants, revocation, audit | Access matrix tests |
| DG-10 Financial operational facts | High | OP, FI | Define payroll, transactions, service statistics contracts | Source-to-report trace |
| DG-11 UX canonical identifiers | Medium | UX, registry | Map ENG-022 extensions to ENG-008 UX slots | Approved alias register |
| DG-12 Build and migration evidence | Critical | All | Resolve offline dependency blocker and execute CI | Build/test/migration reports |

*Severity is an **assessment priority**, not a verified production incident rating.

## 14. Architecture boundary tests
1. RKE and FKE cannot import each other's internal modules.
2. OP owns source facts and must not determine regulated allowability/compliance requirements.
3. SII executes governed services but cannot certify knowledge autonomously.
4. CI consumes RKE-certified definitions; FI consumes FKE-certified methodologies.
5. BM manages manifests and access without bypassing source document ACLs.
6. UX uses API/data-access contracts rather than server internals.
7. Tenant, resource, knowledge-version, and correlation context survive cross-layer calls.

## 15. Treatment decision policy
- **Reuse:** Tests demonstrate required behavior and contracts with no material change.
- **Modify:** A verified asset provides a substantial compatible foundation but needs controlled changes.
- **Replace:** Demonstrated incompatibility or unacceptable remediation cost; requires migration/rollback plan.
- **Build New:** Comprehensive search establishes no suitable asset and an approved contract exists.
- **Investigate:** Evidence is insufficient; **default classification for unresolved items**.

No source-file presence alone justifies `Reuse`; no absence in a targeted scan alone justifies `Build New`.

## 16. Decision worksheet template
| Component ID | Canonical responsibility | Actual repository path(s) | Test evidence | Contract fit | Security fit | Treatment | Owner | Decision ID | Approval |
|---|---|---|---|---|---|---|---|---|---|
| _Populate after verification_ | | | | | | Investigate | TBD | TBD | Pending |

## 17. Dependency sequencing and work packages
| Wave | Proposed assessment/verification package | Entry requirement | Exit artifact |
|---|---|---|---|
| 0 | Contract and alias registry reconciliation | REC-001 policy approvals | Canonical mapping with signed exceptions |
| 1 | Executable repository baseline | Node/dependency access, isolated DB | Nx build/test and migration evidence |
| 2 | Security and foundational contracts | Verified PF inventory | Tenant/access/contract tests |
| 3 | RKE governed lifecycle | RKE schema and approval contracts | Certified Emergency Preparedness knowledge slice |
| 4 | Compliance vertical slice | RKE certified test pack | Source → evaluation → CAP → recheck evidence |
| 5 | FKE governed lifecycle | Financial authority sources and independent review | Certified Texas HCS cost-report knowledge pack |
| 6 | Financial vertical slice | FKE pack + OP financial facts | Source → allocation → report → reconciliation |
| 7 | Universal binders and external access | SII/BM security and release contracts | Survey and Financial Binder acceptance |
| 8 | ISS and enterprise expansion | Approved ISS contracts and verified dependencies | End-to-end ISS acceptance |

These are **dependency proposals**, not authorized sprint assignments or delivery estimates. Parallel work is permitted only when dependencies are satisfied and authorization is separately granted.

## 18. Verification plan
1. Preserve immutable archive fingerprint and manifest.
2. Inventory Nx project graph, aliases, exports, tags, and circular dependencies.
3. Execute `npm ci` in an approved environment; record dependency resolution, versions and logs.
4. Execute Nx lint/test/build targets; capture exact commands and failures.
5. Validate TypeORM migrations on disposable PostgreSQL; test rollback where supported.
6. Inspect and test all API endpoints, DTOs, guards and provider scope.
7. Run RKE validation, certification, version-resolution and historical tests.
8. Run FKE classification, allocation, decimal precision and historical tests.
9. Run compliance, financial, binder, ISS and survey vertical-slice tests.
10. Attach evidence, assign treatment, and obtain explicit decision approvals.

## 19. Acceptance gates
- **G1 Inventory complete:** Every canonical component has verified file/absence evidence and owner.
- **G2 Contracts reconciled:** Canonical component, API, event and alias registries approved.
- **G3 Runtime established:** Build/test/migration baseline reproducible; failures triaged.
- **G4 Security established:** Tenant isolation and access controls demonstrated.
- **G5 Vertical slices verified:** RKE/CI and FKE/FI, binder and ISS workflows tested.
- **G6 Treatment decisions approved:** Each component has an evidence-backed disposition.
- **G7 Implementation separately authorized:** Work-package scope, tests, migration and rollback signed off.

## 20. Decision and risk register
| ID | Decision or risk | Current status | Required action |
|---|---|---|---|
| DR-01 | REC-001 component alias mappings | Policy approved; mappings pending | Produce row-level canonical map |
| DR-02 | Event ID reconciliation | Policy approved; mappings pending | Reconcile EVT-001–042 with later specs |
| DR-03 | ENG-022 UX expansion | Pending | Resolve canonical identifiers |
| DR-04 | Sprint numbering 0–47 | Pending documentation correction | State 48 sprint slots |
| DR-05 | Early RKE certification vs shared approval timing | Pending | Approve dependency-safe sequence |
| DR-06 | Build verification blocked by offline dependencies | Open | Re-run in approved online environment |
| DR-07 | Financial reporting authoritative sources | Open | Verify actual reporting instructions and periods |
| DR-08 | Binder source ACL and external access | Open | Complete security threat model |

## 21. Deliverables required to close REC-002
- Complete component-to-file map with evidence references for all 92 canonical slots.
- Approved canonical alias, API, and event registry entries.
- Nx dependency graph and violations report.
- Build/test/migration evidence bundle.
- Component-level approved Reuse/Modify/Replace/Build New dispositions.
- Gap register with owner, priority, dependency, cost/effort confidence, and acceptance tests.
- Signed decision record explicitly separating architectural approval from implementation authorization.

## 22. Current conclusion
**REC-002 Sections 1–8 form a consolidated static assessment, not a closed reconciliation.** Existing compliance, operational and RKE source offers meaningful candidates for preservation. FKE, FI and universal Binder Management lack demonstrated end-to-end implementation in the reviewed evidence. No component is certified production-ready by this document. No repository edits or implementation authorization are granted.

## 23. Recommended next artifact
**REC-003 — Canonical Contract and Dependency Verification Register**: reconcile actual component IDs, API routes, event schemas, library dependencies, and knowledge-version references using source-backed evidence and executable tests.
