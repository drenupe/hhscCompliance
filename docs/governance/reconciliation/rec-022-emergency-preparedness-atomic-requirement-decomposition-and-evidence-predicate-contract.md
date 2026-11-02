# REC-022 — Emergency Preparedness Atomic Requirement Decomposition and Evidence Predicate Contract

**Project:** McCaskill Projects Regulatory Intelligence Platform  
**Scope:** Texas HCS Knowledge Pack — Emergency Preparedness / Fire Drills  
**Prepared:** 2026-11-02  
**Status:** PROPOSED CONTRACT — NOT CERTIFIED; NOT IMPLEMENTED  
**Implementation authorization:** NOT GRANTED  
**Predecessor:** REC-021; also REC-017–020 and REC-008–009

## 1. Executive purpose
Decompose the 14 proposed crosswalk entries from REC-021 into independently assessable requirements and evidence predicates. Regulatory descriptions are carried forward from REC-021; predicate designs and operational semantics below are engineering proposals, not independent legal verification.

## 2. Source and verification boundaries
Primary anchor: 26 TAC §565.23(e)–(f), subject to authoritative text, amendment, effective-date, and independent reviewer verification required by REC-021. Do not assume HCSSA Chapter 558 applies. The uploaded repository has an RKE emergency-preparedness rule with broad Chapter 565 citation and `UNDER_REVIEW` statuses.

## 3. Governing architectural invariants
RKE owns certified obligation and interpretation; Operational Domains own observations and records; Applied Compliance Intelligence evaluates; Shared Intelligence provides evidence, approvals, audit and binder services. No evaluator invents obligations, no missing query is treated as proof of a breach, and no draft rule produces a certified finding.

## 4. Decomposition method
Each obligation is represented as an atomic predicate with stable crosswalk ID, exact subsection, actor, subject scope, time window, qualifying evidence, counterevidence, failure mode, knowledge revision and source provenance. Composite parent requirements are grouping-only unless explicitly certified as independently assessable.

## 5. Atomic requirement matrix
| ID | Citation | Source-derived obligation (REC-021 paraphrase) | Candidate evidence | Proposed evaluation predicate | Grain | Temporal context | Caveat |
|---|---|---|---|---|---|---|---|
| EP-CW-001 | §565.23(f)(1) | Staff review individual emergency plans before services | staff review attestations, service start, plan revision | all applicable staff/person-plan pairs reviewed before service | staff × individual × plan revision | pre-service | Missing staff or service date → INSUFFICIENT_EVIDENCE |
| EP-CW-002 | §565.23(f)(2) | Staff instructed on plan location | instruction acknowledgment, staff roster | applicable staff have documented location instruction | staff × residence | before assignment (proposed; confirm rule timing) | No instruction record alone does not prove no instruction |
| EP-CW-003 | §565.23(f)(3) | Emergency plan documentation accessible to staff | plan availability observation, plan location | verified availability to relevant staff | residence × assessment date | at assessment | Access failure verified → NONCOMPLIANT |
| EP-CW-004 | §565.23(f)(3)(A)(i) | Plan addresses geographically relevant emergencies | plan revision, hazard applicability | relevant hazards addressed | residence × plan revision | plan effective date | Geographic hazards require reviewed applicability |
| EP-CW-005 | §565.23(f)(3)(A)(ii) | Plan addresses needs of individuals | individual needs and plan mappings | each applicable individual need addressed | residence × individual × plan revision | at assessment | Do not expose PHI in generic findings |
| EP-CW-006 | §565.23(f)(3)(A)(iii) | Plan addresses fire-drill responses | drill response evidence, plan revision | documented response integration | residence × plan revision | at assessment | Missing drill data may block evaluation |
| EP-CW-007 | §565.23(f)(3)(B) | Emergency numbers posted and accessible | posted-number observation | verified posting and access | residence × assessment date | at assessment | Photograph without verified date/location insufficient |
| EP-CW-008 | §565.23(e)(1)(A) | At least one drill per 90 days | fire drill dates and residence IDs | no qualifying 90-day interval without drill | residence × rolling interval | rolling 90 days | Boundary arithmetic and residence openings require review |
| EP-CW-009 | §565.23(e)(1)(B) | At least four drills per 365 days | fire drill records | count qualifying drills ≥4 | residence × rolling 365 days | rolling 365 days | Duplicate or cancelled drills excluded |
| EP-CW-010 | §565.23(e)(1)(C) | Two annual drills during sleeping hours | drill time and sleeping-hours evidence | at least 2 qualifying sleeping-hour drills | residence × 365-day window | rolling annual window; legal interpretation review | No assumed universal clock interval |
| EP-CW-011 | §565.23(e)(2) | Staff drill participation within 90 days of hire and annually | hire dates, attendance, drill records | each applicable staff member meets timing | staff × residence × employment interval | 90 days and annual | Leave/transfer applicability needs review |
| EP-CW-012 | §565.23(e)(3) | Staff can explain emergency plans | documented competency observation | verified staff explanation | staff × residence × assessment | at assessment | Attestation alone may not prove ability |
| EP-CW-013 | §565.23(e)(4) | Train staff who do not follow plan during drill | drill exception and training records | triggered training documented | staff × drill exception | following observed failure; precise deadline verify | No failure event → NOT_APPLICABLE |
| EP-CW-014 | §565.23(e)(5) | Revise plan if individual cannot exit safely | drill outcome, revision lineage | triggered plan revision verified | individual × drill exception × plan | following unsafe exit finding; timing verify | Do not infer safe exit from no recorded exception |

