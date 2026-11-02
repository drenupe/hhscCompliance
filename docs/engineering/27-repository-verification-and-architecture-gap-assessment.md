# ENG-027 — Repository Verification and Architecture Gap Assessment
**Organization:** McCaskill Projects  
**Status:** Evidence-based static inspection — preliminary; architecture approval and execution verification pending  
**Version:** 1.0 — Draft  
**Source:** User-provided `hhscCompliance-develop.zip`  
**Implementation Authorization:** Not Granted  
**Proposed repository path:** `docs/engineering/27-repository-verification-and-architecture-gap-assessment.md`

## 1. Purpose and scope
This document inventories the **uploaded archive**, not a live Git checkout, deployment, database, or working runtime. Presence of code is not evidence of functional completeness. The architecture baseline ENG-001–026 has not been formally reconciled or approved. All findings are provisional until tests, builds, and architecture reviews are performed.

## 2. Verification evidence and limits
- Archive entries: **1814**; files: **1344**; uncompressed archive size: **3,316,384 bytes**.
- Nx project configuration files: **34**; backend module directories: **25**; TypeORM migration files: **52**; test/spec files: **56**; entity files: **33**; controller files: **26**; service files: **102**.
- Inspection method: archive member listing, project configuration reading, and source-path classification; selected source files examined. No `npm install`, Nx command, application launch, database connection, migration execution, or test run was performed.
- Source snapshot commit SHA, branch provenance, runtime environment, deployment status, database schema state, and production configuration are **not verified** by this archive.
- The archive includes `libs.zip` as a nested artifact; its contents were not treated as part of the primary source inventory.

## 3. Observed stack and commands
`package.json` declares Nx 21.5.3, Angular 20.3.x, NestJS 11, NgRx 20.1.x, TypeORM 0.3.x, PostgreSQL driver, Vite, Vitest, Jest, and Playwright. `server/project.json` declares a webpack build; `web/project.json` declares Vite build and test targets. These are **declared dependencies**, not confirmed installed or working versions.

Configured root scripts include `build`, `build:server`, `build:web`, `dev:server`, `dev:web`, `lint`, `test`, `e2e:server`, `e2e:web`, `db:migrate`, and `db:revert`. Root `start` points to `dist/api/main.js`; verify output paths and production runtime after dependencies are available.

## 4. Nx project inventory (archive-verified)
| Project root | Declared project name | Tags | Targets |
|---|---|---|---|
| `libs` | `feature-provider-onboarding` | `—` | `test,lint` |
| `libs/data-access` | `data-access` | `type:lib,type:data-access,scope:data,surface:web` | `test,lint` |
| `libs/features` | `features` | `—` | `test,lint` |
| `libs/features/admin` | `cost-report` | `type:feature,surface:web,feature:admin` | `test,lint` |
| `libs/features/ane` | `ane` | `type:feature,scope:feature,feature:ane,surface:web` | `test,lint` |
| `libs/features/behavior` | `behavior` | `type:feature,scope:feature,feature:behavior,surface:web` | `test,lint` |
| `libs/features/compliance` | `compliance` | `type:feature,scope:feature,feature:compliance,surface:web` | `test,lint` |
| `libs/features/consumers` | `consumers` | `type:feature,scope:feature,feature:consumers,surface:web` | `lint` |
| `libs/features/dashboard` | `dashboard` | `type:feature,scope:feature,feature:dashboard,surface:web` | `test,lint` |
| `libs/features/enclosed-beds` | `enclosed-beds` | `type:feature,scope:feature,feature:enclosed-beds,surface:web` | `test,lint` |
| `libs/features/finance` | `finance` | `type:feature,scope:feature,feature:finance,surface:web` | `test,lint` |
| `libs/features/home` | `home` | `type:feature,scope:feature,feature:home,surface:web` | `test,lint` |
| `libs/features/import-engine` | `import-engine` | `scope:feature,type:feature` | `test,lint` |
| `libs/features/iss` | `iss` | `type:feature,scope:feature,feature:iss,surface:web` | `test,lint` |
| `libs/features/medical` | `medical` | `type:feature,scope:feature,feature:medical,surface:web` | `test,lint` |
| `libs/features/operations` | `operations` | `scope:feature,type:feature` | `lint` |
| `libs/features/programmatic` | `programmatic` | `type:feature,scope:feature,feature:programmatic,surface:web` | `test,lint` |
| `libs/features/prohibitions` | `prohibitions` | `type:feature,scope:feature,feature:prohibitions,surface:web` | `test,lint` |
| `libs/features/protective-devices` | `protective-devices` | `type:feature,scope:feature,feature:protective-devices,surface:web` | `test,lint` |
| `libs/features/provider-onboarding` | `provider-onboarding` | `scope:feature,type:feature` | `test,lint` |
| `libs/features/provider-workspace` | `provider-workspace` | `type:feature,scope:feature` | `test,lint` |
| `libs/features/providers` | `providers` | `type:feature,scope:feature,feature:providers,surface:web` | `test,lint` |
| `libs/features/remediation` | `remediation` | `type:feature` | `lint` |
| `libs/features/residential` | `residential` | `type:feature,scope:feature,feature:residential,surface:web` | `test,lint` |
| `libs/features/restraints` | `restraints` | `type:feature,scope:feature,feature:restraints,surface:web` | `test,lint` |
| `libs/regulatory/knowledge` | `(unnamed)` | `—` | `build,test,lint` |
| `libs/shared-models` | `shared-models` | `type:model,scope:shared,surface:both` | `build` |
| `libs/shared/src/lib/ui-overlay` | `ui-overlay` | `scope:ui,type:util` | `test,lint` |
| `libs/ui-kit` | `ui-kit` | `type:ui,scope:ui,surface:web` | `build,test,lint` |
| `libs/web-shell` | `web-shell` | `type:feature,scope:shell,surface:web` | `test,lint` |
| `server` | `server` | `type:app,surface:api` | `build,prune-lockfile,copy-workspace-modules,prune,serve,serve:debug,serve:watch,test` |
| `server-e2e` | `server-e2e` | `—` | `e2e` |
| `web` | `web` | `type:app,surface:web,scope:web` | `build,serve,preview,test,lint` |
| `web-e2e` | `web-e2e` | `—` | `—` |

