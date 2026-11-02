# REC-020 — Emergency Preparedness Evidence and Crosswalk Implementation Readiness Matrix

## 1. Executive assessment

**Readiness decision: NOT READY FOR IMPLEMENTATION OR RELEASE.** REC-019 contains twelve proposed decisions, none ratified. The inspected emergency-plan evaluator emits three `NON_COMPLIANT` findings without examining operational evidence; the RKE rule remains `UNDER_REVIEW`; the citation crosswalk is unresolved. This record is a planning and verification matrix, not an approval to modify code.

## 2. Purpose and scope

Translate REC-019 EP-D01–EP-D12 into individually actionable work packages, exact repository touchpoints, evidence prerequisites, approval authorities, tests, and stop/go criteria for one Texas HCS Emergency Preparedness vertical slice. Preserve the independent RKE authority and operational source-of-truth boundary.

## 3. Document control

**Classification:** architecture reconciliation / implementation readiness. **Status:** DRAFT; static evidence only. **Basis:** REC-017–019 and `hhscCompliance-develop.zip` inspected 2026-11-02. **Proposed path:** `docs/governance/reconciliation/rec-020-emergency-preparedness-evidence-and-crosswalk-implementation-readiness-matrix.md`. **Authorization:** not granted.

## 4. Evidence legend

**OBSERVED** means visible in inspected repository source; **PROPOSED** means intended contract; **UNVERIFIED** means not proven across runtime or complete codebase; **BLOCKED** means a prerequisite prevents progression; **RATIFIED** requires an explicit recorded approval; **PASS** requires executed test evidence. No planned behavior is represented as current functionality.

## 5. Architectural ownership

RKE owns authoritative regulation interpretation, effective dates, certified requirements, evidence expectations and rule versions. Operational domains own provider/location plan, drill and staff-access facts. Compliance evaluation combines certified knowledge and authorized facts; remediation owns CAP actions; Shared Intelligence owns cross-cutting evidence/audit/binder primitives. Neither UI nor AI is a certifying authority.

## 6. Repository evidence baseline

Confirmed ZIP paths include `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` (819 lines), `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` (142 lines), `server/src/app/fire-drills/fire-drill.entity.ts`, `server/src/app/remediation/entities/cap-evidence.entity.ts`, and `server/src/app/compliance/entities/compliance-result.entity.ts`. File existence is not proof of successful compilation, runtime behavior or production deployment.

## 7. Regulatory citation stop gate

REC-019 reports `565.23(b)(5)` in evaluator codes, `§565.23(f)` in Angular page copy, and broad Chapter 565 reference in RKE. Do not resolve this by intuition. Regulatory reviewer must record official text, source URL, effective dates, applicability, granular citations, evidence interpretation and approval before crosswalk certification.

## 8. Overall decision readiness matrix

| Decision | Required outcome | Primary owner | Readiness | Blocking evidence |
|---|---|---|---|---|
| EP-D01 | Plan operational authority | Operational domain | PROPOSED | Full inventory and data design |
| EP-D02 | Fire-drill authority | Fire-drill owner | PROPOSED | Provider/location/date query validation |
| EP-D03 | Staff-access evidence | Operational domain + privacy | PROPOSED | Applicability and minimization |
| EP-D04 | CAP boundary | Remediation owner | PROPOSED | Recheck provenance contract |
| EP-D05 | RKE requirement authority | Regulatory certifier | BLOCKED | Authoritative citation review |
| EP-D06 | Versioned crosswalk | Regulatory + architecture | BLOCKED | Ratified source IDs and mapping |
| EP-D07 | Three-state evidence evaluation | Regulatory + compliance | BLOCKED | Disposition semantics approval |
| EP-D08 | Authenticated provider scope | Security owner | BLOCKED | Verified authorization boundary |
| EP-D09 | Immutable provenance | Audit + architecture | PROPOSED | Persistence/replay design |
| EP-D10 | Append-only rechecks | Compliance owner | PROPOSED | Historical record contract |
| EP-D11 | Binder snapshots | Binder owner | PROPOSED | Certified snapshot selection |
| EP-D12 | Release acceptance | Release authority | BLOCKED | Test execution and approvals |

