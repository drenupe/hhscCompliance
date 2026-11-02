# ENG-006 — Technology Implementation Standards

**Document ID:** ENG-006  
**Version:** 1.1  
**Status:** Engineering Blueprint — Draft  
**Platform:** Regulatory Intelligence Platform  
**Organization:** McCaskill Projects  
**Implementation Authorization:** Not Granted  
**Document Location:** `docs/engineering/06-technology-implementation-standards.md`

---

# 1. Purpose and Scope

## 1.1 What

This document establishes the technical implementation standards governing how the Regulatory Intelligence Platform is engineered.

It defines the responsibilities, technology usage, implementation timing, architectural placement, and verification requirements for the platform's technical components.

It covers:

- Nx monorepo organization.
- Angular frontend development.
- Frontend state management.
- NestJS backend development.
- API design and implementation.
- PostgreSQL and TypeORM.
- Regulatory Knowledge Engine implementation.
- Financial Knowledge Engine implementation.
- Shared Intelligence Services.
- Operational domains.
- Applied Intelligence.
- Authentication, authorization, and security.
- Events and integrations.
- Testing.
- Deployment.
- Engineering governance.

## 1.2 When

These standards apply whenever a team:

- Designs a new platform capability.
- Creates a new project or library.
- Creates or modifies an entity.
- Implements a service.
- Creates or changes an API.
- Changes a database schema.
- Implements a workflow.
- Adds a regulatory or financial knowledge capability.
- Integrates two or more domains.
- Changes an existing platform capability.
- Prepares a release.

## 1.3 Where

These standards govern implementation across the existing Nx monorepo and its established frontend, backend, database, and deployment environments.

They apply to every engineering team contributing to the platform.

## 1.4 Why

Without consistent implementation standards, independently developed components can create:

- Duplicate business logic.
- Conflicting domain ownership.
- Unauthorized cross-domain dependencies.
- Inconsistent API contracts.
- Uncontrolled database changes.
- Duplicate security systems.
- Untraceable business decisions.
- Inconsistent frontend behavior.
- Difficult maintenance and future expansion.

The standards establish one consistent engineering method across the platform.

## 1.5 How

Every major technical standard in this document follows six questions:

| Question | Required explanation |
|---|---|
| WHAT | What is the capability, component, or responsibility? |
| WHEN | When is it created, executed, or used? |
| WHERE | Which domain, project, service, or application owns it? |
| WHY | Why does it belong there, and what problem does it solve? |
| HOW | How must engineers implement it? |
| VERIFICATION | How do we prove it works correctly? |

No critical implementation responsibility should be left unexplained.

---

# 2. Existing Technology Environment

## 2.1 What

The platform uses the existing development and deployment environment.

| Area | Established technology |
|---|---|
| Monorepo | Nx |
| Frontend | Angular 20 |
| Frontend architecture | Standalone Components |
| Frontend state management | NgRx |
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | TypeORM |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| Source control | Git |
| CI/CD | Existing deployed pipeline |

## 2.2 When

These technologies are used throughout platform development and deployment.

New capabilities must be designed to operate within this established environment.

## 2.3 Where

The technologies operate in their existing locations:

- Nx manages the monorepo and project dependencies.
- Angular provides the frontend application.
- NgRx manages frontend application state.
- NestJS provides backend application services and APIs.
- PostgreSQL persists platform records.
- TypeORM manages database mapping and migrations.
- Vercel hosts the frontend.
- Render hosts the backend.

## 2.4 Why

The existing environment is already established and operational.

Redesigning infrastructure or introducing replacement technologies would create unnecessary migration work and distract from completing the platform's business and knowledge capabilities.

## 2.5 How

Engineers must:

1. Use the established technologies.
2. Preserve working deployment configurations.
3. Maintain compatibility with the existing Nx workspace.
4. Avoid introducing duplicate infrastructure.
5. Document any required environment changes.
6. Obtain approval before changing an established technology.

## 2.6 Verification

A technical implementation must demonstrate that:

- It builds within the existing workspace.
- It respects established project boundaries.
- It operates within the existing development environment.
- It passes the applicable CI/CD checks.
- It does not introduce unauthorized infrastructure changes.

---

# 3. Core Engineering Principles

## 3.1 Knowledge Authority

**WHAT:** The platform has two independent knowledge authorities: the Regulatory Knowledge Engine and the Financial Knowledge Engine.

**WHEN:** These authorities are used whenever an operation requires regulatory requirements, financial definitions, methodologies, or authoritative applicability decisions.

**WHERE:**

- Regulatory requirements belong to Regulatory Knowledge.
- Financial definitions and methodologies belong to Financial Knowledge.
- Operational facts belong to their owning operational domains.
- Execution belongs to the appropriate intelligence capability.

**WHY:** This prevents applications, operational services, and AI components from independently inventing authoritative rules.

**HOW:**

- Regulatory evaluators execute approved regulatory knowledge.
- Financial calculations execute approved financial knowledge.
- Operational services provide verified facts.
- Shared services execute approved definitions and preserve traceability.
- AI may assist with explanation and analysis but cannot establish authority.

**VERIFICATION:**

- Every regulatory determination identifies its governing knowledge.
- Every financial result identifies its governing methodology.
- No independent rule implementation bypasses the appropriate knowledge authority.

## 3.2 Domain Ownership

**WHAT:** Every business capability, record, service, and contract must have an identified owning domain.

**WHEN:** Ownership is established before a new capability or data structure is designed.

**WHERE:** Ownership is represented in the engineering architecture, Nx project boundaries, service catalog, and data model.

**WHY:** Clear ownership prevents duplicate records, competing business logic, and unauthorized cross-domain modification.

