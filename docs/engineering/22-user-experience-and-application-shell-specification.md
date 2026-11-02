# ENG-022 — User Experience and Application Shell: Detailed Component Specifications

**Organization:** McCaskill Projects  
**Platform:** Regulatory Intelligence Platform  
**Document ID:** ENG-022  
**Version:** 1.0 — Draft  
**Classification:** Engineering Design Specification  
**Proposed repository path:** `docs/engineering/22-user-experience-and-application-shell-specification.md`  
**Design approach:** Architecture-first; repository-independent  
**Implementation authorization:** **Not Granted**

---

## 1. Executive Design Statement

The User Experience and Application Shell layer is the authorized interaction surface of the Regulatory Intelligence Platform. It connects people to Operational Domains, the two independent Knowledge Engines, Shared Intelligence, Applied Intelligence, and Platform Foundation through a coherent enterprise desktop-first experience.

**The UI displays and initiates authorized work; it does not become the source of truth for operational facts, regulatory obligations, financial methodologies, or governed decisions.** The backend owns enforcement and durable state. The UI may assist with data entry, preview, navigation, and explanation, but it cannot certify knowledge or override service-side decisions.

The design targets Angular 20 standalone components, NgRx for appropriate shared feature state, and a Fortune 100-quality visual language. These are target design choices, not claims about repository implementation.

## 2. Scope and Non-Goals

**In scope:** application shell, navigation, identity context, provider-wide command center, regulatory and financial workbenches, operational workspaces, knowledge administration, document/evidence interfaces, binder and survey experiences, notifications, accessibility, state management, API integration, and UI quality.

**Out of scope:** authoring new regulatory or financial authority inside the frontend; implementing backend evaluation logic; replacing source-domain persistence; determining actual regulatory compliance or financial allowability; deploying code; or claiming the existing repository satisfies this design.

## 3. Layer Ownership and Integration

| Layer | UI interaction | Authoritative responsibility |
|---|---|---|
| Platform Foundation | Sign-in, session, permissions, tenant context | Identity, security, authorization, tenancy |
| Operational Domains | Record creation, editing, history | Operational facts and workflow state |
| Regulatory Knowledge Engine | Source review, certification administration | Certified regulatory knowledge |
| Financial Knowledge Engine | Methodology review and publication | Approved financial knowledge |
| Shared Intelligence | Evidence, documents, approvals, audit, binder interfaces | Shared execution and governance infrastructure |
| Compliance Intelligence | Findings, CAP, reassessment, readiness | Compliance results and corrective workflow |
| Financial Intelligence | Classification, allocation, reconciliation, reports | Governed financial calculations and reports |
| UX | Presentation, user input, navigation, client-side state | No independent knowledge or business authority |

## 4. Application Shell Component Catalog

The following identifiers are **ENG-022 proposed UI component identifiers**, not assertions of exact ENG-008 service IDs. Reconcile with ENG-008 UX-01–05 before implementation.

| ID | Component | Responsibility |
|---|---|---|
| UX-01 | Application Shell and Layout | Global structure, responsive desktop layout, session framing |
| UX-02 | Navigation and Route Registry | Authorized routes, breadcrumbs, deep links |
| UX-03 | Identity, Tenant and Provider Context | Current actor and scoped context selection |
| UX-04 | Provider Intelligence Center | Provider-wide operational and intelligence overview |
| UX-05 | Regulatory Workbench | Regulatory knowledge, evaluation, and correction entry points |
| UX-06 | Financial Workbench | Financial processing, reconciliation, reporting readiness |
| UX-07 | Operational Workspaces | Organization, people, workforce, service, residential, ISS |
| UX-08 | Knowledge Administration | Separate RKE and FKE review, approval, publication interfaces |
| UX-09 | Evidence and Document Workspace | Protected upload, preview, versions, lineage |
| UX-10 | Binder Workspace | Financial and survey binder composition and release |
| UX-11 | Survey Workspace | Scoped survey event and external reviewer experience |
| UX-12 | Notifications and Task Center | Assigned work, deadlines, message center |
| UX-13 | Shared Interaction and Design System | Forms, tables, feedback, accessibility |
| UX-14 | Frontend State and Data Coordination | NgRx, server state, caching, concurrency |
| UX-15 | UI Observability and Quality | Client diagnostics, performance, tests |

## 5. UX-01 — Application Shell and Layout