## 9. EP-D01 — Emergency-plan operational record

**Existing evidence / inspection target:** Search existing plan/document entities, migrations, controllers, storage adapters and live schema before adding a new aggregate.

**Proposed acceptance contract:** Provider/location ownership; revision, effective interval, document digest, approval and supersession; immutable past revisions.

**Test linkage:** EPX-01, EPX-07, EPX-09. **Decision status:** not ratified. **Implementation:** not authorized.

## 10. EP-D02 — Fire-drill evidence adapter

**Existing evidence / inspection target:** `server/src/app/fire-drills/fire-drill.entity.ts`; inspect API/service, provider filters and historical drill data.

**Proposed acceptance contract:** Read-only evidence projection with providerId, locationId, occurrence date, completeness, record ID, source digest and access checks.

**Test linkage:** EPX-04, EPX-03. **Decision status:** not ratified. **Implementation:** not authorized.

## 11. EP-D03 — Staff accessibility evidence

**Existing evidence / inspection target:** Inspect employee/assignment/acknowledgment and document access modules; do not assume no generic record exists.

**Proposed acceptance contract:** Separate access proof tied to a specific plan revision and applicable staff role; minimal sensitive data.

**Test linkage:** EPX-05, EPX-03. **Decision status:** not ratified. **Implementation:** not authorized.

## 12. EP-D04 — CAP evidence separation

**Existing evidence / inspection target:** `server/src/app/remediation/entities/cap-evidence.entity.ts`; review CAP-to-result linkage and recheck workflows.

**Proposed acceptance contract:** CAP uploads do not retroactively alter original determination; new recheck references original and remediation evidence.

**Test linkage:** EPX-08, EPX-07. **Decision status:** not ratified. **Implementation:** not authorized.

## 13. EP-D05 — Certified RKE requirement

**Existing evidence / inspection target:** `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts`; reconcile `UNDER_REVIEW` status and citations.

**Proposed acceptance contract:** No evaluation of legally binding claims until certification ID, source snapshot, effective date and applicability are approved.

**Test linkage:** EPX-06, EPX-10. **Decision status:** not ratified. **Implementation:** not authorized.

## 14. EP-D06 — Versioned rule crosswalk

**Existing evidence / inspection target:** Compare `TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS` with `565.23(b)(5)-*` evaluator codes.

**Proposed acceptance contract:** Each certified requirement maps to explicit evidence selectors, evaluation semantics and immutable crosswalk revision.

**Test linkage:** EPX-06, EPX-10, EPX-07. **Decision status:** not ratified. **Implementation:** not authorized.

## 15. EP-D07 — Evidence-driven evaluation

**Existing evidence / inspection target:** `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts`; currently emits unconditional failures.

**Proposed acceptance contract:** Distinct outcomes for verified failure, verified satisfaction, missing/unverified evidence and non-applicability; no silent negative default.

**Test linkage:** EPX-01, EPX-02, EPX-04, EPX-05. **Decision status:** not ratified. **Implementation:** not authorized.

## 16. EP-D08 — Authenticated provider and location

**Existing evidence / inspection target:** Review evaluator provider lookup, auth guards, provider service, tenant claims and all query paths.

**Proposed acceptance contract:** Provider/location derived from authorized execution context, not earliest database row; deny cross-tenant references.

**Test linkage:** EPX-03. **Decision status:** not ratified. **Implementation:** not authorized.

## 17. EP-D09 — Immutable determination provenance

**Existing evidence / inspection target:** `server/src/app/compliance/entities/compliance-result.entity.ts`; inspect persistence and audit tables.

**Proposed acceptance contract:** Capture input evidence IDs/digests, RKE/crosswalk revisions, evaluator version, time context, outcome and actor.

**Test linkage:** EPX-07, EPX-09. **Decision status:** not ratified. **Implementation:** not authorized.

## 18. EP-D10 — Append-only rechecks

**Existing evidence / inspection target:** Inspect compliance-result upsert semantics and CAP recheck service.

**Proposed acceptance contract:** New determination for each recheck; historical result retained with explicit supersession relation.

