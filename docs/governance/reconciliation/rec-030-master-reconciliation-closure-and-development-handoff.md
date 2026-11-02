# REC-030 — Master Reconciliation Closure and Development Handoff

## 1. Document control

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document:** REC-030 — Master Reconciliation Closure and Development Handoff  
**Date:** 2026-11-02  
**Status:** DOCUMENTATION HANDOFF DRAFT — not a technical closure certificate  
**Proposed repository path:** `docs/governance/reconciliation/rec-030-master-reconciliation-closure-and-development-handoff.md`  
**Implementation authorization:** **NOT GRANTED**  
**Evidence basis:** REC-001–REC-029; static observations of the uploaded `hhscCompliance-develop.zip` as reported in the reconciliation series. No new build, test execution, certification, or repository mutation is represented.

## 2. Executive disposition

**Close the planned reconciliation-document sequence at REC-030. Do not close the engineering gaps.** The project has enough planning artifacts to initiate a controlled implementation authorization decision, but the Emergency Preparedness vertical slice is not verified or release-ready. Twelve P0 blockers remain open; 36 verification scenarios are specified but unexecuted; proposed technical contracts and regulatory interpretations require ratification. The next work product should be executable changes and reproducible test evidence, not REC-031.

## 3. Meaning of closure

| Closure dimension | Disposition |
|---|---|
| REC-001–REC-030 documentation sequence | **Concluded as a planning series** |
| Architecture principles AD-001–AD-012 | Previously approved as principles; not implementation authorization |
| Proposed detailed decisions and contracts | Pending explicit ratification |
| P0 blocker closure | **0 of 12 established closed** |
| Regulatory certification | Pending |
| Acceptance scenario execution | **0 of 36 established executed** |
| Security and historical replay assurance | Not established |
| Release authorization | Not granted |

## 4. Architecture north star

Maintain six layers: (1) Platform Foundation; (2) Operational Domains; (3) independent Regulatory Knowledge Engine (RKE) and Financial Knowledge Engine (FKE); (4) Shared Intelligence; (5) Applied Intelligence, including Compliance Intelligence and Financial Intelligence; and (6) UX. **Knowledge-first rule:** no new compliance feature without its authoritative RKE representation and approved traceability. Operational records own facts, RKE owns regulatory meaning, evaluators apply certified knowledge to authorized facts, and UI presents determinations. AI does not certify regulatory knowledge.

## 5. Governing approvals and constraints

AD-001–AD-012 establish architecture direction. REC-001 D1–D5 establish naming, event, API-version, Nx dependency, and contract-registry policies. Neither set proves the corresponding runtime contracts are implemented. REC-013, REC-019, and REC-024 contain proposed detailed decisions requiring recorded approval. No development, migration, production publication, or regulatory certification is authorized by this handoff.

## 6. Evidence classification

Use **SOURCE-OBSERVED** only for inspected code at an identified archive/commit; **PROPOSED** for specification; **UNVERIFIED** where no executable or complete repository evidence exists; **EXECUTED-PASS/FAIL** only with immutable run records; **APPROVED** only with attributable authorization. A negative static search is not proof of universal absence. Any new repository checkout must be re-inventoried before editing.

## 7. Repository baseline

The prior static trace identified RKE pack models, validation, loader, knowledge service, and in-memory repository; compliance evaluation and result persistence; fire-drill records; and CAP evidence models. It also reported three empty NestJS RKE integration files, an Emergency Plans evaluator producing unconditional deficiencies, provider selection based on the earliest provider record, and an Angular Emergency Plans placeholder. These are **historical source-review findings**, not claims about an uninspected current commit. Record repository URL, commit SHA, archive checksum, branch, dependency lockfile, and execution environment at implementation kickoff.

## 8. Source-to-authority trace

| Concern | Authoritative owner | Existing or proposed path | Required proof |
|---|---|---|---|
| Regulatory requirement and effective dates | RKE | Knowledge Pack / certified revision | Source citation, effective-dated approval |
| Emergency plan and staff access facts | Operational Domains | New or reconciled records | Authorized provider/location evidence |
| Fire drill facts | Operational Domains | Existing fire-drill records | Mapping and quality tests |
| Rule evaluation | Compliance Intelligence | Evaluator integration | Certified revision + evidence predicates |
| Finding lifecycle | Compliance Results / Shared Intelligence | Existing result workflow plus compatibility | Status semantics, audit and provenance |
| Historical replay | Shared Intelligence + evaluator | Proposed manifest/replay | Same-version deterministic reconstruction |
| User presentation | UX | Workbench / emergency plans page | Accurate states and deep links |

