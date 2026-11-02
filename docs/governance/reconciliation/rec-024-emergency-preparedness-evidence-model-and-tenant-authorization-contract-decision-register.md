# REC-024 — Emergency Preparedness Evidence Model and Tenant Authorization Contract Decision Register

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document class:** Reconciliation / proposed architecture decision register  
**Status:** DRAFT — NOT RATIFIED; IMPLEMENTATION NOT AUTHORIZED  
**Date:** 2026-11-02  
**Proposed repository path:** `docs/governance/reconciliation/rec-024-emergency-preparedness-evidence-model-and-tenant-authorization-contract-decision-register.md`

## 1. Executive determination
The repository provides fire-drill operational data and CAP evidence, but the inspected Emergency Plans evaluator does not consult either source. It selects the oldest provider and emits three `NON_COMPLIANT` results without evaluating location evidence. REC-024 proposes the minimum evidence ownership, authorization, temporal and status contracts required before implementation. These proposals do not supersede REC-019 decisions or establish regulatory certification.

## 2. Evidence basis and limits
Static inspection of `hhscCompliance-develop.zip` (no build, runtime, database, security test, or deployed environment verification). Directly inspected:

- `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts`
- `server/src/app/compliance/entities/compliance-result.entity.ts`
- `server/src/app/fire-drills/fire-drill.entity.ts`
- `server/src/app/remediation/entities/cap-evidence.entity.ts`

Additional integration conclusions from REC-016–023 remain prior assessments rather than new runtime verification. A file not found in inspected paths is **not** proof of absence everywhere.

## 3. Governing architecture
Regulatory knowledge is owned by **RKE**; operational records are owned by **Operational Domains**; evidence, approvals, audit, and binder mechanisms are shared infrastructure; **Compliance Intelligence** evaluates certified rules against authorized operational facts. UI and AI are not regulatory authorities. The knowledge-first development rule applies.

## 4. Scope
Emergency-plan records, staff access/acknowledgments, fire-drill evidence adapters, provider/location authorization, historical snapshots, evaluator result compatibility, crosswalk governance, and acceptance gates.

## 5. Out of scope
No new code, migration execution, approval of statutory interpretation, rule certification, production data correction, or assertion that a specific emergency-plan record satisfies §565.23. Regulatory text and effective dates require separate authoritative review.

## 6. Observed evaluator behavior
`resolveProviderId()` queries `ProviderEntity` with `createdAt: 'ASC'` and no authenticated tenant selection. `evaluate(locationId)` then calls `missingPlan()`, `planNotAccessible()`, and `missingDrillDocumentation()` unconditionally, and writes each via `upsertSystemResult`. Hard-coded rule codes use `565.23(b)(5)`; their legal precision remains subject to REC-021 crosswalk verification.

## 7. Observed persistence contracts
`FireDrillEntity` stores `providerId`, `locationId`, date, shift and operational drill fields. `CapEvidenceEntity` links a file to CAP and compliance result, with a storage path and optional uploader; it is not inherently a first-class emergency-plan record. `ComplianceResultEntity` permits only `COMPLIANT`, `NON_COMPLIANT`, `UNKNOWN`, and uses a unique index on provider/location/entity/rule code.

## 8. Decision register overview
All entries below are **PROPOSED / PENDING RATIFICATION**. Decision identifiers are local to REC-024 and do not assert canonical registry IDs.

| ID | Proposed decision | Required approval | Priority |
|---|---|---|---|
| EP-024-01 | Dedicated versioned emergency-plan record | Operational domain owner | P0 |
| EP-024-02 | Independent staff access evidence | Operational + privacy | P0 |
| EP-024-03 | Fire-drill records reused via scoped adapter | Fire-drill owner | P0 |
| EP-024-04 | CAP files are supplementary, not automatically primary evidence | Evidence owner | P1 |
| EP-024-05 | Tenant and location context required for every read/write/evaluation | Security | P0 |
| EP-024-06 | Immutable evidence snapshot and correction lineage | Data governance | P0 |
| EP-024-07 | Five-state domain determination with legacy projection | Compliance owner | P0 |
| EP-024-08 | Certified RKE rule crosswalk required | Regulatory certification | P0 |
| EP-024-09 | Fail-closed evaluation on missing authorization/knowledge | Security + RKE | P0 |
| EP-024-10 | Event/audit and idempotent result persistence | Shared Intelligence | P1 |
| EP-024-11 | Retention, restricted attachments, redaction | Privacy/legal | P0 |
| EP-024-12 | Staged migration with rollback and no fabricated historical data | Platform owner | P0 |