**WHAT:** A consistent application frame containing global navigation, workspace title, contextual controls, notifications, session status, and a main content region.  
**WHEN:** All authenticated application routes.  
**WHERE:** Angular application root and shell feature.  
**WHY:** Reduce repeated UI infrastructure and make movement between workflows predictable.  
**HOW:** Use semantic landmarks, a collapsible primary navigation rail, workspace header, contextual breadcrumbs, accessible dialogs, persistent but non-authoritative context display, and an explicit loading/error boundary. On narrow screens, reorganize navigation without hiding critical actions. The shell must not assume a location is selected.  
**VERIFICATION:** Shell renders with provider-only context; keyboard navigation, screen-reader landmarks, responsive behavior, and error recovery pass acceptance tests.

## 6. UX-02 — Navigation and Route Registry

**WHAT:** Route metadata, lazy feature loading, deep links, and navigation authorization.  
**WHEN:** Every route entry and context change.  
**WHERE:** Angular router and authorized route registry.  
**WHY:** Deep links from dashboard findings must lead directly to the relevant correction workspace.  
**HOW:** Routes carry stable identifiers, page title, required capability, resource-scope requirements, and supported query parameters. Guards improve UX but never replace backend authorization. Unknown, unauthorized, expired, and deleted targets receive distinct states. Deep links must preserve `routeCommands` and `queryParams` metadata from approved compliance results without executing arbitrary commands.  
**VERIFICATION:** Test valid/invalid deep links, direct refresh, denied access, context changes, and stale resources.

## 7. UX-03 — Identity, Tenant and Provider Context

**WHAT:** Visible actor, tenant, provider, optional location, and current authorized scope.  
**WHEN:** On sign-in, tenant/provider switch, route transition, and access revocation.  
**WHERE:** Shell context service and authorized state.  
**WHY:** Prevent accidental cross-provider actions and confusing implicit scope.  
**HOW:** Resolve selectable contexts from Platform Foundation; invalidate context-sensitive client caches when the selection changes; revalidate resource permissions at the API boundary; distinguish provider-wide pages from location-scoped pages. Never derive access from the mere presence of an identifier in the URL.  
**VERIFICATION:** Tenant isolation, provider switch, revoked session, location-optional navigation, and cross-context cache tests.

## 8. UX-04 — Provider Intelligence Center

**WHAT:** The provider-wide command center for compliance, finance, operational readiness, and assigned work.  
**WHEN:** Provider leadership or authorized staff open the dashboard.  
**WHERE:** Provider Intelligence Center feature.  
**WHY:** A provider needs one operational overview without selecting an individual location.  
**HOW:** The provider dashboard requires `providerId` but **must not require `locationId`**. It aggregates authorized domain results, shows freshness and provenance, separates compliance findings from financial readiness, and links to owning workbenches. Metrics must distinguish actual results from estimates, pending checks, missing data, and execution failures. Cards are navigational summaries, not new authorities.  
**VERIFICATION:** Provider-wide loading without location, multi-location aggregation, stale indicators, partial data failure, and authorized drill-down.

## 9. UX-05 — Regulatory Workbench

**WHAT:** Navigation from regulatory knowledge to evaluations, findings, and remediation.  
**WHEN:** Compliance review, correction, and reassessment.  
**WHERE:** Regulatory Workbench and Compliance Intelligence views.  
**WHY:** Users need an actionable path from a requirement to the affected operational record.  
**HOW:** Present requirement source/version, applicability, evidence, evaluation status, finding severity, assigned owner, CAP, due dates, and recheck history. Only certified RKE definitions may be presented as governing requirements. Keep knowledge authoring and provider correction as distinct permissions and workflows.  
**VERIFICATION:** Certified version display, correction deep links, finding lifecycle, unauthorized edits, and historical reassessment.

## 10. Residential Correction-Area Workbench

**WHAT:** A correction-first Residential experience.  
**WHEN:** Users review residential compliance issues across locations.  
**WHERE:** Regulatory Workbench / Residential module.  
**WHY:** Users should see the type of correction first, then the affected locations.  
**HOW:** Group initial sections as **Fire Drills, Emergency Plans, Hot Water, Medication**. Within each, show affected locations, counts, status, evidence, owner, due date, and direct links to source records and findings. Do not create separate top-level dashboards that force location selection before users can identify the problem. Allow filters by location without making them mandatory.  
**VERIFICATION:** Multi-location grouping, correct source deep links, provider-wide entry, and no frontend rule evaluation.

