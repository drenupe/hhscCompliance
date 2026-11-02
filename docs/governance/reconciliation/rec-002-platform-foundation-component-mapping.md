# REC-002 — Component-to-Service Mapping and Dependency Reconciliation
## Section 1: Platform Foundation (PF-01–PF-09)

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Source:** User-supplied `hhscCompliance-develop.zip`  
**Status:** Static repository evidence reviewed; runtime and security behavior not verified  
**Implementation authorization:** NOT GRANTED

## 1. Purpose and evidence standard
Map nine *proposed* Platform Foundation component slots to code actually present in the uploaded Nx monorepo. The source archive is evidence of files, **not** proof of correct behavior, secure operation, successful builds, or production readiness. Component titles and slot allocations below are **provisional functional groupings** pending reconciliation against the canonical ENG-008/ENG-021 registry; they are not claimed to be verbatim canonical definitions.

Evidence categories: **Observed** = file/path exists in archive; **Inferred** = probable responsibility from names; **Unverified** = functionality requires code review, test or execution; **Proposed** = architecture or next action, not present behavior.

## 2. Source and inspection method
- Archive: `hhscCompliance-develop.zip` (1,814 ZIP entries, including directories).
- Inspected ZIP entry paths, with targeted inventory of backend modules and security-related files.
- No dependency installation, build, test, migration, application startup, penetration test or deployment performed during this section.
- Prior ENG-027/ENG-028 findings remain separate; do not turn previous static findings into runtime certification.
- Canonical component identifiers follow approved REC-001-D1: `PF` for Platform Foundation.

## 3. Verified repository anchors
| Area | Observed path | Interpretation / limit |
|---|---|---|
| Backend | `server/project.json`, `server/src/app/` | Nx-managed NestJS server source present; build not verified here |
| Frontend | `web/project.json`, `libs/data-access/project.json` | Frontend and data-access projects present |
| Authentication | `server/src/app/auth/` | Authentication controllers, services, JWT strategy/guards present |
| Authorization | `server/src/app/security/` | Roles, permissions, authorization service and guards present |
| MFA | `server/src/app/security/services/mfa.service.ts` | MFA implementation source present; enrollment/enforcement not verified |
| Audit | `server/src/app/audit/`, `server/src/app/security/services/audit-logs.service.ts` | Two audit-related source areas present; ownership overlap needs review |
| Health | `server/src/app/health/` | Health endpoint source present |
| Observability | `server/src/app/observability/` | Observability module directory present; production telemetry not verified |
| Provider | `server/src/app/providers/` | Provider domain source present; tenant isolation not proven |
| Database migrations | `server/migrations/` | Migration sources present; migration success not verified |
| Frontend auth | `libs/data-access/src/lib/auth/` | Client auth guard/interceptor/state sources present |

## 4. Provisional PF mapping
**Important:** The PF slot labels below are working labels, not confirmed titles from ENG-021. Final mapping requires checking the approved component catalog and reviewing source internals.

| Slot | Provisional responsibility | Observed implementation evidence | Assessment | Verification needed |
|---|---|---|---|---|
| PF-01 | Identity and authentication | `server/src/app/auth/`, JWT strategy, tokens/sessions/password services | **Modify candidate**; code present, conformity unknown | Token lifecycle, password policy, session revocation, auth tests |
| PF-02 | Roles, permissions and authorization | `server/src/app/security/`, permission guard, authorization service | **Modify candidate** | Role/attribute scope, deny-by-default, backend enforcement |
| PF-03 | Tenant and organization context | `server/src/app/providers/`, provider models and service paths | **Unclassified**; provider records do not prove isolation | Tenant context propagation, cross-tenant negative tests, DB queries |
| PF-04 | API gateway and contract boundary | `server/src/app/`, `server/project.json`, frontend data-access | **Modify candidate** | Actual routing/versioning, DTO schemas, OpenAPI, auth and errors |
| PF-05 | Persistence and migrations | `server/migrations/`, server project configuration | **Modify candidate** | TypeORM config, migrations on clean DB, rollback, integrity |
| PF-06 | Documents and storage | No dedicated storage module established by path inspection | **Unclassified** | Search source for upload/storage adapters, encryption, retention |
| PF-07 | Integration and messaging | No platform-wide integration/event bus established by path inspection | **Unclassified** | Locate producers/consumers, retry/idempotency/outbox and contracts |
| PF-08 | Monitoring, health and operations | `server/src/app/health/`, `server/src/app/observability/` | **Modify candidate** | Readiness/liveness, metrics, traces, alerting, PHI-safe logging |
| PF-09 | Security governance and audit | `server/src/app/audit/`, `server/src/app/security/`, MFA and audit services | **Modify candidate** | Audit completeness, immutability, MFA policy, retention, access review |

**Classification caution:** “Modify candidate” is a planning hypothesis, **not** a final Reuse/Modify/Replace/Build decision. No replacement or new-build recommendation is justified solely by missing filenames.

## 5. PF-01 — Identity and authentication
Observed files include `server/src/app/auth/auth.controller.ts`, `auth.service.ts`, `strategies/jwt.strategy.ts`, `guards/jwt-auth.guard.ts`, `services/tokens.service.ts`, `services/sessions.service.ts`, and `services/password.service.ts`. Frontend `libs/data-access/src/lib/auth/` includes auth guards, interceptors and state. Verify password handling, token issuance and rotation, session invalidation, disabled accounts, clock skew, MFA integration, and whether frontend authorization is backed by server checks.

