# Engineering Deliverable 03 — Master Entity Catalog

**Project:** Regulatory Intelligence Platform  
**Organization:** McCaskill Projects  
**Document ID:** ENG-003  
**Version:** 1.0  
**Status:** Draft — Engineering Blueprint  
**Implementation Authorization:** Not Granted  
**Architecture Alignment:** Approved Platform Architecture Baseline  
**Predecessors:**
- ENG-001 — Master Workflow Catalog
- ENG-002 — Workflow Diagrams and State Machines

---

# 1. Purpose

The Master Entity Catalog defines the conceptual data entities required to build the Regulatory Intelligence Platform.

It establishes:

- What entities the platform must manage.
- What each entity represents.
- Which domain owns each entity.
- Which entities reference other domains.
- Which entities are authoritative.
- Which entities represent operational facts.
- Which entities preserve regulatory and financial knowledge.
- Which entities record evaluations, decisions, evidence, approvals, and historical results.
- Which entities must remain tenant-isolated.
- Which entities require historical reproducibility.

This catalog is the foundation for the Entity Relationship Model, database architecture, service catalog, API contracts, authorization matrix, and implementation packages.

## 1.1 Design Principle

The platform must maintain strict ownership of information.

**Knowledge authorities define what must be satisfied. Operational domains record what actually happened. Shared services execute approved processes. Applied Intelligence evaluates and presents results.**

The platform must never allow an operational record, customer template, AI-generated explanation, or user-entered value to silently become an authoritative regulatory or financial determination.

## 1.2 Scope

This catalog defines conceptual entities and their ownership.

It does not yet define:

- Final database table names.
- Physical database schemas.
- TypeORM entity implementations.
- API endpoints.
- NestJS modules.
- Angular libraries.
- Exact field types or database constraints.
- Migration scripts.

Those decisions will be developed in the appropriate engineering deliverables.

---

# 2. Entity Classification and Ownership

Every entity must have one clearly identified owning domain.

An entity may reference information owned by another domain, but referencing information does not transfer ownership.

## 2.1 Platform Domain Ownership

| Domain ID | Domain | Primary Responsibility |
|---|---|---|
| DOM-01 | Platform Foundation | Identity, tenancy, access, security, and platform configuration |
| DOM-02 | Business and Operational Domains | Organizations, people, employees, locations, services, and operational records |
| DOM-03 | Regulatory Knowledge Engine | Regulatory sources, requirements, interpretations, applicability, and regulatory versions |
| DOM-04 | Financial Knowledge Engine | Financial definitions, classifications, methodologies, rates, formulas, and reporting rules |
| DOM-05 | Shared Intelligence Services | Evidence, validation execution, documents, change, audit, approval, reporting, and binder management |
| DOM-06 | Applied Intelligence and Operations | Compliance evaluation, financial intelligence, findings, corrective actions, and reports |
| DOM-07 | User Experience and Workspaces | Workspace configurations, user workspaces, and presentation preferences |

## 2.2 Entity Ownership Rules

1. Every entity has one owning domain.
2. Cross-domain relationships use defined references and contracts.
3. A domain cannot change another domain's authoritative records without an authorized operation.
4. Regulatory requirements are owned exclusively by the Regulatory Knowledge Engine.
5. Financial definitions and methodologies are owned exclusively by the Financial Knowledge Engine.
6. Operational domains own the records describing actual business activity.
7. Shared services execute approved definitions but do not create regulatory or financial authority.
8. Applied Intelligence records the results of evaluations and decisions without replacing the underlying authority.
9. Customer-specific records must remain tenant-isolated.
10. Historical records must remain reproducible.

---

# 3. Platform Foundation Entities

**Owner: DOM-01 — Platform Foundation**

These entities establish the platform's identity, tenancy, security, and configuration infrastructure.

## 3.1 Tenancy and Organization Identity

| Entity | Purpose | Principal Attributes |
|---|---|---|
| PlatformTenant | Represents an independently isolated customer or tenant | Tenant ID, name, status, creation date |
| TenantConfiguration | Stores tenant-specific platform configuration | Tenant ID, configuration key, value, version |
| Organization | Represents a legal or operating organization | Organization ID, legal name, organization type, status |
| OrganizationRelationship | Records relationships between organizations | Parent organization, related organization, relationship type, effective dates |
| OrganizationRegistration | Records external registration identifiers | Organization ID, jurisdiction, registration type, registration number |
| OrganizationContact | Stores organization-level contact information | Organization ID, contact type, contact value, effective dates |

**Ownership boundary:** PlatformTenant establishes isolation. Organization represents the business identity. The two must not be treated as interchangeable.

## 3.2 Identity and Authentication

| Entity | Purpose | Principal Attributes |
|---|---|---|
| UserAccount | Represents a platform user identity | User ID, username, email, status |
| UserProfile | Stores user-facing identity information | User ID, display name, contact details |
| AuthenticationCredential | Represents authentication credential metadata | User ID, credential type, credential status |
| MultiFactorAuthentication | Records MFA enrollment and verification configuration | User ID, method, enrollment status |
| AuthenticationSession | Represents an authenticated session | User ID, session ID, issued time, expiry, revocation |
| ExternalIdentity | Links an account to an external identity provider | User ID, provider, external subject |
| AccountRecoveryRequest | Tracks authorized account recovery | User ID, request status, verification status |
| SecurityEvent | Records security-related events | Event type, actor, timestamp, outcome |

Credentials and authentication secrets must be protected and must never be exposed through ordinary application APIs.

## 3.3 Authorization and Access Control

| Entity | Purpose | Principal Attributes |
|---|---|---|
| Role | Defines a named access role | Role ID, name, description |
| Permission | Defines an individual authorized action | Permission ID, resource, action |
| RolePermission | Associates permissions with roles | Role ID, permission ID |
| UserRoleAssignment | Assigns a role to a user within an authorized scope | User ID, role ID, scope, effective dates |
| AccessPolicy | Defines an access policy | Policy ID, resource, conditions, effect |
| AccessAssignment | Records a specific access grant | Principal, resource, scope, grantor, expiry |
| AuthorizationDecision | Records an authorization result when required for traceability | Actor, resource, action, decision, timestamp |
| AccessRevocation | Records the removal of an access grant | Assignment ID, revocation reason, timestamp |

Authorization must be evaluated at the resource and record level, not merely at the screen or menu level.

## 3.4 Platform Governance

