# REC-004 — Repository API and Dependency Evidence Inventory
**Version:** 1.0 — Evidence Capture Draft  |  **Date:** 2026-11-02  |  **Implementation Authorization:** Not Granted
**Source:** User-provided `hhscCompliance-develop.zip` (static inspection only).
**Proposed path:** `docs/governance/reconciliation/rec-004-repository-api-and-dependency-evidence-inventory.md`

## 1. Purpose and evidence limits
This is the next evidence-population step after REC-003. It records concrete source declarations found in the archive. A decorator is evidence of a declared route, **not** evidence that the endpoint is mounted, reachable, secure, or correct. No dependencies were installed; no builds, runtime calls, or tests were executed for this document.

## 2. Extraction method
Inspected `.controller.ts` files for NestJS `@Controller` and HTTP method decorators and `project.json` files for declared Nx project names and tags. This deliberately does not infer DTO shapes, global prefixes, guards, or runtime authorization from decorators alone. Complex expressions and generated routes may be missed.

**Observed:** 26 server controller files and 34 parseable Nx `project.json` files.

## 3. Declared HTTP route evidence
| Source file | Controller prefix (literal) | HTTP decorators (literal paths) |
|---|---|---|
| `server/src/app/app.controller.ts` | `(dynamic/empty)` | `Get /`, `Get health` |
| `server/src/app/audit/dashboard/dashboard.controller.ts` | `dashboard` | `Get summary`, `Get chart` |
| `server/src/app/auth/auth.controller.ts` | `auth` | `Post register`, `Post login` |
| `server/src/app/compliance/compliance-results.controller.ts` | `compliance-results` | `Get /`, `Get :id`, `Post /`, `Patch :id`, `Delete :id` |
| `server/src/app/compliance/engine/compliance-engine.controller.ts` | `compliance/engine` | `Post locations/:locationId/evaluate` |
| `server/src/app/consumers/consumers.controller.ts` | `(dynamic/empty)` | `Post /`, `Get /`, `Get :id`, `Patch :id` |
| `server/src/app/dashboard/dashboard.controller.ts` | `dashboard` | `Get summary`, `Get chart`, `Get provider-intelligence`, `Get case-manager/work-queue`, `Get modules/:module`, `Get modules/:module/entities/:entityType/:entityId` |
| `server/src/app/executive/executive.controller.ts` | `executive` | `Get dashboard` |
| `server/src/app/fire-drills/fire-drills.controller.ts` | `fire-drills` | `Get /`, `Get :id`, `Post /`, `Patch :id`, `Delete :id` |
| `server/src/app/health/health.controller.ts` | `health` | `Get liveness`, `Get readiness` |
| `server/src/app/iss/iss.controller.ts` | `(dynamic/empty)` | `Post providers`, `Get providers`, `Post consumers`, `Get consumers`, `Post staff-logs`, `Get staff-logs/:consumerId`, `Patch staff-logs/:id`, `Get consumer/:id/latest-log`, `Get consumer/:id/log`, `Get consumer/:id/weeks` |
| `server/src/app/observability/metrics/metrics.controller.ts` | `metrics` | `Get /` |
| `server/src/app/operations/operations.controller.ts` | `operations` | `Get command-center` |
| `server/src/app/people/people.controller.ts` | `people` | `Post /`, `Get /`, `Get :id`, `Patch :id`, `Delete :id`, `Post consumer-records`, `Get consumer-records/all`, `Get consumer-records/:id`, `Patch consumer-records/:id`, `Post residential-assignments`, `Get residential-assignments/location/:locationId`, `Get residential-assignments/consumer/:consumerRecordId`, `Patch residential-assignments/:id/end`, `Post employee-profiles`, `Get employee-profiles/all`, `Get employee-profiles/:id`, `Patch employee-profiles/:id`, `Post clinical-contact-profiles`, `Get clinical-contact-profiles/all`, `Get clinical-contact-profiles/:id`, `Post care-team-assignments`, `Get care-team-assignments/consumer/:consumerRecordId`, `Get care-team-assignments/:id`, `Patch care-team-assignments/:id`, `Patch care-team-assignments/:id/end`, `Post consumer-diagnoses`, `Get consumer-diagnoses/all`, `Get consumer-diagnoses/consumer/:consumerRecordId`, `Get consumer-diagnoses/:id`, `Patch consumer-diagnoses/:id`, `Delete consumer-diagnoses/:id`, `Post consumer-guardians`, `Get consumer-guardians/all`, `Get consumer-guardians/consumer/:consumerRecordId`, `Get consumer-guardians/:id`, `Patch consumer-guardians/:id`, `Delete consumer-guardians/:id`, `Post consumer-legal-statuses`, `Get consumer-legal-statuses/all`, `Get consumer-legal-statuses/consumer/:consumerRecordId`, `Get consumer-legal-statuses/:id`, `Patch consumer-legal-statuses/:id`, `Delete consumer-legal-statuses/:id`, `Post medicaid-benefits`, `Get medicaid-benefits/all`, `Get medicaid-benefits/consumer/:consumerRecordId`, `Get medicaid-benefits/:id`, `Patch medicaid-benefits/:id`, `Delete medicaid-benefits/:id` |
| `server/src/app/providers/providers.controller.ts` | `providers` | `Get /`, `Get :id`, `Post /`, `Patch :id`, `Delete :id` |
| `server/src/app/raci/raci.controller.ts` | `(dynamic/empty)` | `Get allowed-roles`, `Get menu` |
| `server/src/app/regulatory/knowledge/regulatory-knowledge.controller.ts` | `(dynamic/empty)` | No simple HTTP decorator detected |
| `server/src/app/remediation/controllers/remediation.controller.ts` | `remediation` | `Get caps`, `Get caps/:id`, `Post caps`, `Patch caps/:id`, `Post notes`, `Get notes`, `Get findings/:findingId/workspace`, `Get findings/:complianceResultId/caps`, `Post caps/:capId/notes`, `Get caps/:capId/notes`, `Patch caps/:id/status`, `Get caps/:id/status-history`, `Post caps/:capId/evidence`, `Get caps/:capId/evidence`, `Delete evidence/:evidenceId` |
| `server/src/app/residential/residential-locations.controller.ts` | `residential-locations` | `Get /`, `Get :id`, `Post /`, `Patch :id`, `Delete :id` |
| `server/src/app/security/controllers/audit-logs.controller.ts` | `security/audit-logs` | `Post /`, `Post search`, `Get /`, `Get :id` |
| `server/src/app/security/controllers/mfa.controller.ts` | `security/mfa` | `Post initialize/:userId`, `Post enable`, `Post verify`, `Post disable`, `Get status/:userId` |
| `server/src/app/security/controllers/permissions.controller.ts` | `security/permissions` | `Post /`, `Get /`, `Get :id`, `Patch :id`, `Delete :id`, `Post assign-role`, `Post assign-user` |
| `server/src/app/security/controllers/roles.controller.ts` | `security/roles` | `Post /`, `Get /`, `Get :id`, `Patch :id`, `Delete :id` |
| `server/src/app/security/controllers/security-test.controller.ts` | `security-test` | `Get dashboard` |
| `server/src/app/survey/survey.controller.ts` | `survey` | `Get dashboard`, `Get findings` |
| `server/src/app/users/users.controller.ts` | `users` | `Get /`, `Get :id`, `Patch :id/roles` |

