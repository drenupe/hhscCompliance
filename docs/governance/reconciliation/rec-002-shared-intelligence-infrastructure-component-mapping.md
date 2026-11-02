# REC-002 — Section 5: Shared Intelligence Infrastructure Component Mapping

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Source:** `hhscCompliance-develop.zip` (uploaded snapshot)  
**Method:** Static archive inventory and targeted source inspection  
**Build / runtime / database verification:** Not performed in this section  
**Implementation authorization:** NOT GRANTED

## 1. Purpose

Reconcile the proposed fifteen Shared Intelligence Infrastructure components (SII-01–SII-15) against observable code in the repository. Shared Intelligence supplies execution infrastructure; it **does not** become a third authority for regulatory or financial knowledge. The component names below are functional mapping labels pending exact comparison with ENG-018 and the approved canonical component registry.

## 2. Evidence standard

**Observed** means a file and, where stated, code contents were inspected. **Candidate** means potentially reusable code whose contract and operational behavior are not verified. **Not established** means the inspection does not demonstrate the capability; it is not proof that the capability is absent everywhere. No item is classified as production-ready. Reuse/Modify/Replace/Build New classifications remain provisional until acceptance evidence exists.

## 3. Repository evidence index

| ID | Exact archive-relative path | Evidence | Limitation |
|---|---|---|---|
| E01 | `server/src/app/audit/audit.service.ts` | NestJS TypeORM-backed audit service; includes audit input and action handling | Durability, failure handling, coverage and sensitive-data redaction unverified |
| E02 | `server/src/app/audit/interceptors/audit.interceptor.ts` | Audit interception source exists | Interceptor registration and complete request coverage unverified |
| E03 | `server/src/app/audit/entities/audit.entity.ts` | Audit entity exists | Schema and retention controls not verified |
| E04 | `server/src/app/security/services/audit-logs.service.ts` | Additional audit-related service exists | Potential overlap with E01 requires reconciliation |
| E05 | `server/migrations/1800000000223-CreateAuditLogs.ts` | Audit migration exists | Migration execution not verified |
| E06 | `server/src/app/remediation/entities/cap-evidence.entity.ts` | Corrective-action evidence entity exists | Not proof of universal evidence registry |
| E07 | `server/src/app/remediation/dto/upload-cap-evidence.dto.ts` | Evidence upload DTO exists | Storage, authorization, integrity not verified |
| E08 | `server/migrations/1800000000236-CreateCapEvidence.ts` | Evidence migration exists | Execution not verified |
| E09 | `libs/regulatory/knowledge/src/lib/services/document-generator.service.ts` | Document-generation code; resolves knowledge-backed definitions | RKE-coupled implementation, not proof of neutral document service |
| E10 | `libs/regulatory/knowledge/src/lib/services/survey-binder.service.ts` | File exists but is empty in uploaded snapshot | No binder behavior established |
| E11 | `libs/data-access/process/src/lib/engines/validation-engine.service.ts` | Angular injectable validates import/onboarding readiness | Specific to onboarding/import, not generic certified-knowledge execution |
| E12 | `libs/data-access/process/src/lib/engines/validation-engine.service.spec.ts` | Test file exists | Test execution not verified |
| E13 | `server/src/app/compliance-recheck/services/compliance-recheck.service.ts` | Cron-based compliance recheck service exists | Applied compliance workflow, not a universal event scheduler |
| E14 | `server/migrations/1800000000235-AddRecheckFieldsToComplianceResults.ts` | Recheck migration exists | Execution not verified |
| E15 | `docs/architecture/audit-logging-architecture.md` | Design document exists | Documentation is not operational evidence |
| E16 | `libs/features/consumers/src/lib/pages/programmatic/ipc/steps/ipc-approvals.step.ts` | UI approval-step source exists | Not proof of enterprise approval service |
| E17 | `libs/data-access/import/src/lib/pipeline/import-report.service.ts` | Import reporting code exists | Not proof of universal reporting infrastructure |
| E18 | `server/src/app/health/health.controller.ts` | Health endpoint source exists | Not proof of complete operational monitoring |

## 4. SII-01 through SII-15 mapping matrix