**HOW:**

Each domain owns:

- Its business records.
- Its business processes.
- Its application services.
- Its operational validation.
- Its data lifecycle.
- Its public interfaces.

Other domains consume approved interfaces rather than accessing internal implementation details.

**VERIFICATION:**

Every new project, entity, service, API, and workflow has an identifiable owner.

## 3.3 Explicit Contracts

**WHAT:** A contract is a documented agreement defining how one component communicates with another.

**WHEN:** Contracts are required whenever components communicate across application, domain, service, or integration boundaries.

**WHERE:** Contracts belong to the owning domain's approved public interface.

**WHY:** Explicit contracts prevent undocumented dependencies and allow teams to develop independently.

**HOW:**

Contracts must define:

- Purpose.
- Ownership.
- Inputs.
- Outputs.
- Validation.
- Authorization.
- Error behavior.
- Versioning.
- Compatibility expectations.

**VERIFICATION:**

Contract tests and dependency checks demonstrate that consumers use approved interfaces.

## 3.4 Traceability

**WHAT:** Traceability records the origin, execution, and outcome of important business operations.

**WHEN:** It is required whenever an operation creates, modifies, evaluates, approves, publishes, or releases an important business record or determination.

**WHERE:** Traceability is implemented through the appropriate domain and shared audit capabilities.

**WHY:** The platform must be able to explain who performed an action, what information was used, and how the result was reached.

**HOW:**

Capture applicable information including:

- Actor.
- Tenant and organization.
- Action.
- Timestamp.
- Affected record.
- Source references.
- Knowledge or methodology version.
- Execution result.
- Approval and release history.

**VERIFICATION:**

An authorized reviewer can reconstruct the relevant history of a business operation without relying on undocumented assumptions.

## 3.5 Historical Reproducibility

**WHAT:** Historical reproducibility means retaining the context needed to explain a previous result.

**WHEN:** It applies whenever knowledge, methodology, operational facts, or calculations contribute to a determination.

**WHERE:** It is implemented across knowledge versioning, execution records, source references, and audit history.

**WHY:** Updating current knowledge must not silently change the meaning of a historical result.

**HOW:**

Preserve the applicable:

- Knowledge version.
- Source version.
- Methodology version.
- Input references.
- Effective date.
- Execution time.
- Validation results.
- Approval records.

**VERIFICATION:**

A historical result can be explained using the exact versions and inputs originally applied.

---

# 4. Nx Monorepo Architecture Standards

## 4.1 What

Nx manages the platform's projects, dependencies, build targets, testing, and architectural boundaries.

It is the engineering mechanism used to organize domain ownership in the monorepo.

## 4.2 When

Nx project boundaries must be established before a team creates new libraries, applications, or reusable services.

Boundary rules must be applied continuously as projects are added or changed.

## 4.3 Where

Nx configuration and project definitions reside in the existing monorepo.

The target project organization must reflect the approved platform domains:

- Platform Foundation.
- Business and Operational Domains.
- Regulatory Knowledge.
- Financial Knowledge.
- Shared Intelligence.
- Applied Intelligence.
- Frontend Applications.
- Backend Applications.
- Testing and Tooling.

## 4.4 Why

Without enforced boundaries, a monorepo can become a collection of interconnected projects that share internal implementation details.

Nx must make the intended architecture enforceable rather than merely documented.

## 4.5 How

### Project ownership

Every project must have:

- A unique project name.
- A defined purpose.
- An owning domain.
- A project type.
- An architectural layer.
- Approved dependencies.
- Public interfaces where applicable.

### Project tags

The proposed tagging convention is:

| Tag | Purpose | Example |
|---|---|---|
| Scope | Business ownership | `scope:regulatory` |
| Type | Project responsibility | `type:domain` |
| Layer | Architectural position | `layer:backend` |
| Platform | Application target | `platform:api` |
| Visibility | Contract exposure | `visibility:public` |
| Owner | Responsible domain | `owner:financial` |

Exact tag configuration must be validated against the installed Nx workspace before implementation.

### Dependency rules

The following dependencies are prohibited:

1. Regulatory Knowledge depending on Financial Knowledge internals.
2. Financial Knowledge depending on Regulatory Knowledge internals.
3. Frontend projects importing backend implementation code.
4. Backend projects importing frontend code.
5. Shared services creating independent regulatory or financial rules.
6. One operational domain directly controlling another domain's internal records.
7. Internal libraries becoming public interfaces without approval.
8. Circular project dependencies.

### Public interfaces

Reusable libraries must expose deliberate public entry points.

Consumers must not import another project's private implementation files.

### Nx Console

Nx Console should be used to:

- Discover projects.
- Inspect dependency graphs.
- Generate approved project structures.
- Review project configuration.
- Execute build and test targets.
- Understand affected projects.

Nx Console assists engineering; it does not replace architecture governance.

## 4.6 Verification

Before a project is accepted:

- Project ownership is documented.
- Tags are assigned.
- Dependency rules pass.
- Public interfaces are defined.
- No circular dependency exists.
- Required build and test targets work.

---

# 5. Angular Frontend Standards

## 5.1 What

Angular provides the platform's frontend applications and user-facing workspaces.

The frontend presents business capabilities and allows authorized users to interact with platform workflows.

## 5.2 When

Angular components are used whenever users need to:

- View records.
- Enter information.
- Manage operational workflows.
- Review knowledge.
- Execute authorized actions.
- Review compliance results.
- Review financial results.
- Assemble or access binders.
- Participate in survey workflows.

## 5.3 Where

Frontend responsibilities belong in Angular applications and libraries organized according to Nx ownership boundaries.

Examples of frontend capabilities include:

