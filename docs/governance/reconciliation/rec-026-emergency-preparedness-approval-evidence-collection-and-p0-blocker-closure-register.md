# REC-026 — Emergency Preparedness Approval Evidence Collection and P0 Blocker Closure Register

## 1. Executive purpose

Establish an evidence-collection and closure register for the critical blockers identified in REC-017–025, with REC-025 as the immediate controlling approval packet. **This is a planning and verification artifact, not a closure certificate.** No signature, legal certification, build result, security test, or implementation approval is inferred.

## 2. Document control

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Class:** Reconciliation / P0 blocker closure register  
**Date:** 2026-11-02  
**Status:** DRAFT — BLOCKERS OPEN; APPROVALS PENDING; IMPLEMENTATION NOT AUTHORIZED  
**Proposed repository path:** `docs/governance/reconciliation/rec-026-emergency-preparedness-approval-evidence-collection-and-p0-blocker-closure-register.md`

## 3. Evidence and authority hierarchy

1. Current repository source establishes what is present, not what is safe at runtime. 2. REC-017–024 record prior source findings and proposed decisions. 3. REC-025 defines twelve approval requests, none approved. 4. Authoritative Texas regulations and their effective history must be independently verified and certified by an authorized reviewer. 5. Executed tests and signed approvals are the only admissible evidence of the corresponding gates.

## 4. Terminology and evidence grades

`S` = inspected static source; `D` = proposed design; `L` = independently checked legal/source history; `T` = executed automated/manual test with reproducible artifacts; `A` = authenticated approval; `O` = observed operation in controlled environment; `U` = unresolved. A design document is never upgraded to T, A, or O by citation alone.

## 5. Closure state machine

`OPEN → EVIDENCE_COLLECTING → REVIEW_READY → VERIFIED → APPROVED_FOR_GATE → CLOSED`. Any failed evidence returns to `OPEN` or `REWORK_REQUIRED`. `WAIVED` requires explicit authorized risk acceptance, expiry, compensating controls, and cannot waive a legal, tenant-isolation, or integrity obligation. **Initial state for all blockers: OPEN.**

## 6. Separation of duties

Evidence author, technical verifier, regulatory certifier, security reviewer, and final implementation authorizer must be separately identifiable. A person cannot self-approve evidence they produced where independence is required. AI output may draft records but cannot serve as certification or execution evidence.

## 7. P0 blocker master register

| ID | Blocker | REC-025 decisions | Accountable review | Closure state |
|---|---|---|---|---|
| EP-P0-01 | Regulatory citation, applicability, effective history | EP-024-08 | Regulatory/legal | OPEN |
| EP-P0-02 | Trusted provider/location authorization | EP-024-05,09 | Security | OPEN |
| EP-P0-03 | Emergency-plan source-of-truth schema | EP-024-01 | Operational/data | OPEN |
| EP-P0-04 | Staff accessibility/acknowledgment evidence | EP-024-02 | Operational/privacy | OPEN |
| EP-P0-05 | Fire-drill adapter and evidence semantics | EP-024-03 | Fire-drill/compliance | OPEN |
| EP-P0-06 | Certified requirement-to-predicate crosswalk | EP-024-08,09 | RKE/compliance | OPEN |
| EP-P0-07 | No unconditional findings; fail-closed evaluation | EP-024-09 | Compliance/security | OPEN |
| EP-P0-08 | Five-state outcome and legacy compatibility | EP-024-07 | API/frontend | OPEN |
| EP-P0-09 | Immutable evidence and determination history | EP-024-06 | Data governance | OPEN |
| EP-P0-10 | PHI/PII, retention, attachment authorization | EP-024-11 | Privacy/security | OPEN |
| EP-P0-11 | Migration, rollback, data integrity | EP-024-12 | Platform/data | OPEN |
| EP-P0-12 | Approval provenance and independent authorization | EP-024-01–12 | Governance | OPEN |

## 8. Blocker EP-P0-01 — Regulatory citation and effective history

**Decision mapping:** EP-024-08  
**Required evidence:** Official source URL, text snapshot, jurisdiction, subsection, publication/effective dates, amendment history, reviewer certification and digest.  
**Required verification:** Compare rule text and each of 14 proposed atomic entries to source; verify applicability at historical dates.  
**No-go trigger:** Unresolved citation or effective-date conflict.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 9. Blocker EP-P0-02 — Provider and location authorization

