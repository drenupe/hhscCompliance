# REC-027 — Emergency Preparedness P0 Evidence Execution Plan and Verification Runbook

## 1. Document control

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Class:** Reconciliation / executable verification planning  
**Date:** 2026-11-02  
**Status:** DRAFT — EXECUTION NOT PERFORMED; ALL P0 BLOCKERS OPEN  
**Proposed path:** `docs/governance/reconciliation/rec-027-emergency-preparedness-p0-evidence-execution-plan-and-verification-runbook.md`  
**Controlling predecessor:** REC-026; supporting REC-017–025, REC-008–009, AD-001–012.

## 2. Executive purpose

Turn the twelve REC-026 P0 blockers into reproducible test procedures with named artifacts, independent review, negative cases, rollback instructions and objective closure thresholds. This is a runbook, **not an executed test report**. No test, approval, deployment, legal certification, or implementation is claimed.

## 3. Governing boundaries

RKE alone owns regulatory interpretation and certified rule versions; operational domains own source facts; compliance evaluators consume both; Shared Intelligence manages evidence/audit/approvals; the UI presents outcomes. Never treat an AI-generated interpretation as certification. No code changes or migration runs are authorized by this document.

## 4. Baseline from REC-026

All twelve `EP-P0-01` through `EP-P0-12` are **OPEN**. Twelve EP-024 decisions are pending ratification. REC-026 evidence grades: `S` static source, `D` design, `L` independently verified legal history, `T` executed test, `A` authenticated approval, `O` observed operation, `U` unresolved. This runbook supplies procedures only; its current evidence grade is `D`.

## 5. Verification execution rules

Run only in an explicitly authorized, isolated test environment. Use synthetic persons and provider records; no production PHI or credentials. Capture git commit, dependency lock digest, runtime configuration fingerprint, database migration state, evaluator version, RKE revision and tester identity before each suite. If prerequisites are missing, record `BLOCKED`, never `PASS`.

## 6. Execution prerequisites checklist

- [ ] REC-025 decision owners and independent approvers named.
- [ ] Authorized staging environment and rollback owner assigned.
- [ ] Source revision and dependency manifest captured.
- [ ] Synthetic fixtures reviewed for privacy.
- [ ] Regulatory source snapshot and effective-history review available.
- [ ] RKE certification artifacts available or tests marked BLOCKED.
- [ ] Test runner, database, API and UI versions recorded.
- [ ] Log retention, secure artifact storage and evidence digests configured.

## 7. Required run metadata

Record `runId`, UTC start/end, operator, verifier, repository commit SHA, build ID, database schema version, environment identifier, fixture revision, knowledge revision/digest, evaluator version, feature flags, test command, exit code, log URI and SHA-256 digest. Do not place tokens, secrets or personal identifiers in artifacts.

## 8. Fixture catalog

| Fixture | Purpose | Required properties |
|---|---|---|
| `P-A` | Authorized provider | Two locations `A-1`, `A-2` |
| `P-B` | Isolation negative control | Location `B-1`; no shared access with P-A |
| `ACT-A` | Authorized actor | Membership for P-A and scoped locations |
| `ACT-B` | Foreign actor | Membership only for P-B |
| `ACT-0` | Missing/invalid actor | No valid authorization context |
| `PLAN-1` | Current plan | Valid revision, location A-1, dated evidence |
| `PLAN-0` | No plan | Explicit absence, not assumed violation |
| `PLAN-OLD` | Obsolete plan | Superseded revision and valid-time bounds |
| `STAFF-ACK` | Acknowledgment | Signed/dated with role and scope |
| `DRILL-*` | Drill variants | Dates, shifts, duplicates, invalid dates, foreign tenant |
| `RULE-v1/v2` | Rule history | Two certified revisions only when genuinely certified |
| `EVID-TAMPER` | Integrity negative | Mutated bytes with original digest |

## 9. Expected determination semantics