## 6. Canonical requirement contract

```ts
type AuthorityStatus = 'DRAFT' | 'UNDER_REVIEW' | 'CERTIFIED' | 'SUPERSEDED';
type Outcome = 'COMPLIANT' | 'NONCOMPLIANT' | 'INSUFFICIENT_EVIDENCE' | 'NOT_APPLICABLE' | 'REQUIRES_REVIEW';
interface AtomicRequirement {
  requirementId: string; crosswalkId: string; parentRuleId: string;
  sourceSnapshotId: string; exactCitation: string; authority: 'RKE';
  jurisdiction: 'TX'; program: 'HCS'; applicableResidenceTypes: string[];
  actorRole: string; subjectGrain: string; effectiveFrom: string; effectiveTo?: string;
  knowledgeRevisionId: string; contentDigest: string; status: AuthorityStatus;
  predicateId: string; evidenceTypes: string[]; reviewerApprovalId?: string;
}
```
Stable IDs must not be silently reused after material interpretation changes. The code is illustrative, not an existing exported repository type.

## 7. Evidence envelope and operational provenance

```ts
interface EvidenceEnvelope {
  evidenceId: string; tenantId: string; providerId: string; residenceId?: string;
  subjectId?: string; evidenceType: string; sourceSystem: string;
  occurredAt?: string; observedAt?: string; recordedAt: string;
  validFrom?: string; validTo?: string; contentDigest: string;
  sourceRecordId: string; revisionId?: string; supersedesEvidenceId?: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'DISPUTED';
  accessClassification: 'INTERNAL' | 'SENSITIVE' | 'PHI';
}
```
Evidence is an immutable reference/snapshot, not an unrestricted duplicate of sensitive records.

## 8. Predicate result contract

```ts
interface PredicateResult {
  requirementRevisionId: string; predicateRevisionId: string;
  tenantId: string; providerId: string; residenceId: string;
  applicableAt: string; knownAt: string; outcome: Outcome;
  evidenceRefs: { id: string; digest: string; role: 'SUPPORT'|'COUNTER'|'CONTEXT' }[];
  reasons: string[]; missingEvidenceTypes: string[];
  sourceSnapshotId: string; evaluatorVersion: string;
  inputDigest: string; outputDigest: string; determinationManifestId: string;
}
```
No release until requirement and predicate revisions are certified and evidence authorization passes.

## 9. Outcome decision semantics

`COMPLIANT`: applicable obligation satisfied by verified, sufficient evidence. `NONCOMPLIANT`: verified facts establish a breached obligation under certified predicate. `INSUFFICIENT_EVIDENCE`: cannot determine because required inputs are missing, unavailable, or unverifiable. `NOT_APPLICABLE`: certified applicability logic excludes subject. `REQUIRES_REVIEW`: contradictory facts, ambiguous scope, uncertain timing or unresolved interpretation. Never collapse these states into a binary flag.

## 10. Evidence absence versus verified absence

A failed API call, empty result from an unauthorized scope, missing attachment, stale index or unreviewed document is **not** a verified absence. To establish an absence-based deficiency, require a certified completeness protocol, verified coverage of the relevant time window and a negative attestation or other evidence proving the required act did not occur.

## 11. Temporal evaluation

All windows use local regulatory time and unambiguous instants; store timezone, boundaries and calculation convention. A rolling 90-day rule and rolling 365-day rule are separate tests. The interpretation of sleeping hours, annual participation and first-service timing requires regulatory approval; illustrative predicates must not hard-code an unverified legal convention.

