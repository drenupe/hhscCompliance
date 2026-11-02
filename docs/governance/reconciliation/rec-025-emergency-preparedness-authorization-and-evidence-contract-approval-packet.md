# REC-025 — Emergency Preparedness Authorization and Evidence Contract Approval Packet

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document class:** Reconciliation / approval packet  
**Status:** DRAFT — APPROVALS NOT OBTAINED; IMPLEMENTATION NOT AUTHORIZED  
**Date:** 2026-11-02  
**Proposed repository path:** `docs/governance/reconciliation/rec-025-emergency-preparedness-authorization-and-evidence-contract-approval-packet.md`

## 1. Executive purpose
Convert the twelve pending decisions in REC-024 into an owner-actionable packet with proposed contracts, review questions, explicit sign-off criteria, consumer impact, migration dependencies, and evidence-based release gates. This document does **not** ratify decisions, certify legal interpretations, establish implementation, or assert successful tests.

## 2. Source hierarchy
Primary input is REC-024, supported by the prior REC-017–023 static source assessments. The following inspected paths are the specific repository evidence cited by REC-024: `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts`, `server/src/app/compliance/entities/compliance-result.entity.ts`, `server/src/app/fire-drills/fire-drill.entity.ts`, and `server/src/app/remediation/entities/cap-evidence.entity.ts`. Proposed structures below are **new contracts**, not observed code.

## 3. Governing boundaries
RKE owns certified regulatory requirements; Operational Domains own plans, drills, and staff-access facts; Shared Intelligence owns evidence integrity, approvals, audit, and event infrastructure; Compliance Intelligence owns evaluation and historical determinations. Provider/location access comes from trusted authorization, not client-supplied identifiers. AI may assist review but cannot certify.