`COMPLIANT` only with verified supporting facts; `NONCOMPLIANT` only where verified facts establish violation under an applicable certified rule; `INSUFFICIENT_EVIDENCE` where evidence cannot establish either; `NOT_APPLICABLE` only on verified applicability exclusion; `REQUIRES_REVIEW` for conflicts or unresolved interpretation. Unauthorized access must return denial, **not** a compliance outcome. Legacy three-state projection must never silently collapse uncertainty into pass/fail.

## 10. Evidence naming and chain of custody

Store artifacts under `evidence/rec-027/<runId>/<blockerId>/<caseId>/` in approved storage; include sanitized command output, assertion report, structured logs, screenshots only if needed, manifest and SHA-256 hashes. The path is a **proposed convention**, not a claim that folders exist. Sign-off must reference immutable artifact IDs.

## 11. Execution order and dependencies

Gate A: source/citation and authorization (`01`,`02`,`12`); Gate B: operational schemas and privacy (`03`,`04`,`05`,`10`); Gate C: certified crosswalk/evaluator/status (`06`,`07`,`08`); Gate D: history and migrations (`09`,`11`); Gate E: independent closure review. Block dependent cases if prerequisite certification or infrastructure is unavailable.

## 12. EP-P0-01 — Regulatory citation and effective history

**Accountable reviewer:** Regulatory/legal. **Current state:** OPEN. **Evidence required:** Official dated source, amendment chain, signed 14-entry crosswalk.

**Procedure:**
1. `EP-P0-01-T01` — Verify each of 14 atomic requirements against official subsection text and source digest. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-01-T02` — Resolve same historical date under two effective revisions and check deterministic selection. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-01-T03` — Introduce overlapping or missing effective intervals and require explicit unresolved response. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Historical date mismatch or unverified applicability.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 13. EP-P0-02 — Trusted provider/location authorization

**Accountable reviewer:** Security. **Current state:** OPEN. **Evidence required:** Auth context trace, ownership queries, negative access logs.

**Procedure:**
1. `EP-P0-02-T01` — Authorized ACT-A accesses A-1; record successful scope resolution. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-02-T02` — ACT-B attempts A-1 and must be denied without data leakage. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-02-T03` — ACT-0 and client-supplied provider override must fail closed. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Cross-tenant read or fallback provider.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 14. EP-P0-03 — Emergency-plan source-of-truth

**Accountable reviewer:** Operational/data. **Current state:** OPEN. **Evidence required:** Schema, revision lifecycle, scoped API traces.

**Procedure:**
1. `EP-P0-03-T01` — Create and retrieve current plan revision for A-1. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-03-T02` — Supersede plan and confirm old revision remains retrievable. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-03-T03` — Query absent plan, stale plan and wrong location separately. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Plan absent/obsolete misclassified.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 15. EP-P0-04 — Staff access and acknowledgment

**Accountable reviewer:** Operations/privacy. **Current state:** OPEN. **Evidence required:** Signed acknowledgments, scoped staff roster, expiry traces.

**Procedure:**
1. `EP-P0-04-T01` — Match staff acknowledgment to correct plan revision and role. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-04-T02` — Expire acknowledgment and ensure it no longer proves current access. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-04-T03` — Attempt cross-location staff acknowledgment and reject. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Plan existence assumed to prove access.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 16. EP-P0-05 — Fire-drill adapter semantics

**Accountable reviewer:** Compliance/data. **Current state:** OPEN. **Evidence required:** Field map, timezone and shift fixtures, query traces.

**Procedure:**
1. `EP-P0-05-T01` — Map a valid drill to exact source ID and certified predicate. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-05-T02` — Test timezone boundary, shift boundary and invalid timestamp. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-05-T03` — Reject duplicate and P-B drill from P-A determination. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Wrong shift, invalid date or foreign-provider drill counted.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 17. EP-P0-06 — Certified requirement crosswalk

**Accountable reviewer:** RKE/regulatory. **Current state:** OPEN. **Evidence required:** Certified revisions, predicate map, source digests.