- Provider Intelligence Center.
- Regulatory Workbench.
- Financial Workbench.
- Residential Operations.
- ISS Operations.
- Survey Workspace.
- Financial Binder.
- Survey Binder.
- Knowledge Administration.

## 5.4 Why

Separating presentation from business authority allows the interface to evolve without changing the underlying meaning of business records or determinations.

## 5.5 How

### Component architecture

Use Angular standalone components.

Components should have focused responsibilities:

- Page composition.
- Feature presentation.
- Reusable UI elements.
- Form interaction.
- Local presentation state.
- User interaction.

### Component responsibilities

Components may:

- Display information.
- Collect input.
- Invoke approved application actions.
- Display execution results.
- Present validation messages.
- Navigate through authorized workflows.

Components must not:

- Independently determine regulatory compliance.
- Independently establish financial allowability.
- Duplicate authoritative rules.
- Bypass backend authorization.
- Directly modify another domain's records.

### Forms

Forms must support:

- Explicit field definitions.
- Required-field indicators.
- Input validation.
- Accessible labels.
- Clear error messages.
- Submission state.
- Duplicate-submission protection.
- Appropriate save and recovery behavior.

Frontend validation is for usability. Backend validation remains authoritative.

### Routing

Routes must follow application and domain boundaries.

Frontend route guards may improve navigation and user experience but must never replace backend authorization.

### User experience

The platform must maintain consistent:

- Typography.
- Navigation.
- Layout.
- Status indicators.
- Loading states.
- Empty states.
- Error states.
- Success feedback.
- Accessibility.

The interface must distinguish official determinations from informational guidance and management indicators.

## 5.6 Verification

Frontend features must demonstrate:

- Correct display of backend-owned data.
- Correct handling of loading and error states.
- Correct user interaction.
- Accessible form controls.
- Correct authorization-aware navigation.
- No independent authoritative business logic.

---

# 6. Frontend State Management Standards

## 6.1 What

NgRx is the established frontend state management technology.

It manages the frontend representation of application data and user interaction state.

## 6.2 When

State management is required when application data must be shared, coordinated, refreshed, or maintained across components and workflows.

## 6.3 Where

State management belongs in the frontend state libraries associated with the appropriate application or domain feature.

## 6.4 Why

The frontend needs predictable state transitions and controlled data access.

However, frontend state must never become a second database or independent source of business authority.

## 6.5 How

The detailed state architecture is specified in:

`docs/engineering/07-state-management-architecture.md`

Implementation must follow that document's approved standards for:

- Global and feature state.
- Domain state ownership.
- Actions.
- Reducers.
- Selectors.
- Effects.
- API data.
- Cache invalidation.
- Tenant switching.
- Authentication state.
- Error handling.
- Persistence.
- Testing.

## 6.6 Verification

State management must demonstrate:

- Clear state ownership.
- Predictable state transitions.
- Correct tenant isolation.
- Appropriate cache invalidation.
- No duplication of authoritative business logic.
- No unauthorized persistence of sensitive information.

---

# 7. NestJS Backend Standards

## 7.1 What

NestJS provides the platform's backend application services, domain execution, APIs, and controlled access to persistent data.

## 7.2 When

Backend capabilities are used whenever an operation requires:

- Business processing.
- Data access.
- Authorization.
- Validation.
- Workflow coordination.
- Knowledge execution.
- Financial calculation.
- Evidence registration.
- Audit recording.
- Integration with another domain.

## 7.3 Where

Backend projects belong in the Nx workspace according to their owning domain and technical responsibility.

## 7.4 Why

The backend must enforce business rules, security, data integrity, and domain ownership independently of the frontend.

## 7.5 How

### Controllers

**WHAT:** Controllers are HTTP entry points.

**WHEN:** They are used when a client submits a request to retrieve information or perform an operation.

**WHERE:** They reside in the backend application module that exposes the owning domain's API.

**WHY:** They separate HTTP communication from business execution.

**HOW:** Controllers receive requests, apply appropriate guards and structural validation, invoke application services, and return documented response contracts.

**VERIFICATION:** Controllers contain no unnecessary business logic and enforce the required request and authorization behavior.

### Application services

**WHAT:** Application services coordinate use cases.

**WHEN:** They execute when an API request, event, or approved internal operation initiates a business workflow.

**WHERE:** They belong to the backend capability responsible for the workflow.

**WHY:** They coordinate domain behavior without placing business execution inside HTTP controllers.

**HOW:** They load authorized information, invoke domain services, coordinate approved operations, manage transactions, and record execution context.

**VERIFICATION:** Each use case has a defined owner, sequence, result, and error behavior.

### Domain services

**WHAT:** Domain services implement business behavior owned by a domain.

**WHEN:** They execute when the domain must perform its business responsibilities.

**WHERE:** They belong to the domain that owns the behavior.

**WHY:** Domain behavior must remain independent of unrelated domain implementation details.

**HOW:** Services operate through approved domain models and interfaces.

**VERIFICATION:** No unrelated domain can bypass the service's public contract to control its internal behavior.

### DTOs

**WHAT:** Data transfer objects define API input and output contracts.

**WHEN:** They are required whenever data crosses an external API boundary.

**WHERE:** They belong to the API contract and owning backend project.

**WHY:** DTOs prevent internal persistence structures from becoming uncontrolled public interfaces.

**HOW:** Define fields, types, structural validation, and response shapes. Avoid exposing unnecessary sensitive information.

**VERIFICATION:** API tests verify accepted input, rejected input, and response structure.

### Exception handling

**WHAT:** Exception handling translates failures into controlled responses.

**WHEN:** It applies whenever a backend operation fails or cannot proceed.