| Entity | Purpose | Principal Attributes |
|---|---|---|
| PlatformConfiguration | Stores platform-wide configuration | Configuration key, value, version |
| FeatureDefinition | Defines a platform feature | Feature ID, name, status |
| FeatureAssignment | Controls feature availability by scope | Feature ID, tenant, status |
| IntegrationDefinition | Defines an external integration | Integration ID, provider, configuration reference |
| IntegrationConnection | Records a tenant's integration connection | Tenant ID, integration ID, connection status |
| NotificationDefinition | Defines notification types and behavior | Notification type, delivery configuration |
| NotificationRecord | Records a notification instance | Recipient, type, status, timestamps |
| ScheduledOperation | Represents a scheduled platform operation | Operation type, schedule, status |

---

# 4. Business and Operational Domain Entities

**Owner: DOM-02 — Business and Operational Domains**

These entities describe the organizations using the platform and the work they perform.

Operational domains are reusable capabilities. They are not restricted to Texas HCS or any single regulatory program.

## 4.1 Organization Operations

| Entity | Purpose | Principal Attributes |
|---|---|---|
| BusinessLocation | Represents a physical or operational location | Location ID, organization ID, location type, address, status |
| LocationRelationship | Records relationships between locations | Parent location, related location, relationship type |
| BusinessUnit | Represents an internal operating unit | Unit ID, organization ID, name, status |
| ServiceDefinition | Represents a service offered by an organization | Service ID, name, description, service category |
| ServiceAssignment | Records an organization's service at a location or for a customer | Service ID, location, effective dates, status |
| Contract | Represents an organizational contract or agreement | Contract ID, organization, contract type, effective dates, status |
| ContractParty | Records parties associated with a contract | Contract ID, organization or party reference, role |
| ContractService | Associates a service with a contract | Contract ID, service ID, scope |
| ContractAmendment | Records an amendment to a contract | Contract ID, amendment number, effective date, document reference |

A contract's legal and financial interpretation must be governed by the appropriate knowledge authority where applicable.

## 4.2 People and Individual Records

| Entity | Purpose | Principal Attributes |
|---|---|---|
| Person | Represents an individual receiving or interacting with services | Person ID, identifying information, status |
| PersonIdentifier | Records an identifier associated with a person | Person ID, identifier type, value, issuing authority |
| PersonContact | Stores contact information | Person ID, contact type, value |
| PersonRelationship | Records a person's relationship to another person | Person ID, related person, relationship type |
| PersonLegalRepresentative | Records an authorized representative relationship | Person ID, representative, authority type, effective dates |
| PersonAuthorization | Records an applicable service or participation authorization | Person ID, authorization type, effective dates, status |
| PersonPlan | Represents an individual service or support plan | Person ID, plan type, effective dates, status |
| PersonPlanVersion | Preserves a version of an individual plan | Plan ID, version, approval status, effective date |
| PersonPreference | Records individual preferences relevant to services | Person ID, preference category, description |
| PersonSupportNeed | Records identified support needs | Person ID, support category, description |
| PersonOutcome | Records an individual's desired outcome | Person ID, outcome, source plan, status |

Sensitive person information must be subject to restricted access and appropriate privacy controls.

## 4.3 Workforce Operations

| Entity | Purpose | Principal Attributes |
|---|---|---|
| Employee | Represents an employee of an organization | Employee ID, organization, status |
| EmployeeProfile | Stores employment-related profile information | Employee ID, position, employment dates |
| EmploymentRelationship | Records an employment relationship | Employee ID, organization, effective dates |
| Position | Defines an organizational position | Position ID, title, department |
| EmployeeAssignment | Assigns an employee to a location or operating function | Employee ID, assignment scope, effective dates |
| Qualification | Defines a qualification or credential | Qualification ID, name, issuing authority |
| EmployeeQualification | Records a qualification held by an employee | Employee ID, qualification, issue and expiry dates |
| TrainingDefinition | Defines a training requirement or program | Training ID, subject, version |
| TrainingCompletion | Records completion of training | Employee ID, training ID, completion date, evidence reference |
| CompetencyAssessment | Records an assessment of workforce competency | Employee ID, assessment type, result, assessor |
| StaffSchedule | Represents planned staffing coverage | Location, employee, scheduled period |
| StaffAttendance | Records actual attendance or work time | Employee, location, time period, attendance status |

A training definition is not automatically a regulatory requirement. Where mandatory training is required by regulation, the requirement must be represented in the Regulatory Knowledge Engine.

## 4.4 Residential Operations

**Residential Operations is a reusable operational domain.**

It owns residential operational records, not the regulatory requirements used to evaluate them.

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ResidentialLocation | Represents a residential service location | Location ID, organization, location type, status |
| ResidentialOccupancy | Records occupancy at a residential location | Location, person, start date, end date |
| ResidentialAssignment | Associates a person with a residential setting | Person, location, assignment dates |
| ResidentialSafetyInspection | Records a residential safety inspection | Location, inspection type, date, result |
| EnvironmentalMonitoringRecord | Records monitored environmental conditions | Location, measurement type, value, timestamp |
| FireDrill | Records an actual fire drill | Location, drill date, participants, outcome |
| EmergencyPlan | Represents an emergency plan | Location, plan type, status |
| EmergencyPlanVersion | Preserves an emergency plan version | Plan ID, version, approval date, effective date |
| EmergencyEvent | Records an actual emergency event | Location, event type, start and end times |
| EmergencyResponseRecord | Records the response to an emergency | Event, responder, action, timestamp |
| SafetyEquipment | Represents safety equipment at a location | Location, equipment type, identifier, status |
| EquipmentInspection | Records an equipment inspection | Equipment, inspection date, outcome |
| MaintenanceRecord | Records maintenance activity | Location or equipment, work performed, date |
| CorrectiveMaintenanceAction | Records corrective maintenance | Related inspection, action, completion status |

Residential records can be evaluated against applicable regulatory knowledge without embedding those regulatory requirements inside Residential Operations.

## 4.5 ISS Operations

