# REC-028 — Emergency Preparedness P0 Test Harness and Fixture Contract Specification

## 1. Document control

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document:** REC-028  
**Date:** 2026-11-02  
**Status:** DRAFT / DESIGN ONLY — NOT IMPLEMENTED OR EXECUTED  
**Proposed path:** `docs/governance/reconciliation/rec-028-emergency-preparedness-p0-test-harness-and-fixture-contract-specification.md`  
**Predecessors:** REC-017–027; especially REC-026 P0 register and REC-027 36-scenario verification runbook.  
**Authority:** Proposed test contracts, subject to ratification. No authorization to implement, migrate, or deploy.

## 2. Purpose and stopping rule

Define a minimal, reproducible harness that can execute the 36 REC-027 verification scenarios against the Emergency Preparedness vertical slice. Every asserted PASS must have a real runner result and immutable evidence bundle. A document, code sketch, or mock-only demonstration is not execution evidence. This is the first of the final three reconciliation deliverables, REC-028–030.

## 3. Non-negotiable architectural boundaries

RKE certifies regulatory knowledge; operational domains retain facts; the compliance evaluator computes determinations; Shared Intelligence handles audit, approval and evidence; UX displays outcomes. The harness must not generate fictitious certified versions, infer legal requirements, bypass authorization, or treat test fixture labels as regulatory authority.

## 4. Repository baseline and verification limits

Prior static repository traces report RKE knowledge models/loader/validator, in-memory repository, fire-drill records, compliance results, and Emergency Plans evaluator. Prior inspection identified unconditional Emergency Plans findings and default-provider selection in evaluators. These are **historical static findings**, not a new runtime inspection in this document. No complete test environment, executed migrations, certified knowledge history, or passing tests have been established.

## 5. Scope

In scope: deterministic fixtures, authorization contexts, evidence adapters, temporal RKE stubs for unit tests, integration adapters for real certification storage when available, evaluator oracles, audit/event capture, replay, negative tests, CI packaging and approval evidence. Out of scope: production data, live regulatory certification, substantive changes to Texas law, actual implementation, or closure of blockers without executed proof.

## 6. P0 blocker traceability

| Blocker | Harness focus | Gate |
|---|---|---|
| `EP-P0-01` | regulatory citation and effective history | `G-1` |
| `EP-P0-02` | trusted provider/location context | `G-1` |
| `EP-P0-03` | emergency-plan source of truth | `G-2` |
| `EP-P0-04` | staff access and acknowledgment | `G-2` |
| `EP-P0-05` | fire-drill adapter semantics | `G-3` |
| `EP-P0-06` | certified requirement crosswalk | `G-3` |
| `EP-P0-07` | evidence-driven evaluator | `G-4` |
| `EP-P0-08` | five-state status compatibility | `G-4` |
| `EP-P0-09` | historical replay | `G-5` |
| `EP-P0-10` | privacy and attachment controls | `G-5` |
| `EP-P0-11` | migration and rollback | `G-6` |
| `EP-P0-12` | independent approvals | `G-6` |

## 7. Test pyramid

**Unit:** pure predicate truth tables, version resolver edge cases, status projection. **Contract:** DTO schemas, tenant ownership, event envelopes, source digest verification. **Integration:** real DB constraints, authenticated API, loader/persistence adapter and outbox. **End-to-end:** authorized UI/API finding with audit and binder trace. **Replay:** identical historical inputs produce matching determination digest. Unit stubs cannot close integration or certification blockers.

## 8. Canonical fixture manifest

