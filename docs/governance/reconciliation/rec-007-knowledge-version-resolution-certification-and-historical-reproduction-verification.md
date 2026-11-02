# REC-007 — Knowledge Version Resolution, Certification, and Historical Reproduction Verification

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document:** REC-007  
**Version:** 1.0 — Assessment Draft  
**Repository evidence:** `hhscCompliance-develop.zip` (uploaded source archive)  
**Assessment method:** Static inspection of selected source files  
**Implementation authorization:** **NOT GRANTED**  
**Build/test/runtime verification:** **NOT RUN** for this document  

> **Evidence discipline:** An existing model, method, or test file does not prove a complete operational capability. All proposed contracts below are design recommendations, not claims of implemented or formally ratified behavior.

## 1. Purpose

Verify that RKE and FKE can govern certified knowledge through source provenance, validation, independent review, certification, effective-dated resolution, publication, supersession, and historical replay.

## 2. Scope

RKE knowledge packs, FKE methodologies, shared approval infrastructure, applied determinations, audit and evidence, APIs, persistence, and operational/UX consumers.

## 3. Evidence Baseline

Source: uploaded `hhscCompliance-develop.zip`; static code inspection only. No npm install, database, API, build, test, or migration execution is claimed in this report.

## 4. Architecture Decisions

AD-002 engine independence; AD-003 certification; AD-004 effective dating and historical reproducibility; AD-005 cross-engine contracts; AD-009 knowledge-first development; AD-010 canonical registry; AD-011 security.

## 5. Verification Status Vocabulary

**SOURCE PRESENT** means a file/field is observed. **PARTIAL** means a subset of a capability is supported by inspected source. **NOT VERIFIED** means no demonstrated end-to-end capability. **NOT RUN** means no executable check. **GAP CANDIDATE** is not a proven runtime defect.

## 6. RKE Evidence Inventory

`libs/regulatory/knowledge/src/lib/models/knowledge-pack.model.ts`: metadata includes `version`, optional `effectiveDate`, `publishedAt`. `models/regulatory-source.model.ts`: source `version`, `status`, optional effective/expiration/published dates. `validators/knowledge-pack.validator.ts`: structural/reference validation. `loaders/knowledge-pack.loader.ts`: validates before register. `repositories/memory-knowledge.repository.ts`: Map-based storage. `services/knowledge-engine.service.ts`: getters for packs, rules, requirements, and related items.

## 7. RKE Version Model Assessment

**PARTIAL.** Version and temporal metadata exist. The inspected interfaces do not by themselves demonstrate immutable version IDs, a separate certification record, complete valid-time/transaction-time semantics, or a historical query API.

## 8. RKE Validator Assessment

**SOURCE PRESENT.** The validator checks metadata, duplicate IDs, and references. Its successful result is structural validation, **not** independent human certification, authorization to publish, or evidence that a regulation is legally accurate.

## 9. RKE Loader Assessment

**SOURCE PRESENT.** `load` validates and calls repository `register`; `loadMany` validates inputs before registration. Publication authorization, immutable artifact signing, and version-aware activation are **NOT VERIFIED**.

## 10. In-Memory Persistence Finding

**OBSERVED SOURCE BEHAVIOR:** `MemoryKnowledgeRepository.register(pack)` calls `unregister(pack.metadata.id)` before storing the new pack in `Map<string, KnowledgePack>`. Consequently, loading a new pack with the same ID removes the previous pack from this in-memory store. This is a specific limitation of the inspected implementation; it does not establish that no other persistent historical store exists elsewhere.

## 11. Regulatory Source Provenance

**PARTIAL.** Source model includes publisher, jurisdiction, version, source URL, and dates. Verify primary-source snapshot, content hash, retrieval timestamp, authority, amendment chain, reviewer evidence, and citations to individual requirements.

## 12. FKE Evidence Status

**NOT VERIFIED.** Prior REC-002 Section 4 identified financial UI placeholders and a financial-health service; a complete independent FKE certification, methodology version registry, and effective-dated resolver were not established. No absence claim is made beyond inspected evidence.

