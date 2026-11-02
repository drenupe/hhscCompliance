# REC-017 — Emergency Preparedness RKE-to-Evaluator Vertical Slice Contract and Evidence Matrix

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Status:** Static repository evidence assessment + proposed contract; not ratified  
**Source:** `hhscCompliance-develop.zip` (uploaded repository snapshot)  
**Predecessors:** REC-007 through REC-016; AD-001 through AD-012  
**Implementation authorization:** NOT GRANTED

## 1. Executive determination

The repository contains (a) a detailed Texas HCS Emergency Preparedness knowledge definition, (b) a NestJS Emergency Plans evaluator, (c) persisted compliance results, and (d) an Angular Emergency Plans page. **These are not yet a verified end-to-end knowledge-governed vertical slice.** The evaluator constructs three fixed noncompliant results without consulting the RKE or reading location-specific emergency-plan evidence. The Angular page is a placeholder. Source inspection does not establish a certified knowledge revision, durable knowledge provenance, or historical replay.

## 2. Evidence classification

- **OBSERVED:** directly supported by named source file in the uploaded ZIP.
- **NOT IDENTIFIED:** absent from the inspected path; not a repository-wide proof of nonexistence.
- **PROPOSED:** future contract or design, requiring ratification.
- **UNVERIFIED:** execution, tests, security behavior, or integration not demonstrated.

## 3. Source-of-truth boundary

RKE owns regulatory source, interpretation, rule/requirement, evidence expectations, certification and revision. Operational domains own provider/location data, emergency-plan records, attestations and evidence. Applied Compliance Intelligence evaluates operational facts against a **resolved, certified** RKE revision. Shared Intelligence owns auditable evidence, approvals and binder infrastructure. UX renders state and remediation. AI may explain but must not certify.

## 4. Source inventory

