# REC-019 — Emergency Preparedness Evidence Source-of-Truth and Rule Crosswalk Decision Register

**Classification:** Architecture reconciliation / proposed decision register  
**Status:** DRAFT — decisions proposed, not ratified; no implementation authorized  
**Source basis:** `hhscCompliance-develop.zip`, static inspection; REC-017 and REC-018  
**Proposed repository path:** `docs/governance/reconciliation/rec-019-emergency-preparedness-evidence-source-of-truth-and-rule-crosswalk-decision-register.md`  
**Architectural principle:** Knowledge first. RKE governs certified regulatory meaning; operational domains own facts; evaluators produce determinations using both.

## 1. Executive decision request

Approve a versioned, evidence-first crosswalk between the Texas HCS Emergency Preparedness knowledge pack, provider/location operational evidence, and residential compliance checks. **No existing hard-coded evaluator rule code may be treated as legally certified solely because it appears in source.**

## 2. Evidence and confidence legend

- **OBSERVED:** directly present in inspected source.
- **NOT ESTABLISHED:** not demonstrated by inspected source; broader absence not asserted.
- **PROPOSED:** design for review, not current behavior.
- **BLOCKED:** cannot safely ratify without named verification.
- **RATIFIED:** only after recorded approval; none in this register are ratified.

## 3. Source inspection scope

The ZIP contains `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts`, `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts`, `server/src/app/fire-drills/fire-drill.entity.ts`, `server/src/app/remediation/entities/cap-evidence.entity.ts`, and `server/src/app/compliance/entities/compliance-result.entity.ts`. REC-018 traces 13 files, including the Angular emergency page and migrations. No deployment, database, build, or legal citation verification is implied.

## 4. Verified baseline

The RKE definition exposes `TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS`, including a source, rule, requirement, and evidence identifiers. The RKE rule has `status: UNDER_REVIEW`. The evaluator independently hard-codes three codes: `565.23(b)(5)-PLAN_EXISTS`, `565.23(b)(5)-PLAN_ACCESSIBLE`, and `565.23(b)(5)-DRILL_DOCUMENTATION`. It calls three failure-producing methods without consulting evidence, then upserts three `NON_COMPLIANT` findings. Its provider lookup selects the earliest provider record rather than deriving an authenticated provider scope. Fire-drill operational records exist. CAP evidence is tied to remediation. The Angular Emergency Plans page is a placeholder.

## 5. Regulatory authority limitation

The evaluator references `565.23(b)(5)`, the Angular page describes `§565.23(f)`, and the RKE rule cites Chapter 565 broadly. This document **does not determine which provision governs** or whether any code is a correct statement of current Texas law. Regulatory reviewers must verify authoritative text, applicable dates, provider/service applicability, and citation granularity before certification.

## 6. Decision register summary

| ID | Decision proposal | Evidence | Status | Required approval |
|---|---|---|---|---|
| EP-D01 | Operational domain owns emergency plan records | No dedicated record established | PROPOSED | Domain + security |
| EP-D02 | Fire-drill domain owns drill facts | Fire-drill entity present | PROPOSED | Domain + regulatory |
| EP-D03 | Staff accessibility evidence is independent | No query established | PROPOSED | Domain + regulatory |
| EP-D04 | CAP evidence remains remediation-scoped | CAP evidence linked to CAP/result | PROPOSED | Remediation owner |
| EP-D05 | RKE owns requirement/evidence meaning | RKE identifiers present | PROPOSED | Regulatory certifier |
| EP-D06 | Explicit versioned rule crosswalk | IDs differ | BLOCKED | Regulatory + architecture |
| EP-D07 | Missing evidence is not automatically failure | Evaluator hard-codes failures | PROPOSED | Regulatory certifier |
| EP-D08 | Tenant/provider ownership derives from auth context | Earliest-provider lookup observed | PROPOSED | Security |
| EP-D09 | Immutable evidence snapshots and determinations | Not established | PROPOSED | Architecture + audit |
| EP-D10 | Rechecks append, never rewrite historical findings | CAP model present | PROPOSED | Compliance owner |
| EP-D11 | Binder consumes approved snapshots | Not established | PROPOSED | Binder owner |
| EP-D12 | No rollout without full vertical-slice acceptance | No runtime tests executed | PROPOSED | Release authority |

## 7. EP-D01 — Emergency plan source of truth

**Decision:** A provider/location-scoped operational emergency-plan aggregate is the factual source of truth for plan existence, content, validity, signatures, and document revisions. Before creating a new table, search the full repository and actual database for an equivalent generic document/plan store. **RKE must not store provider-specific plan facts.**

