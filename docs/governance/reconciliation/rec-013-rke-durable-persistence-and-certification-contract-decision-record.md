# REC-013 — RKE Durable Persistence and Certification Contract Decision Record

**Proposed repository path:** `docs/governance/reconciliation/rec-013-rke-durable-persistence-and-certification-contract-decision-record.md`

## 1. Purpose

Define decision-ready contracts for durable RKE knowledge history, separated approval authority, temporal selection, and traceable integration. This is a proposal for technical ratification, not an implementation instruction.

## 2. Document control

Program: McCaskill Projects Regulatory Intelligence Platform. Version: 1.0 decision draft. Evidence baseline: REC-012 and `hhscCompliance-develop.zip`. Status: PROPOSED / NOT RATIFIED. Implementation authorization: NOT GRANTED.

## 3. Evidence baseline

REC-012 identifies metadata, validation, loading, and an in-memory adapter; no durable version history, certification workflow, or temporal resolver was established in inspected scope. Static inspection cannot establish deployed behavior.

## 4. Governing architecture

Apply AD-001–AD-012 and REC-001 D1–D5 as governing principles. RKE and FKE remain independent knowledge authorities; operational facts remain outside RKE; Shared Intelligence supplies reusable approval/audit plumbing without owning regulatory truth.

## 5. Decision register overview

Decisions RKE-D01 through RKE-D15 below are proposed. Each requires an accountable approver, dated decision, rationale, alternatives, and acceptance evidence. Architectural principles already approved do not automatically ratify these field-level contracts.

## 6. RKE-D01 — Identity model

**Proposed:** distinguish stable `packId` from immutable `versionId`, human-readable `versionLabel`, `artifactDigest`, and `certificationId`. Never use a mutable label alone as a replay key. **Approval:** pending.

## 7. RKE-D02 — Durable storage

**Proposed:** PostgreSQL/TypeORM metadata records with immutable content payload storage and integrity digests. Exact physical storage location (DB JSONB vs content-addressed object store) remains an explicit open choice. **Approval:** pending.

## 8. RKE-D03 — Append-only publication

**Proposed:** publication creates immutable revision records; corrections produce new revisions and supersession links, not edits to published payloads. Permit administrative revocation metadata without deleting historical evidence. **Approval:** pending.

## 9. RKE-D04 — Approval separation

**Proposed:** author, reviewer, and certifier must be distinct principals for the same release, with explicit scoped permission and recorded evidence. An automated validator cannot certify. **Approval:** pending.

## 10. RKE-D05 — Validation vs certification

**Proposed:** structural and semantic validation produce a versioned validation report; certification is an independently authorized attestation of the reviewed content digest and source basis. **Approval:** pending.

## 11. RKE-D06 — Time semantics

**Proposed:** distinguish regulation effective interval (`validFrom`, `validTo`), knowledge publication time (`publishedAt`), and system knowledge/recorded time (`recordedAt`). A retroactively effective rule must not masquerade as known earlier. **Approval:** pending.

## 12. RKE-D07 — Deterministic resolver

**Proposed:** resolve by jurisdiction, program, scope, applicableAt and knownAt, returning one immutable certified/published revision or a typed gap/ambiguity error. No silent latest-version fallback. **Approval:** pending.

## 13. RKE-D08 — Snapshot provenance

**Proposed:** store authoritative source identifiers, URLs, retrieved/observed timestamps, content digests, amendment relationships, and reviewed excerpts/locations. Source availability and licensing must be evaluated. **Approval:** pending.

## 14. RKE-D09 — Tenant boundary

**Proposed:** regulatory knowledge may be globally shared by authorized scope; tenant-specific overlays, if supported, require explicit namespace and authorization. No tenant may mutate global certified artifacts. **Approval:** pending.

## 15. RKE-D10 — API versioning

**Proposed:** publish `/api/v1/regulatory/knowledge/...` routes only after DTO, guard, registry, and backward compatibility review. Names are illustrative pending REC-001 canonical contract registry mapping. **Approval:** pending.

## 16. RKE-D11 — Events

**Proposed:** durable outbox events for certification, publication, supersession, and withdrawal; event names and IDs require canonical registry ratification. Consumers are idempotent and cannot infer approval from mere loader success. **Approval:** pending.

## 17. RKE-D12 — Historical replay

**Proposed:** each determination records immutable knowledge revision/digest, resolver context, evaluator build, operational input digest and evidence references; replay must distinguish exact computational reproduction from evidence-based reconstruction. **Approval:** pending.

## 18. RKE-D13 — Migration strategy

**Proposed:** introduce persistence alongside the current in-memory interface, backfill only provable source/version metadata, and explicitly mark unverified historical approvals as absent. No fabricated certification records. **Approval:** pending.