**ISS Operations is a separate reusable operational domain and is not a subtype of Residential Operations.**

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ISSServiceProgram | Represents an organization's ISS operating program | Organization, program configuration, status |
| ISSParticipant | Represents an individual's participation in an ISS program | Person, program, participation status |
| ISSEnrollment | Records enrollment and effective dates | Participant, enrollment date, status |
| ISSIndividualizedGoal | Represents an individualized participant goal | Participant, goal statement, source plan, status |
| ISSGoalObjective | Represents a measurable objective associated with an individualized goal | Goal, objective statement, measurement criteria |
| ISSGoalTemplate | Defines a reusable starting structure for goal development | Template name, domain, version |
| ISSActivityDefinition | Defines an activity that may support individualized objectives | Activity type, description, category |
| ISSActivitySession | Records an actual delivered activity session | Participant, activity, location, start and end times |
| ISSServiceDeliveryRecord | Records an actual ISS service delivery | Participant, provider, date, service period |
| ISSSupportObservation | Records support and assistance actually provided | Participant, employee, observation, support type |
| ISSProgressRecord | Records progress toward an individualized objective | Objective, observation period, measured result |
| ISSCommunityLocation | Records a community location used for an activity | Location, address, location category |
| ISSStaffAssignment | Assigns staff to ISS service delivery | Employee, participant or session, assignment period |
| ISSReviewRecord | Records a participant progress or plan review | Participant, review date, outcome |

### ISS Entity Governance Rules

1. ISS Operations owns actual participant goals, objectives, activities, support observations, service records, and progress records.
2. The Regulatory Knowledge Engine owns Texas ISS regulatory requirements.
3. A customer may configure its goal templates and activity library within authorized boundaries.
4. A template is not an individualized goal.
5. A planned activity is not proof that a service occurred.
6. An activity record is not proof that an individualized objective was achieved.
7. Actual support and assistance must be recorded independently of planned activities.
8. Historical participant records must not be silently rewritten when templates change.

## 4.6 Financial Operations

**Financial Operations is an operational domain, not the Financial Knowledge Engine.**

It records actual financial activity and source information.

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialAccount | Represents an organization's financial account | Organization, account type, account identifier reference |
| FinancialTransaction | Records an actual financial transaction | Account, date, amount, transaction type |
| FinancialTransactionLine | Records an individual transaction line | Transaction, account classification reference, amount |
| FinancialDocument | Represents a source financial document | Document reference, document date, document type |
| FinancialCategoryAssignment | Records an operational classification assignment | Transaction, category reference, assigned by |
| FinancialPeriod | Represents an organization's financial period | Organization, start date, end date, status |
| Budget | Represents an operating budget | Organization, period, status |
| BudgetLine | Records an individual budget allocation | Budget, category, amount |
| PayrollRecord | Records payroll information | Employee, pay period, gross amount, net amount |
| PayrollLine | Records an individual payroll component | Payroll record, component type, amount |
| Vendor | Represents a supplier or payee | Organization, vendor identity, status |
| VendorInvoice | Represents a vendor invoice | Vendor, invoice number, date, total |
| PaymentRecord | Records an actual payment | Payee, date, amount, payment reference |
| CostAllocationRecord | Records an operational allocation of costs | Source transaction, allocation basis, allocated amount |
| ServiceStatistic | Records actual service activity statistics | Service, period, quantity, unit |
| RevenueRecord | Records revenue activity | Organization, source, date, amount |

**Boundary:** Financial Operations records what was paid, received, incurred, scheduled, or recorded. The Financial Knowledge Engine determines the authoritative definitions and methodologies for financial classification, allowability, allocation, calculations, and reporting.

---

# 5. Regulatory Knowledge Engine Entities

**Owner: DOM-03 — Regulatory Knowledge Engine**

This domain is the authoritative source of regulatory knowledge.

No operational domain, customer configuration, or AI process may independently establish regulatory requirements.

## 5.1 Regulatory Jurisdiction and Authority

| Entity | Purpose | Principal Attributes |
|---|---|---|
| RegulatoryJurisdiction | Represents a jurisdiction | Name, jurisdiction type, geographic scope |
| RegulatoryAuthority | Represents an issuing or enforcing authority | Authority name, jurisdiction, authority type |
| RegulatoryProgram | Represents a regulated program | Program name, jurisdiction, authority |
| RegulatoryFramework | Represents a regulatory framework | Name, jurisdiction, version |
| RegulatoryInstrument | Represents a regulation, statute, rule, order, or other instrument | Instrument type, title, issuing authority |
| RegulatorySource | Represents an authoritative source publication | Source type, publisher, source identifier |
| RegulatorySourceVersion | Preserves a specific source version | Source, publication date, effective date, artifact reference |
| RegulatorySourceLocation | Identifies a specific section, page, provision, or citation | Source version, location reference |
| RegulatoryCitation | Represents a formal regulatory citation | Citation text, instrument, provision reference |

## 5.2 Regulatory Requirement Model

| Entity | Purpose | Principal Attributes |
|---|---|---|
| RegulatoryRequirement | Represents an authoritative regulatory obligation | Requirement ID, statement, category, authority |
| RegulatoryRequirementVersion | Preserves a requirement's approved version | Requirement, version, effective dates, status |
| RequirementComponent | Represents a distinct part of a requirement | Requirement version, component type, statement |
| RequirementCondition | Records conditions that activate a requirement | Requirement, condition definition |
| RequirementApplicability | Records approved applicability of a requirement | Requirement, jurisdiction, program, subject scope |
| RequirementException | Represents an authoritative exception or exclusion | Requirement, exception condition, source |
| RequirementDependency | Records a dependency between requirements | Source requirement, related requirement, relationship type |
| RequirementEvidenceDefinition | Defines acceptable evidence associated with a requirement | Requirement, evidence type, criteria |
| RequirementEvaluationDefinition | Defines the approved evaluation logic for a requirement | Requirement, evaluation method, version |

## 5.3 Regulatory Interpretation and Knowledge Governance

| Entity | Purpose | Principal Attributes |
|---|---|---|
| RegulatoryInterpretation | Records an approved interpretation | Requirement, interpretation, status |
| InterpretationVersion | Preserves an interpretation version | Interpretation, version, approval status |
| InterpretationSource | Links an interpretation to supporting sources | Interpretation, source version, citation |
| RegulatoryDefinition | Defines a regulatory concept | Name, definition, authority reference |
| RegulatoryTerm | Defines an authoritative regulatory term | Term, definition, source |
| RegulatoryRelationship | Records relationships between regulatory concepts | Source concept, target concept, relationship type |
| RegulatoryIssue | Tracks an unresolved regulatory interpretation issue | Issue, owner, status |
| RegulatoryReview | Records a review of regulatory knowledge | Reviewer, scope, outcome |
| RegulatoryApproval | Records formal approval of regulatory knowledge | Approver, version, decision, date |
| RegulatoryChange | Records a detected or identified regulatory change | Source, change type, detection date |
| RegulatoryImpactAssessment | Records the impact of a regulatory change | Change, affected requirements, impact |
| RegulatorySupersession | Records replacement or supersession of knowledge | Previous version, replacement version, effective date |