**Procedure:**
1. `EP-P0-06-T01` — Trace all atomic requirement IDs to immutable certified revisions. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-06-T02` — Run gap and overlapping-revision cases with fail-closed resolution. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-06-T03` — Test amended rule using known-at versus applicable-at. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Uncertified or ambiguous rule applied.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 18. EP-P0-07 — Evidence-driven evaluator

**Accountable reviewer:** Compliance/security. **Current state:** OPEN. **Evidence required:** Evaluator decisions and missing/conflict evidence logs.

**Procedure:**
1. `EP-P0-07-T01` — No evidence yields INSUFFICIENT_EVIDENCE or REQUIRES_REVIEW. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-07-T02` — Verified adverse facts yield NONCOMPLIANT only with reason and evidence IDs. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-07-T03` — Tampered or conflicting evidence blocks definitive result. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Unconditional deficiency.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 19. EP-P0-08 — Five-state status compatibility

**Accountable reviewer:** API/frontend. **Current state:** OPEN. **Evidence required:** DTO roundtrips, legacy projections, UI captures.

**Procedure:**
1. `EP-P0-08-T01` — Roundtrip each of five canonical statuses through API. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-08-T02` — Verify explicit, documented legacy projection for uncertainty. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-08-T03` — Unknown future enum must not default to COMPLIANT or NONCOMPLIANT. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Unknown status silently mapped to pass/fail.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 20. EP-P0-09 — Immutable historical replay

**Accountable reviewer:** Data governance. **Current state:** OPEN. **Evidence required:** Snapshot digests, manifest, replay comparison.

**Procedure:**
1. `EP-P0-09-T01` — Replay original manifest after plan correction. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-09-T02` — Replay original manifest after certified rule supersession. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-09-T03` — Alter evidence digest and require tamper detection. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Prior result silently changes.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 21. EP-P0-10 — Privacy and attachment controls

**Accountable reviewer:** Privacy/security. **Current state:** OPEN. **Evidence required:** ACL matrix, access denial, redaction and audit logs.

**Procedure:**
1. `EP-P0-10-T01` — Attempt foreign attachment ID and require denial. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-10-T02` — Verify signed URL expiry and privileged read audit. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-10-T03` — Verify redaction and retention policy handling in test environment. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** PHI exposure or unlogged privileged read.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 22. EP-P0-11 — Migration and rollback

**Accountable reviewer:** Platform/data. **Current state:** OPEN. **Evidence required:** Staging migration, counts, checksums, restore logs.

**Procedure:**
1. `EP-P0-11-T01` — Dry-run migration and reconcile record counts and digests. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-11-T02` — Repeat migration and verify idempotency. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-11-T03` — Restore staging backup and verify old API behavior. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Data loss or unrepeatable rollback.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 23. EP-P0-12 — Independent approvals

**Accountable reviewer:** Governance. **Current state:** OPEN. **Evidence required:** Signed scoped approvals, immutable digest and separation checks.

**Procedure:**
1. `EP-P0-12-T01` — Verify signer authority, approval scope and artifact digest. Capture input, output, assertion and immutable evidence URI.
2. `EP-P0-12-T02` — Reject same-actor prohibited approval and unsigned artifact. Capture input, output, assertion and immutable evidence URI.
3. `EP-P0-12-T03` — Invalidate approval when underlying artifact digest changes. Capture input, output, assertion and immutable evidence URI.

**Pass criterion:** All three cases produce the specified safe result with verified provenance, no unauthorized access, and independent reviewer sign-off. **Fail/no-go:** Self-approval or unsigned ratification.
**If blocked:** Record missing prerequisite, owner and dependency; do not synthesize PASS evidence.

## 24. Example executable test command template

Commands below are illustrative; **do not assume the repository exposes these scripts**. Discover actual Nx targets and package scripts before execution.

```bash
# Illustrative only: replace with verified targets after repository inventory
git rev-parse HEAD
npx nx show projects
# npx nx test <verified-project> --configuration=ci
# npm run <verified-api-integration-script>
```

## 25. Contract assertion pseudocode

