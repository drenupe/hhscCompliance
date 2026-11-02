# REC-008 — Historical Determination and Knowledge Certification Contract Specification

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document ID:** REC-008  
**Version:** 1.0 — Proposed Contract Draft  
**Proposed repository path:** `docs/governance/reconciliation/rec-008-historical-determination-and-knowledge-certification-contract-specification.md`  
**Primary input:** REC-007 and approved architecture decisions AD-001–AD-012  
**Repository evidence:** `hhscCompliance-develop.zip`, as previously inspected in REC-007  
**Contract ratification:** PENDING  
**Implementation authorization:** NOT GRANTED  
**Executable verification:** NOT RUN

> This specification defines **proposed** contracts, not implemented interfaces or verified runtime behavior. Identifiers, field names, HTTP routes, and event names are provisional until reconciled with the canonical registry under REC-001/REC-003.

## 1. Purpose

Define the minimum interoperable contracts needed to certify and publish immutable Regulatory Knowledge Engine (RKE) and Financial Knowledge Engine (FKE) definitions, resolve the correct effective-dated versions, record applied determinations, and reproduce historical outcomes with complete provenance.

## 2. Scope and exclusions

**In scope:** authority boundaries, knowledge artifacts, lifecycle transitions, approval evidence, temporal resolution, determination manifests, correction/supersession, storage constraints, APIs, events, authorization, idempotency, tests, migration and acceptance gates. **Out of scope:** actual Texas regulatory content, cost-report formulas/rates, UI designs, database migration execution, and implementation authorization.

## 3. Source-derived findings versus proposed design

REC-007 identifies RKE knowledge-pack metadata (`version`, optional `effectiveDate`, `publishedAt`), regulatory source metadata, validator and loader source, and a Map-based in-memory repository. REC-007 does **not** establish durable immutable history, independent certification, complete FKE governance, or replay of past determinations. The contracts in this document are **proposals** to close those verification gaps.

## 4. Binding architectural decisions

- **AD-002:** RKE and FKE remain independent authorities.
- **AD-003:** authorized human review, certification, and publication governance.
- **AD-004:** effective dating, immutable version references, and historical reproducibility.
- **AD-005:** versioned cross-engine contracts with provenance.
- **AD-007:** operational domains own source facts; Knowledge Engines own definitions.
- **AD-009:** knowledge-first regulated feature development.
- **AD-010:** one technical contract registry, without transferring regulated authority.
- **AD-011:** tenant isolation, authorization, audit and secure external access.

## 5. Authority and responsibility matrix

| Responsibility | Accountable owner | Boundary |
|---|---|---|
| Regulatory definition and certification | RKE governance | Does not certify FKE methodology |
| Financial methodology and certification | FKE governance | Does not certify RKE requirements |
| Evidence and operational facts | Operational Domain | Cannot redefine certified rules |
| Approval workflow execution and audit | Shared Intelligence | Does not independently certify definitions |
| Compliance determination | Compliance Intelligence | References certified RKE version |
| Financial determination | Financial Intelligence | References certified FKE version |
| Persistence, identity, tenancy, event delivery | Platform Foundation | Infrastructure, not rule authority |
| Presentation | UX | No independent compliance/financial decisions |

## 6. Canonical identity scheme (proposed)

Every knowledge artifact has `authorityId`, `knowledgeDomain` (`REGULATORY` or `FINANCIAL`), `artifactId` (stable logical identity), `artifactVersionId` (immutable revision identity), `semanticVersion` (display only), and `contentDigest` (cryptographic hash over canonicalized content). IDs must not be recycled. Hashing/canonicalization algorithm and UUID conventions require registry ratification.

## 7. Knowledge artifact contract

```ts
interface KnowledgeArtifactVersion {
  authorityId: string;
  knowledgeDomain: 'REGULATORY' | 'FINANCIAL';
  artifactId: string;
  artifactVersionId: string;
  semanticVersion: string;
  contentDigest: string;
  sourceReferences: SourceReference[];
  applicability: ApplicabilityExpression;
  validFrom: string;              // inclusive date/time in declared jurisdiction calendar
  validTo?: string | null;        // exclusive; null means open-ended
  recordedAt: string;             // UTC timestamp when version entered system
  publishedAt?: string | null;    // UTC; distinct from validFrom
  status: KnowledgeStatus;
  certificationId?: string;
  supersedesVersionId?: string;
  schemaVersion: string;
}
```