## 13. Independent Approval Chains

RKE and FKE must each define author/reviewer/certifier permissions and separation of duties. Shared approval infrastructure may execute workflows but must not become the substantive certifying authority. Verify user identity, conflict checks, approval signatures, reasons, and revocation.

## 14. Certification State Machine

Proposed: `DRAFT → VALIDATING → VALIDATED → IN_REVIEW → CERTIFIED → SCHEDULED/PUBLISHED → SUPERSEDED → RETIRED`. Rejection returns to a new draft revision; published certified artifacts remain immutable. State transitions must be guarded and auditable. **PROPOSED, NOT IMPLEMENTED/APPROVED CONTRACT.**

## 15. Three Temporal Dimensions

Track **valid time** (legal/business applicability), **publication/availability time** (when platform offered version), and **transaction/recorded time** (when the platform knew/recorded it). A supersession date alone must not erase prior temporal meaning.

## 16. Effective-Dated Resolver Contract

Proposed input: `{authority, knowledgeType, jurisdiction, program, subject, applicableAt, knownAt?, tenantScope?, purpose}`. Output: immutable certified version ID, applicability rationale, provenance, validity interval, publication interval, and warnings/ambiguities. Never silently default to latest.

## 17. Resolver Precedence

Verify explicit rules for overlapping effective intervals, retroactive corrections, gaps, jurisdiction/program precedence, and multi-authority conflicts. Ambiguous matches must block regulated determinations or request authorized adjudication.

## 18. Knowledge Artifact Identity

Use stable logical definition ID plus unique immutable revision ID, content digest, source snapshot digest, schema version, and certification record ID. Human-readable semantic versions alone are insufficient to establish identity.

## 19. Immutable Publication

Certified artifact content must be immutable. Any amendment creates a new revision with explicit lineage, effective interval, approval record, and controlled publication event.

## 20. Historical Determination Snapshot

Persist evaluated subject, tenant, operational evidence references and hashes, knowledge artifact IDs/digests, effective date, engine version, evaluator version, inputs, output, decision time, and actor/correlation ID. Sensitive data must be appropriately protected.

## 21. Historical Reproduction

Replaying a 2026 assessment in 2028 must select the same applicable certified rule revision and operational snapshot, not whatever is current in 2028. Where deterministic replay is impossible, record the reason and provide verifiable original determination evidence.

## 22. Financial Historical Reproduction

Financial calculations must retain certified methodology ID/version, allocation bases, source ledger snapshots, precision/rounding policy, reporting period, classification outcomes, adjustment history, and approval evidence. Rates must be verified from authoritative sources; do not invent them.

## 23. Cross-Engine Reference Integrity

Cross-engine consumers may store explicit references to each other’s published artifacts but cannot edit their definitions. Reject stale or unresolved references according to contract; record both version identities where determinations depend on both.

## 24. Operational Reassessment

New knowledge publication may queue prospective reassessment, but must not silently rewrite historical findings, released binders, or financial reports. Historical corrections require a separate authorized amendment with full audit lineage.

## 25. Publication Events

Proposed event types: validation completed, review requested, certification granted/rejected, knowledge published, knowledge superseded, resolver conflict, reassessment requested. Canonical IDs and schemas remain pending REC-001/REC-003 reconciliation.

## 26. Event Reliability

Publication and certification state transitions should use transactionally consistent events (e.g., outbox), idempotent consumers, replay policy, tenant-safe correlation, and dead-letter recovery. REC-006 did not verify this infrastructure.

## 27. Authorization and Tenant Isolation

Verify global vs tenant-specific knowledge visibility, scoped approval permissions, restricted source access, publisher roles, separation of duties, service-to-service authorization, and audit of denied publication attempts.

## 28. Audit and Evidence

Every lifecycle transition must capture actor, timestamp, reason, prior/new revision, source evidence, validation output, approval signature, and correlation ID. Audit log availability is not proof of full traceability.

## 29. RKE Verification Matrix