## 5.4 Knowledge Pack Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| RegulatoryKnowledgePack | Represents a governed collection of regulatory knowledge | Pack ID, name, jurisdiction, program |
| RegulatoryKnowledgePackVersion | Preserves an immutable published pack version | Pack, version, status, effective date |
| KnowledgePackRequirement | Associates requirements with a pack version | Pack version, requirement version |
| KnowledgePackDependency | Records pack dependencies | Pack version, dependency, version |
| KnowledgePackValidation | Records validation of a knowledge pack | Pack version, result, validation date |
| KnowledgePackRelease | Records formal publication of a pack version | Pack version, approver, release date |
| KnowledgePackApplicability | Defines the programs and contexts where a pack applies | Pack version, scope, effective dates |

## 5.5 Regulatory Applicability

| Entity | Purpose | Principal Attributes |
|---|---|---|
| RegulatoryApplicabilityRule | Represents an approved rule determining when a requirement applies | Requirement, condition, version |
| RegulatoryApplicabilityAssessment | Records an applicability determination | Requirement, subject, inputs, result |
| RegulatoryApplicabilityEvidence | Links supporting facts to an applicability assessment | Assessment, evidence reference |
| RegulatoryApplicabilityException | Records an approved exception or unresolved applicability issue | Assessment, exception type, status |

The Regulatory Knowledge Engine owns regulatory applicability.

Operational domains provide verified facts and context. The shared Applicability Contract executes approved applicability definitions and preserves the determination.

Missing facts must produce an unresolved or insufficient-information result rather than an invented determination.

---

# 6. Financial Knowledge Engine Entities

**Owner: DOM-04 — Financial Knowledge Engine**

This domain is the authoritative source for financial definitions, classifications, methodologies, calculations, rates, and reporting rules.

It is independent of the Regulatory Knowledge Engine.

## 6.1 Financial Authority and Framework

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialJurisdiction | Represents a financial jurisdiction or governing scope | Name, scope, effective dates |
| FinancialAuthority | Represents a financial authority or standard-setting body | Authority name, authority type |
| FinancialFramework | Represents an accounting, funding, reimbursement, or reporting framework | Framework name, authority, version |
| FinancialInstrument | Represents a financial statute, standard, policy, or official instruction | Instrument type, title, authority |
| FinancialSource | Represents an authoritative financial source | Source type, publisher, source identifier |
| FinancialSourceVersion | Preserves a specific financial source version | Source, publication date, effective date |
| FinancialCitation | Represents a formal financial source citation | Citation, source version, location |

## 6.2 Financial Definitions and Classifications

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialDefinition | Defines an authoritative financial concept | Name, definition, authority |
| FinancialDefinitionVersion | Preserves a definition version | Definition, version, effective dates |
| FinancialClassification | Defines an approved financial classification | Classification name, category, framework |
| FinancialClassificationVersion | Preserves a classification version | Classification, version, effective dates |
| FinancialCategory | Represents an approved financial category | Category name, category type |
| FinancialAccountDefinition | Defines a financial account concept | Account code, name, classification |
| CostCategory | Defines an authoritative cost category | Category, definition, authority |
| CostPrinciple | Defines an authoritative cost principle | Principle, description, source |
| AllowabilityDefinition | Defines financial allowability criteria | Definition, conditions, source |
| FinancialRelationship | Records relationships between financial concepts | Source concept, target concept, relationship type |

## 6.3 Financial Methodologies and Calculations

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialMethodology | Represents an approved financial methodology | Name, purpose, authority, version |
| FinancialMethodologyVersion | Preserves a methodology version | Methodology, version, effective dates |
| AllocationMethod | Defines an approved cost allocation method | Method name, basis, conditions |
| AllocationMethodVersion | Preserves an allocation method version | Method, version, effective dates |
| CalculationDefinition | Defines an approved financial calculation | Name, formula reference, inputs, outputs |
| CalculationVersion | Preserves a calculation definition version | Calculation, version, effective dates |
| CalculationParameter | Defines a parameter used in a calculation | Calculation, parameter name, constraints |
| CalculationExecution | Records execution of an approved calculation | Definition version, inputs, outputs, timestamp |
| CalculationResult | Records a calculated result | Execution, result type, value |
| FinancialRate | Represents an authoritative financial rate | Rate type, value, authority |
| FinancialRateVersion | Preserves a rate version | Rate, value, effective dates |
| ReimbursementDefinition | Defines a reimbursement methodology or model | Name, program, conditions |
| ReimbursementRate | Represents an applicable reimbursement rate | Rate type, value, scope, effective dates |

## 6.4 Financial Reporting Knowledge

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialReportDefinition | Defines an official or management financial report | Report name, purpose, authority |
| FinancialReportVersion | Preserves a report definition version | Report, version, effective dates |
| FinancialReportLine | Defines a report line | Report version, line identifier, description |
| FinancialReportMapping | Maps operational or financial information to report lines | Source definition, report line, mapping |
| FinancialReportingSchedule | Defines a reporting period or submission schedule | Report, schedule, due dates |
| FinancialReportingRule | Defines an authoritative reporting rule | Report, rule, source |
| FinancialReportingApplicability | Defines when a financial reporting rule applies | Rule, subject, scope, effective dates |
| FinancialValidationDefinition | Defines an approved financial validation | Rule, validation logic, version |
| FinancialReconciliationDefinition | Defines an approved reconciliation method | Method, accounts or categories, rules |

## 6.5 Financial Knowledge Governance

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialKnowledgePack | Represents a governed financial knowledge collection | Pack ID, name, jurisdiction, framework |
| FinancialKnowledgePackVersion | Preserves an immutable published version | Pack, version, status, effective date |
| FinancialPackDefinition | Associates financial definitions with a pack | Pack version, definition version |
| FinancialPackMethodology | Associates methodologies with a pack | Pack version, methodology version |
| FinancialPackValidation | Records pack validation | Pack version, result, date |
| FinancialPackApproval | Records formal approval | Pack version, approver, decision |
| FinancialChange | Records an identified financial source or rule change | Source, change type, date |
| FinancialImpactAssessment | Records the impact of a financial change | Change, affected definitions, impact |
| FinancialApplicabilityAssessment | Records an approved financial applicability determination | Rule, subject, inputs, result |

The Financial Knowledge Engine owns financial applicability. Regulatory applicability cannot be inferred from financial classifications or methodologies.

---

# 7. Shared Intelligence Services Entities

**Owner: DOM-05 — Shared Intelligence Services**

These services support both knowledge authorities and the applied intelligence domains.

They execute approved processes without becoming a third knowledge authority.