`SourceReference` includes official source identifier, title, publication or retrieval evidence, jurisdiction/authority, document digest, cited sections and source-effective dates when known. `ApplicabilityExpression` is an independently versioned, testable predicate; its precise schema is pending.

## 8. Knowledge lifecycle

Proposed states: `DRAFT → VALIDATED → IN_REVIEW → CERTIFIED → PUBLISHED → SUPERSEDED → ARCHIVED`. Rejected submissions return to `DRAFT` with retained review history; withdrawn unpublished versions are recorded as `WITHDRAWN`. `ARCHIVED` means inactive for new selection, **not deleted**. Certification and publication are separate, auditable transitions. A published version is immutable.

## 9. Transition guard contract

Each transition must verify current state, actor identity, domain-specific permission, segregation-of-duties policy, source and schema validation results, effective-date constraints, required reviewer signatures, and optimistic concurrency token. Repeated requests with the same idempotency key return the original transition result; mismatched payloads are rejected.

## 10. Certification request

```ts
interface CertificationRequest {
  artifactVersionId: string;
  expectedContentDigest: string;
  validationRunId: string;
  reviewDecisionIds: string[];
  certificationPolicyVersionId: string;
  requestedBy: string;
  idempotencyKey: string;
}
```

Certification must fail closed when validation is stale, content digest differs, source provenance is missing, a required reviewer is unauthorized, or segregation-of-duties checks fail.

## 11. Certification record

```ts
interface CertificationRecord {
  certificationId: string;
  artifactVersionId: string;
  certifiedDigest: string;
  certifierActorId: string;
  certifiedAt: string;
  policyVersionId: string;
  validationRunId: string;
  reviewDecisionIds: string[];
  decision: 'APPROVED' | 'REJECTED';
  auditCorrelationId: string;
}
```

Human approval is mandatory under AD-003. AI assistance may be logged as supporting activity, never as certifier authority.

## 12. Publication contract

Publication takes an immutable certified version, checks authorization, collision/overlap policy, source validity, and approval evidence, then atomically commits a publication record and an event-outbox entry (if the selected delivery design uses an outbox). Publication cannot mutate the artifact body or backdate its recorded/published timestamps.

## 13. Temporal model: three independent clocks

1. **Valid time:** period during which the underlying rule/methodology applies.
2. **Transaction/record time:** when the platform learned, certified, or stored the version.
3. **Determination time:** when an evaluation was executed.

`publishedAt` is separately retained; it must not be treated as interchangeable with `validFrom`. Time zone, local-date boundaries, and inclusive/exclusive interval conventions must be explicit.

## 14. Effective-dated resolution request

```ts
interface KnowledgeResolutionRequest {
  knowledgeDomain: 'REGULATORY' | 'FINANCIAL';
  authorityId: string;
  artifactId: string;
  jurisdictionId?: string;
  programId?: string;
  applicabilityFactsDigest: string;
  effectiveAt: string;
  knownAt: string;                // historical as-known-at cutoff
  purpose: 'CURRENT' | 'HISTORICAL_REPLAY' | 'CORRECTION';
  tenantId: string;
  correlationId: string;
}
```

The resolver must not infer applicability from a tenant's name or substitute the newest version when a historical version is requested.

## 15. Resolution response

```ts
interface KnowledgeResolutionResult {
  artifactVersionId: string;
  contentDigest: string;
  certificationId: string;
  publicationId: string;
  validFrom: string;
  validTo?: string | null;
  knownAt: string;
  resolverVersionId: string;
  applicabilityDecisionId: string;
  resolutionEvidenceIds: string[];
}
```

No match, multiple ambiguous matches, unpublished match, or unauthorized access returns a typed failure, never a silent fallback.

## 16. Resolution ordering and ambiguity

Filter by authority/domain, publication and certification status, valid-time interval, transaction-time visibility (`knownAt`), applicability, and explicit precedence rules. If two versions conflict and precedence is not formally governed, return `AMBIGUOUS_VERSION`. No implicit “latest wins.”

## 17. Historical as-known-at semantics