**Inventory caution:** Project names and tags are inconsistent in places (e.g. `libs/features/admin` declares `cost-report`; some project configs omit names or tags). This is a design-reconciliation candidate, not a proven build failure.

## 5. Backend source inventory
| Module directory | Source files | Example source files |
|---|---:|---|
| `server/src/app/audit` | 7 | `audit.module.ts`, `audit.service.ts`, `dashboard.controller.ts` |
| `server/src/app/auth` | 21 | `auth.controller.spec.ts`, `auth.controller.ts`, `auth.module.ts` |
| `server/src/app/common` | 8 | `current-user.decorator.ts`, `ip.decorator.ts`, `public.decorator.ts` |
| `server/src/app/compliance` | 23 | `compliance-modules.registry.ts`, `compliance-results.controller.ts`, `compliance-results.module.ts` |
| `server/src/app/compliance-recheck` | 2 | `compliance-recheck.module.ts`, `compliance-recheck.service.ts` |
| `server/src/app/consumers` | 6 | `consumers.controller.ts`, `consumers.module.ts`, `consumers.service.ts` |
| `server/src/app/dashboard` | 14 | `dashboard.controller.ts`, `dashboard.module.ts`, `case-manager-work-queue.service.ts` |
| `server/src/app/executive` | 11 | `executive-dashboard.dto.ts`, `executive.controller.ts`, `executive.module.ts` |
| `server/src/app/fire-drills` | 5 | `fire-drill.entity.ts`, `fire-drills.controller.ts`, `fire-drills.dto.ts` |
| `server/src/app/health` | 2 | `health.controller.ts`, `health.module.ts` |
| `server/src/app/hipaa` | 4 | `safe-exception.filter.ts`, `hipaa.module.ts`, `phi-redact.interceptor.ts` |
| `server/src/app/iss` | 9 | `create-iss-provider.dto.ts`, `create-iss-staff-log.dto.ts`, `update-iss-provider.dto.ts` |
| `server/src/app/observability` | 4 | `metrics.controller.ts`, `metrics.interceptor.ts`, `metrics.module.ts` |
| `server/src/app/operations` | 6 | `operations.controller.ts`, `operations.module.ts`, `executive-intelligence.service.ts` |
| `server/src/app/people` | 46 | `create-clinical-contact-profile.dto.ts`, `create-consumer-care-team-assignment.dto.ts`, `create-consumer-diagnosis.dto.ts` |
| `server/src/app/providers` | 5 | `provider.entity.ts`, `providers.controller.ts`, `providers.dto.ts` |
| `server/src/app/raci` | 4 | `raci.controller.ts`, `raci.entities.ts`, `raci.module.ts` |
| `server/src/app/regulatory` | 3 | `regulatory-knowledge.controller.ts`, `regulatory-knowledge.module.ts`, `regulatory-knowledge.service.ts` |
| `server/src/app/remediation` | 23 | `remediation.controller.ts`, `add-cap-note.dto.ts`, `add-finding-note.dto.ts` |
| `server/src/app/residential` | 5 | `residential-location.dto.ts`, `residential-location.entity.ts`, `residential-locations.controller.ts` |
| `server/src/app/security` | 32 | `permission-codes.ts`, `audit-logs.controller.ts`, `mfa.controller.ts` |
| `server/src/app/survey` | 3 | `survey.controller.ts`, `survey.module.ts`, `survey.service.ts` |
| `server/src/app/test` | 1 | `auth.e2e.spec.ts` |
| `server/src/app/types` | 1 | `express.d.ts` |
| `server/src/app/users` | 8 | `create-user.dto.ts`, `update-user.dto.ts`, `user.entity.ts` |