| Check | Evidence | Status |
| Metadata version/effective date | `knowledge-pack.model.ts` | SOURCE PRESENT |
| Source provenance fields | `regulatory-source.model.ts` | PARTIAL |
| Structural validation | `knowledge-pack.validator.ts` | SOURCE PRESENT |
| Loader validation gate | `knowledge-pack.loader.ts` | SOURCE PRESENT |
| Immutable history store | In-memory replacement observed | NOT VERIFIED |
| Independent certification | No end-to-end evidence established | NOT VERIFIED |
| Effective-dated resolver | No end-to-end evidence established | NOT VERIFIED |
| Historical replay | No end-to-end evidence established | NOT VERIFIED |

## 30. FKE Verification Matrix

| Check | Status | Required evidence |
| Methodology version model | NOT VERIFIED | Models/schema and migrations |
| Certified rate/formula version | NOT VERIFIED | Authoritative source and approved artifact |
| Financial certification workflow | NOT VERIFIED | Transition guards and audit |
| Reporting-period resolver | NOT VERIFIED | Resolver API and tests |
| Historical financial reproduction | NOT VERIFIED | Replay fixtures and reconciled output |

## 31. Proposed Test Fixtures

Fixtures: two versions with adjacent dates; overlapping versions; missing period; retroactive rule; future publication; revoked draft; certifier same as author; cross-tenant query; altered digest; superseded methodology; locked financial binder; historical replay with changed operational source.

## 32. Test Execution Plan

After approved verification authorization and available dependencies: inspect TypeScript/Jest tests; run targeted knowledge validator/loader suites; verify migrations against disposable PostgreSQL; test approval guards, publication, version resolver, and replay with deterministic fixtures. Record exact command, environment, output, and commit/archive hash.

## 33. Data Migration Strategy

Design versioned persistent knowledge tables and append-only certification/audit records; backfill source and logical IDs with explicit provenance; never invent prior certifications or effective dates. Validate existing active knowledge before cutover.

## 34. API Contract Work

Define versioned endpoints for draft, validate, submit, review, certify, publish, supersede, resolve-at-date, retrieve revision, and historical reproduction. Explicit RBAC/ABAC and DTO validation are mandatory. Endpoint paths are proposals until REC-003 approval.

## 35. Risk Register

**HIGH:** in-memory replacement does not preserve multiple pack versions by ID. **HIGH:** certification workflow not demonstrated. **HIGH:** effective-dated resolver/replay not demonstrated. **HIGH:** FKE end-to-end capability not demonstrated. **MEDIUM:** source provenance completeness; event delivery; publication authorization. Ratings are provisional architectural risks, not production incident claims.

## 36. Treatment Recommendations

**Reuse candidate:** RKE models, validator, loader, knowledge service and Texas HCS pack where tests and contract reviews pass. **Modify candidate:** storage/versioning and loader publication boundaries. **Build candidate:** certification lifecycle, persistent immutable version store, temporal resolver, historical replay, FKE governed methodology. All classifications are provisional pending executable verification and approval.

## 37. Acceptance Criteria

Certification requires independently authorized sign-off; resolver chooses correct version for historical and future dates; conflicting applicability fails safely; immutable certified artifact cannot be edited; prior version remains retrievable after supersession; tenant isolation passes; historical replay matches stored evidence; all decisions are auditable.

## 38. Exit Gates

G1 canonical contract approved; G2 source provenance verified; G3 authorization and separation of duties verified; G4 immutable persistence and temporal resolution verified; G5 historical RKE/FKE replay verified; G6 migration/rollback and operational monitoring verified. **None claimed passed here.**

## 39. Open Decisions

Define canonical revision IDs and temporal query semantics; certification role matrix; whether publication and effective activation are separate; correction/revocation semantics; FKE authoritative source strategy; retention periods; event contracts; deployment/migration plan.

## 40. Next Deliverable

REC-008 — Historical Determination and Knowledge Certification Contract Specification, or targeted executable verification of REC-007 once architecture contracts and dependencies are available. No implementation authorization granted.