```ts
interface EpFixtureManifest {
  fixtureSetId: string; fixtureRevision: string; schemaVersion: '1.0';
  generatedAtUtc: string; syntheticOnly: true;
  providers: ProviderFixture[]; actors: ActorFixture[];
  locations: LocationFixture[]; plans: PlanFixture[];
  acknowledgments: AcknowledgmentFixture[]; drills: DrillFixture[];
  regulatoryArtifacts: RegulatoryFixtureReference[];
  evidenceAttachments: AttachmentFixture[];
  expectedAssertions: AssertionReference[];
  digestSha256: string;
}
```
Fixture revisions are immutable. `digestSha256` covers canonicalized fixture content excluding its own digest field. `regulatoryArtifacts` may reference only actually certified artifacts in integration tests; synthetic stub artifacts must be labeled `TEST_ONLY_NOT_CERTIFIED`.

## 9. Provider and location fixtures

```ts
interface ProviderFixture { id: string; active: boolean; }
interface LocationFixture { id: string; providerId: string; type: 'THREE_PERSON'|'FOUR_PERSON'|'HOST_HOME'; active: boolean; }
```
Baseline `P-A` owns `A-1`, `A-2`; `P-B` owns `B-1`. IDs are stable UUID-shaped test identifiers, not production identifiers. A cross-provider location reference must be rejected before evidence lookup.

## 10. Actor and authorization fixtures

```ts
interface ActorFixture {
  actorId: string; authenticated: boolean;
  memberships: Array<{ providerId: string; locationIds: string[]; roles: string[] }>;
}
interface AuthorizedEvaluationContext {
  actorId: string; providerId: string; locationId: string;
  authorizationDecisionId: string; requestId: string;
}
```
Test `ACT-A` (P-A), `ACT-B` (P-B), `ACT-0` (none), and a role without evaluator permission. Request-supplied provider/location IDs must never substitute for server-validated membership. Expected denial is an authorization failure, not `NONCOMPLIANT`.

## 11. Emergency-plan fixture contract

```ts
interface PlanFixture {
  id: string; providerId: string; locationId: string;
  revisionId: string; validFrom: string; validTo?: string;
  recordedAt: string; state: 'ACTIVE'|'SUPERSEDED'|'WITHDRAWN';
  sourceDigestSha256: string; contentFields: Record<string, unknown>;
}
```
Required cases: `PLAN-1` active, `PLAN-0` explicit missing-record query, `PLAN-OLD` superseded, incomplete content, wrong location, overlapping dates, withdrawn evidence. Do not invent legally mandatory plan fields; bind them to ratified REC-022 predicates.

## 12. Staff-access evidence fixtures

```ts
interface AcknowledgmentFixture {
  id: string; providerId: string; locationId: string;
  staffId: string; planRevisionId: string;
  acknowledgedAt?: string; evidenceDigestSha256?: string;
  sourceType: 'SIGNED_RECORD'|'TRAINING_RECORD'|'ATTESTATION';
}
```
A signature alone does not automatically prove every access requirement. Test absent, stale, contradictory, cross-location and revoked records; classify using the certified predicate, not test-writer intuition.

## 13. Fire-drill fixtures

```ts
interface DrillFixture {
  id: string; providerId: string; locationId: string;
  occurredAt: string; shiftCode?: string; completed?: boolean;
  recordedAt: string; sourceDigestSha256: string;
}
```
Include dates on period boundaries, time-zone transitions, duplicates, invalid shift codes, cancelled drills, foreign tenant records and amended entries. Whether a pattern violates a rule must be decided only by certified effective-dated requirements.

## 14. Evidence attachment fixtures

```ts
interface AttachmentFixture {
  id: string; providerId: string; locationId: string;
  mediaType: string; sizeBytes: number; digestSha256: string;
  classification: 'SYNTHETIC_PUBLIC'|'SYNTHETIC_RESTRICTED';
  malwareScanStatus: 'CLEAN'|'QUARANTINED'|'PENDING';
}
```
Test foreign-provider download denial, digest tampering, oversize rejection, quarantine, signed-link expiration, access audit and redaction. Never embed real PHI, access tokens or credentials in fixtures or logs.

## 15. Regulatory revision fixtures

