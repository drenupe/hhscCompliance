# ENG-007 — Frontend State Management Architecture

**Document ID:** ENG-007  
**Version:** 1.0  
**Status:** Engineering Blueprint — Draft  
**Platform:** Regulatory Intelligence Platform  
**Organization:** McCaskill Projects  
**Document Location:** `docs/engineering/07-state-management-architecture.md`  
**Implementation Authorization:** Not Granted

---

# 1. Purpose and Scope

## 1.1 WHAT

This document defines how frontend application state is owned, structured, updated, synchronized, secured, tested, and maintained throughout the Regulatory Intelligence Platform.

The established frontend technologies are:

- Angular 20 with standalone components.
- NgRx for application state management.
- Nx for project boundaries and dependency enforcement.
- NestJS APIs as the backend application interface.
- PostgreSQL as persistent business data storage.

The architecture covers global state, feature state, local component state, server-owned data, asynchronous requests, caching, security, concurrency, workflow state, and cross-domain presentation.

## 1.2 WHEN

These standards apply whenever frontend development requires:

- Shared information between components.
- A coordinated multistep workflow.
- Data retrieval or mutation.
- Authentication or authorization context.
- Tenant switching.
- Background refresh or synchronization.
- A long-running business operation.
- Display of regulatory or financial results.
- Management of document or binder interactions.

## 1.3 WHERE

Frontend state belongs in approved Angular and NgRx libraries within the existing Nx workspace.

Business records and authoritative determinations remain in the owning backend domains and knowledge engines.

## 1.4 WHY

Without defined state ownership, frontend development can produce duplicated stores, stale information, inconsistent screens, authorization leaks, and conflicting representations of business records.

A unified state architecture provides predictable behavior while preserving domain ownership.

## 1.5 HOW

State must be categorized, assigned to an owner, managed through appropriate Angular and NgRx mechanisms, and synchronized with approved backend contracts.

## 1.6 VERIFICATION

Every stateful feature must demonstrate:

- Defined state ownership.
- Predictable transitions.
- Correct loading and failure handling.
- Correct authorization context.
- Safe tenant isolation.
- Appropriate freshness and invalidation.
- No independent frontend business authority.

---

# 2. Fundamental State Ownership Principle

## 2.1 WHAT

Frontend state represents information needed to display and operate the user interface.

It does not establish the authoritative truth of business records, regulatory requirements, financial methodologies, or compliance determinations.

## 2.2 WHEN

This principle applies whenever data is loaded, edited, cached, displayed, or submitted.

## 2.3 WHERE

| Information | Authoritative owner | Frontend responsibility |
|---|---|---|
| Regulatory requirements | Regulatory Knowledge Engine | Display approved knowledge |
| Financial methodologies | Financial Knowledge Engine | Display methodology and results |
| Operational records | Owning operational domain | Present and edit through APIs |
| Compliance determinations | Compliance Intelligence backend | Display recorded results |
| Financial calculations | Financial Intelligence backend | Display calculated results |
| Identity and permissions | Existing security foundation | Represent authorized session context |
| Binder records | Binder Management and owning domains | Present binder organization and status |
| Survey access | Backend authorization and Survey Workspace | Present authorized survey workflows |
| User interface preferences | Frontend or approved preference service | Manage presentation choices |

## 2.4 WHY

This prevents the frontend from becoming an uncontrolled second authority.

## 2.5 HOW

All authoritative mutations must go through approved backend APIs.

Frontend selectors may format and compose information, but must not independently establish compliance, financial allowability, regulatory applicability, or certification.

## 2.6 VERIFICATION

Tests must demonstrate that displayed authoritative results originate from approved backend contracts and that frontend state cannot bypass required workflows.

---

# 3. State Classification

## 3.1 WHAT

The platform recognizes four principal state categories.

| Category | Description | Examples |
|---|---|---|
| Global platform state | Shared application context | Session status, selected tenant, user preferences |
| Domain feature state | State owned by one frontend feature | Residential records view, Financial Workbench filters |
| Local component state | Short-lived presentation behavior | Open dialog, selected tab, unsaved field focus |
| Server-owned data representation | Frontend copy of backend information | Consumer records, findings, binder status |