```ts
// Illustrative expected behavior, not repository implementation.
const context = authorizedContext({ providerId: "P-A", locationId: "A-1" });
const result = await evaluateEmergencyPlan({ context, evidence: [] });
assert.equal(result.status, "INSUFFICIENT_EVIDENCE");
assert.ok(result.knowledgeRevisionId);
assert.ok(result.evaluationManifestId);
await assert.rejects(() => evaluateEmergencyPlan({
  context: foreignProviderContext("P-B"), targetLocationId: "A-1"
}), /FORBIDDEN|NOT_FOUND/);
```

## 26. Negative-test priorities

A failed tenant isolation, incorrect definitive deficiency, unauthorized attachment access, untraceable certified rule, or mutable historical determination is an immediate no-go regardless of other pass counts. Capture denial response without exposing whether a foreign record exists.

## 27. Legal and temporal verification protocol

Regulatory reviewer records official source identity, retrieval time, effective date, amendment chain, subsection-level text and certified digest. Test `applicableAt` and `knownAt` independently. Do not invent effective dates or presume that current web text establishes historical applicability.

## 28. Security verification protocol

Use three authorization contexts (same tenant, other tenant, absent/invalid) for every read, write, attachment and evaluation route. Confirm authorization is enforced server-side, including internal evaluator jobs and service accounts; frontend hiding is not evidence.

## 29. Evidence-to-predicate trace

For each atomic rule, capture `requirementRevisionId → predicateId → operationalSourceId/revision → evaluation result → determination manifest → API projection`. Missing links mean test failure or BLOCKED, not a silent inferred result.

## 30. Historical replay oracle

A historical replay passes only when original inputs, applicable certified revisions, evaluator build and manifest are retrievable and result digest matches under documented deterministic conditions. Where environmental nondeterminism exists, define a separately approved evidentiary-reproduction criterion; never call it byte-identical replay.

## 31. Compatibility test oracle

Canonical status remains five-state internally. Document any legacy mapping as a versioned, explicit projection; reject ambiguous mapping unless the consumer can represent review/unknown distinctly. Verify dashboard counts, CAP creation, reporting and binder exports for all five states.

## 32. Database migration protocol

Preflight backup and restore; record migration revision and row counts; apply on disposable staging; validate foreign keys, unique constraints, tenant ownership, digest integrity and rollback. Backfilled records without original approval evidence must be labeled unverified, never retrospectively certified.

## 33. Evidence security and privacy

Use synthetic records. Store raw logs in access-controlled locations with retention settings approved by privacy/legal. Redact tokens, names, identifiers and attachments. Evidence manifests may retain digests and opaque references without copying sensitive payloads.

## 34. Test execution ledger template

| Case ID | Prerequisite | Expected | Actual | Evidence URI/digest | Operator | Independent verifier | Status |
|---|---|---|---|---|---|---|---|
| EP-P0-01-T01 | Certified source snapshot | 14 entries traceable | NOT RUN | PENDING | UNASSIGNED | UNASSIGNED | NOT RUN |
| EP-P0-02-T02 | Two synthetic tenants | Cross-tenant access denied | NOT RUN | PENDING | UNASSIGNED | UNASSIGNED | NOT RUN |
| EP-P0-07-T01 | Evaluator integration | No unconditional deficiency | NOT RUN | PENDING | UNASSIGNED | UNASSIGNED | NOT RUN |
| EP-P0-09-T01 | Historical manifests | Original result reproducible | NOT RUN | PENDING | UNASSIGNED | UNASSIGNED | NOT RUN |

## 35. Evidence manifest schema

```ts
interface Rec027TestEvidence {
  runId: string; blockerId: string; caseId: string;
  commitSha: string; environmentId: string;
  knowledgeRevisionId?: string; evaluatorVersion?: string;
  inputDigest: string; outputDigest?: string;
  artifacts: Array<{ uri: string; sha256: string; classification: string }>;
  operatorId: string; verifierId?: string;
  verdict: "NOT_RUN" | "BLOCKED" | "PASS" | "FAIL";
  executedAt?: string; reviewedAt?: string;
  limitations: string[];
}
```

