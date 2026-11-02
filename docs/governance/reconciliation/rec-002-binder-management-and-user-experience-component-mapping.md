# REC-002 — Section 7: Binder Management and User Experience Component Mapping

**Platform:** McCaskill Projects Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Assessment source:** `hhscCompliance-develop.zip` supplied in conversation  
**Scope:** BM-01–BM-09 and UX component families; provider-wide Intelligence Center, survey, financial binder, residential and ISS interfaces  
**Verification level:** Static archive inspection; builds, tests, endpoint execution, permissions and migrations not run in this section  
**Implementation authorization:** **NOT GRANTED**

## 1. Purpose and assessment discipline

Map the proposed universal Binder Management and User Experience architecture to evidence actually present in the uploaded repository. Distinguish (a) source file exists, (b) code behavior visible from inspection, (c) proposed target capability, and (d) unverified runtime behavior. **File presence is not proof of correct behavior, security, completeness or production readiness.** Candidate component names below are functional mapping labels; reconcile final titles and ownership against ENG-008, ENG-018, ENG-020, ENG-022 and the canonical registry under REC-001.

## 2. Approved architecture boundaries

- One shared Binder Management infrastructure supports Survey and Financial binder types; it is not a third knowledge authority.
- RKE and FKE independently own certified definitions. Operational domains own factual source records; Applied Intelligence owns determinations and orchestrates binder assembly.
- Binder access is distinct from source-document authorization. External survey access requires explicit scope, expiration, revocation, authentication and audit.
- A released binder is an immutable, reproducible snapshot or versioned manifest, not a mutable folder.
- Provider Intelligence Center must support provider-wide operation without a mandatory `locationId`, with authorized location drilldown and correction-area-first Residential workbenches.

## 3. Evidence method

Archive member enumeration confirmed the listed paths. Targeted content inspection confirmed that `libs/regulatory/knowledge/src/lib/services/survey-binder.service.ts` is **empty (zero bytes)**; `server/src/app/survey/survey.service.ts` contains a NestJS service querying compliance results and exposing a `dashboard(locationId: string)` method; the Angular app shell, dashboard workbench and ISS routes contain source code. These findings **do not** demonstrate complete binder lifecycle or UX acceptance.

## 4. Binder Management mapping — BM-01 through BM-09

| ID | Target responsibility (candidate) | Existing evidence | Current assessment | Required proof / gap |
|---|---|---|---|---|
| BM-01 | Binder registry, types and configuration | Empty `libs/regulatory/knowledge/src/lib/services/survey-binder.service.ts` | **Not established** | Durable binder entity, type registry, ownership, tenant scope |
| BM-02 | Binder lifecycle/state transitions | No verified universal lifecycle | **Not established** | Draft → Assembling → Under Review → Approved → Released → Closed → Archived; authorization, rejection and reopening policy |
| BM-03 | Binder manifest and section assembly | Survey dashboard service exists, not proof of manifest | **Not established** | Type-specific sections, evidence references, source provenance |
| BM-04 | Evidence/document attachment coordination | CAP evidence code reported in REC-002 §5; survey service | **Candidate integration** | Per-document ACL, retention, integrity, missing evidence handling |
| BM-05 | Binder validation and completeness | No verified binder validation engine | **Not established** | Versioned checklist and type-specific required artifacts |
| BM-06 | Binder review and approval | No verified universal binder approval chain | **Not established** | Separation of duties, approvals, signatures and immutable decision trail |
| BM-07 | Binder release and historical snapshot | No verified immutable release manifest | **Not established** | Content hashes, frozen knowledge/source references, reproducibility |
| BM-08 | Secure external sharing / survey access | `server/src/app/survey/` exists | **Survey domain candidate only** | External identity, MFA, scoped sharing, expiration, revocation, download audit |
| BM-09 | Binder retrieval, export, audit and retention | Survey service/controller; no full binder export established | **Not established** | Export completeness, audit, redaction, retention and legal hold |

**Interpretation:** BM IDs and target descriptions are assessment groupings, not verified canonical contracts. A survey service and an empty binder service file are **not** a functioning universal Binder Management system. Financial binder implementation is not established.

## 5. Verified binder/survey repository paths

- `libs/regulatory/knowledge/src/lib/services/survey-binder.service.ts` — **empty, zero bytes**.
- `server/src/app/survey/survey.controller.ts` — source exists; endpoint behavior untested.
- `server/src/app/survey/survey.module.ts` — source exists; module wiring untested.
- `server/src/app/survey/survey.service.ts` — 63-line service; `dashboard(locationId: string)` queries compliance results; not a binder lifecycle implementation.
- `libs/features/executive/src/lib/components/survey-prediction-card/survey-prediction-card.component.ts` — source exists; prediction and data provenance unverified.

## 6. UX inventory — architecture to source mapping