Server-owned data may be represented within domain feature state; these categories describe responsibility rather than four mandatory separate storage systems.

## 3.2 WHEN

Classify state before implementing a new feature.

## 3.3 WHERE

- Global state belongs to approved platform-level frontend state ownership.
- Feature state belongs to its owning feature library.
- Local state belongs to the component or a narrowly scoped presentation helper.
- Server-owned data remains authoritative in the backend and is represented only where required by the frontend.

## 3.4 WHY

Classification prevents unnecessary global state, duplicate caching, and uncontrolled cross-feature dependencies.

## 3.5 HOW

Choose the narrowest state scope that meets the actual sharing and lifecycle requirements.

Do not place all application data in one global store simply because NgRx is available.

## 3.6 VERIFICATION

A state inventory must identify each state collection, its owner, lifecycle, and consumers.

---

# 4. NgRx Architecture and Responsibilities

## 4.1 WHAT

NgRx provides predictable state transitions and coordinated asynchronous application behavior.

The primary architectural concepts are:

- Actions.
- Reducers.
- Selectors.
- Effects.
- Feature state.
- Entity collections where appropriate.

## 4.2 WHEN

NgRx is appropriate when state must be coordinated across multiple components, routes, or asynchronous workflows.

Simple presentation state should remain local when shared state management adds no value.

## 4.3 WHERE

NgRx feature state belongs within the Nx library owned by the corresponding frontend capability.

Platform-wide state belongs in approved platform frontend state projects.

## 4.4 WHY

Explicit state transitions make application behavior easier to understand, test, and maintain.

## 4.5 HOW

### Actions

Actions describe meaningful events or intentions.

Examples:

- `Financial Report Opened`
- `Financial Report Load Requested`
- `Financial Report Load Succeeded`
- `Financial Report Load Failed`
- `Binder Release Requested`
- `Binder Release Succeeded`
- `Binder Release Failed`

Actions must not imply that a backend operation succeeded before confirmation.

### Reducers

Reducers synchronously calculate the next frontend state from the current state and an action.

Reducers must be pure and must not call APIs or perform external side effects.

### Selectors

Selectors provide controlled read access to state.

They may:

- Select records.
- Compose presentation models.
- Calculate display-only totals.
- Derive loading or error status.
- Produce filtered views.

They must not independently determine authoritative compliance or financial results.

### Effects

Effects coordinate asynchronous activity such as:

- API requests.
- Approved refresh operations.
- Navigation-related loading.
- Mutation requests.
- Error handling.
- Cache invalidation.

Effects must respect the owning feature and domain contracts.

### Entity collections

NgRx entity utilities may be used for collections requiring normalized lookup, selection, and updates.

Entity normalization is a frontend representation strategy, not a replacement for backend persistence.

## 4.6 VERIFICATION

Tests must cover action behavior, reducer transitions, selectors, effect success and failure paths, and domain boundary compliance.

---

# 5. Global Platform State

## 5.1 WHAT

Global state represents information required by multiple frontend workspaces.

Examples include:

- Session status.
- Current user display context.
- Active tenant or organization.
- Authorized application scope.
- Global navigation context.
- Approved user preferences.

## 5.2 WHEN

Global state is initialized during application startup and updated when session, tenant, or application context changes.

## 5.3 WHERE

It belongs in platform-owned frontend state libraries.

## 5.4 WHY

A single owner prevents different features from maintaining conflicting session or tenant contexts.

## 5.5 HOW

Global state must contain only information that genuinely requires application-wide sharing.

It must not accumulate unrelated feature records.

Sensitive authentication material must follow the existing security implementation rather than being copied into general-purpose frontend state.

## 5.6 VERIFICATION

Tests must confirm consistent global context across workspaces and correct reset behavior on logout, session expiration, and tenant changes.

---

