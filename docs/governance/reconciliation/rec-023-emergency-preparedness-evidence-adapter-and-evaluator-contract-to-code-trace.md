# REC-023 — Emergency Preparedness Evidence Adapter and Evaluator Contract-to-Code Trace

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Scope:** Texas HCS Emergency Preparedness vertical slice  
**Classification:** Repository-grounded static assessment and proposed contract mapping  
**Status:** DRAFT — review required; no implementation authorization  
**Evidence basis:** `hhscCompliance-develop.zip`, inspected 2026-11-02. No runtime tests executed.  
**Predecessors:** REC-017 through REC-022, especially REC-022 atomic requirement and evidence predicate proposal.

## 1. Executive assessment
The repository contains a FireDrillEntity, CRUD service, fire-drill evaluator, CAP evidence entity, compliance result entity, and Angular emergency-plans page. The EmergencyPlansComplianceEvaluator does **not** read operational evidence: it writes three unconditional `NON_COMPLIANT` results. The FireDrillsComplianceEvaluator does read fire-drill rows, but its 30/90-day heuristics and shift logic must be reconciled to certified requirement predicates rather than treated as regulatory authority. No direct certified-RKE revision lookup is established by these inspected paths.

## 2. Scope boundaries
This trace does not establish legal certification, comprehensive repository absence, production behavior, tenant-safe operation, or successful builds. The 14 atomic entries described in REC-022 are **proposed**; their exact per-entry wording and final legal interpretation must be verified against REC-022 and authoritative source snapshots before any mapping is ratified.

## 3. Source inventory and trace identifiers
| ID | Actual repository path | Observed responsibility |
|---|---|---|
| SRC-01 | `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | Emergency Plans evaluator; unconditional findings |
| SRC-02 | `server/src/app/compliance/engine/residential/evaluators/fire-drills.evaluator.ts` | Fire-drill temporal and shift checks |
| SRC-03 | `server/src/app/fire-drills/fire-drill.entity.ts` | Operational fire-drill record schema |
| SRC-04 | `server/src/app/fire-drills/fire-drills.service.ts` | Fire-drill CRUD and audit integration |
| SRC-05 | `server/src/app/fire-drills/fire-drills.controller.ts` | Fire-drill API boundary |
| SRC-06 | `server/src/app/fire-drills/fire-drills.dto.ts` | Input DTO boundary |
| SRC-07 | `server/src/app/remediation/entities/cap-evidence.entity.ts` | Remediation evidence metadata |
| SRC-08 | `server/src/app/compliance/entities/compliance-result.entity.ts` | Current dashboard result persistence |
| SRC-09 | `libs/features/residential/src/lib/residential/pages/emergency/emergency-plans.page.ts` | Emergency Plans UI placeholder |
| SRC-10 | `libs/data-access/src/lib/residential/src/services/fire-drills.api.ts` | Frontend fire-drill API adapter |
| SRC-11 | `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/fire-drill.rule.ts` | Regulatory knowledge definition candidate |
| SRC-12 | `server/migrations/1800000000210-create-fire-drill-logs.ts` | Fire-drill schema migration |

## 4. Verified evaluator behavior
`EmergencyPlansComplianceEvaluator.evaluate(locationId)` calls `missingPlan()`, `planNotAccessible()`, and `missingDrillDocumentation()` without reading plan, staff acknowledgment, or fire-drill records. It writes codes `565.23(b)(5)-PLAN_EXISTS`, `565.23(b)(5)-PLAN_ACCESSIBLE`, and `565.23(b)(5)-DRILL_DOCUMENTATION`. These are **not** established as certified regulatory identifiers. The Angular page refers to `§565.23(f)`, creating a concrete citation alignment issue. Do not automatically replace identifiers without regulatory review and migration planning.

## 5. Existing fire-drill evaluator behavior
The fire-drill evaluator injects `FireDrillEntity`, reads records for `locationId`, checks whether a drill occurred in the last 30 days, and inspects shifts within the last 90 days, including a NIGHT shift. These are executable source heuristics, not proof of correct legal interpretation. It obtains a provider by selecting the earliest provider row; it does not demonstrate request-scoped provider ownership in the inspected method.

## 6. Existing evidence fields
`FireDrillEntity` includes `providerId`, `locationId`, `dateDrillConducted`, `timeDrillConducted`, `shift`, simulated situations, locations, fire types, exits used, and operational observations including `emergencyPlanExecutedCorrectly` and `staffCarriedOutResponsibilities`. These are candidate source facts. They do **not** by themselves prove the existence, currency, accessibility, or staff acknowledgment of an emergency plan.

## 7. Remediation evidence is not original plan evidence
`CapEvidenceEntity` records `capId`, `complianceResultId`, filename, type, storage path, uploader and timestamp. It is linked to corrective action. A CAP attachment must not silently be reclassified as a contemporaneous, authoritative emergency-plan record. Provenance, time and document identity must be explicit.

## 8. Current result model compatibility
`ComplianceStatus` is `COMPLIANT | NON_COMPLIANT | UNKNOWN`. REC-022 proposes five domain outcomes (`COMPLIANT`, `NONCOMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, `REQUIRES_REVIEW`). An explicit compatibility adapter is required; do not directly write unsupported statuses to the existing entity. Preserve richer decision outcome in a separate versioned determination record; map to dashboard display only under a ratified policy.