## 19. RKE-D14 — Retention and legal hold

**Proposed:** certified artifacts and determination manifests follow documented retention/legal hold policy with access control and encryption; exact periods require legal/compliance approval. **Approval:** pending.

## 20. RKE-D15 — Release gate

**Proposed:** no production publication or compliance evaluation using newly certified versions until acceptance tests, security review, migrations, rollback plan, and authority sign-off are recorded. **Approval:** pending.

## 21. Canonical logical records

`KnowledgePackIdentity`, `KnowledgePackVersion`, `KnowledgeArtifact`, `SourceSnapshot`, `ValidationReport`, `CertificationDecision`, `PublicationRecord`, `SupersessionLink`, `ResolutionTrace`, and `DeterminationManifest` are proposed logical contracts—not observed database tables.

## 22. Immutable revision fields

Minimum fields: `versionId`, `packId`, `schemaVersion`, `versionLabel`, `jurisdiction`, `program`, `contentDigest`, `validFrom`, `validTo?`, `recordedAt`, `createdBy`, `sourceSnapshotIds[]`, `lifecycleState`, `certificationId?`. Content hash covers canonical serialized payload.

## 23. Certification record fields

Minimum fields: `certificationId`, `versionId`, `reviewedDigest`, `validationReportId`, `reviewerId`, `certifierId`, `decision`, `decisionAt`, `authorityScope`, `rationale`, `evidenceRefs[]`, `signatureProof`, `correlationId`. Certification must bind to exact digest.

## 24. Proposed lifecycle

`DRAFT → VALIDATING → VALIDATED → IN_REVIEW → CERTIFIED → SCHEDULED → PUBLISHED → SUPERSEDED`. Rejection returns a new/revised draft; withdrawal/revocation is recorded as a separate immutable event. Transitions and permissions require ratification.

## 25. Approval command invariants

Commands require actor identity, permission scope, expected version/ETag, idempotency key, reason, and audit correlation. Reject self-certification, mismatched digest, stale revision, missing source evidence, and publication without certification.

## 26. Publication atomicity

A publication transaction must commit publication metadata, exclusivity/overlap checks, and an outbox record together. Payload storage integrity must be verified before visibility. Failures cannot leave a partially visible release.

## 27. Temporal resolver request

Inputs: `authority=RKE`, `jurisdiction`, `program`, `subject`, `scope`, `applicableAt`, `knownAt`, `purpose`, `tenantContext?`. Date/time timezone and interval boundary conventions must be canonicalized; use UTC instants and half-open intervals where appropriate.

## 28. Temporal resolver response

Outputs: `versionId`, `packId`, `contentDigest`, `certificationId`, `validInterval`, `publishedAt`, `recordedAt`, `sourceSnapshotIds`, `resolverVersion`, `selectionRationale`, `warnings[]`, `resolutionTraceId`. Failure is typed and auditable.

## 29. Overlaps, gaps, and corrections

Overlapping eligible versions with equal specificity yield `AMBIGUOUS_VERSION`, not arbitrary selection. Missing applicable coverage yields `NO_CERTIFIED_VERSION`. Retroactive corrections must preserve prior knownAt answers and show supersession lineage.

## 30. Historical determination manifest

Record `determinationId`, `tenantId`, `subjectRef`, `evaluatedAt`, `applicableAt`, `knownAt`, `knowledgeVersionId`, `knowledgeDigest`, `evaluatorVersion`, `inputSnapshotDigest`, `evidenceRefs[]`, `outputDigest`, `decision`, `correlationId`, and optional binder reference. Never store raw PHI in general-purpose event payloads.

## 31. Reproducibility levels

**Exact replay:** original evaluator and normalized inputs available, matching digests. **Evidentiary reconstruction:** same historical version and supporting records but original runtime unavailable. **Not reproducible:** missing required artifacts; report the deficiency rather than simulate a match.

## 32. Financial boundary

FKE owns financial methodology and rate/classification revisions. RKE certification cannot certify FKE artifacts. Cross-engine determinations retain separate immutable RKE and FKE references; no assumed rate or regulatory interpretation is introduced here.

## 33. Database constraints

Candidate uniqueness: immutable `versionId`; unique `(packId, versionLabel)` within defined namespace; content-digest verification; foreign keys from certification/publication to exact version; restricted updates/deletes. Temporal exclusion constraint strategy requires design review.

## 34. Authorization matrix

Draft: knowledge author; validate: authorized service; review: designated reviewer; certify: independent certifier; publish: publisher with release authority; resolve: scoped service; inspect history: authorized auditor. Every action is tenant/authority scoped and audited.

## 35. Audit and outbox contracts