# 6. Domain Feature State

## 6.1 WHAT

Domain feature state represents information needed by a particular frontend business capability.

Examples include:

- Regulatory Knowledge Administration.
- Financial Knowledge Administration.
- Residential Operations.
- ISS Operations.
- Compliance Workbench.
- Financial Workbench.
- Survey Workspace.
- Financial Binder.
- Survey Binder.

## 6.2 WHEN

Feature state is created when a business capability requires shared or coordinated frontend state.

## 6.3 WHERE

It belongs in the feature's approved Nx state or data-access library.

## 6.4 WHY

Feature ownership prevents one domain from directly manipulating another domain's application state.

## 6.5 HOW

Each feature must define:

1. Its state owner.
2. Its state shape.
3. Its actions.
4. Its reducers.
5. Its selectors.
6. Its effects.
7. Its backend API contracts.
8. Its loading and error states.
9. Its cache lifecycle.
10. Its reset and cleanup behavior.

Features must not directly dispatch private implementation actions belonging to unrelated domains.

Cross-feature coordination must use approved public application contracts or backend orchestration.

## 6.6 VERIFICATION

Nx dependency checks and state tests must demonstrate that feature boundaries remain intact.

---

# 7. Local Component and Form State

## 7.1 WHAT

Local state represents short-lived interface behavior.

Examples include:

- Dialog visibility.
- Selected tab.
- Temporary search input.
- Expanded section.
- Form focus.
- Local unsaved form values.

## 7.2 WHEN

Use local state when information is needed only by a component or a small component hierarchy.

## 7.3 WHERE

It belongs in the relevant Angular component or a narrowly scoped presentation helper.

## 7.4 WHY

Not every interface interaction requires a global action and reducer.

Keeping short-lived state local reduces complexity.

## 7.5 HOW

Use Angular component state and forms for local presentation concerns.

Promote state to a shared feature owner only when there is a demonstrated requirement for coordinated access or lifecycle management.

Unsaved forms must be clearly distinguished from backend-persisted records.

## 7.6 VERIFICATION

Local interactions must behave correctly without creating unnecessary global dependencies.

---

# 8. API Data and Server-State Synchronization

## 8.1 WHAT

Server-state synchronization controls how frontend representations of backend records are loaded, refreshed, updated, and invalidated.

## 8.2 WHEN

It is required whenever a feature displays or changes server-owned information.

## 8.3 WHERE

API access belongs in the appropriate frontend data-access layer.

The owning backend domain remains authoritative.

## 8.4 WHY

The same business record may be updated by other users, services, integrations, or knowledge executions.

A cached frontend representation can become stale.

## 8.5 HOW

A standard retrieval flow is:

1. User opens a feature.
2. Feature requests the required data.
3. State records loading status.
4. An effect or approved data-access mechanism calls the backend.
5. The backend validates authorization and returns data.
6. The frontend stores the response.
7. Selectors expose the result to components.
8. The feature invalidates or refreshes the representation when required.

A standard mutation flow is:

1. User requests a change.
2. Frontend validates the input structure.
3. The backend receives the mutation request.
4. The backend validates authorization and business requirements.
5. The owning domain commits or rejects the operation.
6. The frontend processes the authoritative response.
7. Related cached representations are updated or invalidated.

## 8.6 VERIFICATION

Integration tests must confirm correct synchronization, failure handling, stale-response protection, and authoritative backend behavior.

---

# 9. Cache Management and Freshness

## 9.1 WHAT

Caching reduces unnecessary requests while maintaining appropriate data freshness.

## 9.2 WHEN

Caching is considered when information is repeatedly requested or shared across views.

## 9.3 WHERE

Caches belong to the owning feature's frontend data-access or state layer.

## 9.4 WHY

Caching improves performance but can produce incorrect decisions if stale information is presented as current.

## 9.5 HOW

Each cached collection must define:

- Cache owner.
- Cache key.
- Tenant and scope context.
- Source API.
- Refresh conditions.
- Invalidation triggers.
- Maximum acceptable staleness, where applicable.
- Cleanup behavior.

