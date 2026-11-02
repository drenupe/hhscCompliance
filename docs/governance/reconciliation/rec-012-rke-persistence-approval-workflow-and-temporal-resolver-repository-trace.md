# REC-012 — RKE Persistence, Approval Workflow, and Temporal Resolver Repository Trace

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Evidence Assessment Draft  
**Source examined:** `hhscCompliance-develop.zip` (uploaded repository snapshot)  
**Proposed path:** `docs/governance/reconciliation/rec-012-rke-persistence-approval-workflow-and-temporal-resolver-repository-trace.md`  
**Implementation authorization:** NOT GRANTED  
**Assessment method:** Static examination of archived source and migration filenames and targeted source contents; no application execution or database inspection.

## 1. Purpose

Trace the proposed Regulatory Knowledge Engine (RKE) persistence, certification/approval, and effective-dated resolution responsibilities to actual repository files. Distinguish observed code from unverified capabilities, and identify contracts that must be ratified before implementation.

## 2. Assessment scope and limitations

The archive was inspected read-only. Findings apply only to this snapshot, not to deployed services or later branches. File existence does not prove successful compilation, database schema application, endpoint security, or runtime behavior. Negative findings mean **not identified in the inspected repository scope**, not proof that an equivalent capability cannot exist externally.

## 3. Executive findings

| Capability | Repository evidence | Assessment |
|---|---|---|
| Knowledge metadata | `libs/regulatory/knowledge/src/lib/models/knowledge-pack.model.ts` | Present: `id`, `version`, `effectiveDate`, `publishedAt` |
| Knowledge repository contract | `.../repositories/knowledge-repository.interface.ts` | Present; keyed primarily by pack ID, no version/effective-date resolution methods |
| Knowledge storage adapter | `.../repositories/memory-knowledge.repository.ts` | Present; in-memory Maps, not durable history |
| Knowledge validation and loading | `.../validators/knowledge-pack.validator.ts`; `.../loaders/knowledge-pack.loader.ts` | Source present; integration and execution not verified |
| Backend RKE controller/module/service | `server/src/app/regulatory/knowledge/` | Three files exist but contain no implementation text in this archive |
| RKE database migration | `server/migrations/` | No migration identified by filename or inspected text as defining knowledge-pack persistence |
| Certification workflow | Backend migration/entity/service inspection | No RKE certification persistence or workflow identified |
| Temporal resolver | RKE repository interface and backend inspection | No effective-dated resolver contract identified |
| Historical replay | RKE persistence/contract inspection | Not established |

## 4. Verified RKE source paths

- `libs/regulatory/knowledge/src/lib/models/knowledge-pack.model.ts`
- `libs/regulatory/knowledge/src/lib/repositories/knowledge-repository.interface.ts`
- `libs/regulatory/knowledge/src/lib/repositories/memory-knowledge.repository.ts`
- `libs/regulatory/knowledge/src/lib/loaders/knowledge-pack.loader.ts`
- `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.ts`
- `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.ts`
- `libs/regulatory/knowledge/src/lib/services/regulatory-knowledge.service.ts`
- `libs/regulatory/knowledge/src/lib/packs/texas-hcs/texas-hcs.knowledge-pack.ts`
- `server/src/app/regulatory/knowledge/regulatory-knowledge.controller.ts`
- `server/src/app/regulatory/knowledge/regulatory-knowledge.module.ts`
- `server/src/app/regulatory/knowledge/regulatory-knowledge.service.ts`

## 5. Model metadata trace

`KnowledgePackMetadata` defines `id`, `code`, `name`, `jurisdiction`, `industry`, `version`, optional `effectiveDate`, optional `publishedAt`, and other descriptive fields. These metadata fields are necessary but insufficient for immutable certification and bitemporal audit: they do not themselves prove content hashing, approved version state, certification actor, supersession history, or durable retention.

## 6. Repository interface trace

The `KnowledgeRepository` interface exposes `register(pack)`, `unregister(packId)`, `clear()`, `hasPack(packId)`, `getPack(packId)`, `getAllPacks()`, and lookup methods for rules and other elements. It does **not** expose version-specific retrieval, `resolveAsOf`, immutable publication, certification-state transition, or historical snapshot retrieval in the inspected contract.

## 7. In-memory behavior trace

`MemoryKnowledgeRepository.register(pack)` calls `this.unregister(pack.metadata.id)` before `this.packs.set(pack.metadata.id, pack)`. Thus a second pack with the same ID replaces the first in that adapter. Other element Maps are keyed by their element IDs. The adapter is a useful development abstraction but cannot by itself meet immutable historical-version retention requirements.

## 8. Backend integration trace

The three files under `server/src/app/regulatory/knowledge/` are present but empty in the uploaded archive. No runtime API route, dependency-injection provider, approval endpoint, or persistence integration can be credited to those files. A separate working implementation elsewhere would require additional evidence.

## 9. Migration trace

The archive contains TypeORM migrations for operational, security, audit, and compliance domains. A targeted search of server migrations, entity files, and service files did not identify a knowledge-pack table, knowledge certification entity, or historical knowledge-version migration. Some unrelated operational entities use effective dates; these are not evidence of an RKE temporal resolver. The live database was not inspected.

## 10. Approval infrastructure trace

Security roles/permissions and audit infrastructure exist elsewhere in the backend, including `server/migrations/1800000000222-CreateSecurityRolesPermissions.ts`, `.../1800000000223-CreateAuditLogs.ts`, and `server/src/app/audit/`. These are potential shared foundations, **not evidence of an implemented RKE author-reviewer-certifier workflow**. No RKE-specific approval state machine was identified in this inspection.

## 11. Required authority boundaries