## 11. UX-06 — Financial Workbench

**WHAT:** Financial source readiness, classification, allocations, calculations, reconciliation, report instances, and approvals.  
**WHEN:** During governed financial reporting cycles.  
**WHERE:** Financial Workbench feature.  
**WHY:** Users must distinguish raw source transactions from methodology-dependent financial outputs.  
**HOW:** Show reporting period, approved FKE version, source completeness, classification exceptions, allocation inputs, formula lineage, reconciliations, approval stage, and generated report instances. Use decimal-safe display; do not recompute official values in client-side floating point. An execution failure must never appear as zero or an allowed cost.  
**VERIFICATION:** Source-to-calculation lineage, version pinning, error presentation, rounding display, and segregation of duties.

## 12. UX-07 — Operational Workspaces

**WHAT:** Authorized interfaces for OP-01–OP-12.  
**WHEN:** Daily organization, workforce, service, and program operations.  
**WHERE:** Domain-specific feature workspaces.  
**WHY:** Operational facts require accurate, auditable capture independently of intelligence outcomes.  
**HOW:** Provide record lists, search, typed forms, status timelines, document linkage, source history, optimistic concurrency, and correction flows. Reuse interaction primitives while preserving domain-specific ownership and validation. Distinguish saved operational facts from regulatory compliance and financial reporting results.  
**VERIFICATION:** Domain API contract tests, concurrency conflicts, accessible forms, history, and permission scope.

## 13. ISS Operations Workspace

**WHAT:** Individual goals, objective templates, activity schedules, participation, and progress documentation.  
**WHEN:** Planning and recording individualized skills and socialization services.  
**WHERE:** ISS Operations feature.  
**WHY:** Activities must be individualized and measurable rather than generic attendance-only records.  
**HOW:** Support nine configurable skill domains, an initial 72-template objective library, baseline and target measures, Guided/Supported/Independent progression, weekly adventure plans, session documentation, community participation, and individual-plan/PDP linkage. A six-hour conceptual schedule is a planning tool and must **not** automatically imply six billable hours. LevelUp Adventures is a customer-facing organization, not the universal engine identity.  
**VERIFICATION:** Individual goal traceability, template versioning, progress history, accessibility, and separation from billability determination.

## 14. UX-08 — Knowledge Administration

**WHAT:** Separate administration workspaces for RKE and FKE.  
**WHEN:** Knowledge source intake, authoring, validation, review, approval/certification, publication, and change impact.  
**WHERE:** Restricted Knowledge Administration feature.  
**WHY:** Knowledge governance must be explicit, attributable, and independent for the two authorities.  
**HOW:** Separate navigation, roles, state machines, validation reports, source provenance, approval chains, and publication controls. UI actions call owning knowledge services. AI suggestions are visually marked as suggestions until reviewed and approved. Prevent stale-version approvals and self-approval where prohibited.  
**VERIFICATION:** Authority separation, version conflicts, permission tests, source lineage, and publication state enforcement.

## 15. UX-09 — Evidence and Document Workspace

**WHAT:** Document upload, preview, evidence linking, version history, and provenance.  
**WHEN:** Any authorized workflow requires documents or supporting evidence.  
**WHERE:** Shared Intelligence-facing UI.  
**WHY:** Documents should be reusable while source access remains protected.  
**HOW:** Support validated uploads, protected previews, large-file streaming, immutable versions, document classification, evidence association, and access history. A binder link or finding link is not itself authorization to retrieve the underlying document. Do not expose raw storage credentials or unrestricted object URLs.  
**VERIFICATION:** Unauthorized download denial, expired links, version history, large-file handling, and source access checks.

## 16. UX-10 — Binder Workspace

**WHAT:** Universal binder creation, assembly, completeness, review, approval, release, closure, and archive.  
**WHEN:** Financial reporting and survey preparation.  
**WHERE:** Shared Binder Management UI with type-specific extensions.  
**WHY:** Financial and survey binders should share lifecycle infrastructure.  
**HOW:** Support Financial, Provider Survey, Residential Survey, ISS Survey, and Personnel Survey binder types. Display binder definition version, sections, required items, completeness, review history, released snapshot, and legal-hold status. Use lifecycle **Draft → Assembling → Under Review → Approved → Released → Closed → Archived**. Changes requested return to assembly; released content remains versioned/frozen.  
**VERIFICATION:** Completeness blocking, approval-before-release, immutable release snapshots, and source authorization.

## 17. UX-11 — Survey Workspace