## 7.1 Evidence Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| EvidenceRecord | Represents a piece of evidence | Evidence ID, type, owner, source |
| EvidenceVersion | Preserves a version of evidence | Evidence, version, artifact reference |
| EvidenceRelationship | Links evidence to requirements, records, or findings | Evidence, target reference, relationship type |
| EvidenceClassification | Records evidence classification | Evidence, classification, sensitivity |
| EvidenceVerification | Records verification of evidence | Evidence, verifier, result, date |
| EvidenceCollection | Groups related evidence | Collection name, scope, owner |
| EvidenceCollectionItem | Associates evidence with a collection | Collection, evidence reference |
| EvidenceRequest | Records a request for evidence | Requestor, recipient, scope, due date |
| EvidenceResponse | Records a response to an evidence request | Request, evidence reference, response date |

Evidence records must retain source ownership, provenance, version, access restrictions, and audit history.

## 7.2 Document Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| DocumentRecord | Represents a managed document | Document ID, owner, document type |
| DocumentVersion | Preserves a document version | Document, version, storage reference |
| DocumentMetadata | Stores document descriptive metadata | Document, metadata key, value |
| DocumentRelationship | Links documents to business records | Document, target reference, relationship type |
| DocumentClassification | Defines document classification | Document, classification, sensitivity |
| DocumentRetentionPolicy | Defines retention requirements | Policy, scope, retention period |
| DocumentHold | Records a legal or administrative hold | Document or scope, hold reason, status |
| DocumentAccessRecord | Records document access | Actor, document, action, timestamp |

## 7.3 Validation Execution

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ValidationDefinitionReference | References an approved validation definition | Authority, definition, version |
| ValidationExecution | Records a validation execution | Validation reference, subject, inputs, status |
| ValidationResult | Records an individual validation outcome | Execution, result, severity, message |
| ValidationIssue | Records an issue identified during validation | Result, issue type, status |
| ValidationException | Records an exception to validation execution | Execution, reason, approval |
| ValidationEvidenceLink | Links validation results to supporting evidence | Result, evidence reference |

Validation ownership is divided into three distinct responsibilities:

- Operational validation belongs to the operational domain.
- Regulatory validation uses definitions owned by the Regulatory Knowledge Engine.
- Financial validation uses definitions owned by the Financial Knowledge Engine.

Shared Validation Service executes the definitions and preserves traceability.

## 7.4 Change Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ChangeRecord | Represents a proposed or completed change | Change ID, type, owner, status |
| ChangeVersion | Preserves a change version | Change, version, description |
| ChangeImpactAssessment | Records an impact assessment | Change, affected objects, assessment |
| ChangeApproval | Records approval of a change | Change, approver, decision |
| ChangeImplementationRecord | Records implementation of a change | Change, implementation date, result |
| ChangeHistory | Preserves the sequence of change events | Change, event, actor, timestamp |

## 7.5 Approval Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ApprovalDefinition | Defines an approval process | Process name, scope, conditions |
| ApprovalRequest | Represents an approval request | Request type, subject, requester, status |
| ApprovalAssignment | Assigns an approval to an authorized approver | Request, approver, due date |
| ApprovalDecision | Records an approval decision | Request, decision, actor, date |
| ApprovalCondition | Defines conditions required for approval | Request type, condition, mandatory status |
| ApprovalHistory | Preserves approval activity | Request, action, actor, timestamp |

Approval requirements must be defined by the relevant business capability and authority. Shared Approval Management executes and records them.

## 7.6 Audit and Traceability

| Entity | Purpose | Principal Attributes |
|---|---|---|
| AuditEvent | Records an auditable event | Actor, action, resource, timestamp |
| AuditEventDetail | Records relevant event details | Event, attribute, prior value, new value |
| AuditCorrelation | Links related audit events | Correlation ID, event reference |
| ProvenanceRecord | Records the origin and lineage of information | Source, transformation, destination |
| DecisionTrace | Preserves the inputs and references supporting a decision | Decision, inputs, authority, versions |
| HistoricalSnapshot | Preserves a historical state for reproducibility | Subject, version, effective date |
| ExecutionTrace | Records the steps taken during a process execution | Execution, step, result, timestamp |

Historical traceability must preserve the exact source and knowledge versions used at the time of an evaluation or calculation.

## 7.7 Binder Management

Binder Management is a shared platform capability.

A binder organizes and references records. It does not replace ownership of source records.

| Entity | Purpose | Principal Attributes |
|---|---|---|
| BinderDefinition | Defines a binder family and its behavior | Binder type, owner capability, configuration |
| BinderInstance | Represents an individual binder | Binder ID, type, owner, scope, status |
| BinderVersion | Preserves a version of a binder | Binder, version, created date |
| BinderSection | Defines an organizational section | Binder, section name, sequence |
| BinderItem | Represents a reference to a record or document in a binder | Binder, source reference, item type |
| BinderItemVersion | Preserves a binder item's historical reference state | Item, version, source version |
| BinderAccessAssignment | Records access to a binder | Principal, binder, scope, expiry |
| BinderReview | Records a binder review | Binder, reviewer, outcome |
| BinderApproval | Records formal binder approval | Binder, approver, decision |
| BinderRelease | Records release of a binder | Binder, release date, release authority |
| BinderClosure | Records closure of a binder | Binder, closure date, reason |
| BinderArchiveRecord | Records archival of a binder | Binder, archive date, retention reference |
| BinderLegalHold | Records a legal hold on a binder | Binder, hold reason, status |

### Initial Binder Families

1. Provider Survey Binder.
2. Residential Survey Binder.
3. ISS Survey Binder.
4. Personnel Survey Binder.
5. Financial Binder.

New binder families must be introduced through governed configuration and defined capabilities.

The binder framework must support type-specific lifecycle and approval rules without redesigning the platform.

### Binder Lifecycle

The common lifecycle is:

- Draft
- Assembling
- Under Review
- Approved
- Released
- Closed
- Archived

Type-specific rules may add controlled states or transitions.

---

# 8. Applied Intelligence and Operations Entities

**Owner: DOM-06 — Applied Intelligence and Operations**

This domain coordinates operational evaluation and presents results using approved regulatory and financial knowledge.

It does not own regulatory requirements or financial methodologies.

