# REC-018 — Emergency Preparedness Operational Evidence and Rule-Mapping Repository Trace

**Classification:** Repository reconciliation / static evidence assessment  
**Status:** Draft; no code change authorized  
**Source:** `hhscCompliance-develop.zip` supplied for this project  
**Predecessors:** REC-013–REC-017, particularly REC-017  
**Proposed repository path:** `docs/governance/reconciliation/rec-018-emergency-preparedness-operational-evidence-and-rule-mapping-repository-trace.md`

## 1. Executive determination

The repository contains a regulatory Emergency Preparedness definition, a residential Emergency Plans evaluator, fire-drill operational records, and CAP evidence infrastructure. These are **separate partial capabilities**. The inspected evaluator does not read an emergency-plan record, staff-access evidence, fire-drill records, or certified RKE requirements before emitting three `NON_COMPLIANT` results. A full evidence-to-rule-to-determination trace is therefore **not established**.

## 2. Evidence method

Static inspection of the named source files inside the supplied ZIP. Findings describe code presence and control flow, **not** successful build, database migration, deployed behavior, current law, or production authorization. Absence statements mean *not identified in inspected files*, not proof of absence across all possible systems.

## 3. Inspected source inventory

| # | Repository file | Observed responsibility |
|---|---|---|
| 1 | `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` | RKE emergency knowledge |
| 2 | `libs/regulatory/knowledge/src/lib/models/evidence-requirement.model.ts` | RKE evidence requirement schema |
| 3 | `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | Emergency Plans compliance evaluator |
| 4 | `libs/features/residential/src/lib/residential/pages/emergency/emergency-plans.page.ts` | Emergency Plans Angular page |
| 5 | `server/src/app/compliance/entities/compliance-result.entity.ts` | Compliance results entity |
| 6 | `server/src/app/remediation/entities/cap-evidence.entity.ts` | CAP evidence entity |
| 7 | `server/src/app/remediation/dto/upload-cap-evidence.dto.ts` | CAP evidence input DTO |
| 8 | `server/src/app/remediation/entities/compliance-result-cap.entity.ts` | CAP-to-result link entity |
| 9 | `server/src/app/fire-drills/fire-drill.entity.ts` | Fire-drill operational entity |
| 10 | `server/src/app/fire-drills/fire-drills.controller.ts` | Fire-drill HTTP controller |
| 11 | `server/src/app/fire-drills/fire-drills.service.ts` | Fire-drill service |
| 12 | `server/migrations/1800000000236-CreateCapEvidence.ts` | CAP evidence migration |
| 13 | `server/migrations/1800000000210-create-fire-drill-logs.ts` | Fire-drill migration |

## 4. RKE emergency knowledge identity

`TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS` supplies stable identifiers for source, rule, requirement, questions, evidence, validations, document, renewal, and guidance. The rule uses `TX-HCS-EMERGENCY-PREPAREDNESS`, with `status: UNDER_REVIEW`. Its citation is `26 TAC Chapter 565`; the source declares version `2026.1`. These fields are source assertions, not verified regulatory certification.

## 5. RKE evidence identifiers

The knowledge definition declares `emergencyPlan`, `evacuationMap`, `emergencyContacts`, and `approvalSignature` evidence IDs. These should become the join keys between certified requirements and operational evidence; no such persisted join was verified.

## 6. Evidence requirement type

`EvidenceRequirement` includes `requirementId`, `evidenceType`, `required`, frequency, accepted MIME types, minimum count, maximum age, approval/signature flags, and binder section key. This is a **declarative requirement model**, not proof that uploads are checked against it.

## 7. Evaluator rule-code identity

The evaluator uses three hard-coded codes: `565.23(b)(5)-PLAN_EXISTS`, `565.23(b)(5)-PLAN_ACCESSIBLE`, and `565.23(b)(5)-DRILL_DOCUMENTATION`. These differ in naming and granularity from the RKE rule ID and code. An explicit approved crosswalk is needed; do not infer legal equivalence.

## 8. Evaluator data dependencies

Constructor injects `Repository<ProviderEntity>` and `ComplianceResultsService`; it does not inject the RKE service, an emergency-plan repository, fire-drill repository, or evidence service.

## 9. Evaluator behavior

The evaluator calls `missingPlan()`, `planNotAccessible()`, and `missingDrillDocumentation()` unconditionally and upserts all three findings as `NON_COMPLIANT`. No inspected branch checks whether a plan or drill exists.

## 10. Provider identity concern

`resolveProviderId()` retrieves the earliest provider record (`createdAt: ASC`) rather than deriving provider identity from the authenticated request and location ownership. This warrants a tenant/provider-scoping review; do not assume the route guard alone fixes it.

## 11. Location context

`evaluate(locationId)` builds location-scoped route commands and query params. The inspected evaluator does not show a provider/location ownership check before writing results.

## 12. Result persistence

`ComplianceResultEntity` records provider/location/entity, module, subcategory, ruleCode, status, severity, message, route metadata, CAP summary, and check timestamps. No certified knowledge revision, evidence snapshot digest, or evaluator version field appears in this inspected entity.

## 13. Frontend Emergency Plans page

`EmergencyPlansPage` is a static informational placeholder describing future plan storage, staff acknowledgment, and posted numbers checklist. It does not expose verified operational evidence capture.

## 14. Fire-drill operational model

`FireDrillEntity` records provider and location, date/shift, simulated conditions, exits, safety observations, plan execution, staff responsibilities, and report completion fields. It is a plausible operational evidence source for drill-related requirements, subject to rule review.

## 15. Fire-drill HTTP surface

The controller exposes list/get/create/update/delete operations. Listing requires `locationId`; mutations pass `req.user` and request metadata to the service. Authorization and ownership must be verified in service/guards, not assumed from controller signatures.

## 16. CAP evidence entity

`CapEvidenceEntity` links a file to `capId` and `complianceResultId`, with file name/type/storage path, evidence category, uploader, and created time. It is remediation-linked evidence, not a general emergency-plan evidence registry.

## 17. CAP upload DTO

`UploadCapEvidenceDto` validates file name, file type, storage path, and optional category. The DTO alone does not verify file bytes, cryptographic integrity, malware scanning, evidence applicability, or RKE requirement ID.

## 18. CAP-to-result link

`ComplianceResultCapEntity` relates corrective action plans and compliance findings. This supports remediation navigation but does not by itself prove initial evidence-driven compliance evaluation.

## 19. Migration evidence

Fire-drill and CAP-evidence migration files exist in the archive. Static existence does not prove that migrations ran in a target database or that all production schema matches source.

## 20. Regulatory citation conflict

The evaluator codes cite `565.23(b)(5)`; the Angular page describes `§565.23(f)`; the RKE definition references Chapter 565 at a broader level. Regulatory reviewers must resolve the precise authoritative provision and effective date before any rule is certified or changed.

## 21. Evidence absence versus noncompliance

Proposed contract: `MISSING`, `NOT_COLLECTED`, `UNVERIFIED`, `EXPIRED`, `REJECTED`, and `VERIFIED` evidence states must not automatically collapse into `NON_COMPLIANT` unless a certified rule explicitly authorizes that conclusion.

## 22. Operational plan record gap

No dedicated persisted emergency-plan entity or service is established by the inspected files. Search for alternative document stores before designing a new table; do not create duplicate operational sources of truth.

## 23. Staff accessibility gap

The inspected evaluator has no staff acknowledgment, access log, or attestation query. A plan being uploaded is not evidence that staff can access or understand it.

## 24. Drill documentation gap

Fire-drill records exist, but the evaluator does not query them. Define what counts as acceptable drill documentation using certified knowledge; avoid inferring compliance merely from one stored row.

## 25. Evidence provenance contract

Proposed evidence record must bind providerId, locationId, evidenceRequirementId, knowledgeRevisionId, evidenceId, source type, content digest, creator, timestamps, verification status, and access policy.

## 26. Evidence temporal semantics

Distinguish event occurrence, document effective period, upload time, verification time, and evaluation time. A later upload must not silently rewrite an earlier determination.

## 27. Rule crosswalk contract

Create an approved crosswalk from each certified RKE requirement/evidence ID to evaluator check ID and persisted result ruleCode. Crosswalk entries must be revisioned and traceable; no ad hoc string matching.

## 28. Evaluation outcome contract

Proposed outcomes: `COMPLIANT`, `NON_COMPLIANT`, `UNKNOWN` (existing result statuses), with separate structured evidence/decision reasons. Missing evidence should normally yield `UNKNOWN` until certified rule semantics establish otherwise.

## 29. Historical provenance

Proposed immutable determination manifest includes knowledge pack/revision digest, crosswalk revision, evaluator build version, evidence snapshot references/digests, applicableAt, knownAt, actor, tenant, and output digest.

## 30. API integration boundary

Proposed NestJS service resolves authenticated provider/location, certified RKE requirements, evidence, and historical context; evaluator consumes a typed immutable input snapshot. Controller should not decide regulatory truth.

## 31. Security boundary

All evidence queries, uploads, and result writes must enforce provider/tenant ownership server-side. Storage paths are not sufficient authorization. Limit PHI/PII exposure in logs, events, and exported binders.

## 32. Evidence integrity

Proposed upload flow computes server-side digest, validates MIME/content and size, malware scans where applicable, records immutable object version, and uses signed time-limited access. These are proposed safeguards, not verified current behavior.

## 33. Remediation separation

CAP evidence may prove a correction after a finding. It must not automatically retroactively convert the original finding to compliant; use a new recheck determination linked to the original.

## 34. Binder separation

Binder assembly consumes approved evidence references and immutable determination manifests; it must not independently recalculate regulatory conclusions or silently substitute newer documents.

## 35. Proposed RKE-to-evidence-to-result data flow

`Certified RKE revision → resolved requirement/evidence specification → provider/location operational evidence snapshot → evaluator → compliance result + immutable determination manifest → CAP/recheck → binder`. This is a target architecture, **not** the current verified execution path.

## 36. Gap register

G01 no verified dedicated plan persistence; G02 no staff accessibility evidence query; G03 no drill-evidence evaluator query; G04 hard-coded unconditional failures; G05 no certified RKE injection; G06 rule-code crosswalk unresolved; G07 provider ownership risk; G08 no immutable determination provenance; G09 page placeholder; G10 CAP evidence not general evidence registry; G11 regulatory citation discrepancy; G12 migrations not runtime-verified.

## 37. Decision dependencies

Ratify REC-013 persistence and certification decisions; approve REC-014 gates; reconcile REC-015 contract registry; verify REC-016 consumer dependencies; close REC-017 citation and evaluator issues before implementation.

## 38. Acceptance test EP-01

With verified, currently applicable plan evidence and approved RKE criteria, evaluator does not issue a false missing-plan finding.

## 39. Acceptance test EP-02

With no evidence, evaluator returns the certified policy outcome with explicit reason and never fabricates a factual assertion that a plan does not exist.

## 40. Acceptance test EP-03

Fire-drill records for another location or provider cannot satisfy the target location’s requirements.

## 41. Acceptance test EP-04

A CAP attachment does not count as initial compliance evidence without an approved evidence mapping and temporal qualification.

## 42. Acceptance test EP-05

When a certified knowledge revision changes, historical replay resolves the original revision and reproduces the original result manifest.

## 43. Acceptance test EP-06

Missing or conflicting certified knowledge revisions cause fail-closed/unknown behavior with a diagnostic, not a silent fallback to the newest rule.

## 44. Acceptance test EP-07

A user from another tenant cannot list, fetch, upload, mutate, or attach evidence for the target provider/location.

## 45. Acceptance test EP-08

All three evaluator rule codes have explicit versioned crosswalk entries to certified RKE requirements, or evaluation is blocked.

## 46. Acceptance test EP-09

Staff accessibility evidence and plan existence are evaluated as separate checks; one does not imply the other.

## 47. Acceptance test EP-10

Post-finding correction creates a new recheck result linked to original evidence rather than mutating historical determination provenance.

## 48. Acceptance test EP-11

Source files, object digests, and timestamps can be traced from binder evidence to the originating operational record and rule revision.

## 49. Acceptance test EP-12

Published API DTOs reject invalid provider/location/evidence relationships and prevent storage-path substitution.

## 50. Test execution status

EP-01 through EP-12 are **specified only; NOT EXECUTED**. No build, migration, integration, or security test success is asserted.

## 51. Release gates

Gate A authoritative citation reconciled; B certified knowledge contract approved; C source-of-truth operational plan model selected; D crosswalk approved; E tenant isolation verified; F evidence integrity verified; G end-to-end tests executed; H historical replay verified; I implementation explicitly authorized.

## 52. Implementation sequence recommendation

After authorization: first build/verify durable RKE revision resolution; then evidence model/crosswalk; then tenant-safe evaluator input; then result provenance; then UI and binder; then end-to-end acceptance tests. This is a recommendation, not authorization.

## 53. Open questions

Where are operational emergency plans stored today? Which regulatory text and effective date govern each check? Are staff attestations currently persisted elsewhere? Should CAP evidence be reused or separated from original evidence? Who may certify crosswalks? What is the retention schedule?

## 54. Conclusion

The archive supports **existing RKE definitions, fire-drill records, CAP attachments, compliance result persistence, and a placeholder page**. It does not establish an evidence-driven, certified-knowledge-based Emergency Plans evaluation path. REC-018 closes the static mapping step, not the engineering gaps.

## 55. Next document

**REC-019 — Emergency Preparedness Evidence Source-of-Truth and Rule Crosswalk Decision Register.** Ratify evidence ownership and precise rule mapping before writing implementation code.

## Appendix A — Source excerpts and trace anchors

| Anchor | Source symbol / literal | Interpretation |
|---|---|---|
| A1 | `TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS.evidence` | RKE evidence identities |
| A2 | `EmergencyPlansComplianceEvaluator.evaluate` | Unconditional finding writes |
| A3 | `PLAN_EXISTS_RULE_CODE` | Hard-coded evaluator code |
| A4 | `FireDrillEntity` | Drill operational source |
| A5 | `CapEvidenceEntity` | CAP-scoped attachment source |
| A6 | `ComplianceResultEntity` | Finding persistence |
| A7 | `EmergencyPlansPage` | Placeholder UI |

## Appendix B — Proposed crosswalk shape (not implemented)

```ts
interface EmergencyEvidenceRuleCrosswalk {
  crosswalkRevisionId: string;
  certifiedKnowledgeRevisionId: string;
  rkeRequirementId: string;
  rkeEvidenceRequirementIds: string[];
  evaluatorCheckId: string;
  resultRuleCode: string;
  applicableFrom: string;
  applicableUntil?: string;
  approvedBy: string;
  approvedAt: string;
}
```

## Appendix C — Proposed evaluation input shape (not implemented)

```ts
interface EmergencyEvaluationInput {
  providerId: string;
  locationId: string;
  applicableAt: string;
  knownAt: string;
  certifiedKnowledgeRevisionId: string;
  crosswalkRevisionId: string;
  evidenceSnapshotIds: string[];
  evaluatorVersion: string;
}
```

---

**Governance:** Static assessment only. No code, database, contract approval, or runtime state changed. Implementation authorization remains **NOT GRANTED**.
