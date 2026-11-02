# HHSC Compliance Platform
# Current Architecture Baseline v1.0

**Baseline date:** 2026-10-30  
**Repository:** hhscCompliance  
**Branch observed:** develop  
**Status:** Initial repository-grounded baseline

---

## 1. Purpose

This document records the current architecture of the HHSC Compliance Platform based on repository inventory, project configuration, existing architecture documentation, and source-code inspection.

It is intended to:
- Preserve the current architecture.
- Establish a reliable reference for future development.
- Identify existing capabilities and boundaries.
- Separate implemented functionality from proposed architecture.
- Prevent duplicate models and conflicting services.
- Provide a foundation for the future Regulatory Intelligence Platform architecture.

This document describes the current system. It does not claim that proposed future capabilities already exist.

## 2. Product context

The platform is designed to support healthcare and human-services providers with operational records, regulatory compliance, evidence, findings, remediation, and reporting.

The original architecture is centered on a provider organization, its locations, people, consumers, employees, operational domains, and compliance results.

The platform currently contains Texas HCS-oriented regulatory and compliance capabilities. The long-term architectural direction is a jurisdiction-neutral Regulatory Intelligence Platform.

That future direction is not a statement that all jurisdictions are currently supported.

## 3. Repository and workspace architecture

### 3.1 Repository structure

The repository is an Nx monorepo.

Major directories observed:

| Directory | Purpose |
|---|---|
| `server/` | NestJS API application |
| `web/` | Angular frontend application |
| `libs/` | Shared, feature, and data-access libraries |
| `tools/` | Workspace tooling |
| `docs/` | Architecture, domain, and roadmap documentation |
| `server-e2e/` | Backend end-to-end tests |
| `web-e2e/` | Frontend end-to-end tests |

### 3.2 Nx projects

The workspace inventory reports 34 projects, including:

**Applications and shells**
- `server`
- `web`
- `web-shell`
- `server-e2e`
- `web-e2e`

**Regulatory**
- `@hhsc-compliance/regulatory-knowledge`

**Feature and domain projects**
- `provider-onboarding`
- `provider-workspace`
- `providers`
- `consumers`
- `residential`
- `compliance`
- `remediation`
- `dashboard`
- `operations`
- `programmatic`
- `behavior`
- `finance`
- `medical`
- `ane`
- `iss`
- `restraints`
- `enclosed-beds`
- `protective-devices`
- `prohibitions`
- `cost-report`
- `import-engine`

**Shared infrastructure**
- `shared-models`
- `data-access`
- `features`
- `ui-kit`
- `ui-overlay`

The exact dependency graph and all project boundaries require further Nx graph and project configuration inspection.

## 4. Technology stack

The following versions and dependencies were found in the root package configuration.

| Technology | Version / configuration |
|---|---|
| Nx | 21.5.3 |
| Angular | 20.3 |
| Angular build tooling | Angular Build |
| Frontend development/build | Vite 6 |
| State management | NgRx 20.1 |
| Backend framework | NestJS 11 |
| Language | TypeScript 5.8 |
| ORM | TypeORM 0.3 |
| Database driver | PostgreSQL `pg` |
| Runtime | Node.js |
| API documentation | NestJS Swagger |
| Configuration validation | Zod 4 |
| DTO validation | class-validator |
| Unit testing | Jest and Vitest |
| End-to-end testing | Playwright |
| Scheduling dependency | NestJS Schedule |

Database connection settings, deployment topology, hosting configuration, and production infrastructure are not fully established by this inventory.

## 5. Application architecture

### 5.1 Backend

The backend application is located at:

`server/src/`

Its Nx project configuration identifies:
- Project type: application.
- Main entry point: `server/src/main.ts`.
- Build executor: `@nx/webpack:webpack`.
- Output directory: `dist/api`.
- TypeScript configuration: `server/tsconfig.app.json`.

The root NestJS application module is:

`server/src/app/app.module.ts`