**Verification required:** Inspect bootstrap global prefix, controller module imports, method guards, parameter validation, route collision behavior, response schemas, tenant scoping, and integration tests before certifying any contract.

## 4. Nx project configuration evidence
| Project configuration file | Declared name | Tags |
|---|---|---|
| `libs/data-access/project.json` | `data-access` | `type:lib,type:data-access,scope:data,surface:web` |
| `libs/features/admin/project.json` | `cost-report` | `type:feature,surface:web,feature:admin` |
| `libs/features/ane/project.json` | `ane` | `type:feature,scope:feature,feature:ane,surface:web` |
| `libs/features/behavior/project.json` | `behavior` | `type:feature,scope:feature,feature:behavior,surface:web` |
| `libs/features/compliance/project.json` | `compliance` | `type:feature,scope:feature,feature:compliance,surface:web` |
| `libs/features/consumers/project.json` | `consumers` | `type:feature,scope:feature,feature:consumers,surface:web` |
| `libs/features/dashboard/project.json` | `dashboard` | `type:feature,scope:feature,feature:dashboard,surface:web` |
| `libs/features/enclosed-beds/project.json` | `enclosed-beds` | `type:feature,scope:feature,feature:enclosed-beds,surface:web` |
| `libs/features/finance/project.json` | `finance` | `type:feature,scope:feature,feature:finance,surface:web` |
| `libs/features/home/project.json` | `home` | `type:feature,scope:feature,feature:home,surface:web` |
| `libs/features/import-engine/project.json` | `import-engine` | `scope:feature,type:feature` |
| `libs/features/iss/project.json` | `iss` | `type:feature,scope:feature,feature:iss,surface:web` |
| `libs/features/medical/project.json` | `medical` | `type:feature,scope:feature,feature:medical,surface:web` |
| `libs/features/operations/project.json` | `operations` | `scope:feature,type:feature` |
| `libs/features/programmatic/project.json` | `programmatic` | `type:feature,scope:feature,feature:programmatic,surface:web` |
| `libs/features/prohibitions/project.json` | `prohibitions` | `type:feature,scope:feature,feature:prohibitions,surface:web` |
| `libs/features/project.json` | `features` | `(none declared)` |
| `libs/features/protective-devices/project.json` | `protective-devices` | `type:feature,scope:feature,feature:protective-devices,surface:web` |
| `libs/features/provider-onboarding/project.json` | `provider-onboarding` | `scope:feature,type:feature` |
| `libs/features/provider-workspace/project.json` | `provider-workspace` | `type:feature,scope:feature` |
| `libs/features/providers/project.json` | `providers` | `type:feature,scope:feature,feature:providers,surface:web` |
| `libs/features/remediation/project.json` | `remediation` | `type:feature` |
| `libs/features/residential/project.json` | `residential` | `type:feature,scope:feature,feature:residential,surface:web` |
| `libs/features/restraints/project.json` | `restraints` | `type:feature,scope:feature,feature:restraints,surface:web` |
| `libs/project.json` | `feature-provider-onboarding` | `(none declared)` |
| `libs/regulatory/knowledge/project.json` | `(implicit)` | `(none declared)` |
| `libs/shared-models/project.json` | `shared-models` | `type:model,scope:shared,surface:both` |
| `libs/shared/src/lib/ui-overlay/project.json` | `ui-overlay` | `scope:ui,type:util` |
| `libs/ui-kit/project.json` | `ui-kit` | `type:ui,scope:ui,surface:web` |
| `libs/web-shell/project.json` | `web-shell` | `type:feature,scope:shell,surface:web` |
| `server-e2e/project.json` | `server-e2e` | `(none declared)` |
| `server/project.json` | `server` | `type:app,surface:api` |
| `web-e2e/project.json` | `web-e2e` | `(none declared)` |
| `web/project.json` | `web` | `type:app,surface:web,scope:web` |