**WHERE:** Shared exception infrastructure and domain-specific error handling.

**WHY:** Consistent errors improve reliability and prevent exposure of internal implementation details.

**HOW:** Use consistent error categories and responses. Do not expose credentials, stack traces, or unnecessary personal information.

**VERIFICATION:** Error tests verify status codes, response structure, and safe logging.

---

# 8. API Implementation Standards

## 8.1 What

APIs are controlled interfaces through which applications, integrations, and authorized systems access platform capabilities.

## 8.2 When

An API is required whenever a capability must be exposed beyond its internal implementation boundary.

## 8.3 Where

Each API belongs to the domain responsible for the operation or data being exposed.

## 8.4 Why

Clear API ownership prevents one domain from taking control of another domain's business behavior.

## 8.5 How

Every API must define:

- Purpose.
- Owning domain.
- HTTP method.
- Endpoint.
- Request schema.
- Response schema.
- Authentication requirements.
- Authorization requirements.
- Tenant and record scope.
- Validation.
- Error behavior.
- Audit expectations.
- Versioning.

### Cross-domain communication

A domain must not bypass another domain's public interface to access internal data or behavior.

### API versioning

Preserve the existing API versioning convention.

Breaking changes require an approved compatibility and migration plan.

### Documentation

API documentation must be maintained alongside implementation.

## 8.6 Verification

API acceptance requires:

- Contract tests.
- Authorization tests.
- Tenant-isolation tests.
- Input validation tests.
- Error-response tests.
- Documented ownership.
- Compatibility review.

---

# 9. PostgreSQL and TypeORM Standards

## 9.1 What

PostgreSQL is the platform's relational database.

TypeORM provides the established object-relational mapping and migration framework.

## 9.2 When

Database design and persistence implementation are required whenever a capability must create, retrieve, update, or preserve business records.

## 9.3 Where

Database records and entities belong to the domain that owns their business meaning.

Shared database infrastructure does not create shared business ownership.

## 9.4 Why

Clear persistence ownership prevents duplicate records, inconsistent data, and uncontrolled cross-domain updates.

## 9.5 How

### Entity design

Entities must follow approved domain models.

They must account for:

- Primary identifiers.
- Relationships.
- Tenant ownership.
- Domain ownership.
- Lifecycle state.
- Effective dates where applicable.
- Audit information.
- Version relationships where required.

### Migrations

All schema changes must use controlled migrations.

A migration must:

1. Identify the affected domain.
2. Explain the schema change.
3. Identify data impact.
4. Be reviewed.
5. Be tested.
6. Include an appropriate recovery strategy.
7. Be recorded in the Software Change Register.

Production schema changes must not depend on uncontrolled automatic schema synchronization.

### Transactions

Use transactions when multiple database operations must succeed or fail together.

For cross-domain workflows, define consistency and recovery behavior explicitly.

Do not assume a PostgreSQL transaction provides atomicity across external systems.

### Data integrity

Use appropriate:

- Unique constraints.
- Foreign keys.
- Required-field constraints.
- Tenant-scoped uniqueness.
- Indexes.
- Referential integrity.
- Lifecycle validation.

### Historical records

Changes must not silently rewrite historical determinations.

Use approved versioning and correction mechanisms.

## 9.6 Verification

Database changes must demonstrate:

- Correct entity ownership.
- Correct tenant relationships.
- Valid migrations.
- Referential integrity.
- Appropriate constraints.
- Tested rollback or recovery behavior.
- Preservation of historical data.

---

# 10. Regulatory Knowledge Engine Standards

## 10.1 What

The Regulatory Knowledge Engine is the authoritative platform capability for regulatory requirements and regulatory applicability.

## 10.2 When

It is used whenever the platform must determine:

- Which regulatory requirements apply.
- What an organization or service is required to do.
- What evidence is required.
- How regulatory requirements are evaluated.
- Which knowledge version governs a determination.

## 10.3 Where

Regulatory knowledge belongs exclusively within the Regulatory Knowledge Engine.

Regulatory source material, structured requirements, interpretations, validation definitions, and knowledge lifecycle records must be governed there.

## 10.4 Why

The platform must have one authoritative source for regulatory requirements.

This prevents regulatory rules from becoming scattered throughout applications, services, and operational modules.

## 10.5 How

### Knowledge representation

A regulatory requirement must be represented with sufficient information to identify:

- Requirement identity.
- Official authority.
- Source citation.
- Jurisdiction.
- Program or service applicability.
- Effective dates.
- Requirement content.
- Related definitions.
- Required evidence.
- Validation expectations.
- Version.
- Lifecycle state.
- Approval and certification status.

### Source governance

Distinguish:

1. Official source material.
2. Extracted regulatory content.
3. Structured requirement representations.
4. Interpretations and explanatory content.
5. Approved validation logic.

AI-generated interpretations must not automatically become approved regulatory requirements.

### Knowledge lifecycle

The lifecycle must support:

- Source acquisition.
- Extraction.
- Structuring.
- Review.
- Validation.
- Approval.
- Certification.
- Publication.
- Change monitoring.
- Supersession.
- Retirement.

Unapproved knowledge must not silently become active authority.

### Rule execution

Evaluators execute approved regulatory knowledge.

They do not create regulatory requirements independently.

## 10.6 Verification

A regulatory implementation must demonstrate:

- Identifiable official sources.
- Approved requirement representation.
- Defined applicability.
- Version and effective-date handling.
- Approved validation logic.
- Traceable execution.
- Historical reproducibility.

No regulatory evaluator may introduce a requirement that is absent from the approved Regulatory Knowledge Engine.

---

# 11. Financial Knowledge Engine Standards

## 11.1 What