Caches must be invalidated or revalidated when relevant:

- Records change.
- Tenant context changes.
- Permissions change.
- Knowledge versions change.
- Methodologies change.
- Workflow status changes.
- A user requests refresh.

Time-based expiration alone is not sufficient for every business workflow.

The interface should communicate when displayed information may be stale.

## 9.6 VERIFICATION

Tests must demonstrate that stale information is not incorrectly treated as an authoritative current determination.

---

# 10. Authentication and Authorization State

## 10.1 WHAT

Authentication and authorization state represents the frontend's current session and permitted application context.

## 10.2 WHEN

It is used during application initialization, navigation, protected operations, session changes, and logout.

## 10.3 WHERE

It belongs to the existing platform security integration and approved global frontend state.

## 10.4 WHY

Features require consistent session information, but frontend permission checks cannot replace backend authorization.

## 10.5 HOW

Preserve the existing authentication and authorization implementation.

Do not create a duplicate security system.

Frontend state may represent:

- Whether the session is authenticated.
- Current user display information.
- Active tenant.
- Available navigation permissions.
- Session expiration or reauthentication status.

Authentication secrets must not be placed in ordinary NgRx state.

All protected backend operations must independently enforce authorization.

Permission changes must trigger appropriate state invalidation and view updates.

## 10.6 VERIFICATION

Test session expiration, logout, revoked permissions, unauthorized requests, and protected navigation.

---

# 11. Tenant Switching and State Isolation

## 11.1 WHAT

Tenant switching changes the organization or tenant context in which the user is operating.

## 11.2 WHEN

It occurs when an authorized user selects another tenant or organization context.

## 11.3 WHERE

The selected context is managed through platform-owned frontend state.

Tenant authorization remains enforced by the backend.

## 11.4 WHY

Information from one tenant must never appear in another tenant's workspace because of retained frontend state.

## 11.5 HOW

When tenant context changes:

1. Validate the new context through the approved security workflow.
2. Invalidate tenant-scoped feature state.
3. Cancel or disregard in-flight requests from the previous context.
4. Clear tenant-specific selections and cached data.
5. Reinitialize authorized feature state.
6. Load information for the new tenant.
7. Preserve only explicitly approved tenant-independent preferences.

Responses must be associated with their initiating tenant and request context so delayed responses cannot populate the wrong workspace.

## 11.6 VERIFICATION

Cross-tenant frontend tests must demonstrate that cached records, selections, responses, and protected information do not leak between contexts.

---

# 12. Regulatory Knowledge State

## 12.1 WHAT

Regulatory Knowledge state represents knowledge records, versions, review status, publication status, and related administration information in the frontend.

## 12.2 WHEN

It is used when authorized users inspect, review, approve, publish, or manage regulatory knowledge.

## 12.3 WHERE

It belongs to the Regulatory Knowledge frontend capability.

The Regulatory Knowledge Engine remains authoritative.

## 12.4 WHY

Knowledge administration requires coordinated state, but frontend state must not independently determine whether a requirement is certified or applicable.

## 12.5 HOW

State should represent backend-provided:

- Knowledge pack identity.
- Version.
- Lifecycle status.
- Requirement references.
- Review status.
- Approval status.
- Publication status.
- Validation results.

Approval and publication transitions must be confirmed by the backend.

## 12.6 VERIFICATION

Tests must confirm that knowledge lifecycle transitions cannot be completed through frontend-only state changes.

---

# 13. Financial Knowledge State

## 13.1 WHAT

Financial Knowledge state represents financial definitions, methodologies, versions, review status, and approval status in the frontend.

## 13.2 WHEN

It is used when authorized users administer or inspect financial knowledge.

## 13.3 WHERE

It belongs to the Financial Knowledge frontend capability.

The Financial Knowledge Engine remains authoritative.

## 13.4 WHY

Financial methodology changes can affect calculations and reporting, so the frontend must preserve clear version and approval context.

## 13.5 HOW