```ts
interface RegulatoryFixtureReference {
  authority: 'RKE'; logicalRuleId: string;
  revisionId: string; contentDigestSha256: string;
  validFrom: string; validTo?: string; knownAt: string;
  certificationId?: string; mode: 'REAL_CERTIFIED'|'TEST_STUB';
}
```
`RULE-v1` and `RULE-v2` enable unit-level temporal behavior tests. `TEST_STUB` is prohibited as evidence that real certification or legally correct citations have been verified.

## 16. Five-state determination contract

```ts
type EpOutcome = 'COMPLIANT'|'NONCOMPLIANT'|'INSUFFICIENT_EVIDENCE'|'NOT_APPLICABLE'|'REQUIRES_REVIEW';
interface EpDetermination {
  outcome: EpOutcome; providerId: string; locationId: string;
  requirementRevisionId: string; evaluatedAt: string;
  evidenceRevisionIds: string[]; predicateVersion: string;
  explanationCode: string; determinationDigestSha256: string;
}
```
Denial, timeout, unavailable certified rule, or internal error is **not** one of these five compliance outcomes. Those are transport/execution failures with distinct typed errors.

## 17. Adapter interfaces

```ts
interface EpEvidenceAdapter {
  loadAuthorizedSnapshot(ctx: AuthorizedEvaluationContext, asOf: string): Promise<EpEvidenceSnapshot>;
}
interface EpKnowledgeResolver {
  resolveCertified(input: { jurisdiction: string; requirementId: string; applicableAt: string; knownAt: string }): Promise<ResolvedRule>;
}
interface EpEvaluator {
  evaluate(input: { ctx: AuthorizedEvaluationContext; evidence: EpEvidenceSnapshot; rule: ResolvedRule }): Promise<EpDetermination>;
}
```
The adapter must query by authorized provider **and** location, not select a default provider. The resolver must fail closed on missing, overlapping or uncertified revisions.

## 18. Evidence snapshot interface

```ts
interface EpEvidenceSnapshot {
  providerId: string; locationId: string;
  asOf: string; capturedAt: string;
  sourceRevisionIds: string[]; sourceDigestsSha256: string[];
  plans: PlanFixture[]; acknowledgments: AcknowledgmentFixture[];
  drills: DrillFixture[]; snapshotDigestSha256: string;
}
```
Canonical serialization must fix property order, UTC timestamp normalization, numeric precision and omission semantics. Snapshot digests exclude volatile request tracing fields.

## 19. Test case schema

```ts
interface EpTestCase {
  id: string; blockerId: string; level: 'UNIT'|'CONTRACT'|'INTEGRATION'|'E2E'|'REPLAY';
  fixtureSetId: string; preconditions: string[];
  action: string; expected: string[];
  evidenceRequired: string[]; ownerRole: string;
}
```
Each of the 36 REC-027 scenarios receives a stable ID and at least one concrete assertion. An assertion without executable target, fixture, expected result and evidence path is `NOT_READY`.

## 20. Deterministic execution contract

Freeze the clock, timezone, locale, random seed and canonical serialization in unit/contract tests. In integration tests, capture actual DB clock, migration version and external service versions. Avoid sleep-based timing assumptions. Test ordering must not change outcomes; each case resets its own isolated dataset.

## 21. Test runner CLI proposal

```bash
# Proposed commands; not verified as existing npm scripts
npm run test:ep:unit -- --fixture-set=ep-v1
npm run test:ep:contract -- --fixture-set=ep-v1
npm run test:ep:integration -- --fixture-set=ep-v1
npm run test:ep:replay -- --manifest=fixtures/ep/replay-v1.json
```
No command should be represented as currently runnable until the package scripts, dependencies and environment are verified. Each process exits nonzero for failed assertions or missing required prerequisites.

## 22. Harness package layout proposal

```text
tests/emergency-preparedness/
  README.md
  contracts/
  fixtures/{providers,actors,locations,plans,staff,drills,rules,attachments}/
  cases/{unit,contract,integration,e2e,replay}/
  helpers/{clock,auth,evidence,knowledge,digest,db-reset}/
  manifests/
  reports/                 # generated; excluded from source control
```
Final placement must conform to actual Nx project graph and approved dependency tags; this is not a claim that these paths exist.