The Financial Knowledge Engine is the authoritative platform capability for financial definitions, classifications, methodologies, and financial applicability.

## 11.2 When

It is used whenever the platform must determine:

- Financial classification.
- Cost treatment.
- Allowability.
- Allocation methodology.
- Reimbursement.
- Calculation methodology.
- Reporting schedules and lines.
- Financial statistical definitions.
- Applicable financial rules.

## 11.3 Where

Financial knowledge belongs exclusively within the Financial Knowledge Engine.

Financial definitions and methodologies must not be embedded as independent authority inside Financial Operations or Financial Intelligence.

## 11.4 Why

Financial calculations and reports must use approved definitions and methodologies.

Separating financial knowledge from operational records makes methodologies governable, reusable, and historically reproducible.

## 11.5 How

Financial knowledge may include:

- Financial definitions.
- Account classifications.
- Cost classifications.
- Allowability principles.
- Allocation methodologies.
- Cost principles.
- Reimbursement rates.
- Calculation formulas.
- Reporting schedules.
- Reporting lines.
- Statistical definitions.
- Financial applicability.
- Source references.
- Effective periods.
- Version and approval history.

Every financial calculation must preserve the applicable methodology and source versions.

A methodology change must not silently rewrite previous financial results.

## 11.6 Verification

Financial implementations must demonstrate:

- Approved financial definitions.
- Versioned methodologies.
- Effective-date handling.
- Traceable calculation inputs.
- Reproducible results.
- Defined approval and release requirements.

Financial Intelligence executes approved financial knowledge; it does not independently create financial authority.

---

# 12. Shared Intelligence Services

## 12.1 What

Shared Intelligence Services provide reusable platform capabilities used by multiple domains.

They include:

- Evidence.
- Validation execution.
- Document Management.
- Change and Version.
- Audit and Traceability.
- Approval.
- Reporting infrastructure.
- Binder Management.

## 12.2 When

Shared services are used whenever multiple domains require the same technical capability.

## 12.3 Where

They belong in the Shared Intelligence portion of the platform and must be organized into independently governed Nx projects according to their responsibility.

## 12.4 Why

Common infrastructure should be implemented once where appropriate, rather than duplicated across operational and intelligence domains.

However, shared services must not become a third regulatory or financial knowledge authority.

## 12.5 How

### Evidence Services

**WHAT:** Register and manage evidence references and relationships.

**WHEN:** When an operational record, validation, determination, report, or binder requires supporting evidence.

**WHERE:** Shared Evidence capability, with source records remaining in their owning domains.

**WHY:** Evidence must be reusable and traceable without transferring source ownership.

**HOW:** Support registration, provenance, version references, relationships, access, retention, and lifecycle.

**VERIFICATION:** Evidence can be traced to its original source and accessed only by authorized users.

### Validation Services

**WHAT:** Execute approved validation definitions.

**WHEN:** Whenever an operational, regulatory, or financial validation is required.

**WHERE:** Shared Validation execution infrastructure, with rule ownership remaining in the responsible domain or knowledge authority.

**WHY:** Execution infrastructure can be shared without merging validation authority.

**HOW:**

| Validation responsibility | Owner |
|---|---|
| Operational completeness and consistency | Operational domain |
| Regulatory requirement satisfaction | Regulatory Knowledge Engine |
| Financial definition and methodology satisfaction | Financial Knowledge Engine |

**VERIFICATION:** Each result identifies the validation responsibility, governing definition, inputs, and execution context.

### Document Services

**WHAT:** Manage document registration, references, metadata, versions, and access.

**WHEN:** Whenever the platform stores, references, retrieves, or manages business documents.

**WHERE:** Shared Document Management capability.

**WHY:** Document handling should be consistent while original business ownership remains intact.

**HOW:** Support metadata, secure storage references, versioning, classification, access controls, retention, and audit history.

**VERIFICATION:** Documents retain source ownership and enforce authorized access.

### Change Services

**WHAT:** Govern changes to controlled platform information and knowledge.

**WHEN:** Whenever a governed definition, methodology, configuration, or knowledge record changes.

**WHERE:** Shared change and version capabilities, coordinated with the owning authority.

**WHY:** Historical context must be preserved.

**HOW:** Support proposals, impact assessment, versions, review, approval, effective dates, publication, and supersession.

**VERIFICATION:** A reviewer can identify what changed, why, when, and who approved it.

### Audit and Traceability

**WHAT:** Record important platform actions and their context.

**WHEN:** Whenever an important business, security, knowledge, approval, or access operation occurs.

**WHERE:** Shared audit infrastructure with domain-specific event ownership.

**WHY:** The platform must provide defensible operational history.

**HOW:** Capture actor, action, time, scope, affected records, versions, and outcome without exposing unnecessary sensitive information.

**VERIFICATION:** Authorized reviewers can reconstruct relevant activity.

### Approval Services

**WHAT:** Execute governed approval workflows.

**WHEN:** Whenever a capability requires review or approval before publication, certification, release, or closure.

**WHERE:** Shared approval infrastructure, with approval authority defined by the owning domain.

**WHY:** Workflow execution should be reusable, but approval authority must remain with the responsible organization or knowledge owner.

**HOW:** Record approver, role, decision, time, scope, and related version.

**VERIFICATION:** Unauthorized users cannot approve, and approval history is preserved.

### Reporting Infrastructure

**WHAT:** Provide reusable reporting infrastructure.

**WHEN:** Whenever information must be assembled, calculated, reviewed, or presented across platform domains.

**WHERE:** Shared reporting infrastructure, with source accuracy retained by owning domains.

**WHY:** Reporting can be shared without transferring ownership of the underlying information.