`server/src/app/app.module.ts` imports Auth, Users, RACI, ISS, Consumers, People, Providers, Security, Survey, Remediation, Dashboard, Compliance Recheck, Compliance Results, Compliance Engine, Operations, and Executive modules. Other directories/files in the archive are **not necessarily registered** in this root module.

## 6. Data model and migration inventory
Found **33** TypeORM entity-named files and **52** migration `.ts` files. Existence of migration files does not prove that they have been applied to any database.

### Migration filenames
- `server/migrations/1700000000000-enable-extensions.ts`
- `server/migrations/1700000000001-init-roles-catalog.ts`
- `server/migrations/1700000000002-init-modules-catalog.ts`
- `server/migrations/1700000000003-init-raci-assignments.ts`
- `server/migrations/1710002000000-seed-raci.ts`
- `server/migrations/1755630176745-init_auth.ts`
- `server/migrations/1755747436628-init_auth.ts`
- `server/migrations/1800000000000-IssBaseline.ts`
- `server/migrations/1800000000001-PatchIssSeedLocations.ts`
- `server/migrations/1800000000002-IssRotationOctDec2025.ts`
- `server/migrations/1800000000003-RemoveFullServicePeriod.ts`
- `server/migrations/1800000000004-core-db-prereqs.ts`
- `server/migrations/1800000000007-create-core-consumers.ts`
- `server/migrations/1800000000009-normalize-auth-timestamps.ts`
- `server/migrations/1800000000010-core-providers.ts`
- `server/migrations/1800000000011-remove-core-providers.ts`
- `server/migrations/1800000000100-create-providers.ts`
- `server/migrations/1800000000101-create-locations.ts`
- `server/migrations/1800000000103-enforce-location-capacity.ts`
- `server/migrations/1800000000104-add-providers-status-soft-delete.ts`
- `server/migrations/1800000000105-align-providers-name-citext-unique.ts`
- `server/migrations/1800000000106-add-provider-address-fields.ts`
- `server/migrations/1800000000107-add-provider-core-fields.ts`
- `server/migrations/1800000000110-CreateResidentialLocations.ts`
- `server/migrations/1800000000111-AddResidentialLocationCode.ts`
- `server/migrations/1800000000120-CreateComplianceResults.ts`
- `server/migrations/1800000000201-AddComplianceResultsSubcategory.ts`
- `server/migrations/1800000000202-AddComplianceResultsFilterIndexes.ts`
- `server/migrations/1800000000203-AddComplianceResultsPartialIndexes.ts`
- `server/migrations/1800000000210-create-fire-drill-logs.ts`
- `server/migrations/1800000000211-CreateFireDrillsForm4719.ts`
- `server/migrations/1800000000212-CreatePeopleDomain.ts`
- `server/migrations/1800000000213-RenameConsumerProfileToConsumerRecord.ts`
- `server/migrations/1800000000214-EnforceOneActiveResidentialAssignment.ts`
- `server/migrations/1800000000215-CreateEmployeeProfiles.ts`
- `server/migrations/1800000000216-CreateClinicalContactProfiles.ts`
- `server/migrations/1800000000217-CreateConsumerCareTeamAssignments.ts`
- `server/migrations/1800000000218-CreateConsumerDiagnoses.ts`
- `server/migrations/1800000000219-CreateConsumerGuardians.ts`
- `server/migrations/1800000000220-CreateConsumerLegalStatuses.ts`
- `server/migrations/1800000000221-CreateMedicaidBenefits.ts`
- `server/migrations/1800000000222-CreateSecurityRolesPermissions.ts`
- `server/migrations/1800000000223-CreateAuditLogs.ts`
- `server/migrations/1800000000224-CreateMfaTables.ts`
- `server/migrations/1800000000225-SeedSecurityRolesPermissions.ts`
- `server/migrations/1800000000230-CreateRemediationTables.ts`
- `server/migrations/1800000000231-CreateComplianceResultCaps.ts`
- `server/migrations/1800000000232-AddCapSummaryToComplianceResults.ts`
- `server/migrations/1800000000233-AddCapIdToComplianceFindingNotes.ts`
- `server/migrations/1800000000234-CreateCapStatusHistory.ts`
- `server/migrations/1800000000235-AddRecheckFieldsToComplianceResults.ts`
- `server/migrations/1800000000236-CreateCapEvidence.ts`