State should represent backend-provided:

- Financial definition identity.
- Methodology identity.
- Version.
- Effective period.
- Approval status.
- Publication status.
- Source references.
- Validation results.

The frontend must not independently approve methodologies or calculate authoritative financial results.

## 13.6 VERIFICATION

Tests must confirm that financial knowledge status and authoritative calculations are backend-controlled.

---

# 14. Compliance Intelligence State

## 14.1 WHAT

Compliance Intelligence state represents evaluations, findings, corrective actions, evidence relationships, and reassessment status.

## 14.2 WHEN

It is used when users review compliance status or perform authorized remediation workflows.

## 14.3 WHERE

It belongs to the Compliance Intelligence frontend feature.

Authoritative evaluation and workflow results remain in the backend.

## 14.4 WHY

Compliance results must be traceable to approved regulatory knowledge and operational facts.

## 14.5 HOW

The frontend may represent:

- Evaluation status.
- Requirement reference.
- Knowledge version.
- Finding identity.
- Severity.
- Evidence relationships.
- Corrective action status.
- Reassessment history.

Selectors may group and filter findings for presentation.

They must not independently establish compliance status.

## 14.6 VERIFICATION

Tests must confirm that authoritative finding and evaluation statuses come from backend results.

---

# 15. Financial Intelligence State

## 15.1 WHAT

Financial Intelligence state represents financial reporting workflows, calculation results, review status, and financial binder activity.

## 15.2 WHEN

It is used when users prepare, review, approve, or inspect financial results.

## 15.3 WHERE

It belongs to the Financial Intelligence and Financial Reporting frontend capabilities.

Financial Knowledge and the owning backend services remain authoritative.

## 15.4 WHY

Financial results must preserve approved methodologies and distinguish draft work from certified or released reporting.

## 15.5 HOW

State should represent:

- Reporting period.
- Calculation status.
- Methodology version.
- Source record references.
- Validation status.
- Review status.
- Approval status.
- Report version.
- Binder relationships.

Official calculations and approvals must be executed and confirmed by the backend.

## 15.6 VERIFICATION

Tests must verify that the frontend cannot create a certified financial result through local state changes.

---

# 16. Binder and Survey Workspace State

## 16.1 WHAT

Binder and Survey Workspace state represents binder organization, access context, document references, requests, responses, and workflow progress.

## 16.2 WHEN

It is used during binder assembly, review, approval, release, survey access, and closure.

## 16.3 WHERE

State belongs to the relevant Financial Binder, Survey Binder, or Survey Workspace frontend capability.

Binder Management, source domains, and backend authorization remain responsible for their respective authoritative records.

## 16.4 WHY

Survey and financial workflows involve sensitive records, multiple participants, and controlled access.

Frontend state must not weaken record-level authorization.

## 16.5 HOW

State may represent:

- Binder identifier and type.
- Binder lifecycle.
- Authorized scope.
- Document references.
- Assembly status.
- Review status.
- Approval status.
- Surveyor access status.
- Requests and responses.
- Expiration and revocation status.

Document access must be validated by the backend for each protected operation.

Binder access does not automatically grant access to every underlying source record.

The frontend must not retain unauthorized document content after access is revoked or the session ends.

## 16.6 VERIFICATION

Test binder access, source-record authorization, surveyor revocation, access expiration, and protected document behavior.

---

# 17. Asynchronous Requests and Concurrency

## 17.1 WHAT

Concurrency management controls how overlapping frontend requests are executed and how their results affect state.

## 17.2 WHEN

It is required when users navigate rapidly, change filters, submit mutations, refresh data, or switch tenants while requests are in progress.

## 17.3 WHERE

Concurrency handling belongs to the owning feature's effects or approved data-access implementation.

## 17.4 WHY

Without concurrency controls, delayed responses can overwrite newer information or update the wrong application context.

## 17.5 HOW

Choose request behavior according to the operation.