**HOW:** Preserve source references, period, authority, versions, calculation history, approval, and release status.

**VERIFICATION:** Management indicators are distinguishable from official determinations and certified financial reports.

### Binder Management

**WHAT:** Manage binder types, instances, organization, lifecycle, access relationships, and traceability.

**WHEN:** Whenever the platform assembles a governed collection of records and evidence for a business purpose.

**WHERE:** Shared Binder Management capability.

**WHY:** Binder organization should be reusable without taking ownership of source records.

**HOW:** Support:

- Binder type.
- Binder instance.
- Scope.
- Period or event.
- Document relationships.
- Access assignments.
- Lifecycle.
- Approval history.
- Audit history.

Financial Binder and Survey Binder remain separate business capabilities using shared Binder Management.

**VERIFICATION:** A binder can organize authorized source records without changing source ownership or granting unauthorized access.

---

# 13. Operational Domain Standards

## 13.1 What

Operational domains manage the actual business activities, records, and processes performed by organizations.

Examples include:

- Residential Operations.
- ISS Operations.
- Workforce Operations.
- Financial Operations.

## 13.2 When

Operational domains are used whenever an organization creates or manages real-world business records and activities.

## 13.3 Where

Each operational capability belongs to its own domain and its corresponding Nx projects.

## 13.4 Why

Operational responsibilities must remain reusable across jurisdictions and programs.

Regulatory and financial requirements should govern operational capabilities through approved knowledge packs and applicability contracts, rather than being hardcoded into operational services.

## 13.5 How

Each operational domain owns:

- Its records.
- Its workflows.
- Its application services.
- Its operational validation.
- Its record lifecycle.
- Its operational reporting inputs.

Operational domains provide verified facts and context.

The Regulatory Knowledge Engine determines regulatory applicability.

The Financial Knowledge Engine determines financial applicability.

## 13.6 Verification

Operational implementations must demonstrate:

- Clear record ownership.
- Reusable capability boundaries.
- No unauthorized cross-domain modification.
- No independent regulatory or financial authority.
- Traceable operational facts and changes.

---

# 14. Applied Intelligence Standards

## 14.1 What

Applied Intelligence coordinates operational facts, approved knowledge, evidence, validation, and business workflows.

It includes:

- Compliance Intelligence.
- Financial Intelligence.
- Compliance Evaluation and Workflow.
- Financial Reporting.

## 14.2 When

Applied Intelligence is used whenever the platform must evaluate operational information against authoritative knowledge or produce an approved business result.

## 14.3 Where

Applied capabilities belong in the appropriate application and backend projects, following the approved domain boundaries.

## 14.4 Why

Knowledge authority, operational records, and execution must remain separate while still working together to produce useful business outcomes.

## 14.5 How

### Compliance Intelligence

It must:

1. Retrieve applicable regulatory knowledge.
2. Retrieve authorized operational facts.
3. Execute approved regulatory validation.
4. Preserve the execution context.
5. Record findings and results.
6. Support corrective action.
7. Support reassessment.
8. Preserve historical determinations.

It must not independently create regulatory requirements.

### Financial Intelligence

It must:

1. Retrieve approved financial definitions and methodologies.
2. Retrieve authorized financial and operational facts.
3. Execute approved financial calculations.
4. Preserve methodology versions.
5. Produce traceable financial results.
6. Support reporting and binder workflows.

It must not independently create financial authority.

### Workflow execution

Applied workflows must coordinate responsible domains through approved contracts.

A workflow must not bypass domain ownership to directly modify another domain's internal records.

## 14.6 Verification

Applied Intelligence must demonstrate:

- Correct authority selection.
- Correct applicability.
- Authorized data access.
- Version preservation.
- Traceable execution.
- Correct workflow transitions.
- Reproducible results.

---

# 15. Authentication, Authorization, and Security

## 15.1 What

Security controls determine who can access the platform, which operations they can perform, and which records they can access.

## 15.2 When

Security controls apply to every protected application, API, record, workflow, integration, and document operation.

## 15.3 Where

Security is implemented through the existing platform security foundation and enforced at the backend and data-access boundaries.

## 15.4 Why

The platform handles confidential operational, financial, personnel, and individual records.

Security must protect both the identity of the user and the scope of the information they are authorized to access.

## 15.5 How

### Existing security foundation

Preserve and reuse the existing working:

- Authentication.
- JWT implementation.
- Roles.
- Permissions.
- Authorization services.
- Guards.
- Security infrastructure.

Do not create a duplicate identity or authorization system.

Map the existing security implementation against the approved target architecture before proposing extensions.

Only verified gaps should lead to changes.

### Authorization

Authorization must consider:

- User identity.
- Tenant.
- Organization.
- Role.
- Permissions.
- Record scope.
- Location scope.
- Workflow context.
- Resource ownership.

### Tenant isolation

Tenant isolation must be enforced at the server and data-access boundaries.

Changing a URL, identifier, request body, or frontend state must not provide access to another tenant's records.

### Surveyor identity

External surveyor accounts must remain separate from provider employee accounts.

The Survey Workspace must support:

- Individual surveyor identities.
- MFA.
- Event-specific access.
- Provider and location scope.
- Record-level authorization.
- Time-limited access.
- Revocation.
- Audit of views, requests, responses, and downloads.

### Sensitive information

Sensitive information must be protected using the existing approved security environment.

Secrets must not be embedded in source code or exposed through frontend bundles.

Logs must not contain unnecessary personal, confidential, or authentication information.

## 15.6 Verification

Security acceptance requires:

- Authentication tests.
- Role and permission tests.
- Record-level authorization tests.
- Cross-tenant access tests.
- Revocation tests.
- Expiration tests.
- Surveyor scope tests.
- Sensitive data exposure tests.