## 4. Approval states
`PROPOSED`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED`, `SUPERSEDED`. All twelve decisions begin `PROPOSED`. An approval must record a named accountable person, role, version/digest of reviewed contract, timestamp, decision, conditions, and evidence links. Blank signature lines mean no approval.

## 5. Evidence grades
**S — static source observed:** supported by inspected source. **D — design proposed:** not in code. **V — independently verified:** requires build/runtime/security or authoritative legal evidence; none is claimed here. **U — unresolved:** further discovery or ratification required.

## 6. Decision-to-owner approval register
| Decision | Proposed contract | Accountable role | Required co-review | Priority | State |
|---|---|---|---|---|---|
| EP-024-01 | Versioned emergency-plan entity | Operational domain owner | Data/platform | P0 | PROPOSED |
| EP-024-02 | Independent staff-access evidence | Operational domain owner | Privacy/security | P0 | PROPOSED |
| EP-024-03 | Provider-scoped fire-drill adapter | Fire-drill domain owner | Compliance/RKE | P0 | PROPOSED |
| EP-024-04 | CAP attachments supplementary by default | Evidence owner | Operational domain | P1 | PROPOSED |
| EP-024-05 | Trusted provider/location authorization | Security owner | Backend/platform | P0 | PROPOSED |
| EP-024-06 | Immutable evidence snapshots | Data governance owner | Audit/privacy | P0 | PROPOSED |
| EP-024-07 | Five-state result plus legacy projection | Compliance product owner | API/frontend | P0 | PROPOSED |
| EP-024-08 | Certified RKE rule crosswalk | Regulatory certification authority | Legal/compliance | P0 | PROPOSED |
| EP-024-09 | Fail-closed evaluation | Security owner | RKE/compliance | P0 | PROPOSED |
| EP-024-10 | Audit/events/idempotent persistence | Shared Intelligence owner | Platform | P1 | PROPOSED |
| EP-024-11 | Retention, attachment access and redaction | Privacy/legal owner | Security/evidence | P0 | PROPOSED |
| EP-024-12 | Staged migration and rollback | Platform/data owner | Operations/security | P0 | PROPOSED |

## 7. Approval sequence
First validate regulatory citations/effective dates and tenant authority. Next ratify operational evidence semantics and status compatibility. Then ratify immutable history, privacy, API/events, and migration plan. Implementation approval is a **separate final act** and is not implied by contract approval.

## 8. Critical source observation: provider selection
REC-024 records that the Emergency Plans evaluator selects the oldest provider rather than using authenticated provider context. This is a **static-code finding**; production exploitability was not tested. Approval must prohibit global/default-provider resolution in ordinary evaluation.

## 9. Critical source observation: unconditional results
REC-024 records three unconditional `NON_COMPLIANT` findings emitted by the Emergency Plans evaluator. The new contract must distinguish verified violation from insufficient evidence and avoid fabricating a deficiency.

## 10. Critical source observation: result status
REC-024 records the current persistence enum `COMPLIANT | NON_COMPLIANT | UNKNOWN`. Introducing five domain outcomes requires explicit compatibility projection and consumer verification; do not mutate the existing enum blindly.

## 11. EP-024-01 — plan contract proposal
Suggested `EmergencyPlanRevision`: immutable `revisionId`, `planId`, `providerId`, `locationId`, `version`, `state`, `effectiveFrom`, `effectiveTo?`, `approvedAt?`, `approvedBy?`, `documentEvidenceId?`, `contentDigest`, `recordedAt`, `supersedesRevisionId?`. Approval is operational approval, not RKE certification.

## 12. EP-024-01 — approval criteria
Owner confirms one plan identity per provider/location, permitted revision states, overlap behavior, authority for operational approval, amendment semantics, and retention. Reviewer verifies no plan is considered adequate solely because it was uploaded.

## 13. EP-024-02 — staff-access contract proposal
Suggested `StaffPlanAccessEvidence`: `evidenceId`, `providerId`, `locationId`, `planRevisionId`, `staffReference`, `accessMethod`, `observedAt`, `verifiedBy?`, `verificationState`, `recordedAt`, `digest`. Define minimum necessary staff identifiers and access control.

## 14. EP-024-02 — approval criteria
Reviewers must distinguish acknowledgement, demonstrated accessibility, and training competence. Confirm who can attest, who can read staff-level records, and how disputed entries are handled.

## 15. EP-024-03 — fire-drill adapter contract
Input must include trusted `providerId`, `locationId`, applicable period, and certified rule reference. Output returns source record IDs, relevant dates/shifts, field-completeness indicators, verification state, revision/digest where available, and query provenance. Absence of a row is not automatically proof of a violation.

## 16. EP-024-03 — approval criteria
Confirm source ownership, field meanings, date/time handling, amendment history, period boundaries, and whether existing fire-drill schema can supply each certified predicate. Mark missing source capabilities as gaps.

## 17. EP-024-04 — CAP attachment classification
A CAP file is remediation evidence by default. Elevation to emergency-plan or drill source evidence requires explicit source classification, authenticated ownership, integrity checks, and reviewer attestation. Never infer the original evidence date from upload time.

## 18. EP-024-05 — trusted evaluation context
```ts
interface AuthorizedEmergencyEvaluationContext {
  actorId: string;
  providerId: string;
  locationId: string;
  permissions: readonly string[];
  correlationId: string;
  applicableAt: string;
  knownAt: string;
}
```
**Proposed type only.** Context must be created by trusted backend authorization. Verify location ownership and role permissions on every read/write and evaluator invocation.

## 19. EP-024-05 — mandatory denial matrix
Deny absent context, forged provider ID, cross-provider location, unauthorized role, inactive/inaccessible location, and unauthorized attachment access. No evidence or finding may be written on denied requests. Record security audit without leaking protected data.

## 20. EP-024-06 — immutable evidence manifest
```ts
interface EmergencyEvidenceManifest {
  manifestId: string;
  providerId: string;
  locationId: string;
  capturedAt: string;
  applicableAt: string;
  knownAt: string;
  evidence: ReadonlyArray<{
    sourceType: string;
    sourceRecordId: string;
    sourceRevisionId?: string;
    digest?: string;
    verificationState: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED';
  }>;
  manifestDigest: string;
}
```
**Proposed type only.** A published determination refers to an immutable manifest. Corrections append revisions and links; they do not rewrite historical inputs.

## 21. EP-024-06 — approval criteria
Define digest algorithm, immutable storage boundary, source revisions, corrections, disputed evidence, tamper detection, access logs, legal holds, and replay access controls. Do not invent historical snapshots for old records.

## 22. EP-024-07 — canonical outcomes
`COMPLIANT`, `NONCOMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, `REQUIRES_REVIEW`. A definitive noncompliance outcome requires a certified applicable requirement, authorized evidence, a satisfied violation predicate, and recorded provenance.