## 23. Tenant authorization oracle

For every authorized success case, run a paired `ACT-B → A-1` denial case and an unauthenticated case. Assert no data, existence leakage, evidence IDs, status details or timing-sensitive content is returned. Audit denied attempts without leaking restricted record payloads. Include provider/location mismatch with a valid P-A token.

## 24. Evidence predicate oracle

Use a decision table per certified atomic requirement: verified-positive, verified-negative, absent, conflicting, stale, foreign tenant, and nonapplicable evidence. Assert the evaluator produces the approved five-state result or a typed execution failure. Never hardcode `NONCOMPLIANT` for an absent record unless the approved rule and proof burden explicitly establish it.

## 25. Temporal resolver oracle

Test applicableAt before, on and after revision boundary; knownAt before and after publication; retroactive correction; superseded revision; overlapping intervals; missing revision; wrong jurisdiction; digest mismatch; uncertified draft. Resolver must return a unique certified revision or an explicit failure. No silent fallback to latest.

## 26. Historical replay oracle

```ts
interface ReplayAssertion {
  originalDeterminationId: string; originalDigestSha256: string;
  knowledgeRevisionId: string; evidenceSnapshotDigestSha256: string;
  evaluatorBuildDigestSha256: string; replayDigestSha256: string;
  match: boolean; mismatchReasons: string[];
}
```
Compare stable determination fields only; volatile timestamps/correlation IDs are excluded by an approved canonicalization policy. Record exact source/evaluator revision references and preserve original records if replay differs.

## 27. Legacy status projection oracle

Specify an explicit compatibility adapter for three-state consumers. `INSUFFICIENT_EVIDENCE` and `REQUIRES_REVIEW` must not become compliant or noncompliant silently. If a consumer cannot represent uncertainty, block the projection with a typed incompatibility error and test that behavior.

## 28. Audit and event assertions

For each evaluation, assert a correlation ID, authenticated actor/provider/location scope, certified rule revision reference, evidence snapshot digest, outcome, audit event identity and outbox delivery state where applicable. Events must be idempotent; duplicate delivery must not duplicate final findings. Proposed event names remain subject to canonical event registry ratification.

## 29. Database and migration assertions

In isolated disposable PostgreSQL, test foreign keys, unique revision identity, append-only evidence policy, tenant scoping, overlapping temporal constraints where supported, rollback and forward reapplication. Capture migration names and checksums. Do not infer schema readiness from TypeORM entity declarations alone.

## 30. Test isolation and cleanup

Use synthetic tenants, a dedicated database/schema, explicit seed and teardown transaction boundaries, least-privilege service accounts and a clean environment per CI job. Do not reuse production snapshots. Cleanup must remove fixtures and generated credentials while retaining approved redacted evidence bundles.

## 31. Negative-path catalog

Mandatory: unauthenticated, foreign tenant, wrong location, stale membership, missing certification, ambiguous effective date, tampered digest, missing plan, contradictory acknowledgment, duplicate drill, invalid timezone, outbox retry, API timeout, replay mismatch, migration rollback failure and reviewer conflict-of-interest.

## 32. CI workflow proposal

```yaml
# Illustrative, not a deployed workflow
jobs:
  ep-contract-verification:
    steps:
      - run: npm ci
      - run: npm run test:ep:unit
      - run: npm run test:ep:contract
      - run: npm run test:ep:integration
      - run: npm run test:ep:replay
      - run: node scripts/verify-ep-evidence-manifest.mjs
```
Pin Node/package-manager versions and the lockfile; use a supported test database. A missing dependency, offline npm failure or missing script yields `BLOCKED`, not `PASS`.

## 33. Evidence artifact naming