### Entity filenames
- `server/src/app/audit/entities/audit.entity.ts`
- `server/src/app/auth/entities/auth.entity.ts`
- `server/src/app/compliance/entities/compliance-result.entity.ts`
- `server/src/app/consumers/entities/consumer.entity.ts`
- `server/src/app/fire-drills/fire-drill.entity.ts`
- `server/src/app/iss/entities/iss-provider.entity.ts`
- `server/src/app/iss/entities/iss-staff-log.entity.ts`
- `server/src/app/people/entities/clinical-contact-profile.entity.ts`
- `server/src/app/people/entities/consumer-care-team-assignment.entity.ts`
- `server/src/app/people/entities/consumer-diagnosis.entity.ts`
- `server/src/app/people/entities/consumer-guardian.entity.ts`
- `server/src/app/people/entities/consumer-legal-status.entity.ts`
- `server/src/app/people/entities/consumer-record.entity.ts`
- `server/src/app/people/entities/employee-profile.entity.ts`
- `server/src/app/people/entities/iss-consumer-assignment.entity.ts`
- `server/src/app/people/entities/medicaid-benefits.entity.ts`
- `server/src/app/people/entities/person.entity.ts`
- `server/src/app/people/entities/residential-assignment.entity.ts`
- `server/src/app/providers/provider.entity.ts`
- `server/src/app/remediation/entities/cap-evidence.entity.ts`
- `server/src/app/remediation/entities/cap-status-history.entity.ts`
- `server/src/app/remediation/entities/compliance-finding-note.entity.ts`
- `server/src/app/remediation/entities/compliance-result-cap.entity.ts`
- `server/src/app/remediation/entities/corrective-action-plan.entity.ts`
- `server/src/app/residential/residential-location.entity.ts`
- `server/src/app/security/entities/audit-log.entity.ts`
- `server/src/app/security/entities/mfa-backup-code.entity.ts`
- `server/src/app/security/entities/mfa-secret.entity.ts`
- `server/src/app/security/entities/permission.entity.ts`
- `server/src/app/security/entities/role-permission.entity.ts`
- `server/src/app/security/entities/role.entity.ts`
- `server/src/app/security/entities/user-permission.entity.ts`
- `server/src/app/users/entities/user.entity.ts`