## 23. EP-024-07 — compatibility projection
| Canonical outcome | Legacy `ComplianceStatus` | Required metadata |
|---|---|---|
| COMPLIANT | COMPLIANT | Rule/evidence IDs |
| NONCOMPLIANT | NON_COMPLIANT | Verified violation rationale |
| INSUFFICIENT_EVIDENCE | UNKNOWN | `reason=INSUFFICIENT_EVIDENCE` |
| NOT_APPLICABLE | UNKNOWN | `reason=NOT_APPLICABLE` |
| REQUIRES_REVIEW | UNKNOWN | `reason=REQUIRES_REVIEW` |

This mapping is **proposed**, requires review of dashboards, remediation workflows, API consumers, analytics and binder outputs, and must not discard canonical detail.

## 24. EP-024-08 — certified rule crosswalk
Each predicate requires a certified RKE revision, immutable requirement ID, source citation, jurisdiction/program, effective interval, applicability scope, and evaluation method. REC-021 identifies §565.23(e)–(f) as candidate relevant provisions; legal text, applicability, and effective-date history remain subject to authoritative review.

## 25. EP-024-08 — approval criteria
Regulatory reviewer signs the exact legal source/version, atomic requirement wording, predicate mapping, applicability, effective interval, and supersession chain. Existing hard-coded `565.23(b)(5)` identifiers require a documented alias strategy, not silent overwrite.

## 26. EP-024-09 — failure-state contract
Authorization failure is a denied operation; missing certified knowledge prevents definitive evaluation; missing evidence yields an evidence-specific state; contradictory evidence yields review; technical failure returns an explicit error. Never convert authorization denial or resolver error into compliance status.

## 27. EP-024-10 — event proposal
Candidate event names: `EmergencyPlanRevisionRecorded`, `EvidenceVerificationRecorded`, `EmergencyPreparednessDeterminationRecorded`, `DeterminationSuperseded`. Canonical event IDs/schemas are pending registry approval. Events should carry minimal identifiers, correlation and idempotency keys, authority scope, and immutable references—not unrestricted staff details or attachments.

## 28. EP-024-10 — transactional guarantees
Require atomic persistence of result and outbox entry, idempotent consumers, retry/dead-letter handling, and auditable state transitions. The existing upserted compliance result is a current-state projection, not sufficient historical history by itself.

## 29. EP-024-11 — privacy and retention contract
Define least-privilege attachment access, malware/type validation, encryption, access audit, retention schedules, deletion/hold rules, and redaction of staff/client identifiers in downstream events and binders. Exact legal retention periods remain **unresolved**.

## 30. EP-024-12 — migration policy
Use additive schema changes and explicit compatibility periods. Backfill only source-verifiable fields. Do not fabricate plan approvals, staff acknowledgments, RKE certifications, evidence verification, or historical timestamps. Preserve old findings with their original identifiers.