**Test linkage:** EPX-08, EPX-07. **Decision status:** not ratified. **Implementation:** not authorized.

## 19. EP-D11 — Binder integration

**Existing evidence / inspection target:** Inventory binder export/snapshot interfaces and access policy before selecting implementation path.

**Proposed acceptance contract:** Binder references released determinations and approved immutable evidence; no regeneration using latest rules.

**Test linkage:** EPX-07, EPX-09. **Decision status:** not ratified. **Implementation:** not authorized.

## 20. EP-D12 — Vertical-slice release gates

**Existing evidence / inspection target:** Connect all preceding contracts and approvals into CI, integration tests, security tests and regulatory signoff.

**Proposed acceptance contract:** Release requires ratification, reproducible builds, executed tests, migration review and final explicit authorization.

**Test linkage:** EPX-01–EPX-10. **Decision status:** not ratified. **Implementation:** not authorized.

## 21. Source-to-change impact register

| Repository component | Verified current role | Candidate change after approval |
|---|---|---|
| `libs/regulatory/knowledge/.../emergency-preparedness.rule.ts` | RKE rule definition | Certified requirement/citation and evidence mapping |
| `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | Unconditional finding generation | Certified crosswalk + evidence evaluation |
| `server/src/app/fire-drills/fire-drill.entity.ts` | Drill record entity | Evidence projection/selector, not RKE logic |
| `server/src/app/remediation/entities/cap-evidence.entity.ts` | CAP-linked evidence | Explicit recheck-only provenance |
| `server/src/app/compliance/entities/compliance-result.entity.ts` | Compliance results | Immutable determination/provenance linkage |
| Existing plan, staff, binder and audit modules | Not fully established | Inventory first; reuse if suitable |

## 22. Crosswalk contract shape (proposed)

```ts
interface CertifiedEvidenceCrosswalk {
  crosswalkRevisionId: string;
  regulatoryRequirementRevisionId: string;
  certificationId: string;
  jurisdiction: "TX";
  program: "HCS";
  effectiveFrom: string;
  effectiveTo?: string;
  evidenceSelectors: Array<{ evidenceType: string; scope: "PROVIDER" | "LOCATION"; selectorVersion: string }>;
  evaluatorContractVersion: string;
  sourceSnapshotDigest: string;
}
```
Fields and values are proposed. They are not an assertion of existing code or verified statutory requirements.

## 23. Evidence envelope (proposed)

```ts
interface OperationalEvidenceEnvelope {
  tenantId: string; providerId: string; locationId?: string;
  evidenceType: string; sourceRecordId: string; sourceRevisionId?: string;
  observedAt?: string; recordedAt: string; contentDigest: string;
  accessScope: string; verificationStatus: "VERIFIED" | "UNVERIFIED" | "REJECTED";
}
```
Store only necessary identifiers and metadata in the determination; keep protected content in authorized storage.

## 24. Determination outcomes

Proposed states: `COMPLIANT`, `NON_COMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, `EVALUATION_ERROR`. A missing document lookup does **not** prove a legal violation without a ratified rule establishing that inference. Existing `ComplianceResultEntity` enum compatibility must be checked before any migration.

## 25. Provider scope hard stop

Evaluator must receive providerId and authorized location scope from authenticated service context. Test both direct requests and background jobs. Any unscoped provider fallback, including choosing the first provider row, blocks release.

## 26. Time model

Record event/observation time, source record time, rule effective time, rule known/published time and evaluation time separately. A historical replay must resolve the exact certified crosswalk as of the original determination, never the newest rule by default.

## 27. Replay manifest

Proposed manifest: determinationId, tenant/provider/location, evaluatedAt, applicableAt, knownAt, certifiedRuleRevisionId, crosswalkRevisionId, evaluatorBuildId, evidence IDs/digests, inputDigest, outputDigest, actor, correlationId, supersedesId and immutable audit event. Digest mismatches block verified reproduction.

## 28. Migration preflight

Before schema changes: inventory existing tables, columns, constraints and data; check historical records for missing provider IDs and rule versions; identify duplicates and unsafe joins; establish backups, reversible migrations and rollback rehearsals. Do not invent past certifications or retrospectively label historical findings verified.