## 9. EP-024-01 — Emergency-plan record ownership
Create a dedicated operational entity per provider/location/plan revision. Candidate fields: `id`, `providerId`, `locationId`, `planVersion`, `title`, `status`, `effectiveFrom`, `effectiveTo`, `approvedAt`, `approvedBy`, `documentEvidenceId`, `contentDigest`, `createdAt`, `supersedesId`. A plan's existence does not itself prove legal adequacy, accessibility or currency.

## 10. Plan lifecycle
Proposed: `DRAFT`, `SUBMITTED`, `APPROVED`, `ACTIVE`, `SUPERSEDED`, `WITHDRAWN`. Approval of an operational plan is distinct from **certification of regulatory knowledge**. Define allowed transitions and actor permissions before migration.

## 11. Plan temporal semantics
Preserve the plan's asserted applicability period separately from the time the platform learned about it. Backdated entries must retain original record creation and the actor's correction rationale. Never silently replace a plan used in a released determination.

## 12. EP-024-02 — Staff accessibility evidence
Represent staff access/acknowledgment as a separate operational assertion scoped to staff, location, plan revision, access method, observation date and verifier. Do not equate document upload with verified accessibility; do not equate an acknowledgment with demonstrated emergency preparedness.

## 13. Staff privacy boundaries
Limit staff identities to roles needing them; downstream findings should ordinarily carry an evidence reference and conclusion, not an unrestricted staff roster. Apply least privilege and retention policy.

## 14. EP-024-03 — Fire-drill adapter
The adapter should query fire drills by **authorized provider and location**, period and relevant rule criteria. It must return provenance (record ID, snapshot/hash, drill date, shift, source version) and avoid treating a missing record as proof that no drill occurred.

## 15. Fire-drill completeness
Distinguish missing drill records, incomplete fields, contradictory entries, and a certified violation. Date/shift interpretation and required frequency must be derived from certified, effective-dated RKE knowledge, not hard-coded guesses.

## 16. EP-024-04 — CAP evidence classification
Existing CAP evidence can substantiate remediation, but its linkage to a CAP/result does not automatically establish it as the original plan or drill evidence. Explicit classification, verified provider/location ownership, file integrity and source attribution are required.

## 17. Evidence reference contract
```ts
interface OperationalEvidenceRef {
  evidenceId: string;
  sourceType: 'EMERGENCY_PLAN' | 'STAFF_ACCESS' | 'FIRE_DRILL' | 'CAP_ATTACHMENT';
  providerId: string;
  locationId: string;
  sourceRecordId: string;
  sourceRevisionId?: string;
  capturedAt: string;
  applicableAt?: string;
  contentDigest?: string;
  verificationState: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED';
}
```
**Proposed interface only; not an existing repository type.**

## 18. EP-024-05 — Tenant context contract
```ts
interface AuthorizedEvaluationContext {
  actorId: string;
  providerId: string;
  locationId: string;
  authorizationScope: string[];
  correlationId: string;
  evaluationAt: string;
  knownAt: string;
}
```
Context must be constructed by trusted authorization middleware/service, not accepted as self-asserted client authority.

## 19. Provider/location relationship check
Verify location ownership under the authorized provider before querying evidence or writing results. Reject missing, cross-provider, inactive/unauthorized or ambiguous ownership; never select a default provider from global data.

## 20. Query filtering rule
All relevant database reads and writes must include provider scope, and location scope where applicable. A `locationId` alone is insufficient authorization. Services must enforce access independently of frontend routing.

## 21. Privileged cross-provider access
Only separately approved administrative workflows may span providers, with explicit purpose, elevated permission, audit and limited result exposure. Such workflows must not reuse ordinary evaluator endpoints with bypass flags.

## 22. EP-024-06 — Historical evidence snapshots
For each released determination, preserve immutable evidence references, source revision IDs, source digests, observation time, RKE revision, evaluator version and result digest. Evidence updates produce new revisions; old determination manifests remain referentially stable.

## 23. Correction and retraction
Corrections append new source revisions and supersession links. A withdrawn or fraudulent source must be marked and may trigger reevaluation, but the historical determination remains reconstructable with a clear correction trail.

## 24. Snapshot storage and integrity
Propose content-addressed immutable objects with digest verification and access-controlled metadata. Storage technology and retention period remain unresolved. Avoid storing unneeded PHI/PII in public event payloads.

