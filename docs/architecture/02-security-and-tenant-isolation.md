# Security Architecture and Tenant Isolation

**Status:** Architecture Baseline / Proposed Target  
**Date:** 2026-10-30  
**Platform:** HHSC Compliance Platform / Regulatory Intelligence Platform

---

## 1. Purpose

This document establishes the security architecture for the regulatory compliance platform.

The platform must support multiple provider organizations, multiple regulatory jurisdictions, and users who may legitimately work across more than one provider.

Security must be enforced consistently across authentication, authorization, provider membership, resource access, and audit operations.

This document distinguishes:

- **Implemented:** Verified in the inspected source code.
- **Partially implemented:** Components exist, but enforcement or integration is incomplete.
- **Proposed:** Target architecture that has not yet been implemented.
- **Needs verification:** Requires additional source, database, or deployment inspection.

The source code and database migrations remain authoritative for current application behavior.

## 2. Architectural Security Principles

1. Authentication establishes the identity of the requesting user.
2. Provider membership establishes which provider organizations the user may access.
3. Role assignments establish the user's responsibilities within an authorized scope.
4. Permissions determine which actions the user may perform.
5. Resource authorization determines whether the user may access a specific record.
6. Provider-owned data must never be exposed across unauthorized provider boundaries.
7. All security-sensitive operations must be auditable.
8. Access must be denied by default when identity, membership, permission, or resource ownership cannot be established.
9. Platform-level authority must remain separate from provider-level authority.
10. Regulatory jurisdiction must not be confused with provider membership or user identity.

Security must be enforced in the backend. Frontend visibility and route restrictions are not authorization controls.

## 3. Verified Current Architecture

### 3.1 User Identity

**Status: Implemented**

`UserEntity` is defined in:

`server/src/app/users/entities/user.entity.ts`

Current fields:

- id (UUID)
- email
- passwordHash
- roles (text array)
- createdAt
- updatedAt

The user entity has no provider relationship.

### 3.2 Authentication

**Status: Partially implemented**

Authentication is implemented through:

- `AuthService`
- `AuthController`
- `JwtStrategy`
- `JwtAuthGuard`
- `TokensService`
- `PasswordService`

Registration and login issue JWT access tokens.

The current token contains:

- sub
- email
- roles

The JWT strategy maps token roles into both `roles` and `roleIds` when `roleIds` is absent.

The token service does not currently issue a separate roleIds claim.

The JWT strategy currently contains a fallback secret. Production configuration must fail closed when a secure JWT secret is missing.

### 3.3 User Roles

**Status: Inconsistent / Partially implemented**

The current database has:

- `users.roles`: text array
- `roles`: UUID-based role catalog
- `role_permissions`: role-to-permission relationship
- `user_permissions`: direct user permission assignments

There is no verified user-role assignment table or operational user-role assignment workflow.

The authorization service queries role permissions using role UUIDs, while the JWT strategy can treat the legacy user role strings as role IDs.

This inconsistency must be resolved before relying on role-based authorization.

### 3.4 Permissions

**Status: Partially implemented**

The platform includes:

- `PermissionEntity`
- `RolePermissionEntity`
- `UserPermissionEntity`
- `AuthorizationService`
- `PermissionsGuard`

Direct user DENY permissions currently take precedence over direct ALLOW permissions and role-based grants.

Two permission decorator systems exist:

- `@RequirePermission()` uses metadata key `required_permissions`.
- `@RequirePermissions()` uses metadata key `requiredPermissions`.

The current `PermissionsGuard` reads only `required_permissions`.

Both decorators are used in active controllers. They must be consolidated into one metadata contract.

### 3.5 Guard Enforcement

**Status: Partially implemented**

No global JWT authentication guard was found in the inspected `main.ts` or `AppModule`.

Selected controllers explicitly use JWT and permission guards.

The following security administration controllers were inspected without controller-level or method-level guards:

- RolesController
- PermissionsController

People, Residential, and ISS controllers were also found without local guards in the inspected source.

Provider controller guard declarations were commented out.

The deployed environment and any upstream gateway protections have not been verified.

### 3.6 Provider Isolation

**Status: Missing / Incomplete**

Provider-owned records contain provider identifiers in several domains.