**Decision mapping:** EP-024-05, EP-024-09  
**Required evidence:** Trusted JWT/session context contract, provider membership lookup, location ownership enforcement, deny-by-default authorization traces.  
**Required verification:** Cross-provider and cross-location negative tests; missing-context denial; IDOR tests; service-account scopes.  
**No-go trigger:** Any evaluator selects global/oldest provider or accepts arbitrary client provider ID.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 10. Blocker EP-P0-03 — Emergency-plan operational records

**Decision mapping:** EP-024-01  
**Required evidence:** Approved schema and lifecycle, ownership, versioning, effective dates, signatures, data dictionary, migration map.  
**Required verification:** Create/read/update with version history, plan absence, obsolete plan, and location mismatch.  
**No-go trigger:** No authoritative plan record or ambiguous plan state.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 11. Blocker EP-P0-04 — Staff accessibility evidence

**Decision mapping:** EP-024-02  
**Required evidence:** Approved staff-access evidence schema, attestation provenance, role/shift scope, dates, privacy controls.  
**Required verification:** Authorized and unauthorized staff scenarios; expired acknowledgment; missing records.  
**No-go trigger:** Assumption that plan existence proves staff access.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 12. Blocker EP-P0-05 — Fire-drill evidence adapter

**Decision mapping:** EP-024-03  
**Required evidence:** Actual FireDrillEntity field mapping, source IDs, provider/location scoping, time-zone/shift semantics, data quality rules.  
**Required verification:** Historical drill coverage, duplicates, invalid dates, missing shift, wrong provider.  
**No-go trigger:** Reinterpretation of fields without certified rule or unscoped queries.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 13. Blocker EP-P0-06 — Certified crosswalk

**Decision mapping:** EP-024-08  
**Required evidence:** For each atomic requirement: immutable certified revision, exact citation, evidence predicates, evaluation scope, version digest.  
**Required verification:** Requirement-to-evidence completeness; conflicting/missing evidence; retroactive rule changes.  
**No-go trigger:** Hard-coded uncertified requirement treated as authoritative.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 14. Blocker EP-P0-07 — Evidence-based fail-closed evaluator

**Decision mapping:** EP-024-09  
**Required evidence:** Evaluator decision table, explicit outcomes, evidence references, trusted evaluation context, reason codes.  
**Required verification:** Zero-evidence case yields insufficient evidence or review, never automatic noncompliance; tampered evidence denial.  
**No-go trigger:** Unconditional noncompliance or unauthorized evaluation.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 15. Blocker EP-P0-08 — Status compatibility

**Decision mapping:** EP-024-07  
**Required evidence:** Canonical five-state status contract and documented legacy three-state projection, client impact matrix.  
**Required verification:** Round-trip API DTO tests; UI mapping; reporting and binder projection; unknown state handling.  
**No-go trigger:** Lossy mapping silently classifies unknown as noncompliant/compliant.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 16. Blocker EP-P0-09 — Immutable historical integrity

**Decision mapping:** EP-024-06  
**Required evidence:** Evidence revision IDs, content digests, certified rule revision, evaluator build/version, determination manifest, audit lineage.  
**Required verification:** Reproduce earlier result after evidence correction and rule supersession; tamper detection.  
**No-go trigger:** Historical result silently changes or cannot identify prior inputs.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 17. Blocker EP-P0-10 — Privacy and attachment access

**Decision mapping:** EP-024-11  
**Required evidence:** Classification, minimum-necessary access matrix, encryption/storage controls, retention and deletion legal review.  
**Required verification:** Attachment IDOR, signed URL expiry, redaction, retention and audit access tests.  
**No-go trigger:** Unauthorized exposure, missing retention approval, unlogged privileged reads.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 18. Blocker EP-P0-11 — Migration and rollback

**Decision mapping:** EP-024-12  
**Required evidence:** Migration scripts, dry-run logs, record counts/checksums, reversible rollout and backup/restore evidence.  
**Required verification:** Forward/rollback in staging, legacy compatibility, repeatable migration, reconciliation.  
**No-go trigger:** Destructive or unrepeatable migration without validated recovery.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 19. Blocker EP-P0-12 — Independent approvals