---

# 16. Event and Integration Standards

## 16.1 What

Events communicate that an important action or business occurrence has taken place.

Integrations allow platform capabilities to communicate with approved external systems.

## 16.2 When

Events and integrations are used when:

- A domain must notify another domain of a change.
- A workflow must continue asynchronously.
- A process must coordinate multiple capabilities.
- An approved external system must exchange information with the platform.

## 16.3 Where

Events belong to the domain that produces them.

Integration contracts belong to the responsible platform boundary.

## 16.4 Why

Event-driven communication allows domains to remain independently owned while coordinating business workflows.

## 16.5 How

Event contracts must define:

- Event identifier.
- Event name.
- Producing domain.
- Event version.
- Occurrence time.
- Affected record reference.
- Tenant context where applicable.
- Required metadata.
- Consumer expectations.

Events must account for:

- Duplicate delivery.
- Retry behavior.
- Failed processing.
- Ordering where required.
- Idempotency.
- Auditability.
- Recovery.

Avoid including unnecessary sensitive information in event payloads.

## 16.6 Verification

Event processing must demonstrate:

- Correct event ownership.
- Contract compatibility.
- Idempotent processing where required.
- Controlled retries.
- Failure recovery.
- Traceable execution.

---

# 17. Error Handling and Observability

## 17.1 What

Error handling and observability allow the platform to detect, explain, and recover from failures.

## 17.2 When

They are required throughout development, testing, production operation, and support.

## 17.3 Where

They belong in shared technical infrastructure and the relevant application or domain implementation.

## 17.4 Why

A production platform must not depend on developers manually discovering failures or examining raw database behavior.

## 17.5 How

### Error categories

Errors should distinguish:

- Authentication failures.
- Authorization failures.
- Validation failures.
- Business rule failures.
- Knowledge or applicability failures.
- Data integrity failures.
- Integration failures.
- Infrastructure failures.
- Unexpected system failures.

### Logging

Where appropriate, logs should include:

- Correlation identifier.
- Request identifier.
- Tenant context.
- Domain.
- Operation.
- Outcome.
- Error category.
- Timestamp.

Do not log secrets or unnecessary sensitive information.

### Monitoring

Monitor:

- API availability.
- Request failures.
- Processing failures.
- Knowledge execution failures.
- Integration health.
- Database availability.
- Background processing.
- Workflow completion.

Use the existing deployed environment and established monitoring capabilities.

## 17.6 Verification

Verify that failures can be identified and traced without exposing sensitive information.

---

# 18. Testing Standards

## 18.1 What

Testing verifies that platform components behave as designed and comply with their architectural responsibilities.

## 18.2 When

Testing begins during development and continues through integration, release, and production maintenance.

Testing must not be postponed until the end of a sprint.

## 18.3 Where

Tests belong with the project or application whose behavior they verify.

Cross-domain tests belong in the appropriate integration or end-to-end testing boundary.

## 18.4 Why

The platform must verify not only that code executes, but also that authority, security, ownership, and traceability remain intact.

## 18.5 How

### Unit testing

Test:

- Domain services.
- Application services.
- Validators.
- Knowledge processing.
- Calculation logic.
- State transitions.
- Utility functions.

### Integration testing

Test:

- API contracts.
- Database operations.
- Domain interactions.
- Authorization enforcement.
- Tenant isolation.
- Knowledge execution.
- Financial calculations.
- Event processing.

### End-to-end testing

Test complete workflows such as:

- Regulatory knowledge publication.
- Financial methodology approval.
- Customer onboarding.
- Operational record creation.
- Compliance evaluation.
- Financial reporting.
- Binder assembly.
- Surveyor access and response.

### Security testing

Include:

- Unauthorized access.
- Cross-tenant access attempts.
- Record-level access violations.
- Permission changes.
- Revoked access.
- Expired surveyor access.
- Sensitive data exposure.
- Authentication and session handling.

### Historical reproducibility testing

Verify that historical results can be explained using the exact knowledge, methodology, inputs, and versions originally applied.

### Nx affected testing

Use the existing Nx affected workflow to execute relevant builds and tests.

CI must enforce required checks for affected projects.

## 18.6 Verification

A capability cannot be considered complete solely because it works locally.

It must pass its required automated tests, integration checks, security checks, and CI validation.

---

# 19. Deployment and Release Standards

## 19.1 What

Deployment and release standards govern how approved application changes reach the existing production environment.

## 19.2 When

They apply whenever a release, migration, configuration change, or production deployment is prepared.

## 19.3 Where

Use the existing Vercel frontend deployment, Render backend deployment, and established CI/CD pipeline.

## 19.4 Why

Controlled releases protect the operating platform and prevent unreviewed changes from disrupting production.

## 19.5 How

### Release requirements

A release must satisfy:

- Required builds.
- Required automated tests.
- Dependency boundary checks.
- Migration review.
- Security checks.
- Configuration validation.
- Deployment compatibility.
- Release documentation.

### Database changes

Migrations must be reviewed and tested before production deployment.

Application rollback must not be assumed to reverse database changes automatically.

### Knowledge publication

Knowledge publication must follow the responsible knowledge authority's approval and certification process.

Deploying application code does not automatically approve or publish unapproved knowledge.

### Release traceability

Retain:

- Application version.
- Relevant knowledge versions.
- Migration versions.
- Deployment time.
- Release approval.
- Known issues.

## 19.6 Verification

Confirm that the release passed required checks and that deployment and recovery procedures are documented.

---

# 20. Software Change Register

## 20.1 What

The Software Change Register is the controlled record of engineering changes made during each sprint.