## 9. Contract inventory
| Contract | Proposed responsibility | Existing candidate | Gap / disposition |
|---|---|---|---|
| EP-AD-01 | Provider/location ownership context | FireDrillEntity provider/location IDs | Verify authenticated tenant scoping |
| EP-AD-02 | Fire-drill evidence reader | FireDrillsService / TypeORM repository | Add time-bound, tenant-bound read contract |
| EP-AD-03 | Emergency-plan version reader | None established in inspected files | New operational model likely required |
| EP-AD-04 | Staff review/acknowledgment reader | None established | New operational model likely required |
| EP-AD-05 | Posted emergency contact verification reader | None established | New evidence contract likely required |
| EP-AD-06 | CAP attachment reader | CapEvidenceEntity | Restrict to corroboration with provenance |
| EP-AD-07 | Certified RKE rule resolver | RKE knowledge definitions | Runtime certified revision resolver not verified |
| EP-AD-08 | Atomic requirement crosswalk resolver | REC-021/022 proposals | Approval and durable versioning pending |
| EP-AD-09 | Evidence normalization | No shared adapter verified | Define immutable normalized evidence envelope |
| EP-AD-10 | Predicate evaluator | Current evaluators | Replace unconditional and heuristic-only decisions |
| EP-AD-11 | Determination manifest writer | ComplianceResultEntity | Separate append-only historical record needed |
| EP-AD-12 | Dashboard result projection | ComplianceResultsService | Explicit outcome compatibility policy |
| EP-AD-13 | Remediation and recheck trigger | Existing CAP/result fields | Distinguish current finding from replay |
| EP-AD-14 | Evidence audit/provenance | FireDrillsService audit, CAP metadata | End-to-end chain unverified |

## 10. Proposed evidence envelope
```ts
interface EmergencyEvidenceEnvelope {
  evidenceId: string;
  evidenceKind: 'FIRE_DRILL' | 'EMERGENCY_PLAN' | 'STAFF_ACK' | 'POSTED_CONTACTS' | 'CAP_ATTACHMENT';
  providerId: string;
  locationId: string;
  sourceEntityId: string;
  sourceRevisionId?: string;
  observedAt: string;
  recordedAt: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceDigest: string;
  collectionMethod: string;
  verificationState: 'VERIFIED' | 'UNVERIFIED' | 'DISPUTED';
  accessClassification: string;
}
```
**Proposal only.** The sourceDigest must represent canonicalized, immutable evidence content, not merely a filename or storage path.

## 11. Proposed adapter interface
```ts
interface EmergencyEvidenceAdapter {
  collect(input: {
    providerId: string;
    locationId: string;
    applicableAt: string;
    knownAt: string;
    requestedKinds: EmergencyEvidenceEnvelope['evidenceKind'][];
    actorContext: { actorId: string; tenantId: string };
  }): Promise<{
    evidence: EmergencyEvidenceEnvelope[];
    missingKinds: string[];
    conflicts: string[];
    provenanceComplete: boolean;
  }>;
}
```
Never interpret an empty result set as proof that a required event did not happen unless the source is demonstrably complete for the required period and scope.

## 12. Proposed evaluation request
```ts
interface EmergencyEvaluationRequest {
  providerId: string;
  locationId: string;
  applicableAt: string;
  knownAt: string;
  certifiedKnowledgeRevisionId: string;
  crosswalkRevisionId: string;
  evaluationPurpose: 'CURRENT' | 'HISTORICAL_REPLAY';
  correlationId: string;
}
```