## 7. Regulatory Knowledge Engine source inventory
- `libs/regulatory/engines/renewal/src/index.ts`
- `libs/regulatory/engines/renewal/src/lib/interfaces/renewal-engine.interface.ts`
- `libs/regulatory/engines/renewal/src/lib/services/renewal-engine.service.spec.ts`
- `libs/regulatory/engines/renewal/src/lib/services/renewal-engine.service.ts`
- `libs/regulatory/knowledge/jest.config.ts`
- `libs/regulatory/knowledge/src/index.ts`
- `libs/regulatory/knowledge/src/lib/enums/regulatory.enums.ts`
- `libs/regulatory/knowledge/src/lib/interfaces/document-generator.interface.ts`
- `libs/regulatory/knowledge/src/lib/interfaces/knowledge-engine.interface.ts`
- `libs/regulatory/knowledge/src/lib/interfaces/renewal-engine.interface.ts`
- `libs/regulatory/knowledge/src/lib/knowledge.spec.ts`
- `libs/regulatory/knowledge/src/lib/knowledge.ts`
- `libs/regulatory/knowledge/src/lib/loaders/knowledge-pack.loader.ts`
- `libs/regulatory/knowledge/src/lib/models/document-definition.model.ts`
- `libs/regulatory/knowledge/src/lib/models/evidence-requirement.model.ts`
- `libs/regulatory/knowledge/src/lib/models/knowledge-pack.model.ts`
- `libs/regulatory/knowledge/src/lib/models/regulatory-guidance.model.ts`
- `libs/regulatory/knowledge/src/lib/models/regulatory-question.model.ts`
- `libs/regulatory/knowledge/src/lib/models/regulatory-requirement.model.ts`
- `libs/regulatory/knowledge/src/lib/models/regulatory-rule.model.ts`
- `libs/regulatory/knowledge/src/lib/models/regulatory-source.model.ts`
- `libs/regulatory/knowledge/src/lib/models/renewal-rule.model.ts`
- `libs/regulatory/knowledge/src/lib/models/validation-rule.model.ts`
- `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts`
- `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/fire-drill.rule.ts`
- `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/medication-administration.rule.ts`
- `libs/regulatory/knowledge/src/lib/packs/texas-hcs/texas-hcs.knowledge-pack.ts`
- `libs/regulatory/knowledge/src/lib/repositories/knowledge-repository.interface.ts`
- `libs/regulatory/knowledge/src/lib/repositories/memory-knowledge.repository.ts`
- `libs/regulatory/knowledge/src/lib/services/ai-guidance.service.ts`
- `libs/regulatory/knowledge/src/lib/services/document-generator.service.spec.ts`
- `libs/regulatory/knowledge/src/lib/services/document-generator.service.ts`
- `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.spec.ts`
- `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.ts`
- `libs/regulatory/knowledge/src/lib/services/regulatory-knowledge.service.ts`
- `libs/regulatory/knowledge/src/lib/services/renewal-engine.service.ts`
- `libs/regulatory/knowledge/src/lib/services/survey-binder.service.ts`
- `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.spec.ts`
- `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.ts`

**Observed:** A regulatory knowledge library, models, services, in-memory repository, Texas HCS knowledge-pack file, and named rule files for Emergency Preparedness, Fire Drills, and Medication Administration. **Not verified:** official source provenance, independent certification workflow, effective-dated pack publication, production persistence, or complete end-to-end evaluation.

