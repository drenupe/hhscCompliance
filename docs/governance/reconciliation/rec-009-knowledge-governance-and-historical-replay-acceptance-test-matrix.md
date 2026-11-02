# REC-009 — Knowledge Governance and Historical Replay Acceptance Test Matrix

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document ID:** REC-009  
**Version:** 1.0 — Draft Acceptance Specification  
**Proposed repository path:** `docs/governance/reconciliation/rec-009-knowledge-governance-and-historical-replay-acceptance-test-matrix.md`  
**Primary design input:** REC-008 — Historical Determination and Knowledge Certification Contract Specification  
**Architecture decisions:** AD-001–AD-012 (principles approved)  
**Contract ratification:** PENDING  
**Test execution:** NOT RUN  
**Implementation authorization:** NOT GRANTED

> This document specifies acceptance tests for **proposed** contracts. No test case below is represented as executed or passed. Endpoint names, schema fields, and event identifiers remain provisional until the canonical contract registry is reconciled. The uploaded repository has been inspected previously, but this document is not a new runtime verification report.

## 1. Purpose

Provide a deterministic, auditable test matrix for independent knowledge certification, immutable version publication, temporal resolution, applied determinations, historical replay, and related authorization and reliability guarantees. A feature is not accepted merely because its classes, endpoints, or database tables exist.

## 2. Test boundary and authority model

- **RKE** owns authoritative regulatory definitions and applicability.
- **FKE** independently owns authoritative financial classifications, allowability, allocations, rates, formulas, and reporting methodologies.
- **Operational Domains** own factual records, not regulated interpretations.
- **Shared Intelligence** supplies validation execution, evidence, audit, approvals infrastructure, and delivery mechanisms without owning regulated definitions.
- **Applied Intelligence** evaluates facts against pinned certified versions.
- **Platform Foundation** enforces tenant, identity, security, persistence, and observability.
- **UX** displays authorized results and never substitutes for backend enforcement.

## 3. Source basis and limitations

REC-008 sections 7–31 define proposed artifact, lifecycle, certification, publication, temporal resolution, determination, replay, storage, security, and validation contracts. Sections 32–36 add domain-specific and error expectations. Section 37 contains a preliminary test matrix; this document expands it into executable acceptance scenarios. REC-008 explicitly states that durable immutable history, independent certification, full FKE governance, and historical replay were **not established** by prior repository inspection. The exact API routes and schemas are not yet ratified.

## 4. Test case schema

Each test record must include: stable ID, requirement references, contract revision, scenario, preconditions, fixtures, execution method, expected assertions, negative assertions, evidence artifacts, environment/build hash, run timestamp, result, defect reference, and reviewer. Permitted results: `NOT_RUN`, `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE` (with approved justification). No inferred PASS statuses.

## 5. Acceptance levels

1. **Contract:** Schema and state-transition checks against ratified definitions.
2. **Component:** Isolated RKE/FKE and Shared Infrastructure behavior.
3. **Integration:** Durable persistence, auth, events, and operational fact binding.
4. **End-to-end:** Certified knowledge to determination to released binder.
5. **Historical:** Deterministic replay after supersession, migration, and operational changes.
6. **Adversarial:** Tenant leakage, privilege escalation, replay tampering, race conditions, and delivery faults.

## 6. Fixture governance

Use synthetic organizations `tenant-alpha` and `tenant-beta`, synthetic authors/reviewers/certifiers with distinct identities, synthetic source documents, and synthetic operational evidence. No live PHI/PII or invented Texas regulatory rates. Fixtures must be explicitly marked **TEST ONLY**. Store source hash, knowledge artifact hash, evaluator build identifier, time-zone assumption, decimal precision policy, and expected result manifest. Seed data must be repeatable and isolated.

