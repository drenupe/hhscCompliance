# REC-002 — Section 3: Regulatory Knowledge Engine Component Mapping

**Version:** 1.0 — Assessment Draft  
**Repository snapshot:** `hhscCompliance-develop.zip` (uploaded archive)  
**Architecture baseline:** AD-001–AD-012 approved; REC-001 policy decisions approved  
**Implementation authorization:** NOT GRANTED  
**Verification method:** Static ZIP source inspection; no compilation, tests, migrations or live service execution.

## 1. Purpose
Map the proposed eleven Regulatory Knowledge Engine components to observed source files without mistaking source-file existence for working, approved functionality. Component-to-file relationships below are **candidate mappings**, not finalized ownership decisions.

## 2. Observed repository root
`hhscCompliance-develop/libs/regulatory/knowledge/` contains models, interfaces, a loader, validator, repository implementations, services, Texas HCS pack, and tests. `hhscCompliance-develop/server/src/app/regulatory/knowledge/` contains controller/module/service paths. These observations are limited to the supplied snapshot.

## 3. Component mapping overview

| Component | Proposed responsibility | Source evidence | Preliminary disposition |
|---|---|---|---|
| RKE-01 | Authoritative source intake | models/regulatory-source.model.ts | **Assess for reuse/extension**; not approved |
| RKE-02 | Source normalization and provenance | models/regulatory-rule.model.ts | **Assess for reuse/extension**; not approved |
| RKE-03 | Regulatory classification and applicability | models/regulatory-requirement.model.ts | **Assess for reuse/extension**; not approved |
| RKE-04 | Knowledge definition and modeling | models/*.ts | **Assess for reuse/extension**; not approved |
| RKE-05 | Knowledge validation | validators/knowledge-pack.validator.ts | **Assess for reuse/extension**; not approved |
| RKE-06 | Review and certification | No dedicated certification implementation confirmed within inspected RKE paths. | **Assess for reuse/extension**; not approved |
| RKE-07 | Knowledge pack assembly and loading | loaders/knowledge-pack.loader.ts | **Assess for reuse/extension**; not approved |
| RKE-08 | Effective dating and version resolution | models/knowledge-pack.model.ts | **Assess for reuse/extension**; not approved |
| RKE-09 | Knowledge repository and retrieval | repositories/knowledge-repository.interface.ts | **Assess for reuse/extension**; not approved |
| RKE-10 | Change impact and downstream notification | No dedicated change-impact publisher confirmed in inspected RKE paths. | **Assess for reuse/extension**; not approved |
| RKE-11 | Knowledge consumption and explanation | services/regulatory-knowledge.service.ts | **Assess for reuse/extension**; not approved |

## 4. Detailed component evidence and verification gaps

### RKE-01 — Authoritative source intake
**Candidate source paths:** `models/regulatory-source.model.ts; packs/texas-hcs/rules/emergency-preparedness.rule.ts`
**Observed:** Source models and a Texas HCS source object are present.
**Unverified / gap:** Source ingestion, provenance verification and authoritative freshness not established.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-02 — Source normalization and provenance
**Candidate source paths:** `models/regulatory-rule.model.ts; models/regulatory-requirement.model.ts`
**Observed:** Rule and requirement structures exist.
**Unverified / gap:** Normalization pipeline, source change detection and provenance completeness unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-03 — Regulatory classification and applicability
**Candidate source paths:** `models/regulatory-requirement.model.ts; models/regulatory-question.model.ts`
**Observed:** Requirement and question types exist.
**Unverified / gap:** General jurisdiction/program/tenant applicability resolver not verified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-04 — Knowledge definition and modeling
**Candidate source paths:** `models/*.ts; enums/regulatory.enums.ts`
**Observed:** Models for sources, rules, requirements, questions, evidence, validation, documents, renewal and guidance exist.
**Unverified / gap:** Coverage and semantic validation across all proposed regulatory domains not verified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-05 — Knowledge validation
**Candidate source paths:** `validators/knowledge-pack.validator.ts; validators/knowledge-pack.validator.spec.ts`
**Observed:** Validator checks metadata, unique identifiers, relationships and additional content families; tests are present.
**Unverified / gap:** Runtime test results, authoritative semantic correctness and full validation gates not verified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-06 — Review and certification
**Candidate source paths:** `No dedicated certification implementation confirmed within inspected RKE paths.`
**Observed:** Validator provides technical precondition only.
**Unverified / gap:** Independent reviewer/certifier roles, approvals and immutable certification records unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-07 — Knowledge pack assembly and loading
**Candidate source paths:** `loaders/knowledge-pack.loader.ts; packs/texas-hcs/texas-hcs.knowledge-pack.ts`
**Observed:** Loader validates before registration; Texas HCS pack is assembled explicitly.
**Unverified / gap:** Production publication, signed release, automatic discovery and atomic persistent deployment unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-08 — Effective dating and version resolution
**Candidate source paths:** `models/knowledge-pack.model.ts`
**Observed:** Metadata includes version, optional effectiveDate and publishedAt.
**Unverified / gap:** Immutable version storage, supersession date, as-of resolution and historical replay unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-09 — Knowledge repository and retrieval
**Candidate source paths:** `repositories/knowledge-repository.interface.ts; repositories/memory-knowledge.repository.ts; services/knowledge-engine.service.ts`
**Observed:** Repository interface, in-memory implementation and query service exist.
**Unverified / gap:** Durable storage, tenant/subscription scoping, query authorization and production readiness unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-10 — Change impact and downstream notification
**Candidate source paths:** `No dedicated change-impact publisher confirmed in inspected RKE paths.`
**Observed:** Pack load paths could be an integration point; this is a design inference.
**Unverified / gap:** Source diffing, affected-customer analysis, versioned events and reassessment triggers unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

### RKE-11 — Knowledge consumption and explanation
**Candidate source paths:** `services/regulatory-knowledge.service.ts; services/ai-guidance.service.ts; server/src/app/regulatory/knowledge/*`
**Observed:** Regulatory knowledge and AI-guidance services have source files; server integration paths exist.
**Unverified / gap:** Runtime API behavior, citation guarantees, AI authority boundary and downstream contract tests unverified.
**Decision:** Pending code-level dependency review, tests, and architecture acceptance. **Classification:** Provisional assessment only; no Reuse/Modify/Replace/Build decision approved.

## 5. Directly observed implementation details
- `KnowledgePackValidator.validate()` invokes checks for metadata, duplicate IDs, rules, requirements, questions, evidence requirements, validation rules, document definitions, renewal rules and guidance. Presence of checks does not establish that all intended business validations are complete.
- `KnowledgePackLoader.load()` validates a pack and throws `KnowledgePackLoadError` on invalid content before calling `repository.register(pack)`. `loadMany()` validates all supplied packs before registration.
- `MemoryKnowledgeRepository` stores pack objects and indexed definitions in JavaScript Maps; this is not durable production persistence.
- `KnowledgePackMetadata` includes `id`, `code`, `name`, `jurisdiction`, `industry`, `version` and optional `effectiveDate` and `publishedAt`. A full supersession/history contract was not established from this model.
- `texas-hcs.knowledge-pack.ts` declares `TX-HCS`, version `1.0.0`, and explicitly includes Emergency Preparedness rule/source/requirements/questions/evidence/validation/document/renewal/guidance data. Separate fire-drill and medication rule source files exist, but inclusion in the assembled pack is not demonstrated by the inspected pack declaration.
- Test source files exist for the knowledge engine and validator; test execution was not performed.

## 6. Critical governance gaps to resolve
1. Authoritative source provenance and periodic monitoring must be designed and verified.
2. Separation of knowledge author, reviewer, certifier and publisher must be enforced and audited.
3. Certified releases require immutable identifiers, durable storage, effective-date resolution and historical replay.
4. Knowledge-pack changes must emit governed, idempotent events with impact assessment.
5. Downstream consumers must use versioned contracts, tenant-aware authorization and explicit source citations.
6. Texas HCS regulatory content must be independently checked against official sources before certification; this assessment does not validate regulatory accuracy.

## 7. Dependency boundaries
RKE owns regulatory definitions and applicability. Shared Intelligence may execute validations and approvals but must not become an alternative rule authority. Operational Domains supply facts; Compliance Intelligence evaluates facts against certified RKE versions. Financial Knowledge Engine remains independent. AI guidance is assistive, not a certifier.

## 8. Proposed evidence collection
| Check | Required evidence | Current state |
|---|---|
| Nx project and TypeScript compilation | Command, exit code, logs, commit/archive fingerprint | NOT RUN |
| Validator and engine unit tests | Test report, cases, coverage | NOT RUN |
| Knowledge pack source audit | Verified authority URL, version, effective dates | NOT VERIFIED |
| Certification workflow | Role checks, approval trail, immutable release | NOT VERIFIED |
| As-of historical resolution | Deterministic fixtures and replay output | NOT VERIFIED |
| Persistent repository | Migration schema, durability tests | NOT VERIFIED |
| API contract | OpenAPI/DTOs, auth, integration tests | NOT VERIFIED |
| Events and downstream impact | Schemas, producer/consumer, retry tests | NOT VERIFIED |

## 9. Candidate inspection commands (not executed)
```bash
npx nx show project regulatory-knowledge --json  # confirm actual project name first
npx nx show projects
npx nx test <verified-project-name>
npx nx build <verified-project-name>
```
Use Node/npm versions required by the repository CI; do not assume the placeholder project name is valid.

## 10. Decision worksheet
| ID | Candidate library/module | Architectural owner | Reuse / Modify / Replace / Build | Evidence reference | Decision owner | Status |
|---|---|---|---|---|---|---|
| RKE-01 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-02 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-03 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-04 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-05 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-06 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-07 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-08 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-09 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-10 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |
| RKE-11 | Pending | RKE | Pending | Static inspection only | Pending | OPEN |

## 11. Release gates
- REC-001 canonical component naming and event/API contract mappings must be applied to verified components.
- ENG-024 detailed contract reconciliation must be completed.
- ENG-028 executable verification blockers must be resolved.
- All authoritative Texas HCS content requires qualified source review before certification.
- An implementation work package needs explicit, separate authorization.

## 12. Assessment conclusion
The uploaded repository provides a meaningful **RKE foundation**: typed models, validation and loading, in-memory retrieval, and an assembled Texas HCS Emergency Preparedness pack. It does **not** yet provide evidence sufficient to claim a fully governed, certified, durable, effective-dated Regulatory Knowledge Engine. Preserve existing assets as candidates while closing verification gaps.

## 13. Next section
REC-002 — Section 4: Financial Knowledge Engine Component Mapping (FKE-01 through FKE-13).

**Document status:** Draft; no repository changes made; no implementation authorization.