`EP-<runId>-<caseId>-<artifactType>-<sha256-prefix>.<ext>` with types `result`, `log`, `trace`, `audit`, `snapshot`, `replay`, `approval`. Artifacts must be redactable, digest-verified and referenced by an immutable run manifest. Never store secrets or real patient records.

## 34. Run manifest schema

```ts
interface EpRunManifest {
  runId: string; gitSha: string; lockfileSha256: string;
  environmentId: string; databaseMigrationDigest: string;
  fixtureSetId: string; fixtureDigestSha256: string;
  evaluatorBuildDigestSha256: string; knowledgeRevisionIds: string[];
  startedAtUtc: string; endedAtUtc?: string;
  cases: Array<{ caseId: string; status: 'PASS'|'FAIL'|'BLOCKED'|'NOT_RUN'; artifactDigests: string[] }>;
  operatorId: string; independentReviewerId?: string;
}
```
The manifest itself receives a digest and retention classification. Never declare a run successful if required cases are `BLOCKED` or `NOT_RUN`.

## 35. Status semantics

`NOT_RUN`: no execution attempted. `BLOCKED`: prerequisite absent. `FAIL`: executed and assertion violated. `PASS`: executed, evidence captured, assertion met. `INVALID`: fixture or runner error; rerun after correction. `REVIEW_PENDING`: technical pass awaiting independent review. These statuses are for **tests**, distinct from compliance outcomes.

## 36. Approval evidence contract

Approval requires named accountable owner, independent reviewer, artifact manifest digest, verified test scope, known exclusions, decision timestamp and authorization reference. The author cannot self-certify regulatory content. A review signature does not convert unexecuted tests into passing tests.

## 37. Performance and reliability thresholds

Thresholds for latency, concurrency, replay throughput and retry behavior are **TBD by owners** and must be measured on a representative staging environment. Do not invent service-level targets. Correctness, tenant isolation and provenance are hard gates independent of performance.

## 38. Observability contract

Structured logs include run ID, case ID, correlation ID, component, outcome category, revision IDs and sanitized error codes. Metrics count denied access, missing certified revisions, ambiguous temporal resolution, insufficient evidence, replay mismatch and outbox retries. Trace collection must respect data minimization.

## 39. Coverage matrix

| Level | Primary proof | Cannot prove alone |
|---|---|---|
| Unit | Pure predicates and deterministic behavior | Real authorization/persistence |
| Contract | DTO compatibility and adapter boundaries | End-to-end operation |
| Integration | DB/API/authorization/outbox behavior | Independent legal certification |
| E2E | User-to-result workflow | Exact historical replay without manifest |
| Replay | Reproducibility against preserved artifacts | Legal correctness of original rule |

## 40. Acceptance gates

| Gate | Required evidence | Current state |
|---|---|---|
| G-1 Source authority | Verified citation history, approved atomic rules | OPEN |
| G-2 Tenant security | Authenticated isolation tests | OPEN |
| G-3 Evidence source | Plan, staff, drill records with provenance | OPEN |
| G-4 Evaluation | Five-state evidence-driven outcomes | OPEN |
| G-5 History | Certified revisions and deterministic replay | OPEN |
| G-6 Operations | Migration, privacy, outbox, audit checks | OPEN |
| G-7 Governance | Independent ratification and release authorization | OPEN |

## 41. REC-027 scenario mapping method

Assign `EP-T-001` through `EP-T-036` in the same order as the REC-027 verification scenarios, retaining each original `EP-P0-xx` reference and expected result. Do not renumber existing scenarios during implementation; create a crosswalk if original case identifiers differ. A future executed ledger must link every case to its run manifest and evidence artifacts.

## 42. Sample unit case