## 7. Certification lifecycle matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| KG-001 | Create RKE draft | Draft is editable only by authorized author; not resolvable as certified | NOT_RUN |
| KG-002 | Create FKE draft | Independent FKE authority and approval scope enforced | NOT_RUN |
| KG-003 | Validate structurally invalid definition | Validation fails with field-level errors and no publication | NOT_RUN |
| KG-004 | Validate missing authoritative provenance | Certification blocked with traceable reason | NOT_RUN |
| KG-005 | Author attempts self-review where separation required | Review denied; immutable denial audit recorded | NOT_RUN |
| KG-006 | Reviewer attempts unauthorized certification | Certification denied at backend | NOT_RUN |
| KG-007 | Authorized independent reviewer approves | Review record binds exact artifact hash/version | NOT_RUN |
| KG-008 | Certifier approves changed artifact after review | Stale review rejected; new review required | NOT_RUN |
| KG-009 | Certify exact validated version | Certification binds approver, time, hash, policy revision | NOT_RUN |
| KG-010 | Publish uncertified version | Publication rejected | NOT_RUN |
| KG-011 | Publish certified version | Published version immutable and resolvable under applicable dates | NOT_RUN |
| KG-012 | Repeated publication request | Idempotent result; no duplicate release or events | NOT_RUN |
| KG-013 | Revoke certifier role during workflow | Subsequent privileged action denied | NOT_RUN |
| KG-014 | RKE certifier attempts FKE approval without FKE grant | Cross-authority action denied | NOT_RUN |

## 8. Immutability and supersession matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| IM-001 | Edit certified definition | In-place mutation rejected | NOT_RUN |
| IM-002 | Edit published artifact through persistence path | Storage-layer immutability enforced | NOT_RUN |
| IM-003 | Publish successor version | Prior version remains retrievable and hash-stable | NOT_RUN |
| IM-004 | Overlapping applicability without approved precedence | Ambiguous resolution fails explicitly | NOT_RUN |
| IM-005 | Backdated correction | Prior as-known-at result remains reproducible | NOT_RUN |
| IM-006 | Delete version referenced by historical determination | Deletion denied or retention policy preserves replay dependency | NOT_RUN |
| IM-007 | Restore database backup | Immutable version identifiers and hashes preserved | NOT_RUN |
| IM-008 | Concurrent publication of conflicting versions | Deterministic conflict handling; no double active release | NOT_RUN |

## 9. Temporal resolution matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| TM-001 | Resolve before first effective date | Explicit no-applicable-version response | NOT_RUN |
| TM-002 | Resolve on effective-date boundary | Boundary inclusion matches ratified temporal policy | NOT_RUN |
| TM-003 | Resolve on supersession boundary | Correct version selected without overlap ambiguity | NOT_RUN |
| TM-004 | Resolve historical period after new publication | Historical effective version selected, not simply latest | NOT_RUN |
| TM-005 | Resolve `asKnownAt` before later correction publication | Original known version returned | NOT_RUN |
| TM-006 | Resolve `asKnownAt` after correction publication | Corrected knowledge returned only under explicit correction semantics | NOT_RUN |
| TM-007 | Time zone and midnight boundary | Canonical date/time interpretation deterministic | NOT_RUN |
| TM-008 | Future-dated certified version | Not prematurely applied to earlier period | NOT_RUN |
| TM-009 | Tenant-specific applicability | Unauthorized tenant cannot access protected scoped artifacts | NOT_RUN |
| TM-010 | Regulatory vs financial period differences | RKE/FKE independent effective-period resolution | NOT_RUN |

## 10. Determination manifest and replay matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| RP-001 | Produce compliance determination | Output pins RKE version, input snapshot/hash, evaluator version, result hash | NOT_RUN |
| RP-002 | Produce financial determination | Output pins FKE version, exact numeric policy, input snapshot/hash, evaluator version | NOT_RUN |
| RP-003 | Replay unchanged manifest | Deterministic canonical output equality under defined tolerance policy | NOT_RUN |
| RP-004 | Replay after successor knowledge publication | Historical result unchanged | NOT_RUN |
| RP-005 | Replay after operational record modification | Original immutable evidence snapshot used; live record does not rewrite history | NOT_RUN |
| RP-006 | Replay after evaluator deployment | Pinned evaluator artifact or compatible verified runtime used | NOT_RUN |
| RP-007 | Replay with missing input artifact | Explicit non-reproducible failure; never fabricated output | NOT_RUN |
| RP-008 | Replay with altered input hash | Integrity violation detected and audited | NOT_RUN |
| RP-009 | Replay with unavailable knowledge version | Explicit blocked result and incident trace | NOT_RUN |
| RP-010 | Authorized correction to historical determination | New correction record linked to original; original remains intact | NOT_RUN |
| RP-011 | RKE/FKE cross-authority reference | Exact foreign knowledge reference pinned; no ownership transfer | NOT_RUN |
| RP-012 | Decimal rounding and allocation order | FKE output follows certified numeric precision and deterministic ordering | NOT_RUN |

