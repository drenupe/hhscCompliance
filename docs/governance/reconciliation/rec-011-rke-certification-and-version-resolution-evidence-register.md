# REC-011 — RKE Certification and Version Resolution Evidence Register

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Evidence assessment draft  
**Source snapshot:** `hhscCompliance-develop.zip` supplied in this conversation  
**Proposed repository path:** `docs/governance/reconciliation/rec-011-rke-certification-and-version-resolution-evidence-register.md`  
**Decision authority:** AD-001–AD-012; REC-001 governance policy approvals  
**Implementation authorization:** **NOT GRANTED**  
**Inspection type:** Static source review; no code modifications, builds, database migrations, or runtime tests.

## 1. Purpose and boundaries

REC-010 calls for moving from architecture descriptions to verifiable repository evidence. REC-011 begins that work for the Regulatory Knowledge Engine (RKE), focusing on certification, immutable publication, effective-date resolution, and historical reproducibility. It records *what the supplied code proves*, what is inferred, and what remains unverified. It is not an implementation approval or a claim that a feature is absent everywhere in the repository.

## 2. Evidence identification

All paths below are relative to the ZIP's `hhscCompliance-develop/` root. Evidence is drawn from direct inspection of the named source files, not from earlier conversational descriptions.

| Evidence ID | Exact repository path | Observed role |
|---|---|---|
| RKE-E01 | `libs/regulatory/knowledge/src/lib/models/knowledge-pack.model.ts` | KnowledgePack and KnowledgePackMetadata interfaces |
| RKE-E02 | `libs/regulatory/knowledge/src/lib/repositories/knowledge-repository.interface.ts` | Repository interface and retrieval methods |
| RKE-E03 | `libs/regulatory/knowledge/src/lib/repositories/memory-knowledge.repository.ts` | In-memory pack registration and lookup |
| RKE-E04 | `libs/regulatory/knowledge/src/lib/loaders/knowledge-pack.loader.ts` | Validation-before-registration loader |
| RKE-E05 | `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.ts` | Pack structure and reference validation |
| RKE-E06 | `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.ts` | Read-only knowledge access service |
| RKE-E07 | `libs/regulatory/knowledge/src/lib/interfaces/knowledge-engine.interface.ts` | Public knowledge retrieval interface |
| RKE-E08 | `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.spec.ts` | Validator test source present; not executed |
| RKE-E09 | `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.spec.ts` | Engine test source present; not executed |
| RKE-E10 | `libs/regulatory/knowledge/src/lib/packs/texas-hcs/texas-hcs.knowledge-pack.ts` | Texas HCS pack definition |
| RKE-E11 | `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` | Emergency Preparedness rule source |

## 3. Evidence-backed findings

### 3.1 Metadata is version-aware but not itself a certification record

RKE-E01 defines `KnowledgePackMetadata` with required `id`, `code`, `name`, `jurisdiction`, `industry`, and `version`, plus optional `effectiveDate` and `publishedAt`. These fields enable descriptive versioning, but the inspected interface does **not** define a certifier identity, approval decision, immutable content digest, certification timestamp, or supersession linkage. Absence from this interface does not rule out other implementations elsewhere.

### 3.2 The repository contract is keyed by pack ID, not pack version

RKE-E02 exposes `register(pack)`, `unregister(packId)`, `getPack(packId)`, and `getAllPacks()`. It does not expose a method to retrieve a pack by immutable version ID, effective period, certification status, or as-of timestamp. This is a **verified interface gap** against the proposed REC-008 historical-resolution contract.

### 3.3 In-memory registration replaces the prior loaded pack for the same ID

RKE-E03 implements `register(pack)` by calling `this.unregister(pack.metadata.id)` before `this.packs.set(pack.metadata.id, pack)`. Thus the in-memory repository retains one loaded pack per ID and removes the previously indexed records. **This implementation does not retain previous versions of the same pack ID in memory.** It is not evidence that no historical archive exists elsewhere.

### 3.4 Loader validates before registering but does not certify