## 8. Test file inventory
Found **56** `.spec.ts`/`.test.ts` files. This is a file count, **not a test count or pass result**. Some targets specify `passWithNoTests`, which must not be interpreted as evidence of coverage.
- `libs/data-access/process/src/lib/engines/validation-engine.service.spec.ts`
- `libs/data-access/src/lib/ane/ane.spec.ts`
- `libs/data-access/src/lib/auth/auth-guard.spec.ts`
- `libs/data-access/src/lib/auth/auth-http/auth-http.spec.ts`
- `libs/data-access/src/lib/auth/auth-interceptor.spec.ts`
- `libs/data-access/src/lib/auth/auth-state/auth-state.spec.ts`
- `libs/data-access/src/lib/auth/role-guard.spec.ts`
- `libs/data-access/src/lib/auth/token-storage/token-storage.spec.ts`
- `libs/data-access/src/lib/behavior/behavior.spec.ts`
- `libs/data-access/src/lib/enclosed-beds/enclosed-beds.spec.ts`
- `libs/data-access/src/lib/finance/finance.spec.ts`
- `libs/data-access/src/lib/programmatic/programmatic.spec.ts`
- `libs/data-access/src/lib/prohibitions/prohibitions.spec.ts`
- `libs/data-access/src/lib/protective-devices/protective-devices.spec.ts`
- `libs/data-access/src/lib/restraints/restraints.spec.ts`
- `libs/features/admin/cost-report/src/lib.spec.ts`
- `libs/features/admin/src/lib/cost-report/cost-report.spec.ts`
- `libs/features/ane/src/lib/ane/ane.spec.ts`
- `libs/features/behavior/src/lib/behavior/behavior.spec.ts`
- `libs/features/dashboard/src/lib/components/compliance-chart/compliance-chart.spec.ts`
- `libs/features/dashboard/src/lib/components/compliance-summary-card/compliance-summary-card.spec.ts`
- `libs/features/dashboard/src/lib/dashboard/dashboard.spec.ts`
- `libs/features/enclosed-beds/src/lib/enclosed-beds/enclosed-beds.spec.ts`
- `libs/features/finance/src/lib/finance/finance.spec.ts`
- `libs/features/home/src/lib/home/home.spec.ts`
- `libs/features/medical/src/lib/medical/medical.spec.ts`
- `libs/features/programmatic/src/lib/programmatic/programmatic.spec.ts`
- `libs/features/prohibitions/src/lib/prohibitions/prohibitions.spec.ts`
- `libs/features/protective-devices/src/lib/protective-devices/protective-devices.spec.ts`
- `libs/features/provider-onboarding/src/lib/provider-onboarding/provider-onboarding.spec.ts`
- `libs/features/restraints/src/lib/restraints/restraints.spec.ts`
- `libs/regulatory/engines/renewal/src/lib/services/renewal-engine.service.spec.ts`
- `libs/regulatory/knowledge/src/lib/knowledge.spec.ts`
- `libs/regulatory/knowledge/src/lib/services/document-generator.service.spec.ts`
- `libs/regulatory/knowledge/src/lib/services/knowledge-engine.service.spec.ts`
- `libs/regulatory/knowledge/src/lib/validators/knowledge-pack.validator.spec.ts`
- `libs/shared-models/src/lib/card/card.component.spec.ts`
- `libs/shared-models/src/lib/shared-models.spec.ts`
- `libs/shared-models/src/lib/toggle-theme/toggle-theme.component.spec.ts`
- `libs/shared/src/lib/services/layout.spec.ts`
- `libs/ui-kit/src/lib.spec.ts`
- `libs/web-shell/src/lib/layout/app-shell.spec.ts`
- `libs/web-shell/src/lib/layout/main-content.spec.ts`
- `libs/web-shell/src/lib/layout/sidebar.spec.ts`
- `libs/web-shell/src/lib/web-shell/web-shell.spec.ts`
- `server-e2e/src/api/api.spec.ts`
- `server/.env.test.ts`
- `server/src/app/app.controller.spec.ts`
- `server/src/app/app.service.spec.ts`
- `server/src/app/auth/auth.controller.spec.ts`
- `server/src/app/auth/auth.service.spec.ts`
- `server/src/app/test/auth.e2e.spec.ts`
- `server/src/app/users/services/users.service.spec.ts`
- `server/src/app/users/users.controller.spec.ts`
- `web-e2e/src/example.spec.ts`
- `web/src/app/app.spec.ts`

## 9. Architecture-to-code preliminary traceability
| ENG subsystem | Archive evidence | Initial assessment | Verification needed |
|---|---|---|---|
| ENG-016 RKE | `libs/regulatory/knowledge` and Texas HCS rule files | Partial source present | Certification, provenance, validator, publication and version resolution |
| ENG-017 FKE | Finance and cost-report frontend source paths; no independently verified FKE authority | Not demonstrated | Full financial knowledge authority and approved methodology pipeline |
| ENG-018 Shared Intelligence | Audit, security, remediation and validation-related source paths | Partial/fragmented evidence | 15 service contracts, evidence, document, approval, binder, replay |
| ENG-019 Operational Domains | People, providers, consumers, residential, ISS, operations and migrations | Substantial source presence; completeness unknown | Entity behavior, contract boundaries, migrations and runtime tests |
| ENG-020 Applied Intelligence | Compliance engine/results, dashboard, remediation, recheck and executive paths | Partial source present | Financial Intelligence engine, end-to-end accuracy and results |
| ENG-021 Platform Foundation | Auth/security/observability/configuration, Nx and CI files | Partial source present | Security enforcement, tenancy, deployment, recovery and performance |
| ENG-022 UX and Shell | `web`, `libs/web-shell`, `libs/features/*`, `libs/ui-kit` | Substantial source presence; completeness unknown | Navigation, role gates, accessibility, workflow behavior |
| ENG-023 Integration | Module imports, controllers, data-access, e2e files | Integration scaffolding present | All six-layer E2E scenarios and contract alignment |