**Proposed minimum fields:** tenantId, providerId, locationId, planId, revisionId, content/object reference, digest, createdAt, effectiveFrom, effectiveTo, status, authoredBy, approvedBy, approvedAt, recordedAt, supersedesRevisionId. Do not assume all fields are currently present.

**Acceptance:** A verified plan at location A cannot satisfy location B; an old plan revision remains historically retrievable.

## 8. EP-D02 — Fire-drill operational authority

The existing `FireDrillEntity` is the candidate source of truth for actual drill events, observations, and documentation. Regulatory applicability and acceptable cadence belong to a certified RKE revision. A stored drill row alone does not establish compliance.

**Acceptance:** The evaluator filters by authenticated provider, location, event date, completeness, and applicable rule; incomplete or out-of-period rows cannot silently satisfy a requirement.

## 9. EP-D03 — Staff access and acknowledgment

Plan existence and staff accessibility are separate factual propositions. Propose an evidence aggregate recording staff role, plan revision accessed, access method, acknowledgment/verification time, location, and reviewer. Avoid creating individual-level tracking beyond the certified rule's legitimate purpose; apply minimum-necessary privacy controls.

**Acceptance:** Uploading a plan cannot automatically mark accessibility verified.

## 10. EP-D04 — CAP evidence boundary

`CapEvidenceEntity` is remediation-linked. A CAP upload may support a subsequent correction/recheck only when its provenance and approved crosswalk establish relevance. It does not retroactively prove original compliance.

## 11. EP-D05 — RKE regulatory authority

RKE owns authoritative source references, applicability, requirements, evidence definitions, rule conditions, effective dating, and certification. The current emergency rule's `UNDER_REVIEW` status must not be interpreted as certified. Evaluators may only consume certified, resolved revisions once the certification infrastructure is ratified and implemented.

## 12. EP-D06 — Crosswalk decision

Create an explicit, immutable, revisioned crosswalk with independent approval. No string-prefix matching between `565.23...` codes and `tx-hcs-*` IDs. The crosswalk must bind regulatory source snapshot, RKE rule/requirement/evidence IDs, evaluator check ID, result rule code, applicability, effective interval, evaluator contract version, and approver.

**Status:** BLOCKED pending exact legal provision and semantics review.

## 13. Crosswalk candidate matrix — NOT CERTIFIED

| Evaluator code (observed) | Factual question | Candidate operational source | Candidate RKE relationship | State |
|---|---|---|---|---|
| `565.23(b)(5)-PLAN_EXISTS` | Is a qualifying plan on file? | Emergency-plan aggregate (not established) | Emergency-plan requirement / `emergencyPlan` evidence | UNMAPPED |
| `565.23(b)(5)-PLAN_ACCESSIBLE` | Is qualifying access verified? | Staff access/acknowledgment (not established) | Requires regulatory evidence definition review | UNMAPPED |
| `565.23(b)(5)-DRILL_DOCUMENTATION` | Is qualifying drill documentation present? | Fire-drill records (present) | Requires rule applicability/cadence review | UNMAPPED |

These rows are **candidate technical associations**, not legal equivalences, certified mappings, or permission to evaluate.

## 14. Canonical crosswalk contract (proposed)

```ts
type RuleCrosswalk = Readonly<{
  crosswalkId: string;
  crosswalkRevisionId: string;
  authority: 'RKE';
  jurisdiction: 'TX';
  program: 'HCS';
  sourceSnapshotId: string;
  certifiedKnowledgeRevisionId: string;
  rkeRuleId: string;
  rkeRequirementId: string;
  rkeEvidenceRequirementIds: readonly string[];
  evaluatorCheckId: string;
  persistedResultRuleCode: string;
  operationalSourceTypes: readonly string[];
  applicabilityExpressionVersion: string;
  validFrom: string;
  validTo?: string;
  approvedBy: string;
  approvedAt: string;
  contentDigest: string;
}>;
```

## 15. Crosswalk uniqueness and integrity

Enforce one unambiguous approved mapping for a given program, evaluator check, location/service applicability, effective instant, and known-as-of time. Overlap, gaps, digest mismatch, withdrawn approval, or unknown RKE revision must fail closed with an explicit diagnostic; never fall back to a newer rule silently.

## 16. Evidence state contract

**Proposed:** `NOT_COLLECTED`, `MISSING`, `SUBMITTED`, `UNVERIFIED`, `VERIFIED`, `REJECTED`, `EXPIRED`, `NOT_APPLICABLE`, `INACCESSIBLE`. Separate evidence state from legal determination. A lack of uploaded evidence is not proof that a plan does not exist unless the certified rule explicitly defines that inference.