## 29. Historical findings treatment

Legacy unconditional findings should be labeled `LEGACY_UNVERIFIED` or an approved equivalent in a **separate provenance/quality layer**, subject to schema review. Do not delete them, silently rewrite them as compliant, or present them as certified evidence-based determinations.

## 30. Approval sequence

1. Regulatory reviewer resolves citation and applicability. 2. Architecture owner ratifies authority boundaries and crosswalk. 3. Security approves tenant and staff data access. 4. Data owner approves reuse/migrations. 5. Compliance owner approves disposition/recheck semantics. 6. Audit/binder owners approve immutable provenance. 7. Release authority explicitly authorizes implementation and later release. Approvals are distinct from completed drafting.

## 31. Dependency graph

`Official source verification → RKE requirement certification → crosswalk ratification → operational evidence adapter contracts → authorization/provenance contracts → evaluator implementation → migration and tests → release review`. Security and schema inventory may proceed in parallel, but cannot be bypassed.

## 32. Acceptance test matrix

| ID | Scenario | Expected evidence | Execution |
|---|---|---|---|
| EPX-01 | Verified current plan | Compliant only when all certified conditions met | NOT RUN |
| EPX-02 | No evidence | Insufficient evidence unless certified rule says otherwise | NOT RUN |
| EPX-03 | Cross-tenant/location access | Denied; no data leakage | NOT RUN |
| EPX-04 | Drill date/completeness | Only applicable verified drills considered | NOT RUN |
| EPX-05 | Plan exists but access unverified | Independent access determination | NOT RUN |
| EPX-06 | Uncertified crosswalk | Evaluation fails closed | NOT RUN |
| EPX-07 | Historical replay after rule update | Original revision and result reproducible | NOT RUN |
| EPX-08 | CAP recheck | Original retained, new determination linked | NOT RUN |
| EPX-09 | Evidence tamper | Digest mismatch detected | NOT RUN |
| EPX-10 | Citation disagreement | Certification blocked until reviewed | NOT RUN |

## 33. Supplemental engineering test cases

Add test coverage for concurrent plan revisions, duplicate fire-drill records, DST/time-zone boundaries, revoked staff authorization, deleted evidence object, inaccessible object store, idempotent evaluation retries, expired rule versions, overlapping effective dates, provider transfer, cross-location reuse, partial migration failure, and binder export redaction. All are proposed and unexecuted.

## 34. Test evidence standard

Each executed test must record commit SHA, environment, command, timestamp, test fixture ID, expected/actual result, artifact/log path, reviewer and pass/fail status. No aggregate pass count may be inferred from a written test list.

## 35. Security and privacy gate

Apply deny-by-default tenant filtering to every operational evidence query and object reference. Separate author, reviewer, certifier and runtime evaluator permissions. Audit access to sensitive staff/individual records. Avoid copying PHI/PII into knowledge packs, logs, exported binders or example fixtures.

## 36. Performance and failure modes

Define bounded query plans by tenant/provider/location/date, paging, read consistency and timeouts. On missing certified rule, ambiguous date, stale evidence, unavailable storage, or audit write failure, return a distinguishable non-final evaluation error or insufficient-evidence state; do not silently emit `NON_COMPLIANT`.

## 37. Observability and audit

Track evaluation ID, rule/crosswalk revision, evidence selector versions, scope, outcome, latency and failure reason. Audit certification, publication, supersession, access, rechecks and binder generation with correlation IDs. Metrics must not leak protected data.

## 38. Release gate G1 — Source authority

**BLOCKED.** Approved authoritative citation, applicability and effective-date evidence required. Disagreement between `565.23(b)(5)` and `§565.23(f)` must be resolved by regulatory review.

## 39. Release gate G2 — Decision ratification

**BLOCKED.** All twelve EP-D decisions require owner, dated signoff, selected contract and explicit disposition of open questions.

## 40. Release gate G3 — Source inventory

**INCOMPLETE.** Inspect existing plan, staff, binder, persistence, migrations, guards and deployment configuration before creating new components.