However, the inspected user entity has no provider membership relationship, and no active provider context resolution mechanism was found.

Some inspected services perform unscoped lookups.

Provider isolation therefore cannot be assumed to be consistently enforced.

### 3.7 Tests

**Status: Insufficient**

The inspected authentication area contains:

- auth.controller.spec.ts
- auth.service.spec.ts

No user-role or permission authorization tests were found by the inspected search.

Cross-provider isolation tests must be introduced before provider isolation is considered complete.

## 4. Target Identity and Membership Model

### 4.1 One Global User Identity

A user must have one account and one login identity.

A user must be able to belong to multiple provider organizations using that same account.

The platform must not require duplicate user accounts when an individual works for multiple providers.

Examples include:

- Consultants
- Corporate administrators
- Compliance professionals
- Authorized auditors
- Personnel working across provider organizations

A user identity must not itself imply access to any provider.

### 4.2 Provider Membership

**Proposed entity:** `ProviderMembershipEntity`

Purpose:

Connect a global user identity to a provider organization.

Proposed attributes:

- id (UUID)
- userId
- providerId
- status
- membership start date
- membership end date, nullable
- createdAt
- updatedAt

Constraints:

- A user may have memberships with multiple providers.
- A user must not have duplicate active memberships for the same provider.
- Membership status must be checked during authorization.
- Revoked or inactive memberships must not grant access.
- Membership must be validated server-side.
- Provider membership must not be inferred from a request-supplied providerId.

### 4.3 Provider Selection

A user with multiple provider memberships must be able to select an active provider context.

The selected provider is a request context, not proof of authorization.

The backend must verify:

1. The authenticated user exists and is active.
2. The requested provider exists and is active.
3. The user has an active membership for that provider.
4. The requested action is permitted within that membership.
5. The requested resource belongs to the authorized provider.

Changing the active provider must not grant additional privileges.

### 4.4 Multiple Provider Access

This is a mandatory architectural requirement.

One user account may have multiple provider memberships.

Each membership must have its own role assignments and applicable permissions.

Access to one provider must not imply access to another provider.

## 5. Target Role and Permission Model

### 5.1 Separate Platform and Provider Authority

Platform roles and provider roles must be distinct.

Platform-level examples:

- PLATFORM_SUPER_ADMIN
- PLATFORM_SECURITY_ADMIN
- PLATFORM_AUDITOR

Provider-level examples:

- PROVIDER_ADMIN
- PROGRAM_MANAGER
- COMPLIANCE_DIRECTOR
- RN
- LVN
- CASE_MANAGER
- ISS_MANAGER
- ISS_STAFF
- DIRECT_CARE_STAFF
- HOST_HOME_PROVIDER
- READ_ONLY

These names are proposed examples, not a final role catalog.

A provider-level administrator must not automatically receive platform-wide authority.

### 5.2 Role Assignments

**Proposed entities:**

- `PlatformUserRoleEntity`
- `ProviderMembershipRoleEntity`

Platform roles are assigned to a user at platform scope.

Provider roles are assigned to a specific provider membership.

This avoids interpreting provider-specific responsibilities as global user authority.

Role assignments must be validated against active role definitions.

### 5.3 Permission Definitions

Permissions describe actions, not organizational identity.

Examples:

- dashboard:view
- consumer:view
- consumer:update
- residential:view
- residential:update
- survey-binder:view
- report:export
- security:role:manage
- security:permission:manage

Permission definitions should remain reusable across regulatory jurisdictions.

Regulatory requirements themselves must remain in the Regulatory Knowledge Engine rather than being embedded in authorization logic.

### 5.4 Permission Evaluation

Authorization must evaluate:

- Authenticated user
- Active provider membership, when provider scope applies
- Platform role assignments, when platform scope applies
- Provider role assignments, when provider scope applies
- Direct user permission exceptions, if retained
- Required permission
- Resource ownership and scope

Direct DENY must take precedence over applicable ALLOW grants.

Missing, inactive, or invalid permissions must result in denial.

A route without required permission metadata must not accidentally become authorized merely because the permission guard has nothing to evaluate.

### 5.5 Direct User Permissions

Direct user permissions may be retained for exceptional access requirements.

If retained, provider-scoped exceptions must identify the applicable provider membership.