| Operation | Required consideration |
|---|---|
| Search or filter changes | Disregard obsolete results |
| Record loading | Avoid duplicate unnecessary requests |
| Record mutation | Prevent conflicting submissions |
| Sequential workflow | Preserve required execution order |
| Tenant switching | Cancel or disregard old-context responses |
| Approval or release | Prevent duplicate authoritative transitions |

RxJS operators and request correlation should be selected according to these semantics.

No single concurrency operator is appropriate for every operation.

Use backend version or concurrency controls where required for authoritative mutations.

## 17.6 VERIFICATION

Tests must cover rapid navigation, overlapping requests, duplicate submission, stale responses, and context changes.

---

# 18. Optimistic Updates

## 18.1 WHAT

Optimistic updates temporarily change frontend presentation before the backend confirms a mutation.

## 18.2 WHEN

They may be used for low-risk, reversible interactions where the business operation permits them.

## 18.3 WHERE

They belong to the owning frontend feature and must be coordinated with the authoritative backend mutation.

## 18.4 WHY

Optimistic updates can improve responsiveness but can also misrepresent important business outcomes.

## 18.5 HOW

Optimistic updates must have:

- A reversible state transition.
- Clear pending status.
- Backend confirmation.
- Failure rollback.
- Appropriate conflict handling.

Do not optimistically confirm:

- Regulatory approval.
- Knowledge certification.
- Financial certification.
- Binder release.
- Compliance determination.
- Financial allowability determination.
- Sensitive access authorization.

These operations must wait for authoritative backend confirmation.

## 18.6 VERIFICATION

Tests must confirm rollback, error handling, and correct presentation of pending versus confirmed results.

---

# 19. Error Handling and Recovery

## 19.1 WHAT

Frontend error handling manages failures encountered during state transitions and asynchronous operations.

## 19.2 WHEN

It applies whenever loading, saving, validation, authorization, synchronization, or workflow execution fails.

## 19.3 WHERE

Errors are represented in the owning feature state and displayed through approved UI patterns.

## 19.4 WHY

Users need clear feedback and safe recovery without losing context or accidentally repeating sensitive operations.

## 19.5 HOW

Distinguish:

- Network failures.
- Authentication failures.
- Authorization failures.
- Input validation failures.
- Business rule failures.
- Knowledge or applicability failures.
- Concurrency conflicts.
- Unexpected system failures.

Each operation must define:

- Loading state.
- Success state.
- Failure state.
- Retry eligibility.
- Recovery behavior.
- User feedback.

Do not automatically retry non-idempotent mutations without an approved retry strategy.

## 19.6 VERIFICATION

Tests must confirm error presentation, safe retry behavior, recovery, and preservation of appropriate unsaved work.

---

# 20. State Persistence and Security

## 20.1 WHAT

State persistence determines whether selected frontend state survives page reloads or application restarts.

## 20.2 WHEN

Persistence is considered only when a defined user or workflow requirement justifies it.

## 20.3 WHERE

Persistence belongs to an approved frontend state persistence mechanism, if one is authorized.

## 20.4 WHY

Uncontrolled persistence can expose sensitive information, preserve stale permissions, or leak data across tenant contexts.

## 20.5 HOW

Persistence must use an explicit approved allowlist.

Potentially suitable information includes non-sensitive display preferences.

Do not persist sensitive operational records, authentication secrets, protected documents, or confidential financial information through general-purpose frontend state persistence.

Revalidate session and tenant context when restoring allowed state.

Offline operation is not assumed or authorized by this document.

## 20.6 VERIFICATION

Security tests must confirm that sensitive data is not retained in unauthorized frontend persistence.

---

# 21. State Lifecycle and Cleanup

## 21.1 WHAT

State lifecycle management defines when state is initialized, refreshed, invalidated, and cleared.

## 21.2 WHEN

Lifecycle events include:

- Application startup.
- Feature activation.
- Feature deactivation.
- Tenant switching.
- Permission changes.
- Logout.
- Session expiration.
- Record mutation.
- Knowledge publication.
- Workflow completion.

## 21.3 WHERE