The inspected AppModule imports:
- Authentication
- Users
- RACI
- ISS
- Consumers
- People
- Providers
- Security
- Survey
- Remediation
- Dashboard
- Compliance Recheck
- Compliance Results
- Compliance Engine
- Operations
- Executive

It also configures application configuration, TypeORM, and request ID middleware.

This list describes the inspected AppModule imports. Other modules may be nested or registered elsewhere.

### 5.2 Frontend

The frontend application is located at:

`web/src/`

Its Nx project configuration identifies:
- Project type: application.
- Build executor: `@nx/vite:build`.
- Development server: `@nx/vite:dev-server`.
- Output directory: `dist/web`.

Feature libraries are organized by business and compliance domains.

### 5.3 Data access and shared models

The repository contains:
- `libs/data-access`
- `libs/shared-models`

These are intended to provide shared data access and domain contracts across frontend features.

The exact dependency direction and boundaries require further project-level inspection.

## 6. Domain architecture

The original domain architecture establishes the following conceptual structure.

### 6.1 Organization

**ProviderEntity**

Represents the provider organization and serves as the organizational owner of compliance activity.

**ResidentialLocationEntity**

Represents a physical residential service location.

The original design identifies location-specific compliance areas such as fire drills, emergency plans, home environment, infection control, hot water, and life safety.

### 6.2 People

**PersonEntity**

Represents a master human record shared across roles.

**ConsumerRecordEntity**

Represents an individual receiving services and separates service-related information from basic person identity.

**EmployeeProfileEntity**

Represents an employee linked to a person.

**ClinicalContactProfileEntity**

Represents a clinical professional who may participate in care without being an employee.

### 6.3 Assignments

**ResidentialAssignmentEntity**

Connects a consumer to a residential location and preserves placement history.

The original design requires no more than one active residential assignment at a time.

**ConsumerCareTeamAssignmentEntity**

Connects a consumer to responsible employees and clinical contacts.

### 6.4 Consumer domains

The original entity inventory includes:
- ConsumerDiagnosisEntity
- ConsumerGuardianEntity
- ConsumerLegalStatusEntity
- MedicaidBenefitsEntity

These domains support clinical, legal, eligibility, and service coordination workflows.

### 6.5 Compliance

**ComplianceResultEntity**

The original architecture defines this as the central compliance result object used to provide consistent findings across compliance modules.

The original documented workflow is:

Evaluator
→ Compliance Result
→ Dashboard
→ Message Center
→ Remediation
→ Re-evaluation

The current database and backend implementation contain compliance result and remediation capabilities. Exact evaluator coverage and workflow completeness vary by domain and require individual verification.

## 7. Regulatory Knowledge Engine

The repository contains a separate Nx library:

`libs/regulatory/knowledge/`

Its public entry point is:

`libs/regulatory/knowledge/src/index.ts`

Its project configuration defines build, test, and lint targets.

### 7.1 Existing knowledge models

The inspected model inventory includes:

- RegulatorySource
- RegulatoryRule
- RegulatoryRequirement
- EvidenceRequirement
- ValidationRule
- RegulatoryQuestion
- DocumentDefinition
- RegulatoryGuidance
- RenewalRule
- KnowledgePack

These represent the current regulatory knowledge model.

### 7.2 Existing services

The inspected service inventory includes:

- KnowledgeEngineService
- DocumentGeneratorService
- RenewalEngineService
- AiGuidanceService
- SurveyBinderService

The repository also contains a separate renewal engine library under:

`libs/regulatory/engines/renewal/`

The complete runtime integration and dependency boundaries of these services require further inspection.

### 7.3 Current architectural direction

The Knowledge Engine is intended to be the source of truth for structured regulatory requirements.

Provider operational data remains in operational domains.

The intended separation is:

- Knowledge defines regulatory requirements.
- Operational domains maintain provider, location, employee, consumer, and service records.
- Evidence connects operational records to requirements.
- Validation evaluates evidence against defined rules.
- Compliance evaluation interprets results.
- Workflow services manage findings and corrective actions.