A replay of a 2026 decision as it was originally made must use versions **known and published at that decision's knowledge cutoff**, even if later publications were retroactively effective for 2026. A separately authorized **corrected determination** may use later-known knowledge, but must produce a new linked result rather than overwrite the original.

## 18. Determination input manifest

```ts
interface DeterminationInputManifest {
  determinationId: string;
  determinationType: 'COMPLIANCE' | 'FINANCIAL';
  tenantId: string;
  subjectRef: string;
  assessmentPeriod: { from: string; to: string };
  executedAt: string;
  knowledgeCutoffAt: string;
  knowledgeVersions: Array<{ artifactVersionId: string; contentDigest: string; certificationId: string }>;
  operationalSnapshotIds: string[];
  evidenceDigestRefs: string[];
  evaluatorVersionId: string;
  evaluatorConfigDigest: string;
  inputSchemaVersion: string;
  executionCorrelationId: string;
}
```

The manifest must reference immutable or content-addressed inputs, not only mutable operational record IDs.

## 19. Determination output contract

```ts
interface DeterminationRecord {
  determinationId: string;
  manifestDigest: string;
  outcomeSchemaVersion: string;
  outcomeDigest: string;
  outcomeRef: string;
  createdAt: string;
  status: 'COMPLETED' | 'FAILED' | 'INDETERMINATE';
  supersedesDeterminationId?: string;
  correctionReason?: string;
  auditCorrelationId: string;
}
```

A compliance finding and a financial calculation must retain their own domain-specific outcome payloads and supporting calculations, with common replay metadata.

## 20. Replay contract

Replay accepts an original determination ID, an authorized purpose, and an execution mode. `EXACT_REPLAY` reuses the original manifest, evaluator version, knowledge digests and operational snapshots. `CORRECTED_REASSESSMENT` creates a new manifest with an explicit reason and links the result to the original. Any missing original artifact returns `REPLAY_BLOCKED_MISSING_INPUT` rather than substituting current data.

## 21. Replay equality rules

Define whether results require byte-identical output or semantically identical normalized output; retain deterministic rounding, decimal arithmetic, ordering, locale, date parsing, and evaluator dependencies. Financial calculations require a declared decimal precision and rounding policy from certified FKE methodology. Non-deterministic external inputs must be snapshotted.

## 22. Supersession and corrections

Supersession creates a new immutable knowledge version and records explicit predecessor/successor edges. Historical determinations are never edited in place. Corrections create a new determination with reason, actor, timestamps, version changes, and review trail. Released binders retain the original released snapshot unless a separately authorized amendment is issued.

## 23. Publication and supersession invariants

- A published version's content digest cannot change.
- Certification binds to one exact content digest.
- Supersession does not erase earlier versions.
- `validFrom` may precede `publishedAt` but must not erase as-known-at history.
- Uncertified versions cannot be selected for production determinations.
- RKE certification cannot be reused as FKE certification.

## 24. Proposed API surface (not implemented claims)

| Operation | Proposed route | Owner |
|---|---|---|
| Submit review | `POST /api/v1/knowledge/{domain}/versions/{id}/reviews` | RKE/FKE governance |
| Certify version | `POST /api/v1/knowledge/{domain}/versions/{id}/certifications` | RKE/FKE governance |
| Publish version | `POST /api/v1/knowledge/{domain}/versions/{id}/publications` | RKE/FKE governance |
| Resolve version | `POST /api/v1/knowledge/{domain}/resolve` | RKE/FKE resolver |
| Get certification evidence | `GET /api/v1/knowledge/{domain}/certifications/{id}` | RKE/FKE governance |
| Get determination manifest | `GET /api/v1/determinations/{id}/manifest` | Applied Intelligence |
| Request replay | `POST /api/v1/determinations/{id}/replays` | Applied Intelligence |

Exact route shape, versioning and tenancy model must be reconciled with REC-003–005 before approval.

## 25. Proposed event contract families

`KnowledgeVersionValidated`, `KnowledgeReviewCompleted`, `KnowledgeVersionCertified`, `KnowledgeVersionPublished`, `KnowledgeVersionSuperseded`, `KnowledgeResolutionFailed`, `DeterminationCompleted`, `DeterminationCorrectionIssued`, `DeterminationReplayCompleted`, `DeterminationReplayBlocked`. Names are provisional; map to EVT-001–042 and later ENG events before assigning canonical IDs. Every event includes schema version, event ID, occurred-at, producer, tenant or global-authority scope, correlation/causation IDs, and immutable subject reference.