## 41. Release gate G4 — Security and provenance

**BLOCKED.** Authenticated provider scope, object access, immutable provenance and append-only historical rechecks must be demonstrated.

## 42. Release gate G5 — Implementation authorization

**NOT GRANTED.** Architectural planning and source inspection do not authorize repository edits, database migration or production deployment.

## 43. Release gate G6 — Executable verification

**NOT RUN.** Reproducible build, migrations, unit/integration/security tests, historical replay and evidence-based evaluator behavior required.

## 44. Release gate G7 — Release approval

**NOT GRANTED.** Requires G1–G6 evidence, operational rollout/rollback plan, training, and release authority signoff.

## 45. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Unconditional negative findings | False compliance conclusions | Replace only after approved evidence semantics |
| Incorrect statutory citation | Invalid certified logic | Official source/legal review |
| Earliest-provider fallback | Tenant data exposure | Auth-scoped context and isolation tests |
| Missing historical rule versions | Unreproducible findings | Immutable revision and replay manifest |
| CAP evidence used retroactively | Distorted history | Append-only recheck linkage |
| Duplicate operational storage | Conflicting facts | Full inventory before migration |
| Missing evidence misclassified | False failure | Explicit insufficient-evidence disposition |

## 46. Open questions requiring owners

What official statutory subsection governs each requirement? Does an existing plan/document aggregate already capture versioned emergency plans? What constitutes proof of staff accessibility? Which fire-drill fields are authoritative and sufficiently complete? What is the approved result enum? What is the durable audit/binder infrastructure? How will legacy findings be labeled? Which decision owner signs each crosswalk?

## 47. Implementation package candidates

After explicit authorization, candidate work packages: WP-01 regulatory citation and RKE certification; WP-02 operational plan inventory/model; WP-03 fire-drill selector; WP-04 staff-access selector; WP-05 crosswalk registry/resolver; WP-06 evaluator refactor; WP-07 tenant authorization; WP-08 provenance/recheck persistence; WP-09 binder snapshot; WP-10 migrations and executable verification. Package ordering is conditional on the dependency graph.

## 48. Definition of ready for each work package

Must have ratified decision ID, contract version, source-of-truth owner, verified current files, schema/API compatibility analysis, security impact, acceptance tests, rollback plan and assigned reviewer. A package missing any item stays `BLOCKED`.

## 49. Decision and evidence tracking template

| Item | Owner | Evidence link | Approval date | Status |
|---|---|---|---|---|
| EP-D01–EP-D12 | To assign | Pending | — | NOT RATIFIED |
| Citation reconciliation | Regulatory authority | Pending | — | BLOCKED |
| Source inventory | Engineering | Partial static inspection | — | INCOMPLETE |
| EPX-01–EPX-10 | QA/security/regulatory | No run artifacts | — | NOT RUN |
| Release authorization | Release authority | None | — | NOT GRANTED |

## 50. Traceability to governance

REC-017 identifies the emergency preparedness vertical-slice gap; REC-018 maps operational evidence; REC-019 proposes twelve ownership and crosswalk decisions; this REC-020 converts them into readiness and test gates. Related architecture decisions include knowledge-first enforcement, RKE independence, operational data separation, tenant isolation and historical reproducibility. No previous proposed decision is silently promoted to approved.

## 51. Explicit non-authorization

No source code, schema, migration, API, production data or configuration changes are authorized by this document. The file is a reconciliation deliverable only. No build or runtime test was executed in preparing it.

## 52. Next recommended artifact

**REC-021 — Emergency Preparedness Regulatory Citation and Crosswalk Source Verification Register.** This should capture official regulatory source text and effective-date evidence, line-by-line mapping to RKE IDs and evaluator codes, discrepancy dispositions, named reviewer decisions and certification prerequisites. Until that work is completed, no certified mapping should be claimed.

## 53. Final readiness determination

**NOT READY.** Twelve proposed decisions remain unratified; the statutory citation crosswalk remains unresolved; source inventory is incomplete; ten core tests are specified but not executed; no implementation authorization exists. The immediate priority is authoritative citation verification and approval of the evidence-to-rule crosswalk, not feature development.