| ID | File (relative to repository root) | Evidence |
|---|---|---|
| S01 | `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` | Regulatory source, rule, requirement, questions, evidence/validation/document/renewal/guidance definitions |
| S02 | `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.ts` | RKE read methods `getRuleKnowledge`, `getRequirementKnowledge`, `getRule`, `getRequirement` |
| S03 | `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | Fixed emergency-plan finding generation |
| S04 | `server/src/app/compliance/engine/residential/residential-compliance.service.ts` | Calls emergency-plans evaluator among residential evaluators |
| S05 | `server/src/app/compliance/compliance-results.service.ts` | `upsertSystemResult` and persisted results operations |
| S06 | `server/src/app/compliance/entities/compliance-result.entity.ts` | Compliance finding persistence shape |
| S07 | `libs/features/residential/src/lib/residential/pages/emergency/emergency-plans.page.ts` | Static Emergency Plans placeholder UI |

## 5. Knowledge identity (observed)

S01 exports `TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS`, including `tx-hcs-rule-emergency-preparedness` and `tx-hcs-requirement-emergency-plan`. Its regulatory source records code `TX-26-TAC-CH-565` and version `2026.1`. Its rule cites `26 TAC Chapter 565` and has status `UNDER_REVIEW`; the requirement likewise has status `UNDER_REVIEW`. These are **repository-authored assertions**, not independently validated legal interpretation or certification.

## 6. Operational questions (observed)

S01 defines structured emergency-plan questions including residence identification/address, coordinators, contacts, hazards, support needs, evacuation, shelter-in-place, communication, transportation, continuity, utility failure, medication, fire safety, approval date and approver. The existence of question definitions does not prove operational answers are captured or persisted.

## 7. Evidence and validation definitions (observed)

S01 declares evidence identifiers for emergency plan, evacuation map, contact list and approval signature, plus required-field validation identifiers. Their presence is **knowledge definition**, not proof that the NestJS evaluator executes those validations.

## 8. Evaluator identity mismatch (observed)

S03 uses hard-coded result codes `565.23(b)(5)-PLAN_EXISTS`, `565.23(b)(5)-PLAN_ACCESSIBLE`, and `565.23(b)(5)-DRILL_DOCUMENTATION`. These do not match the S01 RKE rule ID or requirement ID. No explicit mapping from those codes to the RKE revision is present in the inspected evaluator.

## 9. Evaluator behavior (observed)

S03's `evaluate(locationId)` resolves a provider, constructs navigation metadata, and calls `missingPlan()`, `planNotAccessible()` and `missingDrillDocumentation()` unconditionally. It then invokes `compliance.upsertSystemResult` three times. There is no observed operational plan lookup, evidence inspection, or RKE call in this method.

## 10. Evaluation correctness risk

Because S03 always creates negative results, its output cannot distinguish an actually missing plan from an existing and verified plan. This is a **behavioral limitation of the inspected evaluator**, not evidence that the provider is noncompliant.

## 11. Provider resolution risk

S03's provider resolution must be reviewed for provider/tenant scoping before release; the current vertical slice cannot be accepted solely because a provider ID is resolved. Tenant isolation must be explicit, authenticated, and tested.

## 12. Results persistence (observed)

S05 exposes `upsertSystemResult`, and S06 models persisted results with `providerId`, `locationId`, `ruleCode`, `status`, `severity`, `message`, route metadata and timestamps. This establishes a persistence pathway in source, not verified transaction execution.

## 13. Missing provenance in the inspected result path

S03 does not supply a certified knowledge revision ID, digest, certification ID, source snapshot, evaluator build identity, operational evidence digest, or historical determination manifest to `upsertSystemResult`. Therefore the observed call path cannot establish a reproducible knowledge-bound determination.

## 14. UI behavior (observed)

S07 renders a card labeled “Emergency Plans,” a regulatory reference and a message indicating future plan storage/acknowledgement/checklist work. It does not render a location-specific plan form, actual evidence, or evaluator state in the inspected component.

## 15. Regulatory citation discrepancy requiring review

S01 describes Chapter 565 generally; S03 uses `565.23(b)(5)` rule-code strings; S07 displays `TAC §565.23(f)`. **Do not silently reconcile these references.** Regulatory specialists must verify the applicable legal provisions and date before certification. This document does not declare which citation is correct.

## 16. Observed source flow

`S01 RKE authored definition → S02 available read interface` is a separate source path from `S04 residential orchestration → S03 hard-coded evaluator → S05 results service → S06 compliance_results`. S07 is a separate static UI surface. An authenticated, certified connection across all three paths is **not established**.

## 17. Target vertical slice (proposed)

`Certified RKE emergency-plan revision → temporal resolver → evidence/operational snapshot → evaluator → immutable determination manifest → results projection → remediation UI → binder evidence`. Each arrow must be a named, tested contract with explicit authorization and provenance.

## 18. Contract EP-01: knowledge reference

Proposed required fields: `authority='RKE'`, `knowledgeDefinitionId`, `immutableRevisionId`, `packReleaseId`, `certificationId`, `contentDigest`, `jurisdiction`, `program`, `effectiveFrom`, `effectiveTo`, `knownAt`. Only published certified revisions are eligible for production evaluation.

## 19. Contract EP-02: resolution request

```ts
interface EmergencyKnowledgeResolutionRequest {
  authority: 'RKE';
  jurisdiction: 'TX';
  program: 'HCS';
  requirementId: string;
  applicableAt: string; // ISO timestamp, business-effective time
  knownAt: string;      // ISO timestamp, publication/knowledge time
  purpose: 'CURRENT_EVALUATION' | 'HISTORICAL_REPLAY';
}
```

## 20. Contract EP-03: resolution response

Return immutable revision/certification/source digests and a reasoned temporal match. Reject missing, overlapping, uncertified or ambiguous matches. Do not fall back to newest pack.

## 21. Contract EP-04: operational evidence snapshot

```ts
interface EmergencyPlanEvidenceSnapshot {
  providerId: string;
  locationId: string;
  asOf: string;
  planRecordId?: string;
  planRevisionId?: string;
  accessibilityAttestations: readonly string[];
  drillEvidenceIds: readonly string[];
  evidenceDigests: readonly string[];
  sourceSnapshotDigest: string;
}
```

No missing evidence may be represented as affirmative noncompliance without a defined, certified rule and reliable evidence coverage. Use an `INSUFFICIENT_EVIDENCE` or equivalent outcome when evidence cannot be established.

## 22. Contract EP-05: evaluator input

```ts
interface EmergencyPlanEvaluationInput {
  providerId: string;
  locationId: string;
  applicableAt: string;
  knownAt: string;
  certifiedKnowledgeRevisionId: string;
  operationalSnapshotDigest: string;
  evaluatorVersion: string;
  correlationId: string;
}
```

## 23. Contract EP-06: evaluator output

Return separate outcomes for existence, accessibility and drill documentation **only where the certified rule mapping authorizes those checks**. Each result carries `ruleDefinitionId`, `requirementId`, `knowledgeRevisionId`, `evidenceRefs`, `status`, `severity`, `reasonCode` and a deterministic evaluation timestamp context.

## 24. Contract EP-07: rule mapping registry

Map existing legacy codes to canonical RKE requirement/validation IDs via an explicit versioned mapping. Require legal review for code/citation equivalence. Unmapped codes must fail verification, not silently inherit RKE authority.

## 25. Contract EP-08: result projection

The compliance results table is a query projection; the immutable determination record is the provenance source of truth. Update projections idempotently without mutating prior determination manifests.

## 26. Contract EP-09: historical manifest

Persist `determinationId`, tenant/provider/location, certified RKE revision/digest, operational snapshot/digest, evaluator version/digest, evaluation time, `applicableAt`, `knownAt`, result digest, actor, correlation and evidence IDs. Corrections append superseding determinations.

## 27. Contract EP-10: replay

Replay must pin exact recorded inputs and knowledge revisions, verify digests, and distinguish **deterministic recomputation** from **evidentiary reconstruction**. A later regulatory update must not rewrite prior outcomes.

## 28. Contract EP-11: frontend read model

Location-specific page must show actual plan state, missing/uncertain evidence, source/certification provenance, finding rationale, last evaluation time, remediation and audit links. Never show hard-coded compliance verdicts as factual findings.

## 29. Contract EP-12: binder integration

Binder exports must reference immutable evidence and determination manifests, revision/certification identity, and export time. Binder publication must not recalculate silently against current rules.

## 30. Security and privacy

Enforce authenticated provider/tenant and location authorization at every read, evaluation, evidence upload, replay and binder export. Avoid putting protected personal details into event payloads or logs. Restrict access to plan-specific individual support needs.

## 31. Event contracts (proposed names)

`RKE.KnowledgeRevisionPublished`, `OP.EmergencyPlanEvidenceChanged`, `CI.EmergencyPlanEvaluationRequested`, `CI.EmergencyPlanDeterminationRecorded`, `SII.BinderEvidenceLinked`. Names/IDs require canonical event-registry ratification; these are not claims of existing events.

## 32. Failure semantics

Knowledge unresolved → block certification-based verdict. Evidence unavailable → evidence-incomplete state. Digest mismatch → integrity failure. Tenant mismatch → deny. Persistence partial failure → transactional rollback or recoverable idempotent retry. Event-delivery delay must not change committed determination.

## 33. Database design dependencies

Proposed persistent entities: knowledge revision/certification/source snapshot; emergency-plan operational revision; evidence snapshot; immutable determination; finding projection; outbox/audit records. Actual schema/migrations must be reconciled before any change.

## 34. Nx dependency rules

Operational and evaluator libraries may consume **published RKE contracts**; RKE must not import evaluator or UI implementation. Shared Intelligence interfaces should remain authority-neutral. Verify Nx project graph before introducing dependencies.

## 35. Acceptance matrix — knowledge

| Test | Scenario | Expected | Execution |
|---|---|---|---|
| EP-T01 | Draft/UNDER_REVIEW revision selected | Evaluation blocked | NOT RUN |
| EP-T02 | Valid certified revision selected | Exact revision pinned | NOT RUN |
| EP-T03 | Two overlapping certified revisions | Ambiguity failure | NOT RUN |
| EP-T04 | No effective revision | No silent latest fallback | NOT RUN |
| EP-T05 | Retroactive publication with earlier knownAt | Earlier historical view unchanged | NOT RUN |

## 36. Acceptance matrix — operational evidence

| Test | Scenario | Expected | Execution |
|---|---|---|---|
| EP-T06 | Plan exists and evidence complete | No unconditional missing-plan finding | NOT RUN |
| EP-T07 | Plan absent with sufficient coverage | Rule-governed outcome | NOT RUN |
| EP-T08 | Evidence source unavailable | Insufficient-evidence outcome | NOT RUN |
| EP-T09 | Drill evidence exists | Drill determination uses actual evidence | NOT RUN |
| EP-T10 | Unmapped legacy rule code | Mapping error / blocked result | NOT RUN |

## 37. Acceptance matrix — integrity and UX

| Test | Scenario | Expected | Execution |
|---|---|---|---|
| EP-T11 | Replay after knowledge supersession | Same historical knowledge pinned | NOT RUN |
| EP-T12 | Evidence digest tampered | Replay fails integrity check | NOT RUN |
| EP-T13 | Cross-tenant evidence request | Access denied | NOT RUN |
| EP-T14 | Location page opened | Actual location-specific state shown | NOT RUN |
| EP-T15 | Binder exported | Manifest/provenance included | NOT RUN |

## 38. Gap register

| Gap | Severity | Source basis | Closure evidence |
|---|---|---|---|
| EP-G01 | Critical | S03 fixed negative results | Evidence-driven evaluator test |
| EP-G02 | Critical | S03 lacks RKE calls | Certified resolver integration test |
| EP-G03 | High | S01/S03 IDs differ | Approved versioned rule mapping |
| EP-G04 | Critical | S01 status UNDER_REVIEW | Certification and publication proof |
| EP-G05 | High | S03 result input lacks revision provenance | Immutable manifest round trip |
| EP-G06 | High | S07 placeholder UI | Location-level end-to-end UI test |
| EP-G07 | High | S01/S03/S07 citations differ | Regulatory/legal signoff |
| EP-G08 | Critical | No runtime execution supplied | Build, migration and E2E logs |

## 39. Decision requests

1. Ratify canonical emergency-preparedness requirement and legally verified citations.
2. Ratify legacy-code mapping or controlled deprecation.
3. Ratify evidence sufficiency and unknown-status semantics.
4. Ratify immutable determination and replay manifest.
5. Ratify tenant authorization boundaries and publication authority.
6. Ratify integration contracts and migration sequence.

## 40. Sequenced remediation proposal (not authorized)

First validate legal sources and rule mapping; then approve RKE persistence/certification/resolver contracts; next establish operational plan/evidence schema; then replace unconditional evaluator outcomes with evidence-based evaluations; finally wire UI, binders, and historical replay. Do not deploy or backfill invented certifications.

## 41. Release gates

G1 legal/citation review; G2 certified knowledge publication; G3 operational evidence provenance; G4 evaluator mapping and no-hardcoded-verdict tests; G5 tenant isolation; G6 historical replay; G7 UI/binder E2E; G8 observed CI/build/migration/test logs and explicit implementation approval.

## 42. Explicit non-findings

This document does **not** establish that a plan is missing at any real residence, that the cited TAC provisions are currently accurate, that the RKE is production-certified, that any acceptance test passed, or that all other repository modules lack these capabilities.

## 43. Evidence preservation

Keep ZIP snapshot identity, exact relative paths, code excerpts, commit ID if available, test logs and migration outputs with subsequent closure records. Current observations are from static inspection only.

## 44. Status and handoff

**REC-017:** Completed as a static evidence matrix and proposed contract. **Approval:** pending. **Runtime verification:** not executed. **Implementation:** not authorized.  
**Next:** **REC-018 — Emergency Preparedness Operational Evidence and Rule-Mapping Repository Trace**, focused on actual plan entities, APIs, evidence attachments and rule-code lineage.