RKE-E04 calls `validator.validate(pack)` and throws `KnowledgePackLoadError` when invalid. For valid packs it calls `repository.register(pack)`. `loadMany` validates its inputs before registration. These are positive implementation facts. The inspected loader has no certification authorization check, independent reviewer/certifier workflow, signature verification, or immutable publication gate.

### 3.5 Validator performs structural/reference checks

RKE-E05 validates metadata, duplicate IDs, rules, requirements, questions, evidence requirements, validation rules, document definitions, renewal rules, and guidance. The observed `validateMetadata` checks the presence of `metadata.version` but does not establish certified authority or temporal selection. The complete validator may contain further checks not summarized here; the certification lifecycle is not demonstrated by the inspected public contract.

### 3.6 Engine exposes current knowledge lookups, not temporal resolution

RKE-E06 and RKE-E07 provide `getPack(packId)`, `getRule(ruleId)`, `getRequirement(requirementId)`, and related aggregate queries. The inspected interface does not provide `resolveKnowledge(asOfDate, jurisdiction, ...)`, `getCertifiedVersion(...)`, or `replayDetermination(...)` operations. These are proposed contracts, not implemented interface methods in this file.

## 4. Contract verification matrix

| Contract / invariant | Source evidence | Status | Required next evidence |
|---|---|---|---|
| Pack ID and version metadata | RKE-E01 | **Observed in source** | Tests for version format and semantic meaning |
| Effective-date metadata | RKE-E01 | **Observed, optional** | Policy for mandatory applicability and temporal semantics |
| Structural pack validation | RKE-E04/E05 | **Observed in source** | Execute validator tests and negative fixtures |
| Validation before loading | RKE-E04 | **Observed in source** | Execute loader acceptance tests |
| Durable immutable version retention | RKE-E02/E03 | **Not established; in-memory replacement conflicts with requirement** | Inspect database schema and persistence adapters; prove retention |
| Independent reviewer/certifier | RKE-E01/E04 | **Not demonstrated in inspected files** | Locate approval workflow, roles, state transitions, tests |
| Publication only after certification | RKE-E04 | **Not demonstrated** | Prove authorization and publication gate |
| Effective-dated version selection | RKE-E02/E06/E07 | **Not exposed by inspected contracts** | Approved resolver interface and integration tests |
| Historical replay | RKE-E06/E07 | **Not exposed by inspected contracts** | Determination snapshot and replay test evidence |
| Tenant and jurisdiction scoped resolution | RKE-E01/E07 | **Not verified** | Authorization and applicability tests |
| Financial Knowledge Engine parity | RKE source only | **Out of scope / pending** | Separate FKE evidence assessment |

## 5. Architecture-to-source gap register

| Gap ID | Severity (proposed) | Gap | Evidence | Treatment recommendation (not authorized) |
|---|---|---|---|---|
| RKE-G01 | Critical | No version-addressable retrieval in inspected repository contract | RKE-E02 | **Modify** interface and introduce versioned persistence adapter |
| RKE-G02 | Critical | Existing in-memory registration replaces same-ID loaded pack | RKE-E03 | **Retain for ephemeral testing only**, not historical authority |
| RKE-G03 | Critical | Loader can register validated pack without demonstrated certification | RKE-E04 | **Modify** publication boundary after approval design |
| RKE-G04 | High | Certification metadata and immutable digest absent from inspected pack metadata | RKE-E01 | **Extend** governed publication record; avoid mutating source definition silently |
| RKE-G05 | High | Effective-dated resolver absent from inspected knowledge-engine interface | RKE-E07 | **Build** explicit resolution contract with policy for ambiguity |
| RKE-G06 | High | Historical replay contract absent from inspected service interface | RKE-E06/E07 | **Build** determination provenance and replay orchestration |
| RKE-G07 | High | Approval separation-of-duties not evidenced in inspected loader | RKE-E04 | **Verify** platform approval services before selecting reuse/build |
| RKE-G08 | High | Tenant isolation and scoped authorization unproven for resolution | RKE-E07 | **Verify** backend enforcement and tests |

Severity and treatment are **provisional recommendations**, not approved work packages or production findings.

## 6. Proposed canonical contracts for technical review

These are design proposals from REC-008 principles, **not claims about existing source**.

### 6.1 CertifiedKnowledgeVersion