## 25. EP-024-07 — Domain outcomes
Canonical proposed domain outcomes: `COMPLIANT`, `NONCOMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, `REQUIRES_REVIEW`. A negative assertion requires a verified predicate and applicable certified requirement.

## 26. Legacy compatibility
Existing `ComplianceStatus` is `COMPLIANT | NON_COMPLIANT | UNKNOWN`. Propose a distinct detailed determination record and explicit compatibility projection: `COMPLIANT → COMPLIANT`; `NONCOMPLIANT → NON_COMPLIANT`; all other states → `UNKNOWN` **with separate reason metadata**. Do not lose detail or represent unknown as a violation. This mapping requires consumer review.

## 27. Severity semantics
Severity may be assigned only after a valid determination and approved policy. Missing evidence must not automatically inherit `CRITICAL` severity from today's unconditional evaluator methods.

## 28. EP-024-08 — Certified knowledge crosswalk
Each predicate must reference a certified, effective-dated RKE requirement and citation, including jurisdiction, program, applicable period and immutable revision ID. REC-021's subsection crosswalk remains subject to legal review; do not certify from this document.

## 29. Rule identifier migration
Hard-coded `565.23(b)(5)-*` codes should be reconciled with certified crosswalk IDs before use. Preserve historical identifiers for audit; implement explicit aliases/migration, not silent rewrite.

## 30. EP-024-09 — Failure behavior
On missing certification, conflicting rules, inaccessible evidence, tenant mismatch or missing location ownership: stop definitive evaluation; return a structured error or review/insufficient-evidence state as appropriate. Authorization failure must not be downgraded into a benign evidence gap.

## 31. EP-024-10 — Audit and event design
Proposed events: `EmergencyPlanRevisionRecorded`, `EvidenceVerificationRecorded`, `EmergencyPreparednessDeterminationRecorded`, `DeterminationSuperseded`. Event IDs and schemas remain pending canonical event registry approval. Include idempotency key, correlation ID, actor, scope and immutable references.

## 32. Result persistence concurrency
Use idempotent writes with stable determination IDs, optimistic concurrency where appropriate, and transactional outbox for emitted events. The existing upsert key is a current-state projection; it must not be the sole historical ledger.

## 33. EP-024-11 — Security and retention
Authorize object retrieval independently from metadata; scan attachments, constrain MIME/content, encrypt at rest/in transit, apply access logging, retention holds and defensible deletion policies. Exact legal retention schedule requires counsel/compliance approval.

## 34. EP-024-12 — Migration strategy
Add new structures without rewriting old findings. Backfill only verified facts from existing fire-drill and CAP records; do not infer historical plan approval, staff access, certification, or evidence verification from mere file existence.

## 35. Suggested implementation packages (not authorized)
1. Security context and provider/location ownership guards.
2. Operational plan and staff evidence models/DTOs/migrations.
3. Fire-drill/CAP evidence adapters and integrity references.
4. Certified RKE crosswalk resolver integration.
5. Five-state determination and legacy projection.
6. Immutable history, events, observability and binder evidence.

## 36. Repository change map
| Existing file / area | Intended treatment |
|---|---|
| `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | Replace default-provider and unconditional-result logic after approvals |
| `server/src/app/fire-drills/fire-drill.entity.ts` | Reuse as source; avoid disruptive schema assumptions |
| `server/src/app/remediation/entities/cap-evidence.entity.ts` | Reuse as supplemental attachment source |
| `server/src/app/compliance/entities/compliance-result.entity.ts` | Preserve compatibility; add detailed determination history separately |
| `libs/regulatory/knowledge/...` | Integrate only through certified/versioned knowledge contracts |
| Database migrations / NestJS modules | Design, verify and authorize before creating |

## 37. Acceptance tests — security
| ID | Test | Expected outcome |
|---|---|---|
| AT-024-01 | Provider A requests Provider B location | Denied; no data leak |
| AT-024-02 | Evaluator invoked without trusted tenant context | Denied; no write |
| AT-024-03 | Forged provider ID in request | Ignored/rejected |
| AT-024-04 | Authorized actor accesses wrong location | Denied |
| AT-024-05 | CAP attachment metadata allowed but file forbidden | Object retrieval denied |