Not all of these capabilities have been verified as implemented.

### 7.4 Texas HCS

Texas HCS is the current regulatory implementation focus.

Regulatory source provenance and legal interpretation must be verified against authoritative official sources before being treated as authoritative.

The earlier TAC Rule Library document is historical design material and must be reconciled with the current Knowledge Engine model.

## 8. Compliance and operational workflows

### 8.1 Compliance results

The backend contains:
- Compliance Results module and controller.
- Compliance Results service.
- Compliance Engine module.
- Compliance recheck module.

The compliance results database model has been described in existing architecture documentation with fields including module, subcategory, rule code, status, severity, message, route commands, and query parameters.

The current entity definition should be consulted before treating that list as a complete database schema.

### 8.2 Fire Drills

The backend contains a Fire Drills module, controller, service, and entity.

The migration inventory includes:
- `1800000000210-create-fire-drill-logs.ts`
- `1800000000211-CreateFireDrillsForm4719.ts`

A residential fire-drill evaluator is part of the existing compliance implementation.

The statutory interpretation and exact regulatory basis of each evaluator rule must be verified separately.

### 8.3 Remediation

The migration inventory includes corrective action plan, finding notes, status history, recheck, and evidence changes.

The remediation backend has dedicated controllers and permission-protected endpoints.

The complete workflow and all state transitions require additional service-level inspection.

## 9. Security and authorization architecture

### 9.1 Authentication

The authentication implementation contains:
- Auth controller and service.
- JWT strategy.
- JWT authentication guard.
- Password service.
- Session service.
- Token service.
- Current-user and public decorators.
- Authentication entities and DTOs.

### 9.2 Authorization

The security implementation contains:
- RoleEntity
- PermissionEntity
- RolePermissionEntity
- UserPermissionEntity
- RolesGuard
- PermissionsGuard
- AuthorizationService
- Permission decorators
- Role and permission administration services

The inspected AuthorizationService implements direct permission precedence:
1. Direct DENY overrides other grants.
2. Direct ALLOW grants access unless denied.
3. Active role permissions may grant access.
4. Otherwise access is denied.

Controller inspection shows that JWT and permission guards are used on selected endpoints.

The provider controller contains commented-out role guard usage. Therefore, consistent authorization enforcement across all controllers has not been established.

### 9.3 Multi-factor authentication

The security directory contains:
- MFA controller.
- MFA service.
- MFA secret entity.
- MFA backup code entity.

The migration inventory includes an MFA table migration.

The complete enforcement policy and coverage require additional verification.

### 9.4 Audit

The repository contains two audit-related areas:

`server/src/app/audit/`

and

`server/src/app/security/`

The first contains an audit service, audit entity, interceptor, and dashboard components.

The security area contains audit log entities, service, and controller.

The relationship between these two audit implementations, interceptor registration, coverage, and retention behavior requires further investigation.

The presence of an interceptor does not establish that all application requests are automatically audited.

### 9.5 Security documentation status

Existing role and permission documentation describes the intended permission model and role bundles.

These documents should be reconciled against actual database seeds, authorization services, and controller enforcement before being treated as a complete access-control specification.

## 10. Database and migrations

The repository uses TypeORM configuration under:

`server/src/configuration/typeorm/`

Inspected files include:
- async.config.ts
- data-source.ts
- development.ts
- production.ts
- staging.ts
- index.ts

The migration inventory establishes a migration-based schema evolution history.

Major migration groups include:

| Migration range | Domain |
|---|---|
| 1700000000000 onward | Extensions, roles catalog, modules catalog, RACI |
| 1755630176745 onward | Authentication initialization |
| 1800000000000 onward | ISS and core database foundations |
| 1800000000100 onward | Providers and locations |
| 1800000000110 onward | Residential locations |
| 1800000000120 onward | Compliance results |
| 1800000000201 onward | Compliance result enhancements |
| 1800000000210 onward | Fire Drills and Form 4719 |
| 1800000000212 onward | People and consumer domains |
| 1800000000222 onward | Security, permissions, audit, and MFA |
| 1800000000230 onward | Remediation and corrective action plans |