- RKE owns regulatory definitions and certification status.
- Platform Foundation authenticates and authorizes actors.
- Shared Intelligence may execute approvals and audit capture without becoming regulatory authority.
- Applied Intelligence references immutable certified knowledge versions.
- Operational domains retain factual source records; they do not certify regulatory definitions.

## 12. Proposed durable knowledge schema (design only)

| Proposed record | Key attributes | Purpose |
|---|---|---|
| `knowledge_pack_identity` | pack ID, jurisdiction, program | Stable logical identity |
| `knowledge_pack_version` | version ID, pack ID, semantic version, content hash, effective interval, published timestamp, state | Immutable revision |
| `knowledge_pack_artifact` | version ID, canonical payload reference, digest | Reproducible content |
| `knowledge_certification` | version ID, author, reviewer, certifier, decisions, timestamps | Segregated approval evidence |
| `knowledge_publication` | version ID, publication event, supersession linkage | Publication history |
| `knowledge_resolution_log` | requested period, as-of timestamp, selected version, resolver version | Determination trace |

These are **proposed contracts**, not existing database tables. Names and schema types require approval and migration design.

## 13. Proposed lifecycle (design only)

`Draft → Validated → Under Review → Certified → Published → Superseded` with explicit rejected/withdrawn paths. Certification and publication are separate authorized transitions. Previously published versions must remain queryable even after supersession; content must not be overwritten in place.

## 14. Proposed temporal resolution contract

Input: knowledge authority, pack identity, jurisdiction/program, applicability context, target effective date or period, publication-as-of cutoff, and authorization context. Output: exact immutable version ID, content digest, effective interval, publication timestamp, source provenance, and a deterministic resolution explanation. Ambiguous or missing versions must produce an explicit error or review-required result, not silent fallback to the latest version.

## 15. Proposed determination snapshot contract

Capture `determinationId`, tenant/provider scope, assessment period, exact knowledge version and digest, evaluator version, input evidence identifiers and hashes, evaluation timestamp, output digest, and audit correlation ID. Any later correction produces a new auditable determination revision; the original remains intact.

## 16. Source-to-contract gap matrix

| ID | Requirement | Observed source | Gap status | Provisional treatment |
|---|---|---|---|---|
| RKE-G01 | Durable pack/version persistence | In-memory repository | Open | Build durable adapter; retain interface where useful |
| RKE-G02 | Immutable version identity | Metadata `version` | Open | Extend version model/contract |
| RKE-G03 | Author-reviewer-certifier segregation | Shared auth/audit only | Open | Design workflow integration |
| RKE-G04 | Publication and supersession | `publishedAt` metadata only | Open | Build governed lifecycle |
| RKE-G05 | Effective-dated resolver | No resolver interface | Open | Define and implement after authorization |
| RKE-G06 | Publication-as-of selection | Not identified | Open | Add temporal contract |
| RKE-G07 | Historical replay | No retained snapshot contract | Open | Define replay records |
| RKE-G08 | Backend API integration | Empty backend RKE files | Open | Integrate via approved contracts |
| RKE-G09 | Tenant/role enforcement | Generic security foundations | Open | Verify and enforce per operation |
| RKE-G10 | Migration and rollback | No RKE-specific migration identified | Open | Design migration plan |

Treatments are recommendations, not implementation approvals.

## 17. Dependency and migration sequence

1. Ratify RKE persistence and temporal contracts against ENG-016, REC-008, and AD-001–012.
2. Reconcile canonical API/event ownership under REC-001 and REC-003.
3. Validate existing auth, audit, TypeORM configuration, and data migration conventions.
4. Design additive durable schema with immutable version records and safe migration/rollback.
5. Integrate segregated certification and publication transitions.
6. Add deterministic resolver, version pinning, and historical snapshot capture.
7. Execute authorization, concurrency, replay, and failure-injection tests.
8. Approve a bounded implementation work package separately.

## 18. Verification matrix (not executed)

| Test | Expected evidence | Execution |
|---|---|---|
| Publish two versions with same logical pack ID | Both retrievable by immutable version ID | NOT RUN |
| Unauthorized certification attempt | Denied and audited | NOT RUN |
| Author attempts to self-certify | Denied under separation-of-duties policy | NOT RUN |
| Resolve date before/after effective transition | Correct version selected | NOT RUN |
| Backdated publication correction | Bitemporal selection respects publication-as-of | NOT RUN |
| Concurrent publication | Deterministic conflict handling | NOT RUN |
| Replay prior determination | Same outputs and version digests | NOT RUN |
| Modify certified artifact | Immutable write rejected | NOT RUN |
| Tenant boundary violation | Denied with no information leakage | NOT RUN |
| Migration up/down in disposable database | Documented, reproducible outcome | NOT RUN |

## 19. Decision register

- **REC-012-D1:** Durable append-only knowledge-version storage model — PENDING.
- **REC-012-D2:** RKE certification and publication state machine — PENDING.
- **REC-012-D3:** Effective-time plus publication-as-of resolver semantics — PENDING.
- **REC-012-D4:** Historical determination snapshot contract — PENDING.
- **REC-012-D5:** Backend API and event contract integration — PENDING.

## 20. Closure conditions

REC-012 may close only after owners approve contracts, repository mappings are confirmed, relevant migrations and services are examined with executable evidence, and required acceptance tests pass or receive documented exception approvals. Current status: **OPEN — STATIC EVIDENCE ASSESSED; RUNTIME UNVERIFIED**.

## 21. Next recommended section

**REC-013 — RKE Durable Persistence and Certification Contract Decision Record.** This should resolve the five pending REC-012 design decisions before any code changes.

---

**No files in the uploaded repository were modified. No builds, migrations, or runtime tests were executed. Implementation authorization is NOT GRANTED.**