Direct permission assignments must be auditable and should include a reason and, where appropriate, an expiration date.

## 6. Provider Context and Resource Isolation

### 6.1 Provider Context

**Proposed component:** `ProviderContext`

The provider context must be established by trusted backend logic after authentication.

It should expose:

- authenticated user ID
- active provider ID
- active membership ID
- applicable platform roles
- applicable provider roles
- validated permissions

Controllers and services must not trust a provider ID supplied by the client without validating membership.

### 6.2 Provider-Owned Resources

Provider-owned resources must be queried using authorized provider scope.

Examples include:

- Residential locations
- Residential assignments
- Employee profiles
- Clinical contact profiles
- Compliance results
- Fire drill records
- Remediation records
- Provider documents and evidence

Resource access must verify both permission and ownership.

A valid permission does not authorize access to another provider's record.

### 6.3 Query and Mutation Requirements

Every provider-owned read, update, delete, export, and workflow action must enforce provider scope.

For example, a resource lookup must constrain both its resource identifier and provider identifier.

The backend must not:

- Load an arbitrary resource by ID and assume the caller may access it.
- Trust client-supplied provider IDs.
- Allow updates that move resources between providers without an explicit authorized transfer workflow.
- Return records belonging to another provider through unscoped list operations.

### 6.4 Database Integrity

Provider-owned relationships should use appropriate foreign keys and indexes.

Where practical, database constraints should reinforce provider ownership.

Database row-level security may be evaluated as an additional defense, but it does not replace application-level authorization.

## 7. Authentication and Public Routes

### 7.1 Global Authentication

**Proposed**

After the public-route policy and guard behavior are tested, introduce global JWT authentication.

Public routes must be explicitly declared using one consistent `@Public()` decorator.

Public routes should be limited to intentionally public operations, such as:

- Login
- Registration, if open registration remains approved
- Health checks, where appropriate
- Other explicitly approved public endpoints

All other routes should require authentication by default.

### 7.2 Registration Policy

The existing registration endpoint is public and creates users with an empty role array.

Production registration policy must be decided before deployment.

Options include:

- Invitation-based registration
- Administrator-created accounts
- Controlled self-registration with provider onboarding
- Public registration followed by restricted onboarding

Registration must never grant provider access merely because a user creates an account.

### 7.3 JWT Configuration

Production startup must fail if JWT_SECRET is missing or insecure.

Tokens should identify the user, not serve as the authoritative source for current provider membership or role assignments.

Authorization must account for membership revocation and role changes during the token lifetime.

## 8. Security Administration

The following operations require explicit security-administration authorization:

- Create and update roles
- Disable or delete roles
- Create and update permissions
- Assign permissions to roles
- Assign direct user permissions
- Create and revoke provider memberships
- Assign and revoke provider roles
- Assign and revoke platform roles

The roles and permissions controllers must be protected before production exposure.

Security administration must be auditable.

## 9. Audit Requirements

Security-sensitive events should record:

- User ID
- Provider ID, when applicable
- Membership ID, when applicable
- Action
- Resource type
- Resource ID
- Outcome
- Timestamp
- Request or correlation ID
- Reason, when applicable

Events should include:

- Successful and failed authentication
- Membership creation and revocation
- Provider context changes
- Role assignment and removal
- Permission assignment and removal
- Access denials
- Sensitive record access and modification
- Administrative changes

Audit records must not expose passwords, password hashes, access tokens, refresh tokens, or other secrets.

## 10. Migration Strategy

Migrations must be additive and staged.

Existing user records and source changes must be preserved.

### Phase 1 — Normalize Permission Metadata

- Consolidate permission decorators.
- Use one metadata key and one guard contract.
- Add tests proving that every declared permission is evaluated.
- Confirm controller-level and method-level metadata behavior.

### Phase 2 — Introduce User Role Assignments

- Add platform role assignment support.
- Add provider membership role assignment support.
- Inspect existing user role values before migration.
- Map valid legacy role names to existing role UUIDs.
- Verify assignments and permission results.
- Retain the legacy users.roles column during transition.
- Remove the legacy column only after migration verification and application cutover.

### Phase 3 — Introduce Provider Memberships

- Add provider membership entity and migration.
- Establish unique active user/provider membership constraints.
- Add membership lifecycle operations.
- Define invitation and onboarding workflows.
- Preserve existing provider records.