## 36. Failure handling and triage

On failure, freeze the run manifest, classify severity, preserve sanitized logs, identify affected tenants/versions and stop dependent tests. Create a remediation issue referencing the failed case and expected assertion. Rerun from clean fixtures after authorized correction; retain both failure and rerun evidence.

## 37. Closure decision rules

A blocker can transition from OPEN to REVIEW_READY only when required evidence is complete. VERIFIED requires independent technical/regulatory/security review as appropriate. CLOSED requires explicit authorized sign-off and link to immutable evidence. No blanket waiver of legal, security or integrity obligations.

## 38. Approval record template

| Field | Required value |
|---|---|
| Blocker | EP-P0-XX |
| Decision IDs | REC-025 / EP-024 references |
| Evidence manifest | Immutable URI and digest |
| Technical verifier | Named identity and timestamp |
| Regulatory/security reviewer | As applicable, separate identity |
| Exceptions | Explicit risk acceptance and expiry, if permissible |
| Closure authority | Named authorized signer |
| Final state | OPEN until approval is actually recorded |

## 39. Release gate matrix

| Gate | Requirement | Current status |
|---|---|
| G1 | Official regulatory history and certification | BLOCKED/PENDING |
| G2 | Tenant-safe authorization negative tests | NOT RUN |
| G3 | Approved operational evidence schemas | PENDING |
| G4 | Certified crosswalk and evidence-based evaluator | PENDING |
| G5 | Five-state compatibility and UI correctness | NOT RUN |
| G6 | Historical replay and migration recovery | NOT RUN |
| G7 | Independent closure approvals and implementation authorization | NOT GRANTED |

## 40. Stop-ship conditions

Stop if any P0 remains OPEN, BLOCKED or FAIL; if any test lacks traceable evidence; if a rule is uncertified; if tenant boundaries can be bypassed; if the evaluator generates unconditional findings; or if a prior determination cannot be attributed to its historical knowledge and evidence.

## 41. Work allocation and sequencing

Regulatory reviewer handles P0-01/06; security P0-02/10; operational/data P0-03/04/05; compliance engineering P0-07; API/frontend P0-08; data governance P0-09; platform P0-11; governance P0-12. These are **role assignments**, not named people or approvals.

## 42. Evidence completeness checklist

- [ ] Every test case has an executed timestamp or explicit BLOCKED reason.
- [ ] Every PASS links to immutable output and digest.
- [ ] Every source-derived rule has verified citation/effective history.
- [ ] Every tenant-negative case proves server-side denial.
- [ ] Every historical replay has an input manifest and comparison oracle.
- [ ] Every migration has a restoration record.
- [ ] Every closure has independent review and authorized approval.

## 43. Open decisions

Ratify REC-025 EP-024-01–12; select immutable knowledge store and certification mechanism; approve operational schema and evidence retention; define exact legacy status projection; approve the migration and replay oracle; assign accountable reviewers. None is presumed resolved here.

## 44. Known limitations

This document does not run tests, verify present-day regulatory text, certify source history, establish deployed API routes, prove Nx target names, or approve migrations. Earlier static source findings are inherited from REC-017–026; runtime behavior remains unverified until execution evidence exists.

## 45. Deliverables from a future authorized run

Produce a completed test ledger, artifact manifests, negative security evidence, legal certification references, migration restore log, unresolved-defect list, signed closure decisions and an updated REC-026 blocker register. Preserve the original OPEN baseline.

## 46. Final readiness assessment

**Current readiness: NOT READY FOR IMPLEMENTATION RELEASE.** Twelve P0 blockers remain OPEN; decisions remain unratified; tests are NOT RUN; no implementation authorization has been granted. REC-027 supplies a reproducible route to evidence, not the evidence itself.

## 47. Proposed next document

**REC-028 — Emergency Preparedness P0 Test Harness and Fixture Contract Specification.** Define exact synthetic fixture schemas, test runner adapters, deterministic replay oracle and CI evidence packaging, pending authorization and repository verification.
