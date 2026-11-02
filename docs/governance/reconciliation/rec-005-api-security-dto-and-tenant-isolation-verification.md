# REC-005 — API Security, DTO Contracts, and Tenant Isolation Verification

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Document status:** Evidence-based static assessment — Draft 1.0  
**Repository snapshot:** `hhscCompliance-develop.zip` supplied in conversation  
**Proposed repository location:** `docs/governance/reconciliation/rec-005-api-security-dto-and-tenant-isolation-verification.md`  
**Implementation authorization:** **NOT GRANTED**

## 1. Purpose and scope

Examine the existing NestJS controllers, authentication/authorization entry points, DTO definitions, and tenant-scope enforcement candidates. This is a **static code inspection**, not a penetration test, runtime verification, or proof that endpoints are accessible or protected. A missing local guard annotation is **not proof** of an unprotected endpoint: global guards, middleware, and other policies must be traced first.

## 2. Evidence and method

- Inspect TypeScript files directly from the supplied ZIP without changing the repository.
- Enumerate controllers and method decorators, local `@UseGuards` annotations, DTO paths, and security-related files.
- Treat inferred behavior as **unverified** until code-path analysis and runtime tests confirm it.
- Never use live personal data, production credentials, or real tenant records for verification.

## 3. Summary of observed inventory

- **26** files matching `server/src/app/**/*.controller.ts`.
- **58** TypeScript files under server paths containing `/dto/` (file count, not a count of validated API schemas).
- Authentication and permissions guard source files are present.
- These observations do **not** demonstrate consistent endpoint enforcement, validation, tenant scoping, or safe production configuration.

## 4. Controller inventory and local guard evidence

The method count below counts `@Get`, `@Post`, `@Put`, `@Patch`, and `@Delete` annotations; it does not establish reachable routes. A class-level guard or method-level guard may be present; local annotations shown are extracted from the file and are not a complete effective-policy evaluation.

| Controller source | `@Controller` argument (static extract) | HTTP method decorators | Local `@UseGuards` annotations |
|---|---|---:|---|
| `server/src/app/app.controller.ts` | `` | 2 | No local @UseGuards found; global guard status unverified |
| `server/src/app/audit/dashboard/dashboard.controller.ts` | `'dashboard'` | 2 | No local @UseGuards found; global guard status unverified |
| `server/src/app/auth/auth.controller.ts` | `'auth'` | 2 | No local @UseGuards found; global guard status unverified |
| `server/src/app/compliance/compliance-results.controller.ts` | `'compliance-results'` | 5 | No local @UseGuards found; global guard status unverified |
| `server/src/app/compliance/engine/compliance-engine.controller.ts` | `'compliance/engine'` | 1 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/consumers/consumers.controller.ts` | `{   path: 'consumers',   version: '1', }` | 4 | No local @UseGuards found; global guard status unverified |
| `server/src/app/dashboard/dashboard.controller.ts` | `'dashboard'` | 6 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/executive/executive.controller.ts` | `'executive'` | 1 | No local @UseGuards found; global guard status unverified |
| `server/src/app/fire-drills/fire-drills.controller.ts` | `'fire-drills'` | 5 | No local @UseGuards found; global guard status unverified |
| `server/src/app/health/health.controller.ts` | `'health'` | 2 | No local @UseGuards found; global guard status unverified |
| `server/src/app/iss/iss.controller.ts` | `{   path: 'iss',   version: '1', }` | 10 | No local @UseGuards found; global guard status unverified |
| `server/src/app/observability/metrics/metrics.controller.ts` | `'metrics'` | 1 | No local @UseGuards found; global guard status unverified |
| `server/src/app/operations/operations.controller.ts` | `'operations'` | 1 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/people/people.controller.ts` | `'people'` | 49 | No local @UseGuards found; global guard status unverified |
| `server/src/app/providers/providers.controller.ts` | `'providers') // ✅ FIX: no api/v1 here // @UseGuards(RolesGuard` | 5 | RolesGuard |
| `server/src/app/raci/raci.controller.ts` | `{   path: 'raci',   version: '1', }` | 2 | No local @UseGuards found; global guard status unverified |
| `server/src/app/regulatory/knowledge/regulatory-knowledge.controller.ts` | `not statically resolved` | 0 | No local @UseGuards found; global guard status unverified |
| `server/src/app/remediation/controllers/remediation.controller.ts` | `'remediation'` | 15 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/residential/residential-locations.controller.ts` | `'residential-locations'` | 5 | No local @UseGuards found; global guard status unverified |
| `server/src/app/security/controllers/audit-logs.controller.ts` | `'security/audit-logs'` | 4 | No local @UseGuards found; global guard status unverified |
| `server/src/app/security/controllers/mfa.controller.ts` | `'security/mfa'` | 5 | No local @UseGuards found; global guard status unverified |
| `server/src/app/security/controllers/permissions.controller.ts` | `'security/permissions'` | 7 | No local @UseGuards found; global guard status unverified |
| `server/src/app/security/controllers/roles.controller.ts` | `'security/roles'` | 5 | No local @UseGuards found; global guard status unverified |
| `server/src/app/security/controllers/security-test.controller.ts` | `'security-test'` | 1 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/survey/survey.controller.ts` | `'survey'` | 2 | JwtAuthGuard, PermissionsGuard |
| `server/src/app/users/users.controller.ts` | `'users'` | 3 | JwtAuthGuard, PermissionsGuard |