## 8.1 Compliance Intelligence

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ComplianceEvaluation | Represents a compliance evaluation | Subject, scope, pack version, execution date |
| ComplianceEvaluationItem | Represents an individual requirement evaluation | Evaluation, requirement version, result |
| ComplianceFinding | Represents an identified compliance issue | Finding ID, severity, source evaluation, status |
| FindingAssignment | Assigns responsibility for remediation | Finding, owner, assigned date |
| CorrectiveActionPlan | Represents a corrective action plan | Finding, plan, owner, status |
| CorrectiveAction | Represents an individual corrective action | Plan, action, due date, status |
| CorrectiveActionEvidence | Links evidence to corrective action | Action, evidence reference |
| ComplianceReassessment | Records a reassessment | Finding, evaluation, result |
| ComplianceStatusHistory | Preserves status changes | Subject, prior status, new status, date |
| ComplianceDashboardSnapshot | Preserves a dashboard reporting state | Scope, period, snapshot date |

A finding is an applied evaluation result, not a new regulatory requirement.

## 8.2 Financial Intelligence

| Entity | Purpose | Principal Attributes |
|---|---|---|
| FinancialAnalysis | Represents an analysis of financial information | Scope, period, methodology version |
| FinancialAnalysisItem | Represents an individual analyzed item | Analysis, source record, result |
| FinancialClassificationResult | Records an applied financial classification | Source transaction, definition version, result |
| FinancialAllowabilityAssessment | Records an allowability assessment | Financial item, definition version, result |
| FinancialAllocationExecution | Records execution of an approved allocation method | Methodology version, inputs, result |
| FinancialReportingExecution | Represents execution of a financial report | Report version, period, inputs, status |
| FinancialReportInstance | Represents a specific report | Organization, report type, period, status |
| FinancialReportLineResult | Records a calculated or mapped report line | Report instance, line definition, value |
| FinancialReconciliation | Represents a reconciliation process | Scope, period, status |
| FinancialReconciliationItem | Records an individual reconciliation item | Reconciliation, source, variance |
| FinancialReview | Records review of financial results | Report or analysis, reviewer, outcome |
| FinancialCertification | Records an authorized financial certification | Report, certifier, date, status |
| FinancialBinderInstance | Represents an instance of a Financial Binder | Organization, period, report references, status |

Financial Intelligence must preserve the exact financial knowledge versions, source records, calculation inputs, and approval history used to produce each report.

## 8.3 Applied Reporting and Executive Intelligence

| Entity | Purpose | Principal Attributes |
|---|---|---|
| ReportDefinition | Defines a platform reporting output | Report name, purpose, owner |
| ReportExecution | Records report generation | Definition version, scope, period, status |
| ReportInstance | Represents a generated report | Execution, output reference, status |
| ReportApproval | Records report approval | Report, approver, decision |
| ReportRelease | Records authorized report release | Report, release date, recipient scope |
| ManagementIndicator | Defines an operational or management indicator | Indicator name, owner, definition |
| IndicatorValue | Records an indicator value for a period | Indicator, period, value |
| DashboardDefinition | Defines a dashboard | Dashboard name, audience, scope |
| DashboardSnapshot | Preserves a dashboard state | Dashboard, scope, period, timestamp |

Management indicators must remain distinguishable from official regulatory determinations and formal financial reports.

---

# 9. Survey Workspace and External Surveyor Entities

**Ownership:** Platform Foundation for identity and authorization; Shared Intelligence Services for document and binder infrastructure; Applied Operations for survey workflows.

The Survey Workspace is a secure collaboration environment. It is not a replacement for the source records or the Survey Binder.

## 9.1 Survey Event Management

| Entity | Purpose | Principal Attributes |
|---|---|---|
| SurveyEvent | Represents a survey or review event | Event ID, organization, event type, dates, status |
| SurveyScope | Defines the scope of a survey | Event, locations, records, review period |
| SurveyAssignment | Assigns a surveyor to an event | Event, surveyor, assigned scope |
| SurveyorIdentity | Represents an external surveyor identity | Identity ID, external account reference, status |
| SurveyorOrganization | Records the surveyor's external organization | Surveyor, organization, relationship |
| SurveyorAccessGrant | Grants event-specific access | Surveyor, event, scope, expiry |
| SurveyorAccessRevocation | Records revocation of surveyor access | Grant, reason, timestamp |
| SurveyorMFAEnrollment | Records surveyor MFA enrollment | Surveyor, method, status |

Surveyor identities must remain separate from provider employee accounts.

## 9.2 Survey Requests and Responses

| Entity | Purpose | Principal Attributes |
|---|---|---|
| SurveyRequest | Represents a surveyor request | Event, surveyor, requested item, due date |
| SurveyRequestItem | Represents an individual requested record or document | Request, item description, scope |
| SurveyResponse | Represents a provider response | Request, provider responder, status |
| SurveyResponseItem | Represents an individual response item | Response, source reference, response status |
| SurveyCommunication | Records communication within the survey event | Event, sender, recipient, timestamp |
| SurveyReviewNote | Records an authorized survey review note | Event, author, note, date |
| SurveyActivityRecord | Records survey workspace activity | Actor, event, activity type, timestamp |
| SurveyDownloadRecord | Records an authorized document download | Actor, document, timestamp, scope |
| SurveySession | Represents a secure survey workspace session | Surveyor, event, issued time, expiry |

Survey access must be limited to assigned provider, event, location, and record scope.

Access to a binder does not automatically grant access to every underlying source record. Both permissions must be evaluated.

---

# 10. User Experience and Workspace Entities

**Owner: DOM-07 — User Experience and Workspaces**

These entities support the presentation and configuration of platform workspaces.

They do not own underlying business or knowledge records.

| Entity | Purpose | Principal Attributes |
|---|---|---|
| WorkspaceDefinition | Defines a workspace type | Workspace name, owner capability, configuration |
| WorkspaceInstance | Represents a user's or organization's workspace | Workspace, tenant, scope, status |
| WorkspaceAssignment | Assigns workspace access | User, workspace, scope |
| WorkspacePreference | Stores user workspace preferences | User, preference key, value |
| NavigationDefinition | Defines navigation structure | Workspace, route, hierarchy |
| DashboardLayout | Defines dashboard presentation | Dashboard, layout configuration |
| SavedView | Represents a saved user or organizational view | Owner, view definition, scope |
| WorkQueue | Represents a work queue | Queue name, owner capability, status |
| WorkQueueItem | Represents an item assigned to a queue | Queue, source reference, priority |
| UserNotificationPreference | Stores notification preferences | User, notification type, delivery preference |

## 10.1 Initial Workspace Inventory

The platform will support:

1. Provider Intelligence Center.
2. Regulatory Workbench.
3. Financial Workbench.
4. Residential Operations Workspace.
5. ISS Operations Workspace.
6. Workforce Operations Workspace.
7. Financial Operations Workspace.
8. Survey Workspace.
9. Financial Binder Workspace.
10. Survey Binder Workspace.
11. Knowledge Administration Workspace.
12. Executive Intelligence Workspace.