| UX surface | Candidate repository source | Source-level finding | Open verification |
|---|---|---|---|
| Angular application shell | `libs/web-shell/src/lib/layout/app-shell.ts`, `.html`, `.scss` | Standalone Angular shell code present | Routes, permissions, responsive behavior, accessibility |
| Navigation and authorization-aware menu | `libs/web-shell/src/lib/layout/sidebar.ts`; `libs/web-shell/src/lib/nav/role-menu.ts`; `libs/web-shell/src/lib/guards/` | Navigation and guards present | Backend enforcement, denied routes, role and tenant context |
| Main routes and feature composition | `libs/web-shell/src/lib/app.routes.ts`; `web/src/app/app.routes.ts` | Route declarations present | Lazy-load integrity, broken imports, deep-link coverage |
| Provider Intelligence dashboard | `libs/features/dashboard/src/lib/dashboard/dashboard.ts`; `libs/features/dashboard/src/lib/executive-intelligence-panel/` | UI components present | Provider-wide no-location default, authorization filtering, data freshness |
| Module Workbench | `libs/features/dashboard/src/lib/module-workbench/module-workbench.component.ts`; `libs/data-access/src/lib/dashboard/src/services/module-workbench.service.ts` | 132-line Angular workbench component present | Correction-area-first ordering and affected-location drilldowns |
| Entity Workbench | `libs/features/dashboard/src/lib/entity-workbench/entity-workbench.component.ts` | Component present | Finding/evidence/CAP deep links and return navigation |
| Residential workspace | `libs/features/residential/src/lib/residential/residential.routes.ts`; `pages/residential-shell.page.ts` | Routes and shell present | Fire drills, plans, hot water, medication workflows end to end |
| ISS workspace | `libs/features/iss/src/lib/iss.routes.ts`; `ui/iss-page-shell.component.ts` | ISS routes and shell present | Program, consumer-year, schedule, goal tracking, auth |
| Survey workspace | `server/src/app/survey/`; executive survey prediction card | Backend and card candidates | Dedicated review workspace, binder access, external reviewer controls |
| Financial workspace / cost report | `libs/features/admin/cost-report/src/lib.ts`; `libs/features/admin/src/lib/cost-report/cost-report.ts` | Prior inspection found placeholder presentation | Certified FKE integration, calculation and binder UX absent/unverified |
| Shared workflow shell | `libs/ui-kit/src/lib/workflow/shell/workflow-shell.component.ts` | Reusable workflow shell present | Consistency, accessibility and cross-workflow adoption |
| Frontend state / data access | `libs/data-access/src/lib/iss/src/+state/`; `libs/data-access/src/lib/dashboard/` | NgRx ISS state and dashboard services present | Loading/error, invalidation, optimistic updates, security |

## 7. UX canonical identifier reconciliation

ENG-008 introduced UX-01–UX-05, while ENG-022 expanded UX detail. Do **not** assign unverified canonical IDs to the additional UI surfaces. Maintain an alias/crosswalk table with columns: `ENG-008 ID`, `ENG-022 ID`, `canonical ID`, `feature surface`, `Nx project`, `route`, `API owner`, `status`, `decision`, `evidence`. Finalize only after the architecture registry reconciles the two catalogs.

## 8. Provider-wide dashboard acceptance requirements

1. Provider-level landing page does not require `locationId`.
2. Results aggregate only locations authorized for the current user.
3. Affected locations remain discoverable beneath correction areas.
4. Fire Drills, Emergency Plans, Hot Water and Medication appear as correction-area groups when relevant, not as hardcoded assertions that every provider has deficiencies.
5. Deep links preserve provider/location/entity/finding context, without trusting client-supplied tenant scope.
6. Empty, loading, error and partial-data states are distinguishable.
7. Findings expose rule/knowledge version and evaluation time when applicable.
8. Accessibility includes keyboard navigation, focus management, semantic headings and screen-reader labels.

## 9. Universal Binder Management acceptance requirements

- Type-specific binder templates compose over one common lifecycle engine.
- Binder manifest includes tenant, binder type, effective/reporting period, owner, status, approval policy, version, evidence references and knowledge versions.
- All state transitions are authenticated, authorized, timestamped and audited.
- Source document access is checked on retrieval/export, not inferred from binder access.
- A released binder is immutable; corrections generate an explicitly linked revision or addendum.
- Financial binder assembles schedules, reconciliations, calculations, methodology versions and evidence without inventing rates or allowability.
- Survey binder assembles authorized regulatory evidence and findings without exposing unrelated PHI/PII.
- External access expires and can be revoked immediately, including previously issued access tokens as policy requires.
- Exports have deterministic manifest/hash verification and audit logs.

## 10. Source-level risks and questions

| Risk / question | Evidence | Impact | Next check |
|---|---|---|---|
| Binder service stub | Zero-byte `survey-binder.service.ts` | No demonstrated binder lifecycle | Confirm whether implementation lives elsewhere before Build decision |
| Survey scope is location-specific | `dashboard(locationId: string)` in survey service | May not meet provider-wide survey aggregation | Review controller contracts and UX navigation |
| Financial binder missing | No end-to-end implementation established | Cost-report release workflow blocked | Search all financial reporting and export services |
| Role menu vs server ACL | Frontend guards/menu present | UI checks cannot secure API | Permission-matrix and API authorization tests |
| Workbench semantic behavior | Angular component exists | Ordering, grouping and deep links unverified | Component + service + API integration tests |
| UX naming divergence | ENG-008 vs ENG-022 | Ambiguous ownership and acceptance | Canonical crosswalk approval |