## 17. Determination outcome contract

Use existing compatible statuses only after checking their full enum and API consumers. Prefer explicit `COMPLIANT`, `NON_COMPLIANT`, `UNKNOWN` semantics with structured reason codes. `UNKNOWN` is required for unresolved evidence, missing certification, or ambiguous applicability. Do not fabricate compliance.

## 18. Temporal model

Track at least `occurredAt`, `effectiveAt`, `uploadedAt`, `verifiedAt`, `evaluatedAt`, `recordedAt`, and `knownAt` where applicable. Later-arriving evidence creates a new as-known determination; it does not rewrite a prior historical conclusion.

## 19. Proposed evidence snapshot

```ts
type EmergencyEvidenceSnapshot = Readonly<{
  snapshotId: string;
  tenantId: string;
  providerId: string;
  locationId: string;
  applicableAt: string;
  knownAt: string;
  sources: readonly {
    sourceType: 'EMERGENCY_PLAN' | 'FIRE_DRILL' | 'STAFF_ACCESS' | 'CAP_EVIDENCE';
    recordId: string;
    recordRevisionId?: string;
    evidenceRequirementId?: string;
    contentDigest: string;
    observedAt: string;
    verificationState: string;
  }[];
  snapshotDigest: string;
}>;
```

## 20. Evaluation request contract

Input must include authenticated tenant/provider scope, location, evaluation purpose, applicableAt/knownAt, certified knowledge revision, approved crosswalk revision, immutable evidence snapshot, and evaluator version. Client-supplied provider IDs must never override server-resolved ownership.

## 21. Determination manifest

Persist immutable references/digests for source snapshot, RKE revision, crosswalk revision, evidence snapshot, evaluator version, input and output digests, actor, tenant, location, timestamps, and result IDs. This is proposed; the inspected result entity does not establish it.

## 22. Tenant and location isolation

Reject any provider/location relationship not authorized by the current principal. Remove the earliest-provider selection pattern from the target design. Require tests for cross-tenant reads, writes, event processing, attachments, and binder exports.

## 23. Security and sensitive information

Emergency plans can contain addresses, emergency contacts, health support needs, and other sensitive information. Enforce scoped access, encryption, object integrity, retention, audit logs, redacted diagnostics, and signed object access where appropriate. Do not place sensitive content in event payloads or plain logs.

## 24. Certification responsibilities

| Responsibility | Proposed owner | Restriction |
|---|---|---|
| Verify legal source and applicability | Regulatory reviewer | Cannot be inferred from code |
| Approve RKE requirement semantics | Authorized regulatory certifier | Must be independent of author |
| Approve evidence crosswalk | Regulatory + architecture reviewers | Requires source citation resolution |
| Maintain operational plan/drill facts | Operational domain owners | Cannot edit certified rules |
| Execute determination | Compliance evaluator | Cannot certify its own rule |
| Preserve audit/history | Shared Intelligence | Cannot silently rewrite snapshots |

## 25. Proposed workflow

`Authoritative regulation → reviewed RKE revision → certified requirement/evidence definitions → approved crosswalk → authorized operational evidence snapshot → evaluator → immutable determination → remediation/recheck → binder`. **Target only; not verified runtime flow.**

## 26. API boundaries

Proposed versioned endpoints for plan revisions, drill evidence references, staff-access attestations, crosswalk review, evaluation requests, and determination history. Exact paths/DTOs require the canonical API registry and security review; do not introduce ad hoc routes before approval.

## 27. Event boundaries

Proposed events: `EmergencyPlanRevisionRecorded`, `FireDrillEvidenceRecorded`, `StaffAccessEvidenceVerified`, `RuleCrosswalkApproved`, `EmergencyDeterminationRecorded`, `EmergencyRecheckRecorded`. Names and payloads are candidates pending canonical event registry assignment. Require outbox, idempotency, actor provenance, and tenant scoping.

## 28. Migration and reuse

Inventory existing generic document and evidence tables before introducing plan storage. Reuse existing fire-drill facts without reclassifying them as certified evidence automatically. CAP attachments remain linked to corrective action. No historical certifications or verification timestamps may be invented in backfill.

## 29. Legacy findings

Existing hard-coded `NON_COMPLIANT` rows must not be retroactively labeled as certified determinations. Preserve their provenance and identify them as legacy evaluator outputs until a governed remediation/backfill policy is approved.

## 30. Regulatory citation resolution checklist

Record official text and URL, publication/effective dates, exact section/subsection, covered provider/service/location types, plan existence criteria, accessibility criteria, drill requirements (if applicable), exceptions, source snapshot digest, reviewer identity, and certifier approval. The `565.23(b)(5)` versus `§565.23(f)` discrepancy remains OPEN.