**Decision mapping:** EP-024-01–12  
**Required evidence:** Versioned decision artifact, accountable named reviewer, approval timestamp, scope, digest, conditions, signed authorization.  
**Required verification:** Reject unsigned approvals, altered digest, same-person prohibited approval, expired conditions.  
**No-go trigger:** Claim of ratification without authenticated approval.  
**Current state:** OPEN. **Evidence reference:** PENDING. **Verifier:** UNASSIGNED. **Approval:** PENDING.

## 20. Decision-to-blocker traceability

| Decision | Blocker(s) | Priority | Approval |
|---|---|---|---|
| EP-024-01 | 03 | P0 | PENDING |
| EP-024-02 | 04 | P0 | PENDING |
| EP-024-03 | 05 | P0 | PENDING |
| EP-024-04 | Supplementary evidence/P1 | P1 | PENDING |
| EP-024-05 | 02 | P0 | PENDING |
| EP-024-06 | 09 | P0 | PENDING |
| EP-024-07 | 08 | P0 | PENDING |
| EP-024-08 | 01, 06 | P0 | PENDING |
| EP-024-09 | 02, 07 | P0 | PENDING |
| EP-024-10 | Audit/events/P1 | P1 | PENDING |
| EP-024-11 | 10 | P0 | PENDING |
| EP-024-12 | 11 | P0 | PENDING |

## 21. Evidence packet manifest schema

```ts
interface ClosureEvidenceManifest {
  blockerId: string; decisionIds: string[]; sourceRevision: string;
  evidenceItems: Array<{ id: string; kind: "source"|"legal"|"test"|"approval"|"runtime";
    uri: string; sha256: string; collectedAt: string; collectedBy: string; }>;
  reviewerId?: string; verifiedAt?: string; verdict: "PENDING"|"PASS"|"FAIL";
  limitations: string[]; conditions: string[];
}
```
**Proposed contract only**; not an existing repository interface.

## 22. Evidence collection checklist

For each blocker: record exact source revision and environment; collect immutable artifacts; hash artifacts; document reproduction commands; assign independent verifier; capture pass/fail and negative cases; identify unresolved exceptions; obtain role-specific sign-off; record final gate decision. Do not mark complete based on a checkbox alone.

## 23. Source revision and provenance requirements

Capture archive or Git commit SHA, file paths, line ranges, dependency lockfile version, migration state, execution timestamp, environment and evaluator build. The earlier uploaded repository ZIP supports static inspection only; it is not evidence of deployed behavior.

## 24. Regulatory review worksheet

| Field | Required value | Current |
|---|---|---|
| Source authority | Official Texas rule publication | PENDING INDEPENDENT VERIFICATION |
| Program and setting | Texas HCS residential scope | REVIEW REQUIRED |
| Citation | 26 TAC §565.23(e)–(f) candidate | UNRATIFIED |
| Effective dates | As applicable to determination | PENDING |
| Atomic crosswalk | 14 proposed entries from REC-021/022 | NOT CERTIFIED |
| Reviewer identity/signature | Authorized regulatory reviewer | PENDING |
| Certified revision digest | Immutable artifact reference | PENDING |

## 25. Authorization test scenarios

Required negative tests: provider A cannot read/evaluate provider B; location A cannot substitute location B; missing or expired token denied; valid token with no provider membership denied; role without evaluation permission denied; background job must carry scoped service identity; malicious request providerId cannot override trusted context; access denial must not leak existence of foreign records.

## 26. Evaluator outcome oracle

| Facts | Expected canonical outcome |
|---|---|
| Verified compliant facts under certified rule | COMPLIANT |
| Verified violation under certified rule | NONCOMPLIANT |
| Required evidence missing | INSUFFICIENT_EVIDENCE |
| Certified applicability excludes case | NOT_APPLICABLE |
| Conflicting records or unresolved interpretation | REQUIRES_REVIEW |
| No trusted provider context | Authorization failure; no determination |
| No certified rule for applicable time | Controlled unavailable/error; no definitive finding |

## 27. Compatibility decision worksheet

Record every consumer of the existing three-state result, API DTO shape, database enum/constraint, UI badge/filter, dashboard aggregate, remediation flow, event consumer, and binder export. Ratify a lossless canonical status and an explicitly documented legacy projection. Unmapped statuses must not silently collapse into compliance or noncompliance.

## 28. Historical replay test oracle