These are presentation capabilities. They must not create duplicate ownership of the entities managed by their respective domains.

---

# 11. Cross-Domain Entity Relationships

The following relationships establish the primary ownership and integration patterns.

| Source Entity | Related Entity | Relationship |
|---|---|---|
| PlatformTenant | Organization | Tenant contains or governs organizational records |
| Organization | BusinessLocation | Organization operates locations |
| Organization | Employee | Organization employs or engages workforce |
| Organization | Person | Organization serves or manages individual records |
| Person | PersonPlan | Individual has plans |
| Person | ISSParticipant | Individual participates in ISS |
| Person | ResidentialAssignment | Individual may have residential assignment |
| Employee | TrainingCompletion | Employee completes training |
| BusinessLocation | ResidentialLocation | A business location may be designated as residential |
| RegulatoryKnowledgePackVersion | RegulatoryRequirementVersion | Pack includes approved requirements |
| RegulatoryRequirementVersion | RequirementEvaluationDefinition | Requirement has approved evaluation logic |
| FinancialKnowledgePackVersion | FinancialMethodologyVersion | Pack includes approved financial methodology |
| FinancialDefinitionVersion | FinancialClassificationVersion | Financial definitions govern classification concepts |
| OperationalRecord | EvidenceRecord | Operational records may provide evidence |
| EvidenceRecord | ComplianceEvaluationItem | Evidence may support an evaluation |
| ComplianceEvaluation | ComplianceFinding | Evaluation may produce findings |
| ComplianceFinding | CorrectiveActionPlan | Finding may require remediation |
| FinancialTransaction | FinancialClassificationResult | Transaction may receive an approved classification |
| FinancialTransaction | FinancialAllowabilityAssessment | Transaction may be assessed for allowability |
| FinancialMethodologyVersion | FinancialAllocationExecution | Methodology governs an allocation execution |
| FinancialReportDefinition | FinancialReportInstance | Definition produces report instances |
| BinderInstance | BinderItem | Binder contains source references |
| SurveyEvent | SurveyAssignment | Event has assigned surveyors |
| SurveyEvent | SurveyRequest | Survey event may contain requests |
| SurveyRequest | SurveyResponse | Provider responds to a request |
| SurveyorIdentity | SurveyorAccessGrant | Surveyor receives scoped access |
| WorkspaceInstance | UserAccount | User accesses authorized workspaces |

The final relationship cardinalities, keys, and constraints will be defined in Deliverable 04.

---

# 12. Common Entity Metadata Standards

The following metadata should be evaluated for each entity during physical data modeling.

Not every field applies to every entity.

## 12.1 Identity

- Unique identifier.
- Owning domain.
- Entity type or classification where required.
- External identifier where applicable.

## 12.2 Tenancy and Scope

- Tenant identifier where tenant-owned.
- Organization identifier where organization-owned.
- Location or business-unit scope where applicable.
- Parent entity reference where required.

## 12.3 Lifecycle

- Status.
- Created timestamp.
- Created by.
- Last updated timestamp.
- Last updated by.
- Effective start and end dates where applicable.
- Version or revision reference where required.

## 12.4 Governance

- Approval status where required.
- Approval reference.
- Source reference.
- Authority reference.
- Retention classification.
- Sensitivity classification.

## 12.5 Historical Integrity

- Version history where required.
- Supersession reference where applicable.
- Immutable publication or release reference where required.
- Historical relationship preservation.

These are modeling standards, not instructions to add every field to every table.

---

# 13. Historical Reproducibility Requirements

The platform must preserve the historical context of important decisions and outputs.

For every regulatory evaluation, financial calculation, report, certification, and binder release, the system must preserve the applicable references.

These may include:

1. Source operational records and versions.
2. Regulatory source and requirement versions.
3. Financial source and methodology versions.
4. Knowledge pack versions.
5. Applicability determination and inputs.
6. Validation definitions and execution results.
7. Evidence references and versions.
8. Calculation inputs and outputs.
9. Approval decisions.
10. Report and binder versions.
11. Actor identity and timestamps.
12. Effective dates and execution dates.

A later knowledge change must not silently rewrite a previous evaluation, calculation, report, or certification.

A new execution must create a new traceable result.

---

# 14. Security, Privacy, and Tenant Isolation

Every entity must be classified according to ownership, sensitivity, and access requirements.

The data architecture must enforce:

- Tenant isolation.
- Organization-level separation.
- Record-level authorization.
- Location and program scope restrictions where applicable.
- Restricted access to person records.
- Restricted access to workforce records.
- Separation of external surveyor identity from provider employee identity.
- MFA for external surveyor access.
- Time-limited access grants.
- Immediate access revocation.
- Document-level access checks.
- Audit history for sensitive access and actions.
- Retention and legal hold controls.

A reference to a record does not grant permission to access that record.

A binder permission does not bypass source-record authorization.

A workspace assignment does not bypass resource-level authorization.

---

# 15. Entity Lifecycle and Immutability Rules

Entities must be classified by their lifecycle behavior.

## 15.1 Mutable Operational Records

Examples:

- BusinessLocation.
- EmployeeProfile.
- StaffSchedule.
- ResidentialAssignment.
- EmergencyPlan.
- ISSIndividualizedGoal.
- ISSGoalObjective.
- FinancialTransaction classification assignment.

These records may change through authorized operations, with appropriate history and audit requirements.

## 15.2 Versioned Authority Records

Examples:

- RegulatorySourceVersion.
- RegulatoryRequirementVersion.
- RegulatoryKnowledgePackVersion.
- FinancialDefinitionVersion.
- FinancialMethodologyVersion.
- FinancialRateVersion.
- FinancialKnowledgePackVersion.

Published or approved versions must be preserved. Changes create new versions rather than silently rewriting the historical authority.

## 15.3 Immutable Execution and Decision Records

Examples:

- ComplianceEvaluation.
- ValidationExecution.
- CalculationExecution.
- FinancialReportingExecution.
- ApprovalDecision.
- SurveyActivityRecord.
- AuditEvent.
- BinderRelease.
- FinancialCertification.

Corrections must be handled through controlled amendments, reversals, superseding records, or new executions, according to the relevant lifecycle policy.

## 15.4 Reference and Relationship Records

Examples:

- BinderItem.
- EvidenceRelationship.
- DocumentRelationship.
- RequirementDependency.
- OrganizationRelationship.
- RolePermission.