## 11. Security and tenant isolation matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| SC-001 | Tenant A reads Tenant B determination | Denied without revealing protected details | NOT_RUN |
| SC-002 | Tenant A replays Tenant B manifest | Denied at service and data boundary | NOT_RUN |
| SC-003 | Client forges tenant identifier | Trusted identity scope prevails over client-supplied tenant | NOT_RUN |
| SC-004 | Expired/revoked credential accesses certification | Denied and audited | NOT_RUN |
| SC-005 | Binder reader requests restricted source artifact | Independent source ACL enforced | NOT_RUN |
| SC-006 | External surveyor attempts knowledge publication | Denied regardless of binder access | NOT_RUN |
| SC-007 | Service-to-service unauthorized cross-engine call | Denied by scoped service identity | NOT_RUN |
| SC-008 | Audit log contains sensitive fields | Protected data redacted or restricted per policy | NOT_RUN |
| SC-009 | Reviewer and certifier role separation | Enforcement tested across direct API and background worker paths | NOT_RUN |

## 12. Event delivery and audit matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| EV-001 | Successful certification transition | One logical certification event with correlation and artifact hash | NOT_RUN |
| EV-002 | Transaction rollback during publication | No orphaned publication event | NOT_RUN |
| EV-003 | Duplicate event delivery | Consumer idempotency prevents duplicate side effects | NOT_RUN |
| EV-004 | Consumer temporary failure | Retry with bounded policy and observable status | NOT_RUN |
| EV-005 | Persistent delivery failure | Dead-letter/escalation mechanism and traceable recovery | NOT_RUN |
| EV-006 | Out-of-order supersession messages | Consumer does not regress authoritative state | NOT_RUN |
| EV-007 | Audit chain for approval and publication | Actor, role, timestamp, artifact version, decision and correlation recorded | NOT_RUN |
| EV-008 | Audit tampering attempt | Integrity violation detected or prohibited by enforced controls | NOT_RUN |
| EV-009 | Replayed determination | New replay audit entry references original immutable determination | NOT_RUN |

## 13. Binder and downstream consumption matrix

| Test ID | Scenario | Required assertion | Status |
|---|---|---|---|
| BD-001 | Assemble survey binder from determination | Binder pins source/evidence/knowledge versions | NOT_RUN |
| BD-002 | Assemble financial binder | Certified FKE methodology and calculation provenance retained | NOT_RUN |
| BD-003 | Release binder then supersede knowledge | Released binder remains unchanged and reproducible | NOT_RUN |
| BD-004 | Unauthorized source access through binder link | Denied under source-level authorization | NOT_RUN |
| BD-005 | Authorized historical binder replay | Exact release manifest and content integrity verified | NOT_RUN |

## 14. Negative and fault-injection suite

Inject database unavailability, partial writes, event bus outage, stale approval, hash mismatch, clock skew, duplicated commands, concurrent certification, revoked access, and interrupted replay. For every failure, require a stable error class, no unauthorized side effect, and a correlation identifier. No silent fallback to latest knowledge.

## 15. Regulatory vertical-slice acceptance

**Texas HCS Emergency Preparedness** is the first regulatory acceptance slice. Use only authoritative source material and certified knowledge versions approved through the RKE process. A synthetic drill/evidence fixture must support source provenance → applicability → validated/certified knowledge → operational fact → compliance determination → finding/reassessment → survey binder → historical replay. This matrix does **not** assert the contents of any particular Texas requirement or that the slice is implemented.

## 16. Financial vertical-slice acceptance

**Texas HCS Cost Reporting** is the first financial acceptance slice. Use verified authoritative reporting instructions and synthetic costs. Test financial source classification, allowability, allocation, exact decimal behavior, certified methodology version, calculation, reconciliation, reporting artifact, Financial Binder, and replay. Do not invent reimbursement rates, allocation policies, or allowability rules; these must be sourced and certified separately.

## 17. Contract test implementation guidance

After ratification, convert the scenarios into automated contract tests and integration tests using the repository's actual Nx/NestJS/TypeScript conventions. Prefer test fixture builders, deterministic clocks, explicit transaction boundaries, and temporary isolated databases. Avoid brittle assumptions about proposed endpoint names. Record exact command, exit code, toolchain versions, commit SHA, test report, and environment configuration.