## 5. API contract gaps requiring manual review
- [ ] Controller-level and method-level guards and authorization metadata
- [ ] Request DTOs, validation pipes, and response DTOs
- [ ] Tenant/provider/location scoping and row-level enforcement
- [ ] Global `/api/v1` prefix and frontend proxy compatibility
- [ ] OpenAPI schema generation and endpoint contract snapshots
- [ ] Versioned deprecation and consumer compatibility policy
- [ ] Cross-engine contract schemas and knowledge version references
- [ ] Failure semantics, idempotency, pagination, and correlation IDs

## 6. Dependency verification procedure
The `project.json` inventory is **not** an evaluated Nx dependency graph. Run the following only in an authorized, dependency-installed environment:
```bash
node --version
npm ci
npx nx show projects --json
npx nx graph --file=nx-graph.json
npx nx run-many -t lint --all
npx nx run-many -t test --all
npx nx run-many -t build --all
```
Capture environment, command, exit status, logs, affected projects, and evidence references. Do not claim a pass from configuration alone.

## 7. Architecture ownership and dependency checks
- [ ] RKE must not import FKE internals; FKE must not import RKE internals
- [ ] Operational source record ownership must not be transferred to Applied Intelligence
- [ ] Shared infrastructure must not author or override regulated knowledge
- [ ] Angular features must use approved contracts rather than server internals
- [ ] Cross-tenant data access must be denied at server/data boundaries
- [ ] All approved event contracts must have producer, consumer, schema, version, and reliability evidence
- [ ] Binder access must be distinct from source document authorization

## 8. Preliminary gap and decision register
| ID | Gap | Current disposition | Evidence needed |
|---|---|---|---|
| G-01 | Runtime API exposure | Open / not verified | Bootstrap and integration test |
| G-02 | Endpoint authorization | Open / not verified | Guard and policy review |
| G-03 | Contract schemas | Open / not verified | DTO and OpenAPI audit |
| G-04 | Nx layer boundaries | Open / not verified | Evaluated dependency graph |
| G-05 | Event registry completeness | Open / not verified | Event producer/consumer source trace |
| G-06 | RKE/FKE contract separation | Open / not verified | Cross-engine import and integration review |
| G-07 | Tenant isolation | Open / not verified | Negative access tests |
| G-08 | Historical version context | Open / not verified | Knowledge resolution tests |

## 9. Treatment decisions
No final Reuse / Modify / Replace / Build New classifications are assigned by this evidence capture. Such classifications require a verified architecture mapping, runtime checks where applicable, and explicit review.

## 10. Exit criteria for REC-004
- [ ] Complete method-level API/DTO/guard inventory
- [ ] Verify bootstrap prefix and module registration
- [ ] Generate Nx dependency graph and test forbidden imports
- [ ] Reconcile APIs/events against REC-001 and REC-003
- [ ] Document pass/fail/block with reproducible evidence
- [ ] Approve contract mapping decisions separately

## 11. Status and next action
**Static evidence inventory prepared. Runtime verification pending. Detailed contract reconciliation open. Implementation not authorized.** Next: method-level API security and DTO contract audit, then Nx dependency enforcement assessment.