## 13. Proposed atomic predicate response
```ts
type DomainOutcome =
  | 'COMPLIANT' | 'NONCOMPLIANT' | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_APPLICABLE' | 'REQUIRES_REVIEW';
interface AtomicPredicateResult {
  requirementRevisionId: string;
  predicateRevisionId: string;
  outcome: DomainOutcome;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  rationaleCode: string;
  evaluatorVersion: string;
}
```

## 14. Crosswalk handling of 14 proposed atomic requirements
Each REC-022 atomic entry must receive a stable requirement ID, exact verified citation, certification revision, applicability scope, required evidence kinds, predicate revision, missing-data behavior, conflict behavior, and dashboard projection policy. **No per-entry claim of completion is made here**, because ratification of the REC-022 atomic catalog is pending.

## 15. Evidence sufficiency rules
A document's existence is not the same as its currency or accessibility. A fire-drill row is not automatically a complete drill record. Staff acknowledgment must be supported by identity, time and plan revision. Posted-contact verification needs location, observer, observation date and the certified requirement that makes it relevant. Contradictory evidence routes to review rather than a fabricated pass/fail.

## 16. Time semantics
`applicableAt` selects the legal and operational period; `knownAt` bounds what was recorded/available by the historical decision time. The adapter must not use today's updated fire-drill row to reproduce an earlier decision without preserving the earlier row revision. A 30-day lookback cannot substitute for a certified calendar-month or other legally specified interval without review.

## 17. Provider isolation hazard
Both inspected evaluators select the earliest provider in the database through `resolveProviderId()`. This is not an acceptable proof of tenant ownership. Every adapter query must bind authenticated tenant/provider and location ownership, and reject cross-provider IDs. A database foreign key alone does not establish authorization.

## 18. Source-of-truth decision
Operational records own evidence facts; RKE owns certified requirement meaning; Applied Intelligence owns evaluation; Shared Intelligence owns immutable provenance/audit and binder services. CAP evidence belongs to remediation unless separately admitted as evidence with a documented chain of custody.

## 19. Migration strategy — no premature edits
Phase 0: ratify citations and 14 atomic requirements. Phase 1: define operational evidence source contracts and tenant checks. Phase 2: add immutable source revisions and RKE resolver. Phase 3: build adapters and predicate tests. Phase 4: dual-run comparisons in a non-production environment. Phase 5: explicit cutover authorization. Do not rewrite historical results in place.

## 20. Contract-to-code change candidates
- `fire-drill.entity.ts`: preserve existing columns; assess revision/snapshot support.
- `fire-drills.service.ts`: add scoped historical read through a new interface; preserve existing CRUD behavior.
- `emergency-plans.evaluator.ts`: replace unconditional writes only after predicate and outcome compatibility gates pass.
- `fire-drills.evaluator.ts`: move date/shift interpretations into certified, versioned predicates.
- `compliance-result.entity.ts`: retain current dashboard projection; add separate determination manifest model instead of overloading status.
- `emergency-plans.page.ts`: connect to evidence and explanation read APIs after backend approval.

## 21. API contract proposals
`GET /api/v1/providers/:providerId/locations/:locationId/emergency-evidence?applicableAt=...` — authorization and time bounds required.  
`POST /api/v1/compliance/emergency-evaluations` — idempotency key, certified revision and purpose required.  
`GET /api/v1/compliance/determinations/:id` — immutable decision manifest and access-controlled evidence references.  
All routes are **proposals**, not confirmed current endpoints.

## 22. Error and ambiguity policy
Missing certification: fail closed; missing operational evidence: insufficient evidence unless verified absence itself establishes a certified predicate; source conflict: review; unsupported historic snapshot: replay unavailable with explicit reason; unauthorized scope: deny; integrity mismatch: stop and alert.

## 23. Dashboard compatibility decision pending
A five-state domain outcome cannot be losslessly represented by three existing persistence statuses. Ratify whether `UNKNOWN` displays distinct explanatory substatuses and how findings, CAP initiation, and risk counts behave. No automatic CAP creation from `INSUFFICIENT_EVIDENCE` without an approved policy.

## 24. Historical manifest minimum
Persist determination ID, tenant/provider/location, applicableAt/knownAt, certified pack and requirement revision IDs, crosswalk and predicate versions, evaluator build version, evidence snapshot IDs/digests, input and output digests, actor/correlation ID, and supersession links. Replay must distinguish byte-identical deterministic reproduction from evidentiary reconstruction.