**WHAT:** Survey-event preparation, requests, controlled external access, and response tracking.  
**WHEN:** Authorized survey preparation and external review.  
**WHERE:** Survey Workspace and restricted external portal.  
**WHY:** Surveyors need controlled access without gaining provider-wide system privileges.  
**HOW:** Each external reviewer has an individual identity, MFA, time-bound grants, and explicit event/provider/location/person/document scope. Provide requests, responses, protected viewing and streaming, review status, audit history, and immediate revocation. A surveyor must not see a resource merely because it appears in the binder index.  
**VERIFICATION:** Expiration, revocation, cross-event denial, document streaming, and auditable views/downloads.

## 18. UX-12 — Notifications, Tasks, and Message Center

**WHAT:** Central inbox for workflow work items and events.  
**WHEN:** Knowledge review, findings, CAP deadlines, financial exceptions, binder review, and survey requests.  
**WHERE:** Global Message Center and workspace-specific task panels.  
**WHY:** Users need a reliable way to discover and act on assigned work.  
**HOW:** Group notifications by domain, priority, due date, and status. Each message links to an authorized resource and displays relevant context. Notification presence does not grant resource access. Distinguish unread notifications from incomplete tasks and domain findings.  
**VERIFICATION:** Authorized links, revoked permissions, duplicate events, task state, and unread-count consistency.

## 19. UX-13 — Enterprise Design System

**WHAT:** Reusable visual and interaction primitives.  
**WHEN:** Every feature implementation.  
**WHERE:** Shared UI component library.  
**WHY:** A clean enterprise experience requires consistency without flattening domain meaning.  
**HOW:** Establish typography, spacing, navigation, tables, forms, dialogs, drawers, badges, validation summaries, status patterns, loading states, and responsive behavior. Use restrained color and strong information hierarchy. Define semantic status tokens, not arbitrary feature colors. Support WCAG 2.2 AA as the design target.  
**VERIFICATION:** Component tests, keyboard use, screen-reader labels, contrast, zoom, and responsive layouts.

## 20. Accessibility and Inclusive Interaction

All critical tasks must be keyboard-operable. Form controls require visible labels and actionable errors. Tables need headers and accessible sorting. Modal focus must be trapped and restored correctly. Dynamic results must announce status appropriately. Color cannot be the only status indicator. Avoid hover-only controls. Support reduced motion, text scaling, and clear language in critical financial and regulatory decisions.

**Acceptance:** Automated accessibility checks plus manual keyboard and assistive-technology testing on priority workflows.

## 21. UX-14 — Frontend State Architecture

**WHAT:** Predictable state ownership and synchronization.  
**WHEN:** Across shell and feature workflows.  
**WHERE:** Angular, NgRx, feature stores, local component state, and API adapters.  
**WHY:** State must remain consistent without making the browser authoritative.  
**HOW:** Keep authentication/session context in secure session infrastructure; maintain shared application context and cross-page workflows in appropriate NgRx stores; use local state for ephemeral UI; treat backend resources as server-owned state. Do not cache sensitive data across tenant changes. Preserve request status, freshness, errors, and concurrency revision tokens.  
**VERIFICATION:** Tenant-switch invalidation, stale-response suppression, conflict resolution, route refresh, and logout cleanup.

## 22. Suggested Frontend State Shapes

```typescript
interface ProviderContextState {
  tenantId: string | null;
  providerId: string | null;
  locationId: string | null; // optional for provider-wide work
  loading: boolean;
  error: string | null;
}

interface AsyncResourceState<T> {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  revision?: string;
  loadedAt?: string;
  errorCode?: string;
}

interface WorkspaceNavigationTarget {
  routeCommands: string[];
  queryParams?: Record<string, string>;
  resourceType: string;
  resourceId: string;
}
```

These are conceptual contracts. Actual types and paths must be approved during implementation design.

## 23. API Integration and Error Semantics

UI features consume typed API clients, not direct database access. Every request carries correlation context; authorization is verified server-side. Standardize treatment of 401 (session), 403 (permission), 404 (missing or concealed resource), 409 (conflict), 422 (validation), 429 (rate limit), and 5xx (service failure). Do not silently retry non-idempotent writes. Display partial and stale data distinctly from authoritative current results.

## 24. Loading, Empty, Stale, and Failure States