These are **evidence-based screening labels**, not approved Reuse/Modify/Replace/Build decisions. Those decisions require ENG-024 approval and execution evidence.

## 10. Preliminary issues and decision register

| ID | Priority | Observation | Required action |
|---|---|---|---|
| GAP-027-01 | Critical | Architecture baseline not formally reconciled or approved | Complete ENG-024 and resolve conflicts before reuse decisions |
| GAP-027-02 | High | No builds, tests, or migrations executed | Run reproducible commands in isolated environment and capture logs |
| GAP-027-03 | High | No runtime database state verified | Use a safe disposable database; never run migrations on production without approval |
| GAP-027-04 | High | FKE authority not established by static inspection | Inspect financial code and compare against ENG-017 |
| GAP-027-05 | High | RKE certification and publication not established by static inspection | Trace actual pack validator, approval and publication paths |
| GAP-027-06 | High | Shared binder and survey external access not established | Trace binder lifecycles, document authorization and survey access |
| GAP-027-07 | Medium | Inconsistent Nx project naming/tag conventions | Validate graph and reconcile with ENG-005 dependency policy |
| GAP-027-08 | Medium | Possible mismatch between declared scripts and deployment outputs | Verify clean production builds and artifact layout |
| GAP-027-09 | Medium | Security cannot be established from module names | Test tenant isolation, RBAC, object-level authorization |
| GAP-027-10 | Medium | Historical reproducibility not established | Inspect snapshots, knowledge version pins and execution manifests |
| GAP-027-11 | Medium | Root-level files resembling stray Nx generator flags | Investigate provenance and repository hygiene; no deletions without approval |
| GAP-027-12 | Medium | Nested `libs.zip` may be a duplicate/stale archive | Compare contents before deciding whether to retain |

## 11. Build and test execution register (not run)
| Command | Status | Result |
|---|---|---|
| `npm ci` | Not run | Unknown |
| `npx nx show projects` | Not run | Unknown |
| `npx nx graph` | Not run | Unknown |
| `npx nx build server --configuration=production` | Not run | Unknown |
| `npx nx build web --configuration=production` | Not run | Unknown |
| `npx nx run-many -t test` | Not run | Unknown |
| `npx nx run-many -t lint` | Not run | Unknown |
| Server E2E | Not run | Unknown |
| Web E2E | Not run | Unknown |
| Disposable database migration test | Not run | Unknown |

## 12. Reuse / Modify / Replace / Build New criteria
- **Reuse:** Source behavior demonstrably matches an approved ENG contract, passes tests, and satisfies security/data ownership.
- **Modify:** Core ownership and behavior align, but targeted gaps require controlled changes.
- **Replace:** Proven structural incompatibility, unacceptable risk, or excessive remediation cost.
- **Build New:** No suitable implementation exists after complete inspection.
- **Unassessed:** Current default for every component pending architecture approval and verification.

## 13. Next verification sequence
1. Reconcile and approve ENG-001–026, especially ENG-024 findings.
2. Record archive hash, source branch/commit identity, and verified extraction manifest.
3. Establish isolated development environment with no production credentials.
4. Execute dependency install, Nx project graph, builds, lint, and unit tests; preserve command output.
5. Validate migrations against disposable PostgreSQL and compare entity metadata.
6. Trace each component from API → service → persistence → UI → test.
7. Execute representative HCS Emergency Preparedness and Cost Reporting vertical slices using approved golden fixtures.
8. Verify survey/binder, access-control, audit, and historical replay workflows.
9. Populate evidence-backed component-by-component Reuse/Modify/Replace/Build New decisions.
10. Obtain separate implementation authorization before editing application code.

## 14. Acceptance and sign-off
- [x] User-provided archive received and statically inventoried.
- [x] Nx project and backend module directories enumerated.
- [x] Migration and test file names recorded.
- [ ] Architecture baseline approved.
- [ ] Source commit identity verified.
- [ ] Builds, lint, unit tests and E2E executed.
- [ ] Disposable migration test completed.
- [ ] Security and tenancy verified.
- [ ] Knowledge and financial vertical slices verified.
- [ ] Reuse/Modify/Replace/Build New decisions approved.
- [ ] Implementation authorized.

**Decision:** Repository verification **in progress**; implementation readiness **not established**.

**End of ENG-027.**