## 20.2 When

It must be updated throughout every sprint whenever a material engineering change is proposed, approved, implemented, verified, or rejected.

## 20.3 Where

The register belongs in the engineering documentation and sprint records.

Its exact storage format and location must be standardized in the engineering documentation structure.

## 20.4 Why

The platform needs a reliable history of what changed, why it changed, who approved it, and which parts of the system were affected.

## 20.5 How

Every entry must include:

| Field | Description |
|---|---|
| Change ID | Unique change reference |
| Sprint | Sprint identifier |
| Date | Date of change |
| Project | Affected Nx project |
| Domain owner | Responsible domain |
| Change type | New, modified, removed, migrated, or repaired |
| Description | What changed |
| Reason | Why the change was required |
| Dependencies | Affected projects or contracts |
| Data impact | Schema, migration, or data implications |
| Security impact | Authorization or data-access implications |
| Tests | Verification performed |
| Approval | Required engineering approval |
| Status | Proposed, approved, implemented, verified, or rejected |

### Change classification

Classify changes as:

- New capability.
- Existing capability modification.
- Defect correction.
- Data model change.
- API contract change.
- Knowledge model change.
- Security change.
- Infrastructure or configuration change.
- Dependency change.
- Removal or deprecation.

### Change control

No change may silently:

- Transfer domain ownership.
- Create a new knowledge authority.
- Bypass approved architecture.
- Weaken tenant isolation.
- Alter historical determinations.
- Break an approved public contract.

Changes with architectural impact require review before implementation.

## 20.6 Verification

Every sprint must have an updated register.

Changes must be traceable to the affected projects, approvals, tests, and implementation status.

---

# 21. Engineering Definition of Done

## 21.1 What

The Definition of Done establishes the minimum requirements for declaring an engineering capability complete.

## 21.2 When

It is applied before a task, feature, integration, or sprint deliverable is accepted.

## 21.3 Where

It applies to all engineering teams and all platform domains.

## 21.4 Why

A capability that works locally but violates security, architecture, or knowledge authority is not production-ready.

## 21.5 How

### Technical completion

- [ ] Correct Nx project and domain ownership established.
- [ ] Approved dependency boundaries respected.
- [ ] Public interfaces documented.
- [ ] Backend validation implemented.
- [ ] Authorization enforced.
- [ ] Tenant isolation verified.
- [ ] Database changes migrated and tested.
- [ ] Error handling implemented.
- [ ] Required tests pass.
- [ ] Build and CI checks pass.

### Knowledge and business completion

- [ ] Regulatory requirements represented in Regulatory Knowledge where applicable.
- [ ] Financial definitions and methodologies represented in Financial Knowledge where applicable.
- [ ] Operational ownership established.
- [ ] Applicability responsibility preserved.
- [ ] Historical traceability implemented.
- [ ] Required approval workflows implemented.
- [ ] Evidence relationships preserved.

### Release completion

- [ ] Software Change Register updated.
- [ ] Documentation updated.
- [ ] Deployment requirements reviewed.
- [ ] Migration and recovery approach reviewed.
- [ ] Required release approval obtained.
- [ ] No unresolved critical security or data-integrity issue.

## 21.6 Verification

The responsible engineering lead must confirm the applicable completion criteria before accepting the deliverable.

---

# 22. Engineering Governance and Exceptions

## 22.1 What

Engineering governance controls changes to approved implementation standards.

## 22.2 When

It applies whenever a team proposes an exception, replacement technology, architectural deviation, or change to an established engineering convention.

## 22.3 Where

Governance decisions belong in the engineering decision history and the applicable Software Change Register.

## 22.4 Why

Without controlled exceptions, different teams can gradually introduce incompatible engineering practices.

## 22.5 How

Every proposed exception must document:

1. The standard being changed.
2. The reason for the exception.
3. The affected domains and projects.
4. The technical and security implications.
5. The migration or compatibility impact.
6. The approval decision.

Approved exceptions must be recorded in the engineering decision history.

## 22.6 Verification

No exception is considered approved until its decision and rationale are documented.

---

# 23. Relationship to Other Engineering Documents

This document is part of the Engineering Blueprint.

| Document | Purpose |
|---|---|
| ENG-001 | Master Workflow Catalog |
| ENG-002 | Workflow Diagrams and State Machines |
| ENG-003 | Master Entity Catalog |
| ENG-004 | Entity Relationship Model |
| ENG-005 | Nx Workspace Architecture |
| ENG-007 | Frontend State Management Architecture |
| ENG-008 | Service and Module Catalog |
| ENG-009 | API and Event Contracts |
| ENG-010 | Authorization and Permission Matrix |
| ENG-011 | User Interface and Workspace Specification |
| ENG-012 | Data Architecture |
| ENG-013 | Testing and Quality Strategy |
| ENG-014 | Team Work Packages |
| ENG-015 | Sprint Implementation Packages |

Each engineering document must explain its subject through the same WHAT, WHEN, WHERE, WHY, HOW, and VERIFICATION framework.

The level of detail should reflect the subject, but critical design and implementation decisions must have an explicit rationale.

---

# 24. Implementation Authorization

<**Status: Not Granted**>

This document establishes the proposed technology implementation standards for the Regulatory Intelligence Platform.

It does not authorize:

- Creating new Nx projects.
- Modifying existing libraries.
- Creating or modifying entities.
- Creating or modifying services.
- Creating or modifying APIs.
- Changing database schemas.
- Changing authentication or authorization behavior.
- Changing deployment configuration.
- Beginning sprint implementation.

The engineering blueprint must be completed, reviewed, and explicitly approved before implementation begins.

---

**End of ENG-006 — Technology Implementation Standards**