| ID | Proposed functional responsibility | Observed candidate evidence | Initial disposition | Confidence |
|---|---|---|---|---|
| SII-01 | Evidence registry and provenance | E06–E08 | Assess / likely Modify or Build | Medium |
| SII-02 | Governed validation execution | E11–E12 | Assess / likely Build or Modify | Low |
| SII-03 | Audit trail and accountability | E01–E05, E15 | Assess / likely Modify and consolidate | Medium |
| SII-04 | Document generation and rendering | E09 | Assess / likely extract shared contracts | Medium |
| SII-05 | Document storage and lifecycle | E07, E09 | Not established; assess | Low |
| SII-06 | Change management and impact workflow | No dedicated service verified | Not established; assess | Low |
| SII-07 | Review, approval and signatures | E16 (UI only) | Not established as shared service | Low |
| SII-08 | Reporting and export infrastructure | E17, E09 | Assess / likely generalize | Low |
| SII-09 | Universal binder lifecycle | E10 (empty file) | Not established; likely Build | High for observed gap |
| SII-10 | Secure external exchange and survey access | No dedicated implementation verified | Not established; assess | Low |
| SII-11 | Notifications and subscriptions | No dedicated implementation verified | Not established; assess | Low |
| SII-12 | Reliable event delivery and orchestration | E13 (domain scheduler) | Not established as universal infrastructure | Low |
| SII-13 | Historical execution and reproducibility | E01–E05, E14 (partial audit/recheck) | Not established end-to-end | Low |
| SII-14 | Authorization context propagation | Audit actor fields in E01; security source elsewhere | Assess integration with Platform Foundation | Low |
| SII-15 | Operational monitoring and health | E18 | Assess / likely extend | Medium |

**Mapping caution:** This matrix uses proposed functional labels, not a claim that ENG-018 assigns these exact names to each numbered component. Before canonical registration, reconcile IDs and responsibilities against the full ENG-018 source.

## 5. Detailed findings

### 5.1 Evidence management — SII-01

CAP evidence artifacts and a migration exist (E06–E08). Verify whether uploads are scoped to tenant, provider, subject, and finding; whether evidence is immutable after release; and whether retention, content hashes, provenance, access revocation and source-document permissions are enforced. A CAP-specific entity should not be silently promoted to universal evidence ownership.

### 5.2 Validation infrastructure — SII-02

The inspected Angular validation engine (E11) computes onboarding/import readiness and is not evidence of execution of certified RKE/FKE rules. Establish neutral validation-execution contracts with explicit knowledge owner, knowledge version, input snapshot, deterministic result, error semantics and trace identifiers. Keep rule definitions inside their owning engines.

### 5.3 Audit — SII-03

The repository has two audit-related service families (E01 and E04), plus entities, interceptors and a migration. Determine whether they share a table, conflict, duplicate records or have divergent retention policies. Inspect whether the audit service's fire-and-forget behavior can lose security-critical events; do not infer reliable audit delivery without tests. Verify redaction and append-only semantics.

### 5.4 Documents — SII-04 and SII-05

The RKE document generator (E09) resolves a document definition from a knowledge engine. Reuse may be appropriate through a shared renderer interface, while regulatory definition selection must remain RKE-owned. Storage backend, encryption, signed access, malware scanning, retention and released-document immutability remain unverified.

### 5.5 Change and approval — SII-06 and SII-07

An IPC approval UI step (E16) is not a general approval engine. Required controls include separate author/reviewer/certifier roles, state-transition guards, reason codes, approval evidence, revocation, and complete audit. RKE and FKE retain separate certification authority under AD-002/003.

### 5.6 Reporting and binders — SII-08 and SII-09

Import reporting (E17) and knowledge-driven document generation (E09) are possible building blocks. The inspected `survey-binder.service.ts` (E10) is empty. There is no demonstrated universal Draft → Assembling → Under Review → Approved → Released → Closed → Archived binder implementation. Survey and Financial Binders must share infrastructure while retaining type-specific policies; binder access never implies unrestricted source-document access.

### 5.7 External access and notifications — SII-10 and SII-11

No dedicated universal implementation was established by this targeted inspection. Verify scoped external identities, MFA, time-boxed grants, document ACL checks, immediate revocation and access logs. Notification contracts must be tenant-scoped, deduplicated, traceable and avoid sensitive payload leakage.

### 5.8 Event reliability — SII-12