## 26. Event delivery guarantees

Use a durable publication mechanism with idempotent consumers, replayable failure handling, dead-letter visibility, and transactional integrity between state changes and event publication. The exact transport and outbox implementation are not chosen here. At-least-once delivery must not create duplicate certifications or determinations.

## 27. Storage model (logical, not a migration)

Logical stores: `knowledge_artifact`, `knowledge_artifact_version`, `knowledge_source_reference`, `validation_run`, `review_decision`, `certification_record`, `publication_record`, `supersession_link`, `resolution_decision`, `determination_manifest`, `determination_result`, `determination_replay`, `audit_event`, and delivery/outbox records as selected. Foreign keys, unique constraints, retention, row security and partitioning require design review.

## 28. Immutability enforcement

Prefer append-only version records, restricted update privileges, digest checks, immutable object storage for snapshots, and audit of attempted mutations. Application-only immutability checks are insufficient if privileged database writes can silently alter history. Define documented break-glass operations that never rewrite released evidence invisibly.

## 29. Tenant isolation and global knowledge

Certified knowledge may be shared across tenants, but tenant applicability facts, operational snapshots, determination results, and binder content remain tenant-scoped. The authorization model must distinguish globally published knowledge from private tenant-derived outcomes. Resolver and replay endpoints must enforce tenant boundaries server-side.

## 30. Separation of duties and privileged access

Roles for author, reviewer, certifier, publisher, operator, and auditor must be explicitly mapped to permissions. Whether reviewer and certifier may be the same person is a policy decision; the system must support stricter separation. MFA/step-up approval, delegated authority, revocation, and emergency access are subject to security review.

## 31. Validation contract

Validation evidence records validator version, artifact digest, schema version, source-reference checks, temporal overlap checks, applicability tests, domain-specific semantics, result status, failures/warnings, and executed-at. Certification requires a passing validation run tied to the identical digest.

## 32. RKE-specific acceptance requirements

Regulatory source traceability, jurisdiction and program applicability, rule and requirement provenance, effective-date resolution, certification of exact pack version, controlled publication, compliance evaluation linkage, and replay of a historical finding.

## 33. FKE-specific acceptance requirements

Financial source traceability, reporting-period applicability, classification and allowability rule versions, allocation and rate provenance, formula version, precision/rounding policy, independent certification, publication, and replay of a historical cost-report calculation. Do not invent Texas HCS rates or cost-report requirements.

## 34. Cross-authority contract rules

An RKE outcome referenced by Financial Intelligence must be identified as a versioned, provenance-bearing external input, not copied into FKE as an editable financial definition. Likewise RKE must not treat FKE methodology as a regulatory rule. Shared infrastructure transports and audits contracts without deciding their meaning.

## 35. Binder and survey integration

Released Survey and Financial Binders retain immutable manifest IDs, evidence digests, knowledge version references, approval history, and release timestamps. Binder access does not grant blanket access to protected source records. Authorized amendment produces a new binder release linked to the prior release.

## 36. Failure and error taxonomy

Proposed typed errors: `KNOWLEDGE_NOT_FOUND`, `UNCERTIFIED_VERSION`, `INVALID_SOURCE_PROVENANCE`, `VALIDATION_STALE`, `DIGEST_MISMATCH`, `APPROVAL_POLICY_FAILED`, `VERSION_INTERVAL_CONFLICT`, `AMBIGUOUS_VERSION`, `TENANT_SCOPE_DENIED`, `REPLAY_BLOCKED_MISSING_INPUT`, `EVALUATOR_VERSION_UNAVAILABLE`, `EVENT_DELIVERY_PENDING`, `CONCURRENT_TRANSITION_CONFLICT`. Error naming is subject to contract registry ratification.

## 37. Test matrix