## 9. RKE certification and persistence status

RKE metadata and validation are present in inspected source, but durable immutable revision history, independent certification, publication authorization, bitemporal resolution, and historical replay are not established. The in-memory repository was observed replacing a pack when the same ID is registered; it cannot alone be the historical system of record. REC-013–REC-015 provide proposed contracts, not approved implementation. A database design must distinguish logical artifact, immutable revision, certified release, source snapshot, and effective/recorded times.

## 10. Emergency Preparedness regulatory scope

The source-verification series identifies Texas HCS residential Emergency Preparedness under **26 TAC §565.23(e)–(f)** for further effective-date verification and independent certification. REC-021–REC-022 propose 14 atomic crosswalk entries and evidence predicates. Do not treat a subsection mapping or a draft predicate as legally certified. A designated regulatory reviewer must compare each entry with official, applicable historical rule text, record the source snapshot and date, and approve each binding.

## 11. Required outcome semantics

The proposed evaluation outcome contract distinguishes **COMPLIANT**, **NONCOMPLIANT**, **INSUFFICIENT_EVIDENCE**, **NOT_APPLICABLE**, and **REQUIRES_REVIEW**. Existing compliance-result models were reported to support only three statuses; implement an explicit backward-compatible translation or versioned contract. Do not map insufficient evidence to noncompliance, and do not treat an unresolved conflict as a passing determination. A definitive deficiency requires evaluated, attributable evidence under a certified applicable rule.

## 12. P0 blocker register — closure policy

REC-026 identifies **12 P0 blockers**, all open at handoff. Their canonical identifiers, wording, and owners must be copied from REC-026 into the live issue tracker without inventing a new numbering system. Each closure requires: linked code diff, review approval, isolated test case, execution evidence, security/regulatory review as applicable, and a signed disposition. This document groups P0s by remediation theme; it does **not** renumber or assert individual closure.

## 13. P0 theme A — tenant isolation

Replace default/earliest-provider selection with an authenticated, authorized provider and location context. Reject absent, forged, or cross-tenant identifiers at API, service, repository, and evaluator boundaries. Test denial of access to other providers' plans, fire drills, findings, documents, and replay manifests. Log authorization decisions without exposing sensitive records. Treat this as a release-blocking security fix.

## 14. P0 theme B — knowledge authority

Resolve regulatory citation discrepancies; independently certify atomic requirements; persist immutable versions; establish a resolver by applicable date and knowledge-as-known date; bind evaluator inputs to certified revision IDs. Missing, ambiguous, expired, or conflicting versions must fail closed into review or a defined indeterminate outcome rather than silently choosing the latest version.

## 15. P0 theme C — operational evidence

Create or reconcile emergency-plan existence, content/version, accessibility, staff acknowledgment, and evidence linkage models. Reuse fire-drill records where appropriate only after reconciling date, shift, applicability, and source quality. Capture provenance, provider/location scope, author, timestamps, corrections, and retention policy. A document upload alone does not prove staff access or the presence of required plan elements.

## 16. P0 theme D — evaluator correctness

Remove unconditional deficiency generation. Introduce a deterministic evidence adapter and versioned rule crosswalk; evaluate one atomic predicate at a time; record reason codes, evidence references, missing inputs, applicable dates, and certified knowledge revision. Handle incomplete or contradictory evidence explicitly. Protect the result writer from duplicate findings and accidental cross-provider writes.

## 17. P0 theme E — historical integrity

Record the exact source evidence snapshot/digest, applicable RKE revision, evaluator build/version, input hash, outcome hash, tenant/location scope, event correlation, and evaluation time. Corrections create append-only superseding records rather than rewriting prior released determinations. A historical replay must reproduce the past result using its original certified inputs, not the newest rule or newest evidence.

## 18. P0 theme F — API, UI, and audit

Version DTOs for five-state outcomes, preserve existing consumers where possible, ensure role-checked endpoints and deep links, and replace the Emergency Plans placeholder with a truthful evidence-and-finding workflow. Emit audit events through a reliable contract with idempotency and correlation IDs. Do not display unsupported certification badges or imply that a draft finding is a regulator-issued determination.

## 19. Prioritized implementation backlog