## 18. Evidence artifacts required for each test

- Source contract revision and requirement identifier.
- Input fixture hash and expected result manifest.
- Exact executed command or test runner reference.
- Timestamp, environment, commit/build identifier, and database migration state.
- Assertion output and logs with protected data redacted.
- Audit/event records where relevant.
- PASS/FAIL/BLOCKED/NOT_RUN status and reviewer sign-off.

## 19. Traceability to REC-008

| REC-008 section(s) | Test groups |
|---|---|
| 7–12: artifact, lifecycle, approval, publication | KG, IM |
| 13–17: temporal resolution | TM |
| 18–23: determination, replay, supersession | RP, IM |
| 24–28: API, events, storage, immutability | KG, EV, IM |
| 29–31: tenant, duties, validation | SC, KG |
| 32–35: RKE, FKE, cross-authority, binder | RP, BD, vertical slices |
| 36–44: errors, tests, gates, open decisions | fault suite, evidence, exit gates |

## 20. Acceptance gates

- **G0 — Contract ratification:** canonical names, schemas, lifecycle transitions, temporal semantics, and event ownership approved.
- **G1 — Test design review:** every critical requirement mapped to positive, negative, and security tests.
- **G2 — Component verification:** isolated knowledge and authorization tests pass with evidence.
- **G3 — Integration verification:** durable storage, events, tenant boundaries, and failure recovery pass.
- **G4 — Vertical-slice verification:** regulatory and financial paths pass end to end.
- **G5 — Historical reproduction:** replay after supersession and corrections passes deterministically.
- **G6 — Release readiness:** security, performance, recovery, operations, and formal authorization independently satisfied.

No gate is marked passed in this draft.

## 21. Severity and blocking rules

**Critical:** cross-tenant leakage, unauthorized certification, mutable published knowledge, fabricated or silently changed historical outcomes. **High:** wrong effective-date selection, unrecoverable event loss, replay mismatch, missing provenance. **Medium:** contract incompatibility with documented workaround, incomplete diagnostics. **Low:** nonblocking presentation issues. Any unresolved critical or high defect blocks affected gate approval.

## 22. Open contract decisions

Before executable tests are finalized, ratify: canonical artifact and event IDs; publication/supersession boundary semantics; whether effective dates are date-only or instant-based per domain; `asKnownAt` behavior; replay equivalence and financial rounding; immutable evidence snapshot retention; certifier separation policy; tenant-global knowledge subscription model; outbox/delivery design; and binder manifest access rules. These are **not** silently decided by this test plan.

## 23. Initial execution ledger

| Category | Planned cases | Passed | Failed | Blocked | Not run |
|---|---:|---:|---:|---:|---:|
| Certification | 14 | 0 | 0 | 0 | 14 |
| Immutability | 8 | 0 | 0 | 0 | 8 |
| Temporal resolution | 10 | 0 | 0 | 0 | 10 |
| Determination and replay | 12 | 0 | 0 | 0 | 12 |
| Security | 9 | 0 | 0 | 0 | 9 |
| Events and audit | 9 | 0 | 0 | 0 | 9 |
| Binders | 5 | 0 | 0 | 0 | 5 |
| **Total** | **67** | **0** | **0** | **0** | **67** |

The two vertical-slice workflows and fault-injection suite require additional detailed test-case enumeration after contract ratification; they are not included in the 67-case total.

## 24. Roles and approval

Knowledge authority owners approve domain-specific expectations; platform security approves authorization cases; engineering and QA approve test feasibility and evidence completeness; governance records gate outcomes. Approval of this test specification does not constitute passing the tests or granting implementation authorization.

## 25. Exit criteria

REC-009 may be marked **test-design accepted** when cases, fixtures, traceability, expected assertions, and open decisions have been reviewed and ratified. It may be marked **execution verified** only after evidence-backed runs of the applicable suite. Neither status is asserted here.

## 26. Next controlled action

Reconcile the unresolved REC-008 contract fields and event schemas into the canonical registry, then run a bounded executable verification work package in an approved isolated environment. Preserve the uploaded repository unchanged until implementation authorization is granted.

---

**Document status:** DRAFT — TEST DESIGN ONLY  
**Contract ratification:** PENDING  
**Tests passed:** NONE CLAIMED  
**Repository modifications:** NONE  
**Implementation authorization:** NOT GRANTED