### Phase 4 — Establish Provider Context

- Resolve active provider from an authenticated request.
- Validate active membership.
- Resolve applicable roles and permissions.
- Reject unauthorized provider selection.
- Add tests for users with multiple memberships.

### Phase 5 — Protect Security Administration

- Protect roles and permissions controllers.
- Protect membership and role assignment operations.
- Add explicit permission requirements.
- Audit all security administration changes.

### Phase 6 — Global Authentication

- Implement global JWT authentication.
- Explicitly mark public routes.
- Validate production JWT configuration.
- Verify authentication behavior across all controllers.

### Phase 7 — Provider Resource Isolation

- Review every provider-owned service and repository query.
- Scope all provider-owned reads and mutations.
- Review exports, background jobs, scheduled tasks, and compliance evaluators.
- Add cross-provider denial tests.

### Phase 8 — Audit and Security Validation

- Verify audit coverage.
- Test role revocation.
- Test membership revocation.
- Test permission denial.
- Test unauthorized provider access.
- Verify production configuration.

## 11. Required Security Tests

The security implementation is not complete until the following behaviors are tested.

### Authentication

- Unauthenticated requests are rejected on protected routes.
- Valid tokens authenticate the correct user.
- Expired and invalid tokens are rejected.
- Public routes remain accessible without authentication.
- Missing production JWT secrets prevent startup.

### Role and Permission Authorization

- A user with the required permission is allowed.
- A user without the required permission is denied.
- Direct DENY overrides applicable ALLOW.
- Inactive roles do not grant access.
- Role revocation removes effective access.
- Both controller-level and method-level metadata are evaluated consistently.

### Provider Membership

- A user can belong to multiple providers.
- A user can select only an authorized provider.
- An inactive membership grants no access.
- A revoked membership grants no access.
- Provider A membership does not grant Provider B access.

### Resource Isolation

- Provider A users cannot read Provider B records.
- Provider A users cannot update Provider B records.
- Provider A users cannot delete Provider B records.
- Provider A users cannot export Provider B records.
- Client-supplied provider IDs cannot bypass membership checks.
- Resource IDs cannot be used to bypass provider scope.

### Security Administration

- Unauthorized users cannot create or modify roles.
- Unauthorized users cannot assign permissions.
- Unauthorized users cannot grant platform roles.
- All security administration operations generate appropriate audit events.

## 12. Acceptance Criteria

The security architecture may be considered implemented when:

1. A user has one global identity.
2. A user can belong to multiple providers.
3. Provider memberships are independently managed.
4. Provider roles are scoped to memberships.
5. Platform roles are separate from provider roles.
6. Permission metadata has one consistent implementation.
7. Protected routes require authentication.
8. Public routes are explicitly identified.
9. Security administration endpoints require appropriate permissions.
10. Provider-owned data is isolated at the service and repository levels.
11. Revoked memberships and roles no longer grant access.
12. Security events are auditable.
13. Cross-provider isolation tests pass.
14. Existing users and data survive the migration.
15. No security behavior depends exclusively on frontend controls.

## 13. Relationship to the Regulatory Knowledge Engine

The security architecture and Regulatory Knowledge Engine have separate responsibilities.

The Regulatory Knowledge Engine defines regulatory sources, requirements, rules, evidence expectations, and jurisdiction-specific compliance logic.

The security system determines who may access or act on the resulting provider data.

Authorization must not become a second regulatory rule engine.

The platform must preserve the principle:

- Knowledge Engine: source of regulatory truth.
- Database: persists application and regulatory state.
- Services: execute business and authorization logic.
- UI: presents authorized information.
- AI: explains and generates guidance grounded in approved knowledge.

## 14. Implementation Status

This document records the proposed target architecture.

The following remain implementation work:

- Permission decorator consolidation
- User-role assignment model
- Provider membership model
- Provider context resolution
- Global authentication enforcement
- Security administration protection
- Provider resource isolation
- Security test coverage
- Production JWT configuration validation

No implementation should be considered complete solely because its entity, migration, guard, or service has been created. The complete workflow and its enforcement must be tested.

---

**Document owner:** Platform Architecture  
**Review status:** Initial architecture baseline