REC-029 defines **14 work packages**. Preserve their canonical work-package IDs and exact wording in the execution tracker; the sequence below is a dependency-oriented grouping, not a replacement register:

1. Establish immutable baseline and reproduce build/test commands.
2. Correct authenticated provider/location authorization and negative isolation tests.
3. Ratify regulatory citations, atomic predicates, and certification authority.
4. Implement operational emergency-plan and staff-access evidence contracts.
5. Reconcile fire-drill adapter and time/shift semantics.
6. Establish durable certified RKE revision storage and temporal resolution.
7. Bind certified RKE knowledge to evaluator context.
8. Replace unconditional findings with evidence-driven five-state decisions.
9. Implement provenance, correction history, and deterministic replay.
10. Align result persistence, DTOs, API, UX, audit, and binder integrations.
11. Execute the defined verification matrix and independently review evidence.
12. Obtain formal release authorization only after every gate passes.

## 20. Dependency graph

```text
Repository baseline + reproducible tests
                 |
Authenticated tenant context -----> evidence access controls
                 |                         |
Official rule verification ---> certified RKE revision + resolver
                 |                         |
                 +--------> evidence adapter / rule crosswalk
                                      |
                           deterministic evaluator
                                      |
                         findings + provenance manifest
                                      |
                           API / UX / binder / audit
                                      |
                     test evidence + approval / release
```
Do not parallelize around security or certification gates in ways that allow unauthorized or uncertified determinations to reach production.

## 21. First approved development increment

**Recommended scope, subject to explicit authorization:** (a) freeze repository baseline; (b) introduce a trusted evaluation context; (c) remove default-provider selection; (d) add denial tests for unauthorized provider/location combinations; (e) ensure existing behavior remains safe when context is absent. **Exit evidence:** reviewed diff, passing targeted tests, test command/output, negative-tenant fixtures, security approval. This increment does not certify regulations or authorize production release.

## 22. Second development increment

**Recommended scope:** ratify 14 draft atomic crosswalk entries and their effective dates; build the minimum independently approved RKE certification/version-resolution path needed for the vertical slice. No hardcoded unapproved citations, undocumented source text, or silently mutable knowledge. **Exit evidence:** source snapshot and reviewer signature, immutable revision test, resolver tests for gaps/overlaps and historical dates.

## 23. Third development increment

**Recommended scope:** implement emergency-plan and staff-access evidence records, reconcile fire-drill adapters, and apply provider/location authorization at every read/write. **Exit evidence:** CRUD and authorization tests, evidence correction history, fixture validation, and provenance checks.

## 24. Fourth development increment

**Recommended scope:** bind evaluator to certified atomic predicates; implement five-state determinations and status compatibility; persist evidence and knowledge references. **Exit evidence:** no unconditional deficiencies, deterministic assertions, indeterminate-state tests, result deduplication, and API consumer checks.

## 25. Fifth development increment

**Recommended scope:** historical replay, audit and event reliability, UI integration, binder references, and comprehensive acceptance execution. **Exit evidence:** replay manifests, append-only correction tests, UI accessibility/accuracy checks, event retry/idempotency tests, complete signoffs.

## 26. Verification plan — 36 scenarios

REC-027 specifies **36 verification scenarios**; REC-028 specifies their proposed harness/fixture contracts. Maintain a 1:1 scenario-to-run ledger with canonical scenario ID, expected result, fixture version, command, git SHA, timestamp, actual outcome, evidence URI, reviewer, and disposition. **Current executed count: zero established.** Do not report coverage as passed merely because fixtures or tests are described in Markdown.

## 27. Test fixture principles

Use synthetic provider A and B with distinct locations, plans, drill records, staff acknowledgments, RKE revisions, and findings. Include missing evidence, conflicting evidence, nonapplicable cases, retroactive rule changes, tampered digests, concurrency, denied access, and replay after corrections. Fixtures must be deterministic, safe to publish, and free of actual protected health information. Assert negative cases, not just happy paths.

## 28. Suggested verification commands

Commands are **illustrative**, not claimed to have run; determine actual Nx project names and targets from the checkout before use:

```bash
node --version
npm --version
npm ci
npx nx show projects
npx nx affected -t lint test build
```

Record exit codes, logs, environment, dependency lockfile checksum, and tool versions. Prior offline dependency-install limitations are not proof of code failure; classify blocked execution separately from failed tests.

## 29. Evidence package manifest