Minimum fields: `knowledgeAuthority` (`RKE` or `FKE`), `packId`, `versionId`, `contentDigest`, `jurisdiction`, `applicabilityScope`, `effectiveFrom`, `effectiveTo` (if applicable), `certificationStatus`, `reviewerId`, `certifierId`, `certifiedAt`, `publishedAt`, `supersedesVersionId`, and immutable source-provenance references. Separate **effective time** from **platform transaction/publication time**.

### 6.2 ResolveCertifiedKnowledge request

Minimum inputs: tenant/organization context; knowledge authority; pack ID or governed selector; jurisdiction/program; target effective date or period; as-known-at timestamp where historical state matters; caller authorization context. Return either one explicitly identified certified version with resolution trace or a typed failure (not found, ambiguous, unauthorized, unpublished).

### 6.3 HistoricalDeterminationSnapshot

Persist exact knowledge version/digest, evaluator version, operational input references or immutable snapshots, evidence digests, effective period, evaluation timestamp, tenant context, result digest, and correlation/audit identifiers. Replays must be distinguishable from original determinations and must not overwrite them.

## 7. Required acceptance tests and evidence

| Test ID | Scenario | Expected outcome | Execution |
|---|---|---|---|
| RKE-AT01 | Load structurally invalid pack | Validation error; no registration | NOT RUN |
| RKE-AT02 | Load two revisions sharing pack ID into current memory repository | Latest replaces earlier loaded revision; confirms current behavior | NOT RUN |
| RKE-AT03 | Attempt publication without certification | Governed publication rejects request | NOT RUN / CONTRACT NOT VERIFIED |
| RKE-AT04 | Author attempts self-certification where separation is required | Rejected | NOT RUN |
| RKE-AT05 | Resolve historical date before rule change | Exact applicable certified version selected | NOT RUN |
| RKE-AT06 | Resolve overlapping ambiguous effective windows | Explicit ambiguity error | NOT RUN |
| RKE-AT07 | Reproduce prior finding after newer pack published | Same input and version yields same deterministic result | NOT RUN |
| RKE-AT08 | Unauthorized tenant requests restricted knowledge | Denied with auditable result | NOT RUN |
| RKE-AT09 | Modify already certified version | Immutable mutation rejected; new version required | NOT RUN |
| RKE-AT10 | Replay with missing evidence snapshot | Typed non-reproducible result; no silent substitution | NOT RUN |

## 8. Dependency and sequencing decisions

1. Ratify canonical version identity and bitemporal resolution semantics before database or API changes.
2. Locate and inspect existing TypeORM entities/migrations and platform approval infrastructure before declaring the persistence and certification components absent.
3. Determine whether the in-memory repository is intentionally a test adapter; do not delete or replace it without an approved treatment decision.
4. Define publication authorization and separation of duties before wiring loader operations to persistent storage.
5. Align regulatory and financial temporal semantics while keeping RKE and FKE independent authorities.
6. Map these acceptance cases to REC-009 and avoid double-counting equivalent tests.
7. Only after technical ratification and executable verification, request authorization for a narrowly scoped implementation work package.

## 9. Evidence still needed

- Complete repository-wide search for certification, approval, published-version persistence, effective-date resolution, and snapshot/replay facilities.
- Actual database entities, migrations, indexes, and constraints for immutable knowledge versions.
- Backend routes, guards, and tenant scoping for knowledge administration and publication.
- Runtime test results for the existing loader, validator, and repository behavior.
- FKE source inspection and independent approval authority.
- Contract-owner and reviewer sign-off on proposed interfaces.

## 10. Closure criteria

REC-011 may close only when each critical contract is mapped to an approved owner and versioned specification, source-backed implementation evidence is identified, and any required test results are attached. **Current closure status: OPEN.** This report is an evidence register and proposed gap assessment, not an approved implementation plan.

## 11. Next assessment

**REC-012 — RKE Persistence, Approval Workflow, and Temporal Resolver Repository Trace**: inspect repository-wide persistence entities, migrations, approval services, API guards, and integration points to determine whether the capabilities missing from the inspected RKE interfaces exist elsewhere.