## 11. Preliminary disposition hypotheses — not implementation decisions

| Surface | Hypothesis | Rationale |
|---|---|---|
| Existing web shell and navigation | **Reuse / Modify candidate** | Source exists; verify compatibility, auth and accessibility |
| Dashboard, module and entity workbenches | **Reuse / Modify candidate** | Multiple existing components and data services |
| Residential and ISS UX | **Reuse / Modify candidate** | Existing routes and shells |
| Universal Binder Management | **Build / Reuse decision deferred** | Stub and survey source are not sufficient evidence |
| Survey-specific UI and service | **Modify / Extend candidate** | Existing backend and executive card; workflow completeness unknown |
| Financial Binder and FKE-driven UX | **Build / Modify decision deferred** | Placeholder cost-report UI; no complete workflow established |

No Replace or Retire classification is justified from source presence alone. Final treatment decisions require design-contract review, executable verification and explicit work-package approval.

## 12. Contract and dependency checks

- `BM → SII`: binder uses shared document/evidence, audit, approval, authorization and historical execution services.
- `BM → CI/FI`: binder consumes governed findings, schedules and approved outputs; cannot recalculate regulated results.
- `UX → API/data-access`: no direct imports of NestJS entities/services into Angular UI.
- `UX → authorization`: backend tenant and resource checks remain mandatory.
- `RKE/FKE → BM`: knowledge references are immutable/versioned; binder cannot certify or edit knowledge.
- Contract owners, payloads, event IDs, retry policy and API versions require REC-001 registry reconciliation.

## 13. Test matrix

| Test ID | Verification | Status |
|---|---|---|
| BM-T01 | Binder creation and type validation | Not run |
| BM-T02 | Lifecycle transition guards and separation of duties | Not run |
| BM-T03 | Per-document ACL and cross-tenant denial | Not run |
| BM-T04 | Immutable released snapshot and version replay | Not run |
| BM-T05 | External reviewer MFA, expiry, revocation and audit | Not run |
| BM-T06 | Financial binder schedule and provenance assembly | Not run |
| UX-T01 | Provider-wide dashboard without location ID | Not run |
| UX-T02 | Correction-area grouping with affected locations | Not run |
| UX-T03 | Deep link and back-navigation with authorization | Not run |
| UX-T04 | Keyboard, focus and screen-reader accessibility | Not run |
| UX-T05 | Loading, empty, error and stale-data handling | Not run |
| UX-T06 | ISS and Residential route integrity | Not run |

## 14. Required verification sequence

1. Confirm canonical BM-01–09 and UX names/IDs from approved engineering catalog.
2. Inspect service implementations, controllers, DTOs, entities, migration files, imports and test coverage.
3. Generate Nx dependency graph and test allowed dependency boundaries.
4. Install dependencies in a suitable Node.js 20 environment, run affected lint/build/test tasks, capture exact commands and results.
5. Execute backend auth/tenant isolation tests with seeded test tenants.
6. Run provider-wide dashboard and module workbench integration tests.
7. Run binder lifecycle and historical-reproduction acceptance tests when implemented.
8. Obtain explicit approval for Reuse/Modify/Replace/Build decisions; do not modify repository as part of this assessment.

## 15. Evidence register

**Verified by archive inspection:** source paths listed in §§5–6; empty survey binder service; survey dashboard method signature; Angular shell, workbench and ISS route source presence.  
**Previously reported, not re-executed here:** blocked dependency installation in ENG-028; cost-report placeholder assessment in REC-002 §4.  
**Not verified:** runtime correctness, data isolation, external access, binder lifecycle, calculation integrity, performance, accessibility and production readiness.

## 16. Decision and sign-off worksheet

| Item | Decision owner | Decision status | Evidence needed |
|---|---|---|---|
| BM canonical mapping | Architecture owner | Pending | ENG-008/018/022 reconciliation |
| UX canonical mapping | Architecture owner | Pending | ENG-008 vs ENG-022 crosswalk |
| Binder service reuse/build | Engineering owner | Pending | Full repo search + tests |
| Survey access model | Security owner | Pending | Identity, ACL, expiration, revocation design |
| Provider dashboard acceptance | Product/engineering | Pending | Integration and authorization tests |
| Financial binder vertical slice | Financial knowledge owner | Pending | Certified FKE and FI contracts |

## 17. Section completion criteria

This section is a **completed static assessment draft**, not a completed implementation audit. REC-002 Section 7 may be closed only after mappings and contracts are reconciled, technical verification evidence is attached, treatment decisions are approved, and security/UX acceptance gates are defined. The repository remains unchanged.

## 18. Next step

**REC-002 — Section 8: Consolidated Component Mapping, Dependency Gap Register, and Proposed Reuse/Modify/Replace/Build Matrix.** Aggregate Sections 1–7 without converting provisional hypotheses into verified findings. Then seek approval of the consolidated remediation sequence.

**Implementation authorization: NOT GRANTED.**