The compliance recheck service (E13) runs a cron job; that does not demonstrate a durable outbox, event registry, retries, dead-letter handling or idempotent consumers. Assess transactional publication, delivery monitoring and replay separately. Event contracts must follow REC-001-D2.

### 5.9 Historical execution and context — SII-13 and SII-14

Audit and recheck metadata are insufficient by themselves to reproduce past decisions. Historical execution requires source snapshot identifiers, certified knowledge pack/version, effective-period resolution, calculation/runtime version, deterministic output and immutable evidence references. Authorization context must propagate across API, job, event and document boundaries.

### 5.10 Operations — SII-15

A health controller (E18) is present. Inspect runtime registration, dependency probes, error reporting, queue lag, backup/restore, alerting, correlation IDs, tenant-safe logging and disaster recovery. A health endpoint alone is not an SLO or production-readiness claim.

## 6. Cross-layer boundary tests

1. RKE and FKE retain sole authority over their respective certified definitions.
2. SII validates and executes governed contracts but cannot edit certified knowledge.
3. Operational services own facts; SII may retain evidence references and execution snapshots.
4. Applied Intelligence owns findings, determinations and remediation orchestration, not universal audit or binder infrastructure.
5. Platform Foundation owns authentication and authorization policy; SII must propagate and enforce supplied context.
6. UX cannot bypass backend authorization, source ACLs or approval transitions.

## 7. Proposed verification checklist

- [ ] Confirm SII-01–15 exact canonical titles and boundaries against ENG-018.
- [ ] Enumerate all Nx projects, aliases, dependency edges and NestJS module registrations.
- [ ] Trace CAP evidence from upload DTO through storage, access checks, database and retrieval.
- [ ] Compare audit services, tables, interceptors and event reliability semantics.
- [ ] Inspect document-generator outputs and source ACL handling.
- [ ] Search and test approval state machines and separation-of-duties checks.
- [ ] Confirm binder implementation status and all lifecycle transitions.
- [ ] Verify external access expiration, MFA, revocation and document scoping.
- [ ] Locate notification, outbox, queue and retry implementations, if any.
- [ ] Execute unit/integration/tenant-isolation tests in a controlled environment.
- [ ] Test historical reproduction using fixed source and knowledge versions.
- [ ] Record verified build/test outcomes, commit hash, environment and date.

## 8. Provisional work package candidates (not authorized)

| Candidate | Scope | Dependencies | Evidence needed before disposition |
|---|---|---|---|
| SII-WP-01 | Consolidate audit semantics and reliability | PF identity, DB | Audit implementation comparison and failure tests |
| SII-WP-02 | Generalize evidence registry | OP, CI, document storage | Evidence provenance and ACL tests |
| SII-WP-03 | Define neutral validation-execution contracts | RKE, FKE, REC-001 registry | Certified-knowledge fixture and deterministic test |
| SII-WP-04 | Governed approvals and certification handoffs | PF authorization, RKE/FKE | State-machine and separation-of-duties tests |
| SII-WP-05 | Universal binder infrastructure | Evidence, approvals, document ACL | Survey and Financial Binder lifecycle tests |
| SII-WP-06 | Durable events, notifications and monitoring | PF, API/event contracts | Outbox/retry/idempotency and alert tests |
| SII-WP-07 | Historical execution snapshots | RKE/FKE version resolution | Reproduction of prior period determinations |

## 9. Decisions and risks

- **Open:** Exact mapping of ENG-018 identifiers to this assessment's proposed functional labels.
- **Open:** Audit service overlap and security-critical event durability.
- **Open:** Ownership of generated document definition vs rendering/storage.
- **Open:** Universal Binder Management lifecycle and source-document ACL model.
- **Open:** Event infrastructure and historical execution guarantees.
- **Risk:** Treating a placeholder or domain-specific service as complete shared infrastructure would create hidden authority and compliance gaps.

## 10. Exit criteria and next section

This assessment may be closed only when canonical SII mapping, source-level ownership, dependency graph, acceptance tests, disposition decisions and approval evidence are recorded. Static file presence alone is insufficient. **Next: REC-002 Section 6 — Compliance and Financial Applied Intelligence Mapping (CI-01–CI-07 and FI-01–FI-11).**

**Status:** Assessment Draft — no source modifications, no test execution, no implementation authorization.