## 31. Decision approval evidence

Each EP-D decision requires approver, timestamp, rationale, alternatives, risk acceptance, linked code evidence, linked authoritative regulation where applicable, and a stable decision revision. Blank approvals mean pending, not implied consent.

## 32. Test EPX-01 — Verified plan

Given approved mapping and qualifying verified plan evidence, the evaluator must not emit a fabricated missing-plan finding. **NOT EXECUTED.**

## 33. Test EPX-02 — Missing/unverified evidence

Given no evidence or unverified evidence, output must match certified semantics with explicit uncertainty; never claim a factual absence without basis. **NOT EXECUTED.**

## 34. Test EPX-03 — Cross-tenant isolation

Evidence for provider B or location B must not satisfy provider A/location A. **NOT EXECUTED.**

## 35. Test EPX-04 — Drill validity

An incomplete, expired, out-of-scope, or wrong-location drill record must not satisfy a certified check. **NOT EXECUTED.**

## 36. Test EPX-05 — Accessibility independence

Plan upload must not count as staff access verification. **NOT EXECUTED.**

## 37. Test EPX-06 — Unapproved crosswalk

Evaluation fails closed when mapping is missing, ambiguous, revoked, or not effective at applicableAt. **NOT EXECUTED.**

## 38. Test EPX-07 — Historical replay

Replay resolves original certified RKE revision, crosswalk, evidence snapshot, and evaluator build; later uploads do not mutate historical outputs. **NOT EXECUTED.**

## 39. Test EPX-08 — CAP/recheck distinction

CAP evidence can support a later recheck without rewriting the original finding. **NOT EXECUTED.**

## 40. Test EPX-09 — Tamper detection

Altered object digest or evidence reference blocks determination/binder assembly and raises audit evidence. **NOT EXECUTED.**

## 41. Test EPX-10 — Citation conflict

Unresolved legal source citation blocks certification and crosswalk publication. **NOT EXECUTED.**

## 42. Release gates

G1 source citation ratified; G2 RKE revision certified; G3 evidence source ownership approved; G4 crosswalk approved; G5 provider/tenant authorization verified; G6 immutable history verified; G7 integration tests passing; G8 audit/binder trace passing; G9 explicit implementation/release authorization. **All pending.**

## 43. Risks

False deficiency findings from unconditional evaluator; provider data leakage from earliest-provider lookup; regulatory miscitation; overclaiming CAP evidence; nonreproducible historical outputs; duplication of document stores; premature certification; hidden behavior changes during migration.

## 44. Open questions

1. What official, effective-dated provision governs each check?
2. Is there an existing generic document store appropriate for plan revisions?
3. Which staff acknowledgment evidence is legally necessary, if any?
4. What drill evidence and frequency is actually required for each covered service type?
5. Who holds independent regulatory certification authority?
6. How are legacy hard-coded findings labeled and retained?
7. Which current API consumers depend on the three hard-coded codes?

## 45. Required next evidence

Inspect all generic document and evidence entities/services, fire-drill ownership guards, provider/location authorization, RKE evidence requirement arrays, compliance-result status enum, actual API consumers, and authoritative Texas regulation with effective dates. Do not close decisions from naming similarities alone.

## 46. Ratification register

| Decision range | Proposed | Ratified | Blocked/pending |
|---|---:|---:|---:|
| EP-D01–EP-D12 | 12 | 0 | 12 |

**No signature or approval is implied.**

## 47. Relationship to previous records

REC-017 identifies the incomplete vertical slice. REC-018 establishes operational evidence and rule-code gaps. REC-013–REC-016 establish wider certification, persistence, and consumer integration dependencies. REC-019 records the decisions that must be made before implementation.

## 48. Explicit non-authorization

This document does not authorize code, schema, API, rule, certification, production data, or binder changes. It does not establish current legal compliance or production behavior. Tests are specified only.

## 49. Proposed next deliverable

**REC-020 — Emergency Preparedness Evidence and Crosswalk Implementation Readiness Matrix**: map each EP-D decision to concrete repository paths, migration prerequisites, test owners, acceptance gates, and a decision-ready implementation sequence, without writing code before authorization.

## 50. Final determination

**The required source-of-truth separation and crosswalk are defined as proposals, not implemented facts.** Until legal citation resolution, certified RKE revision, operational evidence authority, explicit mapping, tenant scoping, and reproducible determinations are verified, the current unconditional Emergency Plans findings must not be represented as evidence-driven certified compliance results.