Every closure package should include `manifest.json` with: document/decision IDs, P0 ID, work-package ID, repository SHA, reviewer approvals, official rule source digest where relevant, executed test IDs, logs, coverage, vulnerability checks, migration results, rollback evidence, artifact hashes, and timestamps. Evidence should be immutable or content-addressed; never include secrets or live PHI. Use a retention policy approved by security/legal stakeholders.

## 30. Seven release gates

| Gate | Required closure proof | Current state |
|---|---|---|
| G1 Source baseline | Current SHA and reproducible inventory | Pending revalidation |
| G2 Contract ratification | Signed RKE, evidence, outcome, and security decisions | Pending |
| G3 Regulatory certification | Official effective-dated source + independent approval | Pending |
| G4 Tenant security | Negative isolation tests and review | Pending |
| G5 Evidence and evaluator | No unconditional findings; five-state tests | Pending |
| G6 Historical and integration | Replay, audit, API/UI, migration, rollback tests | Pending |
| G7 Release authorization | All P0 closed, evidence reviewed, accountable signoff | **Not granted** |

## 31. Approval matrix

| Decision | Proposed accountable role | Required artifact |
|---|---|---|
| Regulatory meaning and applicability | Regulatory authority/reviewer | Certified crosswalk and source snapshot |
| RKE revision/persistence design | Architecture owner | Ratified interface and migration decision |
| Provider/location authorization | Security owner | Threat review and isolation tests |
| Evidence ownership and retention | Domain + privacy owners | Data model and access/retention policy |
| Evaluator and compatibility contract | Engineering owner | Versioned contract and test results |
| Release | Authorized product/engineering/security stakeholders | Signed gate checklist |

These are **roles to assign**, not claims that specific people have approved.

## 32. Migration safety

Never infer historical certification or source effective dates from current timestamps. Backfill only attributable facts; mark unverifiable history as legacy/unverified. Run migrations against isolated backups, measure referential integrity, use explicit uniqueness and temporal-overlap controls, and document forward/rollback procedures. Keep read-only access to legacy findings until mapping and provenance are verified.

## 33. API and schema compatibility

Create a compatibility matrix for old three-state consumers and new five-state outcomes. Version public DTOs; reject unknown status values; provide explicit mapping only where semantics remain accurate. Ensure tenant scope is enforced by server-side authorization rather than trusting client-submitted provider IDs. Include pagination, error contracts, idempotency, and correlation IDs.

## 34. Event and audit contract

Canonical event names/IDs must be reconciled with REC-001/REC-003 before implementation. At minimum capture knowledge certification/publication, evidence creation/correction, evaluation completion, finding update, and replay events. Use transactional outbox or an equivalently verified delivery design, deduplication, retry/dead-letter handling, and immutable audit correlation. Proposed names are not registry assignments.

## 35. Financial Engine boundary

The FKE remains independent from RKE. This Emergency Preparedness handoff does not authorize financial methodology, reimbursement rates, cost-report classifications, or financial determination implementations. Reuse shared certification and replay infrastructure only where authority ownership, versioning, and approval are explicitly separated. Do not fabricate rates or regulatory interpretations.

## 36. Security and privacy baseline

Use least privilege, scoped service identities, encryption at rest/in transit, protected secrets, tenant-bound storage access, and audit retention. Prefer synthetic fixtures. Historical evidence and binder exports must enforce the same tenant and subject authorization as live records. Test IDOR, privilege escalation, provider confusion, document leakage, and replay access.

## 37. Risk register

| Risk | Severity | Mitigation | Closure evidence |
|---|---|---|---|
| Cross-provider evaluation | P0 | Trusted tenant context, denial tests | Security signoff |
| False noncompliance | P0 | Evidence predicates and five-state outcomes | Evaluator tests |
| Uncertified/incorrect citation | P0 | Official source + independent certification | Signed crosswalk |
| Lost historical revisions | P0 | Immutable persistence + temporal resolver | Replay tests |
| Broken consumer compatibility | High | Versioned DTO and migration | Contract tests |
| Missing audit events | High | Durable event delivery | Retry/idempotency tests |
| Build environment unreproducible | High | Lockfile, pinned toolchain, clean CI | Green run manifest |

## 38. Definition of ready for coding

A work package is ready only when it has an owner, approved scope, source evidence, ratified relevant contract, security/data classification, explicit acceptance tests, migration/rollback strategy where applicable, and an authorization record. **REC-030 does not itself satisfy the authorization record.**