Migration inventory is not a substitute for inspecting the current database schema or migration execution history.

## 11. Existing architectural documentation

The repository already contains documentation for:
- Authentication
- Audit logging
- Compliance engine
- Dashboard
- Data retention
- HIPAA
- Permission matrix
- Roles and permissions
- Security incident response
- Sprint 0 architecture
- TAC Rule Library
- Domain entity inventory
- Domain entity purpose map
- Project roadmap
- Sprint 0 completion
- Sprint 1 planning

Some documents are historical, empty, incomplete, or need implementation reconciliation.

The architecture documentation index identifies their intended status.

## 12. Known architecture gaps and verification needs

The following items must not be treated as resolved based on the current inventory.

| Area | Gap or verification need |
|---|---|
| Nx boundaries | Inspect complete project dependency graph |
| Backend module topology | Verify nested module registration |
| API authorization | Review every controller and endpoint |
| Audit | Verify interceptor registration and coverage |
| Security | Reconcile permission seeds, role bundles, and actual enforcement |
| MFA | Verify enforcement and recovery workflows |
| Regulatory Knowledge Engine | Verify service integration and persistence boundaries |
| Applicability | Verify complete applicability model and runtime evaluation |
| Evidence | Verify operational evidence storage and linkage |
| Validation | Verify existence and coverage of runtime regulatory validation |
| Compliance evaluation | Verify status mapping and historical reproducibility |
| Form intelligence | Verify whether field-level prepopulation exists |
| Regulatory change intelligence | Proposed capability; not established as implemented |
| Database | Verify schema, constraints, indexes, and deployment configuration |
| Roadmap | Reconcile historical sprint plan with actual completion status |

## 13. Current working-tree preservation

At the time of this baseline, the inspected repository had uncommitted changes in the Regulatory Knowledge Engine, including:
- Regulatory source model.
- Texas HCS emergency preparedness rule.
- Knowledge Pack validator.
- A deleted service file.
- New test files.

These changes are not part of this documentation baseline and must be preserved.

No source-code changes or commits are implied by this document.

## 14. Architectural principles to preserve

The following principles guide future architecture decisions:

1. The Regulatory Knowledge Engine is the source of truth for structured regulatory knowledge.
2. No new regulatory feature should bypass the Knowledge Engine.
3. The platform must support multiple jurisdictions and authorities.
4. Provider operational records and regulatory definitions must remain separate.
5. Compliance decisions must be traceable to regulatory sources, obligations, evidence, and evaluation logic.
6. Missing evidence alone must not automatically establish a violation.
7. AI-generated regulatory interpretations must remain proposals until approved.
8. Published Knowledge Pack releases must preserve historical versions.
9. Historical evaluations must remain explainable.
10. Security, authorization, and auditability must be built into workflows.
11. Existing domain entities must be reused where appropriate rather than duplicated.
12. New capabilities must respect established domain ownership and integration boundaries.

## 15. Next architecture work

The next documentation phase should establish the target architecture and map current components to it.

Recommended sequence:

1. Verify provider, location, people, and employee data boundaries.
2. Inspect current Nx dependency graph and application integration.
3. Reconcile security and audit implementation with existing documentation.
4. Establish the jurisdiction-neutral target architecture.
5. Define the Regulatory Knowledge Engine's formal domain boundaries.
6. Define evidence, validation, and compliance evaluation interfaces.
7. Design Form Intelligence and regulatory change intelligence.
8. Establish architecture decision records.
9. Reconcile the roadmap with actual sprint status.
10. Continue Sprint 8 Emergency Preparedness implementation.

---

**Document status:** Initial baseline based on repository inventory and selected source inspection.  
**Next review:** After the remaining domain, integration, and security verification.