## 5. Security entry points requiring code-path verification

| Area | Evidence path | Status | Required verification |
|---|---|---|---|
| JWT guard | `server/src/app/auth/guards/jwt-auth.guard.ts` | File exists | Authentication strategy, token claims, expiry, revocation, route application |
| Role guard | `server/src/app/auth/roles.guard.ts` | File exists | Role resolution, resource scope, default deny |
| Permission guard | `server/src/app/security/guards/permissions.guard.ts` | File exists | Metadata handling, tenant/record checks, fail-closed behavior |
| Auth controller | `server/src/app/auth/auth.controller.ts` | File exists | Login/session flows, brute-force limits, secure cookie/token policy |
| Roles/permissions controllers | `server/src/app/security/controllers/roles.controller.ts`, `permissions.controller.ts` | Files exist | Who can administer roles and prevent privilege escalation |
| MFA controller | `server/src/app/security/controllers/mfa.controller.ts` | File exists | Enrollment, challenge, recovery, privileged/external-user policy |
| Audit log controller | `server/src/app/security/controllers/audit-logs.controller.ts` | File exists | Tenant filtering, immutable logs, sensitive field redaction |
| Global policy | `server/src/main.ts`, `server/src/app/app.module.ts` | Must trace | Global guards, pipes, prefix/versioning, CORS, filters |

## 6. DTO and request-validation verification

The presence of DTO files is not equivalent to runtime validation. For each externally writable route, inspect:

1. DTO parameter type and decorators (e.g., `class-validator`) and any nested/array constraints.
2. `ValidationPipe` configuration and whether it applies globally or per endpoint; verify `whitelist`, `forbidNonWhitelisted`, and transformation policy as appropriate.
3. Explicit authorization checks for route IDs, body IDs, and referenced entity IDs; never trust client-provided tenant/provider IDs alone.
4. Input sanitization and safe output serialization; avoid returning password hashes, tokens, full personal identifiers, or internal-only fields.
5. Pagination, sorting allowlists, file-upload limits, and idempotency for mutation operations.
6. OpenAPI or contract schema drift checks, if OpenAPI is used.

### DTO inspection worksheet

| Endpoint | Request DTO | Runtime pipe | Authorization | Response DTO | Result |
|---|---|---|---|---|---|
| Every writable route in Section 4 | To verify | To verify | To verify | To verify | **NOT TESTED** |

## 7. Tenant isolation and resource-level authorization

**High-priority risk to investigate:** multi-tenant data access must be enforced on every query and mutation, not only through a provider dashboard or route guard.

Required trace for each resource family:

- Establish trusted tenant context from authenticated principal and authorized membership.
- Verify provider/organization scope on reads, writes, list queries, exports, and background jobs.
- Verify location-specific permissions and that provider-wide routes do not accidentally broaden access.
- Verify entity IDs are resolved under tenant constraints, including nested resources and bulk operations.
- Verify admin endpoints, audit endpoints, and file/document download paths cannot cross tenant boundaries.
- Verify event consumers and scheduled tasks retain tenant context.
- Validate deny-by-default behavior for missing context or mismatched identifiers.