Every workspace must distinguish: initial loading, no records, no access, unavailable service, incomplete evaluation, stale result, and successful zero-result. For example, “No findings” must not be displayed when the compliance evaluation has not completed. Financial zero values must not substitute for missing calculation results.

## 25. Search, Filtering, and Provider-Wide Aggregation

Search APIs must enforce authorization before returning results. Provider-wide lists support optional location filters, pagination, sort, and saved view preferences where authorized. Filters must not create hidden cross-tenant data exposure through counts or suggestions. Aggregations must identify source timestamps and partial failures.

## 26. Deep Links and Remediation Navigation

A compliance result may carry `routeCommands` and `queryParams` to the owning operational correction page. The UI must validate route metadata against an approved registry, resolve authorization, preserve provider context, and provide a fallback if the record has moved or been archived. The navigation mechanism must not evaluate the rule or mark a finding resolved on its own.

## 27. Review and Approval Interaction Pattern

Approval screens show the subject version, reviewer identity, policy stage, required evidence, prior decisions, and consequences of approval. Approval buttons are enabled only for currently authorized actions, but the server independently enforces all restrictions. On version conflict, the UI must require re-review. Approval is not inferred from closing a dialog or marking a task complete.

## 28. Document, Report, and Binder Export Pattern

Exports are generated or authorized by owning services. The UI displays source/version metadata, render status, output format, digest where useful, and access expiry. Official reports must not be reconstructed from arbitrary client-side table exports. Binder exports must correspond to a frozen release snapshot when represented as released binders.

## 29. AI-Assisted User Experience

AI may explain findings, suggest evidence, help draft narratives, and summarize authorized records. Every generated suggestion must be labeled as assistance and must cite its underlying approved knowledge or source records when relevant. AI cannot certify knowledge, approve reports, release binders, modify source records without authorized workflow, or replace domain decisions. Sensitive data access remains subject to the same authorization rules.

## 30. User Roles and Workspace Visibility

Examples include provider executive, compliance manager, residential staff, ISS staff, financial analyst, financial approver, regulatory knowledge reviewer, financial knowledge reviewer, system administrator, and scoped external surveyor. Roles are illustrative; ENG-010 owns the authoritative permission matrix. Navigation visibility is a usability feature, never the enforcement boundary.

## 31. UI Event and Audit Responsibilities

The frontend emits authorized commands and may capture non-sensitive diagnostic events. Backend services own authoritative audit records for approvals, record mutations, evidence access, report generation, and binder release. UI analytics must not include unnecessary personal, clinical, payroll, or financial detail. Correlation identifiers link user actions to service traces.

## 32. Security and Privacy

Require secure session handling, CSRF protection where applicable, content security policy, XSS-safe rendering, controlled file previews, strict tenant context, no secret tokens in URLs, and immediate session invalidation on logout. Sensitive client caches should be minimal and cleared on context changes. External surveyor sessions require stronger scope and expiry handling. All access is revalidated at service boundaries.

## 33. Performance and Responsiveness

Design for lazy-loaded feature routes, bounded data tables, virtualized long lists where needed, efficient state selectors, accessible skeleton states, and cancelable read requests. Establish measurable budgets for route startup, provider dashboard load, filtering, document preview, and large binder navigation before implementation. Never optimize by bypassing authorization or data provenance.

## 34. UI Observability

Collect route performance, API latency correlation, client error rates, failed deep links, accessibility regressions, and critical workflow completion metrics. Exclude sensitive record contents from telemetry. Errors should be attributable to application release and correlation IDs without exposing confidential data.

## 35. Testing Matrix

| Test ID | Area | Required verification |
|---|---|---|
| T-UX-01 | Shell | Provider-wide and responsive layout |
| T-UX-02 | Routing | Direct, stale, unauthorized deep links |
| T-UX-03 | Context | Tenant/provider switching and cache isolation |
| T-UX-04 | Dashboard | No required `locationId`; partial data states |
| T-UX-05 | Regulatory | Certified knowledge and remediation navigation |
| T-UX-06 | Residential | Correction-area-first grouping |
| T-UX-07 | Financial | Methodology version, lineage, decimal display |
| T-UX-08 | Operational | Record CRUD, history, concurrency |
| T-UX-09 | ISS | Goals, activities, support progression |
| T-UX-10 | Knowledge Admin | Separate RKE/FKE governance |
| T-UX-11 | Documents | Access, preview, versions, revocation |
| T-UX-12 | Binders | Completeness, approval, frozen release |
| T-UX-13 | Survey | Scoped external access and expiry |
| T-UX-14 | Notifications | Authorized action links |
| T-UX-15 | Accessibility | WCAG 2.2 AA target, keyboard and assistive technology |
| T-UX-16 | State | Stale responses, invalidation, optimistic conflicts |
| T-UX-17 | Security | Tenant isolation, XSS, sensitive cache |
| T-UX-18 | Resilience | Partial failures, retries, offline/error states |
| T-UX-19 | Performance | Approved load and interaction budgets |
| T-UX-20 | E2E | Emergency Preparedness and HCS Cost Reporting slices |