| Test | Expected result | Status |
|---|---|---|
| Certify changed digest after validation | Reject | NOT RUN |
| Publish without independent approval | Reject | NOT RUN |
| Resolve effective-dated 2026 version in 2028 | Original applicable version | NOT RUN |
| Retroactively effective later publication with old known-at | Excluded from original as-known-at replay | NOT RUN |
| Two conflicting applicable versions | Typed ambiguity failure | NOT RUN |
| Replay after mutable source record changed | Original snapshot used | NOT RUN |
| Replay with missing evaluator version | Block with explicit reason | NOT RUN |
| Concurrent duplicate publication requests | One logical publication | NOT RUN |
| Cross-tenant determination access | Denied and audited | NOT RUN |
| FKE calculation replay | Same governed precision and result | NOT RUN |
| Corrected assessment | New linked immutable result | NOT RUN |
| Published content mutation attempt | Rejected and audited | NOT RUN |

## 38. Repository verification checklist

Inspect actual TypeORM entities and migrations for version retention, certification and publication state, compare repository interfaces with proposed contracts, trace evaluator inputs and result persistence, inspect approval and auth guards, identify any event transport, and execute tests only in an authorized environment. REC-007's in-memory repository is not evidence of durable history.

## 39. Contract reconciliation checklist

- Map provisional artifact IDs and component owners to canonical RKE/FKE/SII/CI/FI registry entries.
- Reconcile proposed HTTP routes against REC-004 and REC-005.
- Reconcile events with ENG-001 EVT-001–042 and REC-006.
- Define exact timestamp and applicability semantics.
- Approve source-reference and digest canonicalization standards.
- Resolve approval sequencing dependency between knowledge certification and Shared approval infrastructure.
- Map determination/binder contracts to ENG-009, ENG-016–023.

## 40. Migration and compatibility strategy

Inventory existing packs and their version semantics; do not assign fabricated historical certifications. Introduce immutable version storage alongside existing loader interfaces, verify dual-read compatibility, migrate only provenance-supported records, and label legacy unverifiable records explicitly. Run reconciliation reports before switching readers. Plan rollback without discarding newly recorded audit history.

## 41. Acceptance gates

**G1 — Contract approval:** owners, schema, temporal semantics, event mappings and authorization ratified.  
**G2 — Persistence proof:** immutable history and source snapshots verified.  
**G3 — Governance proof:** human review/certification/publication transitions tested.  
**G4 — Resolution proof:** valid-time and as-known-at behavior tested.  
**G5 — Replay proof:** deterministic RKE and FKE historical outcomes tested.  
**G6 — Security proof:** cross-tenant and privileged-transition tests passed.  
**G7 — Operational proof:** event reliability, backup/restore and audit verification passed.

All gates currently **PENDING**.

## 42. Open decisions

1. Canonical timestamp precision, timezone and jurisdiction-local calendar rules.
2. Exact version precedence and overlap-resolution policy.
3. Certification role separation and delegated authority policy.
4. Content canonicalization/hash algorithm.
5. Evaluator artifact retention strategy and runtime reproducibility.
6. Transactional event delivery technology and retry policy.
7. Retention schedules, legal holds and protected-data minimization.
8. Published pack access and cross-tenant distribution policy.
9. Legacy knowledge version migration evidence standard.
10. API, DTO, event and component identifier ratification.

## 43. Evidence and sign-off register

| Item | Status | Required evidence |
|---|---|---|
| Architecture principles AD-001–AD-012 | APPROVED IN CONVERSATION | Decision register |
| REC-007 static assessment | DRAFT | Source references |
| REC-008 proposed contracts | DRAFT / NOT RATIFIED | Domain owner review |
| RKE certification runtime | NOT VERIFIED | Tests, audit and persistent state |
| FKE certification runtime | NOT VERIFIED | Tests, audit and persistent state |
| Historical replay runtime | NOT VERIFIED | End-to-end fixture results |
| Implementation authorization | NOT GRANTED | Separate explicit authorization |

## 44. Exit criteria and next action

REC-008 may be **contract-ratified** only after canonical identifiers, owners, temporal behavior, API/events, authorization and storage invariants are reviewed and approved. It may be **implementation-verified** only after executable evidence satisfies G2–G7. Next proposed section: **REC-009 — Knowledge Governance and Historical Replay Acceptance Test Matrix**, translating these contracts into executable fixtures and acceptance cases without claiming tests have run.

---

**Document control:** Draft for reconciliation. No code or database changes authorized. No regulatory or financial content has been certified by this document.