## 38. Acceptance tests — evidence
| ID | Test | Expected outcome |
|---|---|---|
| AT-024-06 | Plan document exists but no access verification | No fabricated accessibility finding |
| AT-024-07 | Fire drill present with missing required fields | Insufficient evidence or review per certified predicate |
| AT-024-08 | Missing drill record | Not automatically definitive noncompliance |
| AT-024-09 | Contradictory plan revisions | Review / deterministic conflict handling |
| AT-024-10 | Corrected evidence after published finding | New linked determination; old remains reproducible |

## 39. Acceptance tests — knowledge and outcomes
| ID | Test | Expected outcome |
|---|---|---|
| AT-024-11 | Certified rule missing | No definitive finding |
| AT-024-12 | Historic effective date | Historic certified revision selected |
| AT-024-13 | Valid verified violation | `NONCOMPLIANT` with provenance |
| AT-024-14 | Not-applicable rule | `NOT_APPLICABLE`, legacy `UNKNOWN` with reason |
| AT-024-15 | Detailed unknown outcome | No false `NON_COMPLIANT` projection |

## 40. Acceptance tests — persistence and audit
| ID | Test | Expected outcome |
|---|---|---|
| AT-024-16 | Repeated event delivery | One logical result, no duplicate effect |
| AT-024-17 | Evidence digest tampered | Verification fails, audit records anomaly |
| AT-024-18 | Historical replay | Reconstructs original manifest and result |
| AT-024-19 | Concurrent revision | Conflict resolved without lost history |
| AT-024-20 | Migration with incomplete old records | No invented approvals or timestamps |

## 41. Required decision owners
Regulatory authority approves citations and interpretation; operational domain owner approves record semantics; security/privacy approves tenant access and data protection; platform/data owner approves migrations; compliance product owner approves status projections; audit/evidence owner approves retention and immutable provenance. Named individuals are not yet assigned.

## 42. Decision dependencies
EP-024-05 and EP-024-09 block safe evaluation. EP-024-08 blocks regulatory conclusions. EP-024-01/02/03/04 block comprehensive evidence assessment. EP-024-06/07/10 block historically trustworthy publication. EP-024-11/12 block safe release and migration.

## 43. Risks
- **Critical:** Cross-tenant findings caused by oldest-provider selection.
- **Critical:** False deficiencies from unconditional evaluator outputs.
- **High:** Incorrect statutory crosswalk or wrong effective version.
- **High:** Loss of historical evidence after in-place edits.
- **High:** Consumer breakage if status enum changed without compatibility.
- **High:** CAP attachment mistakenly treated as verified primary evidence.

## 44. Ratification checklist
- [ ] Assign decision owners and reviewers.
- [ ] Verify legal citation and effective-date history from authoritative sources.
- [ ] Confirm complete repository consumers and API routes.
- [ ] Ratify plan/access/fire-drill evidence schemas.
- [ ] Ratify provider/location authorization and negative tests.
- [ ] Ratify status projection and migration contract.
- [ ] Ratify immutable evidence manifest and retention controls.
- [ ] Register canonical API/events/contracts.
- [ ] Approve implementation plan separately.

## 45. Release gates
**G1** authoritative regulatory crosswalk certified; **G2** decision ratification; **G3** tenant authorization demonstrated; **G4** evidence completeness and integrity demonstrated; **G5** status compatibility verified; **G6** historical replay verified; **G7** migrations rehearsed; **G8** full acceptance suite executed with evidence; **G9** explicit implementation/release authorization.

## 46. Evidence confidence
Direct observations about four inspected files are **static-source verified**. Proposed interfaces, decisions, migration steps and event names are **design proposals**. Claims about system-wide absence, legal certification, production behavior or runtime test success are **not established**.

## 47. Open questions
Which provider/location authority is canonical? What operational approval establishes a plan's validity? Which staff roles need verified access? What evidence retention schedule applies? How will rule IDs migrate without changing old results? What UI consumers depend on the three-state status? Who is authorized to certify RKE revisions?

## 48. Closure criteria
REC-024 may be marked *ratified* only when every P0 decision has an approved owner, recorded resolution, versioned contract and supporting evidence. It may be marked *implemented* only after authorized changes and passing tests. Neither state is achieved by drafting this document.

## 49. Immediate next work
**REC-025 — Emergency Preparedness Authorization and Evidence Contract Approval Packet:** owner-by-owner decision sheets, proposed schema diffs, consumer impact register, and signed acceptance gates. Do not begin code changes before explicit approval.

## 50. Final status
**Static evidence documented; 12 decisions proposed; 20 tests specified, none executed; certification pending; implementation authorization NOT GRANTED.**