Relationship changes must preserve history when they affect a historical determination, authorization, or released artifact.

---

# 16. Entity Naming and Modeling Standards

The physical implementation must follow these conventions:

1. Entity names must be singular.
2. Names must describe business meaning, not screen names.
3. Domain ownership must be explicit.
4. Regulatory entities must use regulatory terminology.
5. Financial entities must use financial terminology.
6. Operational entities must describe actual business activity.
7. Shared services must use neutral terminology.
8. Applied Intelligence entities must represent results, executions, findings, or reports.
9. Workspace entities must not duplicate business records.
10. Entity names must not contain jurisdiction-specific assumptions unless the entity is explicitly jurisdiction-specific.
11. Versioned authority entities must clearly identify version ownership.
12. Cross-domain references must use explicit contracts.

---

# 17. Explicitly Prohibited Modeling Patterns

The following patterns are not permitted:

### 17.1 Regulatory Authority Embedded in Operational Entities

Do not embed regulatory requirements directly into Residential Operations, ISS Operations, or Workforce Operations entities as the authoritative source.

Operational entities may reference approved requirements.

### 17.2 Financial Authority Embedded in Transaction Records

Do not treat an operational transaction classification as the authoritative financial definition or methodology.

Financial Operations records facts. Financial Knowledge defines approved financial treatment.

### 17.3 Combined Regulatory and Financial Knowledge

Do not combine RegulatoryRequirement and FinancialDefinition into a single generic authority entity.

They have separate owners, lifecycles, governance, and applicability rules.

### 17.4 Duplicate Source Records in Binders

Do not copy source business records into binders as independent authoritative records.

Binders reference source records and preserve the relevant historical reference or approved snapshot where required.

### 17.5 AI as an Authority

AI-generated interpretations, classifications, summaries, or recommendations must not become authoritative without the required governance and approval process.

### 17.6 Customer Templates as Regulatory Authority

Customer templates cannot override approved regulatory requirements or financial definitions.

### 17.7 Workspace-Owned Business Data

A workspace must not become the owner of the operational records displayed inside it.

---

# 18. HCS Cost Reporting — First Financial Implementation

HCS Cost Reporting is the first financial vertical slice.

It will use the universal financial entity model rather than create a separate HCS-only financial architecture.

The implementation will require the following entity groups:

**Financial Operations**
- FinancialAccount
- FinancialTransaction
- FinancialTransactionLine
- FinancialDocument
- FinancialPeriod
- PayrollRecord
- PayrollLine
- ServiceStatistic
- RevenueRecord
- CostAllocationRecord

**Financial Knowledge Engine**
- FinancialFramework
- FinancialSource
- FinancialDefinition
- FinancialClassification
- CostCategory
- CostPrinciple
- AllowabilityDefinition
- FinancialMethodology
- AllocationMethod
- CalculationDefinition
- FinancialReportDefinition
- FinancialReportLine
- FinancialReportingRule
- FinancialKnowledgePackVersion

**Financial Intelligence**
- FinancialAnalysis
- FinancialClassificationResult
- FinancialAllowabilityAssessment
- FinancialAllocationExecution
- FinancialReportingExecution
- FinancialReportInstance
- FinancialReportLineResult
- FinancialReconciliation
- FinancialReview
- FinancialCertification
- FinancialBinderInstance

The exact HCS reporting requirements, source documents, financial definitions, formulas, reporting lines, and applicability rules must be represented and validated in the Financial Knowledge Engine before implementation.

No HCS-specific formula or reporting rule should be hardcoded as an independent authority in the reporting service.

---

# 19. Engineering Deliverable Dependencies

This catalog establishes the input for the next engineering documents.

| Deliverable | Dependency on ENG-003 |
|---|---|
| ENG-004 — Entity Relationship Model | Defines relationships, cardinalities, keys, and constraints |
| ENG-005 — Nx Workspace Architecture | Maps entity ownership to domain libraries and dependency boundaries |
| ENG-006 — Technology Implementation Standards | Defines how entities are implemented using the existing stack |
| ENG-007 — Service and Module Catalog | Defines the services responsible for entity operations |
| ENG-008 — API and Event Contracts | Defines access and integration contracts |
| ENG-009 — Authorization and Permission Matrix | Defines access to entities and operations |
| ENG-010 — User Interface and Workspace Specification | Maps entities to user workflows and workspaces |
| ENG-011 — Data Architecture | Defines physical storage, tenancy, indexing, versioning, and retention |

---

# 20. Master Entity Catalog Acceptance Criteria

ENG-003 is ready for formal approval when:

- [ ] All platform domains have defined entity ownership.
- [ ] Regulatory and Financial Knowledge Engines remain independent.
- [ ] Business and Operational Domains are reusable and jurisdiction-neutral.
- [ ] Residential Operations and ISS Operations remain separate domains.
- [ ] Financial Operations is distinct from the Financial Knowledge Engine.
- [ ] Shared Intelligence Services do not own regulatory or financial authority.
- [ ] Compliance Intelligence and Financial Intelligence are distinct.
- [ ] Surveyor identity is separated from provider employee identity.
- [ ] Survey Binder and Financial Binder are distinct binder families.
- [ ] Binder Management is modeled as a shared capability.
- [ ] Cross-domain relationships preserve source ownership.
- [ ] Historical reproducibility requirements are established.
- [ ] Tenant isolation and record-level authorization are established.
- [ ] HCS Cost Reporting can be implemented using the universal financial model.
- [ ] No existing repository entities have been adopted merely because they already exist.
- [ ] The catalog is sufficiently defined to support the Entity Relationship Model.

---

# 21. Implementation Authorization

**This document is an engineering design artifact only.**

Approval of this catalog does not authorize:

- Database creation.
- Entity implementation.
- Migration generation.
- API implementation.
- Service implementation.
- Frontend implementation.
- Changes to existing application modules.

Implementation authorization will occur through the approved engineering and sprint planning process.

Before implementation, the platform's new entity architecture must be modeled, reviewed, and mapped to domain ownership and dependency boundaries.

The existing repository will be evaluated against the approved blueprint after the new design is complete. Existing code will not dictate the new platform architecture.

---

# 22. Document Control

| Field | Value |
|---|---|
| Document ID | ENG-003 |
| Document Name | Master Entity Catalog |
| Version | 1.0 |
| Status | Draft |
| Owner | McCaskill Projects |
| Architecture Authority | Regulatory Intelligence Platform |
| Implementation Authorization | Not Granted |
| Next Deliverable | ENG-004 — Entity Relationship Model |

**End of Document**