Write immutable audit entries for lifecycle transitions, failed authorization, resolver decisions, and correction actions. Outbox event envelope includes `eventId`, `eventType`, `schemaVersion`, `occurredAt`, `aggregateId`, `correlationId`, `actorRef`, `payloadDigest`. Avoid sensitive source content in event envelopes.

## 36. Illustrative REST surface

Candidate routes: `POST /api/v1/regulatory/knowledge/versions`, `POST .../versions/:id/validate`, `POST .../versions/:id/submit-review`, `POST .../versions/:id/certify`, `POST .../versions/:id/publish`, `POST .../resolve`, `GET .../versions/:id`, `GET .../determinations/:id/manifest`. All pending API registry ratification.

## 37. Nx ownership mapping

Current evidence paths include `libs/regulatory/knowledge/src/lib/...` and empty `server/src/app/regulatory/knowledge/{controller,module,service}.ts` in the inspected snapshot. Proposed persistence adapters must honor approved Nx dependency direction; exact new library names require project inventory verification.

## 38. Existing adapter compatibility

`MemoryKnowledgeRepository.register(pack)` unregisters the prior pack with the same ID; it is not an immutable archive. Preserve current interface for development where needed, but do not present it as the historical authority. Add separate immutable repository/resolver interfaces rather than silently changing semantics.

## 39. Migration phases

Phase 0 verify live schema and migration history; Phase 1 add additive tables and immutable storage; Phase 2 shadow-write and verify digests; Phase 3 implement independent certification; Phase 4 enable read-only temporal resolution; Phase 5 gate publication; Phase 6 backfill only documented lineage. Each phase requires rollback and sign-off.

## 40. Failure modes and recovery

Handle hash mismatch, object storage unavailability, certification conflict, duplicate publish, event delivery retry, clock skew, ambiguous version, expired source, and tenant access violation. Fail closed for determinations requiring certified knowledge; retain incident/audit evidence.

## 41. Acceptance criteria — persistence

Demonstrate two published revisions for one logical pack remain independently retrievable by immutable IDs; digests match stored payloads; supersession preserves prior revision; unauthorized mutation is denied; backup/restore preserves lineage.

## 42. Acceptance criteria — certification

Demonstrate validation alone cannot publish; self-review/self-certification is rejected; reviewed digest mismatch is rejected; authorization scopes are enforced; decision evidence and signatures survive restore; concurrency yields one consistent transition.

## 43. Acceptance criteria — temporal resolution

Demonstrate as-of applicable date and known-at date independently change selection; gaps/overlaps are typed errors; retroactive amendment does not rewrite earlier knowledge state; deterministic repeat queries return identical revision/digest.

## 44. Acceptance criteria — replay

Demonstrate a historical determination retains version/digest/evaluator/input evidence; later publication does not alter stored manifest; replay reports exact/evidentiary/unavailable status accurately; binder reference remains linked to immutable determination.

## 45. Security and privacy gates

Require threat model, service/tenant authorization tests, least-privilege database roles, encryption at rest/in transit, PHI minimization, tamper detection, retention review, and audit visibility controls before production authorization.

## 46. Verification evidence ledger

For every gate record: test ID, commit SHA, migration revision, environment, fixture provenance, executor, execution time, result, logs/artifact digest, reviewer, and exception disposition. `NOT RUN` is not `PASS`.

## 47. Unresolved choices

Approve physical payload storage; canonical temporal boundaries; regulatory source authority hierarchy; certification signer and revocation policy; cross-jurisdiction scope specificity; release visibility timing; tenant overlays; retention periods; event IDs; exact API paths.

## 48. Decision approval template

For each RKE-D## capture: `decision`, `approved|rejected|deferred`, accountable owner, approver, date, rationale, alternatives considered, impacted contracts, migration implications, security review, acceptance tests, and follow-up deadline.

## 49. Risks and mitigations

Major risks: false historical certification, mutable content, retroactive-rule confusion, split-brain publication, tenant leakage, and unrepeatable findings. Mitigate with immutable digests, separated approvals, bitemporal queries, atomic outbox, scoped authorization, and replay manifests.

## 50. Traceability

REC-007 establishes version/history gaps; REC-008 proposes contract shapes; REC-009 defines acceptance matrix; REC-010 summarizes readiness; REC-011 and REC-012 provide static RKE source evidence. Cross-reference exact contract IDs when registry mapping is approved.

## 51. Approval and implementation boundary

This document is a **decision proposal**. No proposed table, route, event, state transition, or policy is claimed to exist. No migrations, code changes, deployment, or implementation authority are granted by drafting or reviewing this record.

## 52. Next artifact

**REC-014 — RKE Contract Ratification Register and Migration Readiness Checklist**: map each RKE-D## choice to owners, evidence, approval state, concrete repository touchpoints, test IDs, and go/no-go gates.