Lifecycle ownership belongs to the responsible global or feature state implementation.

## 21.4 WHY

State that remains after its authorization or business context has changed can become inaccurate or unsafe.

## 21.5 HOW

Every state owner must document:

1. Initialization trigger.
2. Load trigger.
3. Refresh trigger.
4. Invalidation trigger.
5. Cleanup trigger.
6. Authorization dependencies.
7. Tenant dependencies.
8. Historical or version context.

## 21.6 VERIFICATION

Tests must confirm that state is cleared or refreshed at the correct lifecycle boundaries.

---

# 22. Nx Boundaries for State Management

## 22.1 WHAT

Nx boundaries enforce ownership of frontend state libraries.

## 22.2 WHEN

They apply whenever state projects are created or one feature consumes another feature's state contract.

## 22.3 WHERE

They are enforced through the existing Nx workspace configuration and approved project tags.

## 22.4 WHY

Without dependency enforcement, frontend features can become tightly coupled through direct access to private state implementations.

## 22.5 HOW

Each state library must define:

- Domain owner.
- Public interface.
- Allowed consumers.
- Approved dependencies.
- Internal implementation boundaries.

Cross-feature composition should use approved public selectors, facades where justified, or application-level orchestration.

Direct mutation of another feature's private state is prohibited.

## 22.6 VERIFICATION

Nx boundary checks must pass, and code review must confirm that cross-feature access uses approved contracts.

---

# 23. Performance and Observability

## 23.1 WHAT

State performance and observability standards help keep the frontend responsive and diagnosable.

## 23.2 WHEN

They apply during implementation, testing, performance review, and production troubleshooting.

## 23.3 WHERE

They belong to frontend state libraries, feature components, and approved monitoring integration.

## 23.4 WHY

Poorly managed state can cause unnecessary rendering, repeated API calls, memory growth, and difficult troubleshooting.

## 23.5 HOW

Use:

- Focused selectors.
- Appropriate memoization.
- Controlled subscriptions.
- Angular lifecycle-aware cleanup.
- Normalized collections where useful.
- Pagination or incremental loading for large datasets.
- Deliberate refresh behavior.
- Limited state payloads.

NgRx development tooling must not expose confidential state in production.

Diagnostic logging must exclude unnecessary sensitive information.

## 23.6 VERIFICATION

Performance tests and code reviews must verify reasonable rendering behavior, request frequency, memory cleanup, and safe diagnostics.

---

# 24. Testing Strategy for Frontend State

## 24.1 WHAT

State testing verifies transitions, ownership, synchronization, security, and user-facing behavior.

## 24.2 WHEN

Testing occurs throughout feature implementation and before release.

## 24.3 WHERE

Tests belong with the owning frontend state library and relevant application integration tests.

## 24.4 WHY

State errors can cause misleading information even when backend services are functioning correctly.

## 24.5 HOW

### Unit tests

Cover:

- Reducers.
- Selectors.
- Actions and state transitions.
- Effects.
- Loading and failure states.
- Cache invalidation.
- State reset behavior.

### Integration tests

Cover:

- API synchronization.
- Feature navigation.
- Authentication context.
- Tenant switching.
- Permission changes.
- Concurrent requests.
- Mutation confirmation.

### End-to-end tests

Cover:

- Regulatory Knowledge Administration.
- Financial Knowledge Administration.
- Compliance Workbench.
- Financial Workbench.
- Binder workflows.
- Survey Workspace access and revocation.

### Security tests

Verify:

- No cross-tenant state leakage.
- No stale authorization access.
- No unauthorized document persistence.
- Correct session cleanup.
- Correct handling of revoked access.

## 24.6 VERIFICATION

Required tests must pass through the existing Nx and CI workflow.

---

# 25. Standard State Implementation Sequence

## 25.1 WHAT

This section defines the required order for designing and implementing frontend state for a new capability.

## 25.2 WHEN

Use this sequence whenever a new stateful frontend feature is approved for implementation.

## 25.3 WHERE