Given evidence revision E1 and certified rule R1 at time T, persist determination D1 with digests. After E2 corrects evidence and R2 supersedes the rule, replay D1 with E1/R1/evaluator V1 and compare outcome digest. Separately evaluate current state with E2/R2. Never overwrite D1 or its original binder attachment.

## 29. Privacy and retention checklist

Review PHI/PII data classification, minimum-necessary fields, tenant-scoped evidence URLs, attachment malware checks, encryption and key management, audit visibility, retention schedules, legal hold, redaction, subject access controls, and backup disposal. Legal and security reviewers must explicitly approve policy choices.

## 30. Migration rehearsal evidence

Required artifacts: forward migration SQL, pre/post schema snapshots, sampled data checks, checksum totals, dry-run logs, rollback procedure, backup restore validation, lock/downtime assessment, feature flag strategy, compatibility matrix, and approval for production window. None are asserted completed.

## 31. Security stop-ship conditions

Any cross-tenant access; default-provider fallback; client-controlled authorization scope; unauthorized attachment access; missing audit of sensitive access; unverifiable historical evidence; or unapproved legal interpretation is an automatic NO-GO until corrected and independently retested.

## 32. P1 supporting blockers

EP-024-04 (CAP evidence supplementary by default) and EP-024-10 (events, audit, idempotent persistence) are P1 in REC-025, but may become P0 if a release path depends on them. Capture event schema, outbox/retry/idempotency and CAP provenance tests before claiming that path production-ready.

## 33. Execution matrix

| Test suite | Planned coverage | Evidence | Status |
|---|---|---|---|
| Regulatory review | 14 atomic crosswalk entries | Certified source packet | NOT EXECUTED |
| Authorization | Cross-provider/location, identity, permissions | Security test run | NOT EXECUTED |
| Evidence adapters | Plan, staff access, drills, CAP | Fixture and integration logs | NOT EXECUTED |
| Evaluation | Five states, missing/conflicting evidence | Deterministic test report | NOT EXECUTED |
| Historical replay | Revision and digest reproduction | Replay manifest/logs | NOT EXECUTED |
| Compatibility | Legacy APIs/UI/binder | Contract test report | NOT EXECUTED |
| Migration | Forward/rollback/restore | Staging rehearsal report | NOT EXECUTED |

## 34. Reviewer assignment matrix

| Review role | Scope | Named approver | Status |
|---|---|---|---|
| Regulatory certification | Source/crosswalk/effective history | UNASSIGNED | PENDING |
| Security | Tenant and location isolation | UNASSIGNED | PENDING |
| Privacy/legal | PHI, retention, attachments | UNASSIGNED | PENDING |
| Operational domain | Plan/drill/staff evidence semantics | UNASSIGNED | PENDING |
| Compliance engine | Evaluator/outcome contract | UNASSIGNED | PENDING |
| Platform/data | Persistence, migration, replay | UNASSIGNED | PENDING |
| Release authority | Final implementation approval | UNASSIGNED | NOT GRANTED |

## 35. Artifact naming and storage

Suggested evidence path: `docs/governance/reconciliation/evidence/rec-026/<blocker-id>/<artifact-name>`; keep signed approvals and sensitive evidence in restricted storage, with only metadata/digests in general repository documentation. Do not commit PHI, access tokens, or private keys.

## 36. Reconciliation ledger fields

Every entry needs blocker ID, severity, discovered-in document, affected source paths, proposed decision, accountable role, evidence grade, test case IDs, observed outcome, artifact hashes, verification date, reviewer, residual risk, approval status, and reopen trigger.

## 37. Sample ledger entry — provider isolation

**EP-P0-02:** prior static finding from REC-023–025 indicates default/oldest-provider selection in Emergency Plans evaluator. Grade S (prior source assessment), risk high, approval pending. Closure requires authenticated provider context and cross-tenant negative tests. **Current result: OPEN; no test execution evidence supplied.**

## 38. Sample ledger entry — unconditional findings

**EP-P0-07:** prior static finding from REC-017–025 identifies three unconditional noncompliance findings. Grade S (prior source assessment). Closure requires evidence-driven predicates, certified crosswalk, five-state outcome contract, and zero-evidence negative test. **Current result: OPEN.**

## 39. Change-control and invalidation

Any change to regulatory source version, decision text, evidence schema, evaluator logic, tenant authorization, or migration scripts invalidates affected approvals and test results unless the reviewer documents compatibility and renewed verification. Track digest of reviewed version.