## 6. PF-02 — Authorization
Observed `server/src/app/security/services/authorization.service.ts`, `guards/permissions.guard.ts`, role and permission entities/services/controllers. Confirm a single effective permission-evaluation pathway; test organization, provider, location, record, action and delegated access. Test direct API access that bypasses the UI.

## 7. PF-03 — Tenant context and isolation
`providers/` exists, but **provider domain entities are not sufficient evidence of tenant isolation**. Trace providerId/organizationId across authentication, request context, service queries, background jobs, events, file access and exports. Require positive and negative tests for every cross-tenant data path.

## 8. PF-04 — API boundary
Locate route prefixes, DTO validation pipes, OpenAPI generation, exception filters, request correlation and authorization. Reconcile against REC-001-D3 versioning and REC-001-D5 registry. Preserve existing `/api/v1` consumers through explicit compatibility review.

## 9. PF-05 — Persistence
Inventory migrations, TypeORM data sources, entities, constraints and transaction boundaries. Run migrations only in an isolated test database with documented configuration; never point test commands at production. Check for duplicate or divergent migration histories and rollback feasibility.

## 10. PF-06 — Storage and documents
Conduct targeted content search for object-storage clients, upload controllers, document entities and file references. Determine whether the implementation provides scoped authorization, encryption, retention, immutable evidence references and audit events. Do not infer absence from a folder-name search.

## 11. PF-07 — Integrations and events
Inventory HTTP integrations, scheduled jobs, event publishers, queues, webhook consumers and retry policies. Compare all discovered events to the canonical registry. Verify idempotency, deduplication, correlation IDs, schema versions and failure recovery before claiming readiness.

## 12. PF-08 — Observability
Health and observability directories are present. Determine what checks are actually wired into startup and deployment, what telemetry is emitted, and whether sensitive data is excluded. Define measurable SLOs and alert ownership only after operational requirements are approved.

## 13. PF-09 — Security and audit
Two audit-related source areas warrant a responsibility review, not an assumption of duplication. Check immutable audit records, actor/resource context, denied-access recording, export monitoring, MFA enforcement, secret management and retention. Verify external surveyor access separately; MFA source presence does not prove surveyor safeguards.

## 14. Dependency and boundary reconciliation
- PF may provide identity, authorization, storage, audit and transport primitives to other layers; it must not own certified regulatory or financial definitions.
- Operational domains own source facts and must not delegate source-of-truth ownership to PF.
- RKE and FKE may depend on published PF contracts, not each other's internals.
- Shared Intelligence must use PF primitives without becoming an independent knowledge authority.
- Angular data-access clients must not import backend implementation code.
- Evaluate Nx project tags and import graph against REC-001-D4; **no automated graph check was run**.

## 15. Required verification matrix
| ID | Check | Expected evidence | Current state |
|---|---|---|---|
| PF-V01 | Dependency installation | Reproducible `npm ci` log | NOT RUN in this section |
| PF-V02 | Nx project graph | Exported graph and violations report | NOT RUN |
| PF-V03 | Backend compilation | `nx build server` output | NOT RUN |
| PF-V04 | Authentication tests | Unit and negative API tests | NOT RUN |
| PF-V05 | Tenant isolation | Cross-tenant access denial tests | NOT RUN |
| PF-V06 | MFA and revocation | Authenticated lifecycle tests | NOT RUN |
| PF-V07 | Migration replay | Clean database migration logs | NOT RUN |
| PF-V08 | Storage ACL | Source-document access tests | NOT RUN |
| PF-V09 | Event reliability | Retry, idempotency and failure tests | NOT RUN |
| PF-V10 | Audit integrity | Tamper/access review evidence | NOT RUN |
| PF-V11 | Health and telemetry | Runtime endpoints, metrics, traces | NOT RUN |
| PF-V12 | API compatibility | Contract snapshots and consumer tests | NOT RUN |

## 16. Open questions and decision gates
1. Confirm exact PF-01–PF-09 canonical names and responsibilities against ENG-021.
2. Resolve ownership between `audit/` and `security/` audit services after inspecting actual implementations.
3. Identify true tenant context boundaries and any row-level database safeguards.
4. Establish actual document storage and event integration architecture through source inspection.
5. Resolve whether security modules support external surveyor access requirements.
6. Complete dependency installation in a supported environment, then builds and tests.
7. Obtain explicit approval for any proposed migration or implementation work package.

## 17. Preliminary gap register
| Gap | Evidence | Risk | Disposition |
|---|---|---|---|
| G-PF-01 | Tenant isolation not verified | High | Test and inspect before classification |
| G-PF-02 | Two audit-related source areas observed | Medium | Reconcile ownership |
| G-PF-03 | Storage contracts not yet located | High | Targeted source inspection |
| G-PF-04 | Event reliability not yet established | High | Contract inventory and runtime tests |
| G-PF-05 | Build/test readiness not established | High | Complete ENG-028 verification |
| G-PF-06 | Canonical PF titles not confirmed | Medium | Reconcile with ENG-021 |

## 18. Recommendation and next section
Treat PF-01–PF-09 as **provisional mappings pending source-level and runtime verification**. Preserve potentially reusable code; do not approve replacement, implementation or production deployment from this assessment. Next, reconcile canonical PF component titles and complete targeted code-level inspection, then proceed to **REC-002 Section 2 — Operational Domains (OP-01–OP-12)**.

**Decision status:** Assessment draft only. **Implementation authorization: NOT GRANTED.**