## 31. Proposed schema-diff inventory
| Proposed structure | Kind | Source/consumer | Migration concern |
|---|---|---|---|
| `emergency_plan_revision` | New operational table | Plan service / evaluator | Immutable revision identity |
| `staff_plan_access_evidence` | New operational table | Staff evidence adapter | Privacy and access scope |
| `evidence_snapshot_manifest` | New shared table/object | Evaluator / audit | Digest and retention |
| `emergency_determination_history` | New ledger | Compliance / binder | Historical immutability |
| `knowledge_requirement_crosswalk` | Certified RKE contract | RKE resolver / evaluator | Source/effective dates |
| Legacy result reason projection | Additive API/storage field | Existing compliance consumers | Backward compatibility |
| Transactional outbox | Shared infrastructure | Audit/events | Delivery and deduplication |

These names are **illustrative**, not ratified table names or migrations.

## 32. Source-to-change map
| Inspected area | Proposed treatment | Approval prerequisite |
|---|---|---|
| `.../evaluators/emergency-plans.evaluator.ts` | Remove default provider/unconditional findings | Security + RKE + evidence |
| `.../compliance-result.entity.ts` | Preserve legacy projection; separate history | API consumer review |
| `.../fire-drill.entity.ts` | Read through scoped evidence adapter | Fire-drill domain approval |
| `.../cap-evidence.entity.ts` | Supplemental classified evidence only | Evidence/privacy approval |
| `libs/regulatory/knowledge/...` | Certified version resolver integration | RKE contract ratification |
| NestJS modules/migrations | Additive wiring after approval | Platform change authorization |

Ellipses abbreviate the source paths listed in Section 2; they are not literal file paths.

## 33. Consumer impact register
Review provider dashboard, residential module workbench, finding workspace, CAP/remediation, compliance results API, reporting, exports, binder assembly, and analytics for reliance on `NON_COMPLIANT` and `UNKNOWN`. This is a **review list**, not a claim every consumer was inspected or affected.

## 34. API contract review
Proposed endpoints must use authenticated provider context, scoped location references, validated DTOs, versioned routes, stable error codes, optimistic concurrency for revisions, and pagination/filtering for history. Exact route names and DTOs require source discovery and canonical API registry approval.

## 35. Cross-engine contract review
Emergency Preparedness consumes **RKE**, not FKE. Shared event, evidence, approval, and audit infrastructure must not become an alternative regulatory authority. Historical manifest should record RKE revision and evaluator version.

## 36. Approval evidence package per decision
Attach: (a) exact contract version/digest, (b) impacted code paths, (c) reviewer comments, (d) security/privacy analysis where relevant, (e) test cases and expected outputs, (f) migration/rollback considerations, (g) final signed resolution. Missing attachments keep state pending.

## 37. Acceptance test traceability
REC-024 specifies AT-024-01 through AT-024-20. Preserve those IDs. Map AT-024-01–05 to security; 06–10 to evidence; 11–15 to knowledge/outcomes; 16–20 to persistence/audit. All are **NOT EXECUTED**.

## 38. P0 approval gate: security
Require signed provider/location ownership contract and negative tests AT-024-01–05; confirm no global default-provider fallback and no unauthorized read/write. Static inspection alone does not close this gate.

## 39. P0 approval gate: certified knowledge
Require authoritative citation/effective-date evidence, approved atomic crosswalk, certified immutable RKE revision, and temporal resolver behavior. No definitive rule-based findings before this gate.

## 40. P0 approval gate: operational evidence
Require approved plan/access models, fire-drill adapter mapping, provenance and completeness semantics, and tests AT-024-06–10. Missing record ≠ verified noncompliance by default.

## 41. P0 approval gate: compatibility
Require signed five-state-to-legacy projection, consumer impact review, API compatibility plan, and tests AT-024-13–15. Prevent dashboard false positives and inadvertent CAP creation.

## 42. P0 approval gate: historical integrity
Require immutable manifest, append-only corrections, digest verification, replay authorization, and AT-024-10/17/18/19. Historical outcomes must not silently change after evidence updates.