The sequence is applied within the owning frontend feature and its approved Nx projects.

## 25.4 WHY

State design must follow business ownership and API contracts, not precede or redefine them.

## 25.5 HOW

| Step | Engineering activity | Required result |
|---|---|---|
| 1 | Identify business capability | Confirmed domain owner |
| 2 | Identify authoritative data source | Backend authority established |
| 3 | Review API contracts | Approved data exchange |
| 4 | Classify state | Global, feature, local, or server representation |
| 5 | Define state ownership | Approved Nx project boundary |
| 6 | Define state model | Typed state structure |
| 7 | Define actions and transitions | Predictable behavior |
| 8 | Define selectors | Controlled read access |
| 9 | Define effects and API coordination | Asynchronous execution |
| 10 | Define caching and invalidation | Freshness and lifecycle rules |
| 11 | Define security and tenant behavior | Protected state |
| 12 | Implement tests | Verified transitions and synchronization |
| 13 | Run Nx and CI checks | Boundary and build verification |
| 14 | Update Software Change Register | Traceable engineering change |

This sequence does not authorize implementation; it becomes applicable after formal approval.

## 25.6 VERIFICATION

A feature cannot be accepted without a documented state owner, lifecycle, API relationship, security behavior, and passing tests.

---

# 26. Engineering Definition of Done

A frontend state capability is complete only when:

- [ ] State ownership is documented.
- [ ] The authoritative backend source is identified.
- [ ] State is classified appropriately.
- [ ] Nx boundaries are respected.
- [ ] Public state contracts are defined.
- [ ] Actions and transitions are tested.
- [ ] Selectors are tested.
- [ ] Effects are tested.
- [ ] Loading and error states are handled.
- [ ] Cache invalidation is defined.
- [ ] Tenant switching is safe.
- [ ] Session expiration and logout cleanup work.
- [ ] Sensitive data persistence is controlled.
- [ ] Concurrency behavior is tested.
- [ ] Authoritative mutations require backend confirmation.
- [ ] Required integration tests pass.
- [ ] Software Change Register is updated.
- [ ] Applicable CI checks pass.

---

# 27. Relationship to Other Engineering Documents

| Document | Relationship |
|---|---|
| ENG-001 — Master Workflow Catalog | Defines business workflows that frontend state supports |
| ENG-002 — Workflow Diagrams and State Machines | Defines business lifecycle transitions |
| ENG-003 — Master Entity Catalog | Defines business entities represented in frontend state |
| ENG-004 — Entity Relationship Model | Defines authoritative business relationships |
| ENG-005 — Nx Workspace Architecture | Defines project ownership and dependency boundaries |
| ENG-006 — Technology Implementation Standards | Establishes platform-wide technical standards |
| ENG-008 — Service and Module Catalog | Defines backend capabilities consumed by frontend features |
| ENG-009 — API and Event Contracts | Defines backend exchange contracts |
| ENG-010 — Authorization and Permission Matrix | Defines access requirements |
| ENG-011 — User Interface and Workspace Specification | Defines frontend workflows and presentation |
| ENG-012 — Data Architecture | Defines persistence and data lifecycle |
| ENG-013 — Testing and Quality Strategy | Defines platform-wide verification |
| ENG-014 — Team Work Packages | Assigns engineering responsibilities |
| ENG-015 — Sprint Implementation Packages | Sequences approved implementation work |

---

# 28. Implementation Authorization

**Status: Not Granted**

This document defines the proposed frontend state management architecture.

It does not authorize:

- Creating or modifying NgRx stores.
- Creating or modifying actions.
- Creating or modifying reducers.
- Creating or modifying selectors.
- Creating or modifying effects.
- Creating new Nx libraries.
- Changing authentication state.
- Changing tenant-switching behavior.
- Modifying API contracts.
- Beginning sprint implementation.

The existing security foundation and established technology stack must be preserved.

Implementation begins only after the engineering blueprint is completed, reviewed, and explicitly approved.

---

**End of ENG-007 — Frontend State Management Architecture**