## 25. Fire-drill adapter tests
| Test ID | Scenario | Expected result |
|---|---|---|
| EP23-T01 | Tenant A requests Tenant B location | Access denied |
| EP23-T02 | No fire-drill rows, source completeness unknown | Insufficient evidence, not automatic violation |
| EP23-T03 | Records exist but outside certified interval | Predicate-specific determination, cited interval |
| EP23-T04 | Shift labels inconsistent | Normalize or review; never silently guess |
| EP23-T05 | Existing record modified after historical knownAt | Original snapshot used or replay unavailable |
| EP23-T06 | Fire drill marked executed correctly | Does not alone prove emergency plan accessible |

## 26. Plan and staff evidence tests
| Test ID | Scenario | Expected result |
|---|---|---|
| EP23-T07 | Plan document uploaded but no version/date | Evidence insufficient for currency predicate |
| EP23-T08 | Staff acknowledgment refers to superseded plan | Evaluate against applicable certified predicate |
| EP23-T09 | Plan inaccessible to staff, verified observation | Noncompliance only when certified predicate supports it |
| EP23-T10 | Conflicting staff statements | Requires review |
| EP23-T11 | CAP attachment used as sole plan evidence | Reject as unverified original record |
| EP23-T12 | Posted contacts unobserved | Insufficient evidence, not inferred violation |

## 27. Knowledge and replay tests
| Test ID | Scenario | Expected result |
|---|---|---|
| EP23-T13 | Uncertified RKE rule requested | Evaluation blocked |
| EP23-T14 | RKE effective-date gap | Fail closed with traceable error |
| EP23-T15 | Two overlapping certified revisions | Ambiguity error, no arbitrary selection |
| EP23-T16 | Historical replay after new rule published | Original revision used |
| EP23-T17 | Evidence digest tampered | Integrity failure and audit event |
| EP23-T18 | Repeat idempotent evaluation request | No duplicate determination |
| EP23-T19 | Unsupported dashboard outcome | Explicit projection error or approved mapping |
| EP23-T20 | Recheck after evidence correction | New linked determination, old record retained |

## 28. Test execution status
EP23-T01–T20 are **specified, not executed**. No pass claims. Required evidence: test code path, fixture ID, environment, run timestamp, logs, assertion and reviewer signoff.

## 29. Critical blocker register
| Blocker | Severity | Closure evidence |
|---|---|---|
| EP23-B01 Unconditional emergency findings | Critical | Predicate-driven evaluator tests |
| EP23-B02 Regulatory citation mismatch | Critical | Reviewed authoritative crosswalk |
| EP23-B03 No certified runtime resolver in traced path | Critical | Integration contract and tests |
| EP23-B04 Missing plan/staff source records | High | Approved operational schemas |
| EP23-B05 Tenant selection by first provider | Critical | Scoped authorization tests |
| EP23-B06 Three-state vs five-state outcome mismatch | High | Ratified projection contract |
| EP23-B07 No historical evidence revisions shown | High | Snapshot/replay verification |
| EP23-B08 CAP evidence provenance ambiguity | Medium | Evidence admission policy |

## 30. Decision requests
DR-01 Ratify regulatory citations and REC-022 atomic entries. DR-02 Approve operational plan and acknowledgment source-of-truth. DR-03 Approve evidence snapshot/version strategy. DR-04 Approve RKE resolver and crosswalk contracts. DR-05 Approve five-state to dashboard projection. DR-06 Approve tenant scoping and actor context. DR-07 Approve migration/dual-run criteria. DR-08 Separately authorize implementation.

## 31. Release gates
G1 legal citation and requirement certification; G2 source schema and ownership; G3 tenant security; G4 immutable evidence and knowledge resolution; G5 evaluator contract ratification; G6 20 acceptance tests passing; G7 historical replay and audit verification; G8 explicit implementation and release authorization.

## 32. Traceability to prior records
REC-017 established the unconditional findings; REC-018 inventoried operational evidence; REC-019–020 proposed source-of-truth decisions and readiness gates; REC-021 identified citation precision; REC-022 proposed atomic predicates. REC-023 connects those requirements to concrete inspected code without granting implementation permission.

## 33. Unverified areas
No successful build/test run; no production database inspection; no full security guard trace; no complete source-to-rule certification; no independent regulatory legal review; no historical source revisions verified. All must remain open until evidence is recorded.

## 34. Proposed next document
**REC-024 — Emergency Preparedness Evidence Model and Tenant Authorization Contract Decision Register.** Focus: operational plan/staff/posting record schemas, source versioning, authorization boundaries, and exact compatibility decisions before implementation.

## 35. Final disposition
**Static source-to-contract trace: complete for listed files.** **Contract ratification: pending.** **Runtime verification: not executed.** **Implementation authorization: not granted.** **Repository source changes: none.**