## 39. Definition of done

A work package is done only after merged reviewed code, reproducible green tests, negative security checks, schema/API compatibility proof, audit and provenance checks, documentation update, and linked evidence manifest. A P0 is closed only when the designated owner signs its closure with supporting evidence. No checklist item may be closed based solely on a design document.

## 40. First developer onboarding checklist

- [ ] Obtain current repository and verify SHA/branch against supplied archive.
- [ ] Read AD-001–AD-012, REC-001, REC-017, REC-023, REC-026–REC-030.
- [ ] Inspect RKE repository/loader and NestJS integration files at current SHA.
- [ ] Inspect Emergency Plans evaluator and provider-selection logic.
- [ ] Enumerate actual Nx projects, targets, and package versions.
- [ ] Reproduce baseline build/test or document precise blockers.
- [ ] Import canonical 12 P0 IDs and 14 work-package IDs into tracker.
- [ ] Assign decision owners and obtain implementation authorization.
- [ ] Start security-first increment; preserve baseline behavior and evidence.

## 41. Handoff artifact index

| Source | Primary purpose |
|---|---|
| AD-001–AD-012 | Approved architecture principles |
| REC-001 | Canonical governance policies |
| REC-002–REC-007 | Component/API/event/knowledge static reconciliation |
| REC-008–REC-010 | Proposed historical contracts, tests, readiness |
| REC-011–REC-016 | RKE repository/contract/integration trace |
| REC-017–REC-023 | Emergency Preparedness vertical slice and evidence predicates |
| REC-024–REC-026 | Security/evidence decisions, approval packet, P0 register |
| REC-027–REC-028 | Verification runbook and harness specification |
| REC-029 | 14 prioritized work packages and gap consolidation |
| REC-030 | Documentation closure and controlled development handoff |

## 42. Open decision register

**Pending:** independent regulatory certification authority; official rule revision/effective-date verification; RKE immutable persistence and certification design; tenant authorization interface; emergency-plan and staff acknowledgment data contracts; fire-drill predicate semantics; five-state compatibility; replay manifest/retention; event registry IDs; release and rollback owners. These are not implicitly approved by inclusion in REC-030.

## 43. Go/no-go recommendation

**GO** for reviewing the handoff, appointing decision owners, ratifying contracts, preparing a clean repository baseline, and authorizing a narrowly scoped security-first development increment. **NO-GO** for production release, claims of verified compliance, publishing uncertified rules, or marking P0 blockers closed. This is a conditional planning recommendation, not a formal authorization.

## 44. Immediate next action

**Stop generating reconciliation documents.** Ask the accountable project owner to explicitly authorize the first implementation increment and identify the repository commit to modify. Then inspect that commit, reproduce the baseline, correct provider/location context, and execute negative tenant-isolation tests. Report changed files, exact commands, pass/fail evidence, and remaining P0 status. Do not begin by building new UI or hardcoding regulatory outcomes.

## 45. Formal handoff acknowledgement template

```text
Project: McCaskill Projects Regulatory Intelligence Platform
Handoff document: REC-030
Repository baseline SHA: __________________________
Architecture owner: _______________________________
Regulatory reviewer: ______________________________
Security owner: ___________________________________
Engineering lead: __________________________________
Accepted scope/work-package IDs: ___________________
Implementation authorization: [ ] GRANTED  [ ] NOT GRANTED
Authorized by / date / signature: __________________
Known open P0 IDs acknowledged: ____________________
Release authorization: [ ] GRANTED  [x] NOT GRANTED
```
**Blank fields are intentional.** No signatures, decisions, or execution evidence are fabricated.

## 46. Final reconciliation statement

**The REC documentation series is complete by plan, but the platform is not technically reconciled or production-certified.** The authoritative backlog remains open until its contracts are ratified, P0 issues corrected, 36 scenarios executed with recorded evidence, regulatory requirements independently certified, and release gates signed. The next phase is **controlled implementation and verification**, not another documentation cycle.

## 47. References and traceability

Primary: REC-026 (12 P0 closure items), REC-027 (36 verification scenarios), REC-028 (test harness contract), REC-029 (14 work packages). Supporting: REC-001–REC-025 and AD-001–AD-012. Source-level observations are inherited from prior static analysis of `hhscCompliance-develop.zip`; exact source line references and IDs should be consulted in their originating registers and revalidated against the target commit. This document does not claim independent execution of the tests or fresh source inspection.