## 43. P0 approval gate: privacy and migration
Require attachment ACLs, approved retention policy, migration rehearsal, rollback, and evidence that historical data was not fabricated. AT-024-05 and AT-024-20 are mandatory.

## 44. P1 approval gate: events and audit
Approve canonical event IDs, schemas, outbox behavior, deduplication, audit lineage and AT-024-16. Do not represent proposed event names as registered contracts.

## 45. Approval signature sheet — regulatory
**Decision:** EP-024-08  
**Accountable reviewer:** __________________  
**Reviewed source/version:** __________________  
**Disposition:** ☐ Approve ☐ Request changes ☐ Reject  
**Evidence link / conditions:** __________________  
**Date / signature:** __________________

## 46. Approval signature sheet — security/privacy
**Decisions:** EP-024-02, 05, 09, 11  
**Accountable reviewer:** __________________  
**Disposition:** ☐ Approve ☐ Request changes ☐ Reject  
**Evidence link / conditions:** __________________  
**Date / signature:** __________________

## 47. Approval signature sheet — operational/evidence
**Decisions:** EP-024-01, 03, 04, 06  
**Accountable reviewer:** __________________  
**Disposition:** ☐ Approve ☐ Request changes ☐ Reject  
**Evidence link / conditions:** __________________  
**Date / signature:** __________________

## 48. Approval signature sheet — compliance/platform
**Decisions:** EP-024-07, 10, 12  
**Accountable reviewer:** __________________  
**Disposition:** ☐ Approve ☐ Request changes ☐ Reject  
**Evidence link / conditions:** __________________  
**Date / signature:** __________________

## 49. Decision log template
| Decision ID | Version/digest | Reviewer | Disposition | Date | Conditions | Evidence |
|---|---|---|---|---|---|---|
| EP-024-01–12 | Pending | Unassigned | PROPOSED | — | — | — |

Do not populate fictional signatories or approval timestamps.

## 50. Risk register
**Critical:** cross-provider findings from global provider selection; unconditional deficiencies. **High:** incorrect regulatory citation/version; loss of evidence history; status projection errors; unrestricted staff data; migration backfill misrepresentation. Owners and mitigations are proposed in Sections 6 and 38–44; residual risk requires approval.

## 51. Open decision questions
Which existing authorization service is canonical? Which plan revision counts as active on a historical date? Which staff roles must demonstrate access? How are ambiguous or conflicting drill records handled? What legally supported retention periods apply? Which UI consumers treat `UNKNOWN` as actionable? Who certifies the RKE crosswalk? What migration window and rollback criteria are acceptable?

## 52. No-go conditions
Do not implement or release if any P0 decision is unapproved; regulatory crosswalk uncertified; provider ownership unresolved; unconditional findings remain; privacy/retention unresolved; legacy compatibility untested; migration cannot be reversed safely; or historical replay is unverified.

## 53. Definition of ratification
A decision is ratified only when an authorized reviewer approves an exact versioned contract with supporting evidence and conditions. The packet itself is not ratification. **Current ratified count: 0 of 12** on the evidence available for this document.

## 54. Definition of implementation readiness
Readiness requires ratified P0 decisions, canonical registry entries, repository consumer inventory, migration design and rehearsal, authorized implementation plan, and runnable acceptance tests. None is established solely by this document.

## 55. Proposed next deliverable
**REC-026 — Emergency Preparedness Approval Evidence Collection and P0 Blocker Closure Register.** Collect actual owner decisions and evidence; validate code consumers and legal source snapshots; track closure of P0 blockers without guessing approval or test results.

## 56. Final status
**12 decisions packaged for approval; 0 ratified; 20 inherited acceptance tests remain unexecuted; implementation authorization NOT GRANTED.** No source-code modifications were made by creating this Markdown packet.