## 12. Drill qualification rules

Qualifying drill status, residence association, completion timestamp, attendance, sleep-hour classification, correction and duplicate handling require approved rules. Count only verified qualifying drills. Preserve the original and corrected record revisions.

## 13. Staff coverage and lifecycle

Join staff assignment, hire/start dates, residence assignment, individual support responsibility, attendance and competency records using authorized tenant-scoped identifiers. Define transfer, leave, rehiring and contractor applicability before release.

## 14. Individual-specific plans

Person-specific support needs are sensitive operational data. Evaluate inside the authorized service boundary; show generic deficiency summaries without exposing diagnoses or other PHI in dashboard aggregates.

## 15. Trigger-based obligations

EP-CW-013 and EP-CW-014 are triggered by observed events. `NOT_APPLICABLE` requires verified no-trigger context, not merely missing trigger records. Track the trigger evidence and required response as separate immutable facts.

## 16. Questionnaire field classification

Every existing RKE question is tagged `REQUIRED_BY_RULE`, `IMPLEMENTATION_CONTROL`, or `GUIDANCE_ONLY` with exact citation or policy provenance. Do not represent coordinator, continuity, utilities, medication, signature or transport fields as expressly mandated by §565.23 unless reviewed legal support exists.

## 17. Applicability resolution

Evaluate program, provider, residence type, date and subject before any predicate. Ambiguous program or jurisdiction returns `REQUIRES_REVIEW`, not an inferred applicability.

## 18. Crosswalk revision and certification

Each atomic crosswalk row must be separately reviewable with source snapshot, precise citation, text interpretation, effective interval, predicate version, evidence contract and independent certifier signature. `UNDER_REVIEW` knowledge cannot produce certified determinations.

## 19. Knowledge resolution API

```ts
resolveRequirement({ authority:'RKE', jurisdiction:'TX', program:'HCS',
  crosswalkId:'EP-CW-008', applicableAt:'2026-06-01T00:00:00-05:00',
  knownAt:'2026-06-15T00:00:00Z', purpose:'COMPLIANCE_EVALUATION' });
```
Resolver must fail closed on missing, overlapping or uncertified versions; never silently substitute latest.

## 20. Evidence adapter interface

```ts
interface EvidenceAdapter {
  collect(input: { tenantId: string; providerId: string; residenceId: string;
    requirementRevisionId: string; from?: string; to?: string;
    actorId: string; purpose: string }): Promise<EvidenceEnvelope[]>;
}
```
Adapters must enforce authorization and return availability/error metadata separately from zero records.

## 21. Evaluation pipeline

Authenticate and authorize → resolve applicable certified requirement → resolve certified predicate → collect operational evidence → validate coverage and integrity → compute outcome → persist immutable manifest → emit auditable determination event → project provider/location workbench.

## 22. Historical determination manifest

Manifest includes tenant/provider/location, effective and known-at time, source snapshot and digest, requirement/crosswalk/predicate revisions, evidence IDs/digests, evaluator build/version, input/output digests, actor and correlation ID. Replay references the exact originals.

## 23. Error and failure policy

Authorization failure → deny, audit; source unavailable → no definitive result; digest mismatch → quarantine/review; overlapping knowledge intervals → fail closed; invalid evidence date → review; computation exception → retryable operational error, not noncompliance.

## 24. Tenant and residence isolation

Enforce tenant/provider ownership on every evidence lookup and determination write. Residence scope is mandatory for residential findings, even when the provider-wide dashboard aggregates results. Least-privilege PHI access and audit are mandatory.

## 25. Evidence quality scoring

Completeness, freshness, verification, contradiction and time coverage may inform review priority; a heuristic score must never replace the certified legal predicate.

## 26. Finding and remediation linkage

Finding must identify exact requirement and supporting/counter evidence, avoid duplicate open findings for identical scope/version, and deep-link to the affected residence. CAP, notes, attachments and recheck are operational workflows, not legal rule authorities.

## 27. Events and outbox

Proposed events: `rke.requirement.certified.v1`, `evidence.snapshot.verified.v1`, `compliance.determination.recorded.v1`, `compliance.determination.superseded.v1`. IDs and payload schemas remain subject to canonical event registry ratification. Use transactional outbox, idempotent consumers and correlation IDs.

## 28. Binder and export behavior

Survey binder includes source citation, certified revision, evidence provenance, finding, remediation and manifest reference, with access-controlled redaction. Do not retroactively rewrite released binders.