## 40. Exception and waiver handling

Waivers require owner, legal/security review where applicable, reason, compensating control, expiry, affected tenants, and explicit risk acceptance. A waiver does not certify a rule, create missing evidence, or allow cross-tenant exposure. Unapproved waivers are not closure.

## 41. Dependency ordering

1. Verify official legal source and certification model. 2. Ratify trusted authorization and evidence ownership. 3. Ratify atomic crosswalk, evaluator outcomes, and compatibility. 4. Ratify immutable history/privacy. 5. Rehearse migrations and integration. 6. Execute independent security/replay/functional tests. 7. Record gate-specific approvals. 8. Seek separate implementation authorization.

## 42. Gate G1 — authoritative rule

PASS only with signed authoritative citation/effective-date review, certified revision ID, and full crosswalk trace. Current: **BLOCKED**.

## 43. Gate G2 — authorization

PASS only with trusted provider/location context and executed denial tests. Current: **BLOCKED**.

## 44. Gate G3 — evidence and predicates

PASS only with approved operational schemas and evidence-based evaluator outcomes; zero-evidence test must not create a definitive deficiency. Current: **BLOCKED**.

## 45. Gate G4 — compatibility

PASS only with documented status migration, API/UI/binder mappings, and successful contract tests. Current: **BLOCKED**.

## 46. Gate G5 — history and privacy

PASS only with immutable determination provenance, successful replay, retention/attachment controls, and independent privacy review. Current: **BLOCKED**.

## 47. Gate G6 — migration and operations

PASS only with successful staging rehearsal, rollback/restore proof, operational observability and approved release plan. Current: **BLOCKED**.

## 48. Gate G7 — final authorization

PASS requires all mandatory gates, authenticated decision ratification, residual-risk acceptance, and separate written authorization to implement. Current: **NOT GRANTED**.

## 49. Risk register

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Uncertified citation | False legal conclusion | Official effective-history review | OPEN |
| Default provider selection | Cross-tenant finding/data leak | Trusted auth + negative tests | OPEN |
| Unconditional deficiencies | False compliance results | Evidence-driven evaluator | OPEN |
| Lossy legacy status mapping | Misleading dashboards/binders | Explicit compatibility contract | OPEN |
| Mutable evidence history | Nonreproducible audit | Immutable revisions and replay | OPEN |
| Unsafe migration | Data loss/outage | Staging restore/rollback | OPEN |

## 50. Decision register for approval meeting

Agenda: ratify EP-024-01–12 individually; record amendments and required re-review; identify actual approvers; accept/reject proposed crosswalk; determine canonical status migration; authorize only the next bounded work package if gates permit. Meeting minutes are not approval without authenticated decision records.

## 51. Approval record template

```yaml
blocker_id: EP-P0-XX
decision_ids: []
contract_digest: PENDING
evidence_manifest_digest: PENDING
reviewer_identity: PENDING
reviewer_role: PENDING
verification_result: PENDING
conditions: []
reviewed_at: PENDING
authorization: NOT_GRANTED
```

## 52. Closure summary dashboard

| Metric | Current |
|---|---:|
| P0 blockers identified | 12 |
| P0 blockers closed | 0 |
| REC-024 decisions ratified | 0 / 12 |
| Independently certified crosswalk | No |
| Executed acceptance suites evidenced | 0 |
| Implementation authorization | Not granted |
These are document-workflow states, **not** production runtime measurements.

## 53. Limitations

This register builds on REC-025 and earlier source traces; it does not independently re-run builds, inspect production data, certify law, execute tests, or sign approvals. Source findings should be revalidated against the exact repository commit before any closure decision. The candidate regulatory citation must not be represented as certified until official effective-history review.

## 54. Proposed next deliverable

**REC-027 — Emergency Preparedness P0 Evidence Execution Plan and Verification Runbook.** Convert this closure register into reproducible commands, fixtures, expected results, reviewer sign-off artifacts, and a controlled test sequence tied to an exact repository commit. The runbook itself will not authorize implementation.

## 55. Final disposition

**REC-026 drafted; all twelve P0 blockers remain OPEN.** No legal certification, independent approvals, successful test executions, production readiness, or implementation authorization is claimed. No repository code has been modified by this document.