```ts
// Illustrative test pseudocode, not executable repository code
it('returns insufficient evidence for an absent plan without proof of violation', async () => {
  const rule = certifiedTestStub('EP-PLAN-ATOMIC-01');
  const evidence = syntheticSnapshot({ plans: [] });
  const result = await evaluator.evaluate({ ctx: authorizedA1, rule, evidence });
  expect(result.outcome).toBe('INSUFFICIENT_EVIDENCE');
});
```
This expected outcome is a proposed safety default; the final oracle must be reconciled with ratified predicates and legal interpretation. An empty fixture is not itself proof of a regulatory violation.

## 43. Sample isolation case

```ts
// Illustrative test pseudocode
await expect(
  evidenceAdapter.loadAuthorizedSnapshot({ ...actorBContext, providerId: 'P-A', locationId: 'A-1' }, asOf)
).rejects.toMatchObject({ code: 'FORBIDDEN' });
```
Also assert zero evidence bytes and no foreign identifiers in the response or user-visible logs.

## 44. Sample replay case

```ts
const original = await loadFrozenDetermination('EP-HIST-01');
const replay = await replayEngine.reproduce(original.manifestId);
expect(replay.stableOutcomeDigest).toEqual(original.stableOutcomeDigest);
expect(replay.knowledgeRevisionId).toEqual(original.knowledgeRevisionId);
```
Replay against current/latest rules is a **new evaluation**, not historical reproduction.

## 45. Failure triage and rollback

Security or provenance failures: STOP-SHIP, preserve redacted artifacts, disable affected evaluator route in test/staging as authorized, assign incident owner. Data migration failures: stop, capture schema state, execute approved rollback in disposable environment and reverify. Never patch historical findings in place to make tests pass.

## 46. Implementation prerequisites

Before building the harness: approve REC-024/025 contracts, settle REC-021 citation/effective history, ratify five-state compatibility, identify actual Nx projects/test runner, confirm PostgreSQL test provisioning, agree fixture schema and evidence retention. Implementation authorization is a separate explicit decision.

## 47. Open decisions

Owners must ratify: (1) exact legal rule effective history, (2) predicate identifiers, (3) five-state projection behavior, (4) canonical digest algorithm and serialization, (5) temporal resolver semantics, (6) storage/retention periods, (7) CI runner and test DB strategy, (8) sign-off roles, (9) API versioning, (10) event IDs and outbox contract. All are pending.

## 48. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Mock tests mistaken for certification | Explicit `TEST_STUB` markers; independent legal review |
| Default-provider leak | Paired negative authorization assertions |
| Unconditional findings | Predicate truth tables and absent-evidence cases |
| Historical overwrite | Immutable manifests, revision IDs, digest checks |
| Nondeterministic replay | Canonical serialization, frozen clocks, evaluator digest |
| Offline dependency failures | Mark BLOCKED, capture npm logs, no false PASS |
| Scope expansion | REC-030 stop gate; implement only after approval |

## 49. Definition of ready for execution

Every required test has a case ID, owner, fixture digest, executable target, prerequisite list, expected oracle, artifact destination and independent review rule; staging isolation and CI dependency installation are demonstrated; certified rule references are available for integration tests. Until then the harness is **specified**, not ready for execution.

## 50. Definition of done for a P0 blocker

A blocker closes only with: ratified decision, merged implementation reference, successful required tests, verified evidence manifest, independent reviewer signature and release owner approval. No blocker can close on a document alone. Partial tests or blocked tests remain OPEN.

## 51. Current assessment

**REC-028 output:** test harness and fixture contracts proposed. **Tests executed:** 0 by this document. **P0 blockers closed:** 0. **Decisions ratified:** none newly ratified. **Repository code modified:** no. **Implementation authorization:** NOT GRANTED. These statements describe this deliverable and do not override evidence in any later independently verified run.

## 52. Next deliverables

**REC-029 — Final Gap Analysis and Implementation Priorities:** rank remaining blockers and sequence minimal authorized work. **REC-030 — Master Reconciliation Closure and Development Handoff:** freeze documentation scope, hand off evidence-backed work packages and approval gates. Stop generating more general REC specifications after REC-030 unless a specific implementation finding requires an amendment.