## 29. Repository reuse candidates

Existing RKE emergency-preparedness definitions, fire-drill operational records, compliance results and CAP evidence are reuse candidates. REC-018 identified missing dedicated emergency-plan and staff acknowledgment records; existence and suitability require code-level re-verification before migration.

## 30. Non-goals

This specification does not create new Texas regulatory duties, certify the RKE pack, modify evaluators, issue a compliance finding, or approve implementation.

## 31. Atomic acceptance tests

| ID | Test | Expected outcome |
|---|---|---|
| EP-022-T01 | Valid accessible plan verified | Only applicable plan-access predicate COMPLIANT |
| EP-022-T02 | Missing database connection | Operational error or INSUFFICIENT_EVIDENCE; never NONCOMPLIANT |
| EP-022-T03 | Verified absent posting | Posting predicate NONCOMPLIANT when certification supports it |
| EP-022-T04 | Three drills in 365 days | Annual count predicate NONCOMPLIANT if coverage complete |
| EP-022-T05 | Drill exactly on 90-day boundary | Approved boundary convention applied deterministically |
| EP-022-T06 | Two sleeping-hour drills without approved time classification | REQUIRES_REVIEW |
| EP-022-T07 | New staff without hire date | INSUFFICIENT_EVIDENCE |
| EP-022-T08 | Staff review after service begins | Temporal predicate tests actual dates |
| EP-022-T09 | No observed training trigger and complete event coverage | NOT_APPLICABLE |
| EP-022-T10 | Unknown trigger coverage | INSUFFICIENT_EVIDENCE |
| EP-022-T11 | Individual unsafe exit with revised plan | Revision predicate checks lineage and timing |
| EP-022-T12 | Unverified evidence digest | Quarantine/REQUIRES_REVIEW |
| EP-022-T13 | Cross-tenant evidence | Denied and audited |
| EP-022-T14 | RKE rule UNDER_REVIEW | Certified evaluation blocked |
| EP-022-T15 | Historical knowledge superseded | Replay uses original revision |
| EP-022-T16 | Conflicting plan versions | REQUIRES_REVIEW |
| EP-022-T17 | Provider dashboard aggregates locations | No cross-location evidence leakage |
| EP-022-T18 | Questionnaire policy-only field missing | No fabricated legal violation |

All tests are **specified, not executed**.

## 32. Regulatory review checklist

Official §565.23 text and amendment history; applicability of residence types; legal interpretation of each time window; sleeping-hours definition; staff obligations and triggers; effective dates; source snapshot and reviewer sign-off.

## 33. Engineering readiness checklist

Versioned contract registry, immutable storage, authenticated evidence adapters, temporal resolver, approved rule-to-evidence mappings, safe result states, audit events, replay tests and UI behavior.

## 34. Open decisions

Decide requirement ID scheme, parent grouping semantics, verified-absence protocol, annual window conventions, evidence sufficiency and staff coverage, record retention, conflict review ownership and official source version selection.

## 35. Release gates

G1 primary source verification; G2 regulatory owner approves 14 atomic obligations; G3 predicate and evidence contracts ratified; G4 certification and version resolver verified; G5 tenant/PHI controls verified; G6 automated tests passed; G7 historical replay and binder trace passed; G8 explicit implementation/release authorization.

## 36. Risk register

High: false deficiency from absent evidence; High: wrong effective-date rule; High: unapproved operational control mislabeled law; High: tenant data leakage; High: missing immutable history; Medium: inconsistent drill window boundaries. Each requires named owner and documented mitigation before release.

## 37. Traceability to REC-021

EP-CW-001–014 retain their source-derived paraphrases and citations from REC-021. REC-021-T01–T12 remain applicable; EP-022-T01–T18 expand executable predicate-level cases. No earlier approval or execution is implied.

## 38. Repository change boundary

No repository modifications are authorized. This file is a proposed documentation artifact only; migrations, APIs, new entities and evaluator refactoring require separately approved implementation plan.

## 39. Acceptance and sign-off

Required sign-offs: regulatory authority reviewer, RKE certification owner, operational data owner, security/tenant isolation owner, applied intelligence owner, quality lead and architecture governance. All are **pending**.

## 40. Final disposition and next artifact

**Disposition:** Atomic contract proposed; legal text/effective dates, predicate ratification and runtime tests remain open. **Next proposed deliverable:** REC-023 — Emergency Preparedness Evidence Adapter and Evaluator Contract-to-Code Trace. Implementation authorization: **NOT GRANTED**.