### Tenant-isolation test matrix (proposed; not executed)

| Test | Expected outcome | Execution status |
|---|---|---|
| Tenant A reads Tenant B resource by guessed UUID | Denied, no disclosure | NOT RUN |
| Tenant A modifies Tenant B record | Denied, no mutation | NOT RUN |
| Provider-wide dashboard queried without location ID | Authorized provider-wide results only | NOT RUN |
| Location-restricted user queries other location | Denied or scoped empty response | NOT RUN |
| Tenant A requests Tenant B audit records | Denied | NOT RUN |
| External surveyor accesses unshared source document | Denied | NOT RUN |
| Revoked token / expired external access | Denied | NOT RUN |
| Background processing loses tenant context | Fail closed / quarantined | NOT RUN |

## 8. Authentication and session lifecycle

Review token issuer/audience, signature algorithms, expiry, refresh/revocation, session rotation, password reset, credential stuffing protection, MFA enforcement for privileged and external users, and secrets management. Do not infer compliance from filenames.

## 9. API authorization contract requirements

Every API contract in the canonical registry should specify: owner; API version; verb/path; request and response schemas; required permission; tenant and location scope; audit event; failure semantics; pagination/rate limits; compatibility and deprecation policy; and contract tests. Existing `/api/v1` conventions are subject to runtime verification.

## 10. Security-specific review queues

**Priority 0 — trace before release:** Global guard application, default-deny semantics, tenant-scoped repositories, role/permission administration, audit-log read access, external survey access, and sensitive-data response filtering.

**Priority 1 — integration hardening:** DTO validation consistency, errors and status codes, rate limits, secure uploads, event tenant context, and API compatibility tests.

**Priority 2 — operations:** Key rotation, telemetry redaction, retention, incident evidence, and ongoing security regression checks.

Priorities indicate review order, **not confirmed vulnerabilities**.

## 11. Preliminary disposition

- **Reuse candidate:** Existing auth, roles, permissions, MFA, and audit modules subject to tests and policy review.
- **Modify candidate:** Any controller/service requiring explicit resource scope, DTO validation, or standardized contracts after verification.
- **Replace/build:** Only after demonstrated gaps, approved design, and a documented migration strategy.
- **No final Reuse/Modify/Replace/Build classifications approved.**

## 12. Verification commands for a suitable environment (not executed)

```bash
# From the extracted repository root, after dependencies are available:
npm ci
npx nx show projects
npx nx run-many -t lint --all
npx nx run-many -t test --all
npx nx run-many -t build --all
# Review the actual Nx targets and configuration before executing.
```

A separate isolated test database and synthetic multi-tenant fixtures are required for authorization integration tests. Do not run migrations against production.

## 13. Acceptance criteria and closure gate

REC-005 may be closed only when every externally exposed controller/endpoint has a verified effective authentication and authorization policy; every write path has validated request contracts; every tenant-scoped resource is tested for cross-tenant isolation; sensitive data is filtered; negative tests pass; and evidence links, owners, and remediation decisions are recorded. A security reviewer must approve the results.

## 14. Open issues

1. Whether global guards and pipes cover all controllers and endpoints.
2. Whether permissions are resource- and tenant-aware or role-only.
3. Whether all data-access queries apply trusted tenant constraints.
4. Whether controller DTO declarations are consistently validated at runtime.
5. Whether privileged/security endpoints have appropriate additional protections.
6. Whether external surveyor access is implemented and enforceable.
7. Whether runtime tests can run once dependency installation is available.

## 15. Approval and implementation status

**Document:** Draft / evidence inventory. **Security verification:** Incomplete. **Architecture principles:** AD-001 through AD-012 approved by user. **Implementation authorization:** NOT GRANTED. No repository files were modified.

## 16. Next section

**REC-006 — Event Contract, Delivery Reliability, and Audit Traceability Verification** (proposed), subject to review of REC-005 findings.