## 36. End-to-End Regulatory Vertical Slice

**Texas HCS Emergency Preparedness** is the first regulatory vertical slice. The UI journey is: authorized provider context → residential/emergency plan source record → certified RKE requirement and applicability → Compliance Intelligence evaluation → Shared Validation execution → finding and evidence → CAP → recheck → readiness view → authorized Survey Binder inclusion. Every displayed regulatory claim must trace to a certified knowledge version. Actual Texas source requirements require official verification before certification.

## 37. End-to-End Financial Vertical Slice

**Texas HCS Cost Reporting** is the first financial vertical slice. The UI journey is: reporting period → payroll/transactions/service statistics → approved FKE methodology → Financial Intelligence classification, allocation, and calculation → reconciliation → report instance → independent approval → Financial Binder assembly and release. The UI must preserve source, methodology, formula, and output lineage. Official rates, classifications, and schedules must be verified against authoritative sources before approval.

## 38. Implementation Dependencies and Order

1. Foundation identity, tenancy, authorization, and API contracts.
2. Design system and application shell.
3. Provider context and route registry.
4. Shared data/state patterns and typed API clients.
5. Operational workspaces and document integration.
6. Provider Intelligence Center and Regulatory Workbench.
7. Financial Workbench and knowledge administration.
8. Binder and Survey Workspaces.
9. Notification/task integration, observability, and end-to-end acceptance.

This is a dependency sequence, not authorization to implement or a replacement for ENG-015 sprint planning.

## 39. Acceptance Criteria

- [ ] Application shell works with provider context and no location selected.
- [ ] All routes enforce backend resource authorization.
- [ ] Provider dashboard aggregates authorized provider-wide results.
- [ ] Residential issues appear by correction area before affected locations.
- [ ] Financial values are clearly separated from raw source facts.
- [ ] RKE and FKE administration retain independent approval chains.
- [ ] Evidence and document access are independently protected.
- [ ] Binder release requires approval and preserves a frozen snapshot.
- [ ] Surveyor access is individually authenticated, scoped, expiring, and revocable.
- [ ] ISS goals, objectives, activities, and progress remain individualized.
- [ ] UI state respects tenant changes and server-side revisions.
- [ ] Missing, stale, failed, and successful-zero states are distinct.
- [ ] Accessibility and keyboard acceptance tests pass.
- [ ] Sensitive data is excluded from inappropriate telemetry and caches.
- [ ] Emergency Preparedness and HCS Cost Reporting journeys pass end-to-end tests.
- [ ] All API, event, permission, and component identifiers are reconciled with prior ENG specifications.

## 40. Cross-Document Reconciliation

This specification builds on ENG-001 through ENG-021. Before implementation, reconcile its proposed UX-01–15 catalog with **ENG-008 UX-01–05**, the workspace architecture in **ENG-011**, frontend state ownership in **ENG-007**, API and events in **ENG-009**, authorization in **ENG-010**, tests in **ENG-013**, and dependencies in **ENG-015**. Align exact domain contracts with **ENG-016 through ENG-021**. The 0–47 roadmap contains **48 numbered sprint slots**; do not describe it as 47 sprints without correcting that discrepancy.

## 41. Implementation Authorization

**Status: Not Granted.** This is an independent target-state engineering specification. It does not authorize changes to Angular code, Nx libraries, APIs, database schemas, permissions, deployment configuration, or existing repository files. Approval of design must precede a separate repository-state assessment and implementation authorization.

## 42. Final Engineering Position

The application shell provides a unified enterprise experience while preserving strict domain authority:

**Operational facts → Approved regulatory or financial knowledge → Shared execution → Applied Intelligence results → Authorized workspaces, approvals, reports, and binders.**

The frontend makes the platform understandable and actionable. It never replaces the authority of the services and knowledge systems behind it.

**End of ENG-022 — User Experience and Application Shell: Detailed Component Specifications**
