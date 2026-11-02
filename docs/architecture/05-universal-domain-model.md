# Regulatory Intelligence Platform

# Document 05 — Universal Domain Model



**Document Version:** 1.0  

**Status:** Proposed Architecture Baseline  

**Architecture Scope:** Universal, jurisdiction-neutral platform domain model  

**Related Documents:** 01 Current Architecture Baseline; 02 Security and Tenant Isolation; 03 Master Sprint Roadmap; 04 Platform Architecture  

**Implementation Status:** Design only — no implementation authorization



\---



## 1. Purpose



This document defines the universal domain model for the Regulatory Intelligence Platform.



The domain model establishes the business entities, relationships, ownership boundaries, and historical records required to support multiple organizations, jurisdictions, regulatory programs, and financial reporting environments.



The model must support Texas HCS as an initial implementation environment without making Texas HCS requirements mandatory attributes of the universal platform.



The platform must also support reusable operational capabilities, including Individualized Skills and Socialization (ISS), without coupling those capabilities to a single customer or regulatory knowledge pack.



This document establishes the domain foundation for the Regulatory Knowledge Engine, Financial Knowledge Engine, Shared Intelligence Services, Compliance Intelligence, and Financial Intelligence.



## 2. Core Design Principles



The universal domain model follows these principles:



1\. **Jurisdiction neutrality:** Core entities must not depend on one state's regulatory terminology or data requirements.

2\. **Tenant isolation:** Customer-owned operational records must be isolated by tenant.

3\. **Organization independence:** A tenant may contain one or more organizations, subject to the platform's tenancy policy.

4\. **Knowledge separation:** Regulatory and financial knowledge are independently governed authorities.

5\. **Operational separation:** Business facts and customer records are not regulatory knowledge.

6\. **Version preservation:** Historical records and the versions used to evaluate them must remain traceable.

7\. **Evidence traceability:** Evidence must be linked to the business record, requirement, or validation it supports.

8\. **Extensibility:** Program-specific attributes belong in extensions or specialized domain models, not universal core entities.

9\. **Reusable capabilities:** Operational capabilities must be reusable across customers.

10\. **AI is not authority:** AI may assist with extraction, explanation, and recommendations, but cannot independently establish authoritative regulatory or financial rules.



## 3. Universal Domain Boundaries



The universal model is organized around the following business domains:



| Domain | Primary responsibility |

|---|---|

| Tenancy and Organization | Customer ownership and organizational structure |

| Jurisdiction and Program | Regulatory geography and program participation |

| Contracts | Contractual relationships and scope |

| Locations | Physical and operational service locations |

| People | Individuals receiving services and related parties |

| Workforce | Employees and workforce assignments |

| Services | Service definitions, assignments, and delivery |

| Financial Operations | Transactions, payroll, costs, allocations, and reporting inputs |

| Documents and Evidence | Business documents and supporting evidence |

| Identity and Authorization | Users, roles, permissions, and scoped access |

| Audit and History | Historical changes and traceability |

| Data Intake | Imports, mappings, and reconciliation |

| Operational Capabilities | Reusable business workflows such as ISS |



These domains are universal platform concepts. Specific jurisdictions and programs may add requirements through governed extensions.



## 4. Tenancy and Organization



### 4.1 Tenant



Represents the customer boundary within the platform.



Responsibilities:



\- Establish customer data isolation.

\- Own or administer customer organizations.

\- Define tenant-level configuration.

\- Control tenant membership and access.

\- Establish tenant-specific operational settings.



A tenant is not a regulatory knowledge pack and is not itself a regulatory authority.



### 4.2 Organization



Represents a legal or operational organization associated with a tenant.



Examples include:



\- A service provider.

\- A corporate parent.

\- A subsidiary.

\- An operating organization.



An organization may participate in multiple jurisdictions or programs.



### 4.3 OrganizationProfile



Stores organization-specific business information, including:



\- Legal name.

\- Doing-business-as name.

\- Organization type.

\- Registration identifiers.

\- Contact information.

\- Address information.

\- Business status.



Jurisdiction-specific licensing information must be modeled through appropriate relationships or extensions.



### 4.4 OrganizationMembership



Connects users or authorized representatives to an organization.



Membership must support scoped access and must not automatically grant access to every organization belonging to the same tenant.



## 5. Jurisdiction and Program



### 5.1 Jurisdiction



Represents the geographic or governmental authority under which regulatory requirements may apply.



Examples:



\- United States.

\- State of Texas.

\- Other state or national jurisdictions.



### 5.2 Program



Represents a regulated service, funding, licensing, or operational program.



Examples may include:



\- Texas HCS.

\- Texas TxHmL.

\- Texas DBMD.

\- Other state or federal programs.



Programs must not be hardcoded into universal entities.



### 5.3 OrganizationJurisdiction



Establishes the jurisdictions in which an organization operates.



### 5.4 OrganizationProgram



Establishes the programs in which an organization participates.



Program participation may include:



\- Enrollment status.

\- Effective dates.

\- Program identifiers.

\- Relevant authorization references.

\- Program-specific profile extensions.



The Regulatory Knowledge Engine determines applicable requirements. The OrganizationProgram record supplies business context and does not itself define the law.



## 6. Contract



### 6.1 Contract



Represents a contractual relationship between an organization and another party.



Potential contract relationships include:



\- Government agencies.

\- Managed care organizations.

\- Business partners.

\- Vendors.

\- Other contracting entities.



### 6.2 ContractProgram



Connects a contract to an applicable program.



### 6.3 ContractLocation



Connects a contract to locations included within its scope.



Contract records must preserve effective dates, status, amendments, and historical versions.



## 7. Location



### 7.1 Location



Represents a physical or operational location associated with an organization.



Universal attributes may include:



\- Location identifier.

\- Name.

\- Address.

\- Status.

\- Effective dates.

\- Organization relationship.



### 7.2 Facility



Represents a physical facility when additional facility-level information is needed.



A facility may be associated with one or more operational locations, depending on the business model.



### 7.3 LocationAssignment



Connects people, employees, services, and operational responsibilities to locations.



Texas HCS residential classifications and other jurisdiction-specific location attributes must be handled through program-specific models or extensions.



## 8. People



### 8.1 Person



Represents an individual known to the organization.



The universal Person entity must not require a specific program's identifiers or service classifications.



### 8.2 RepresentativeRelationship



Represents a relationship between a person and another individual acting in a representative capacity.



Examples include:



\- Guardian.

\- Authorized representative.

\- Emergency contact.

\- Other legally recognized representative.



The relationship must preserve its type, effective dates, and applicable authority documentation.



### 8.3 ProfessionalContact



Represents professionals associated with a person or service relationship.



Examples include:



\- Physician.

\- Clinician.

\- Case manager.

\- Other professional contacts.



### 8.4 PersonProgramParticipation



Connects a person to an organization and applicable program.



This relationship may contain program-specific information through extensions or specialized models.



## 9. Workforce



### 9.1 Employee



Represents an individual employed or engaged by an organization.



Universal attributes include:



\- Employee identifier.

\- Organization relationship.

\- Employment status.

\- Contact information.

\- Effective dates.



### 9.2 WorkforceAssignment



Connects an employee to:



\- An organization.

\- A location.

\- A service.

\- A role or operational responsibility.



Assignments must preserve historical scope and effective dates.



### 9.3 EmployeeCompensation



Represents compensation arrangements and compensation records.



Compensation data must remain distinct from financial allowability determinations. The Financial Knowledge Engine determines applicable financial treatment.



## 10. Services



### 10.1 ServiceDefinition



Represents a service that an organization may provide.



A service definition may be universal or program-specific.



### 10.2 ServiceAssignment



Connects a person to a service relationship.



It may include:



\- Effective dates.

\- Assigned organization.

\- Location.

\- Authorization reference.

\- Service status.



### 10.3 ServiceDeliveryRecord



Represents an actual service delivery event.



The record should preserve:



\- Person receiving the service.

\- Service delivered.

\- Organization.

\- Location or delivery setting.

\- Date and time.

\- Assigned workforce.

\- Actual delivery information.

\- Supporting documentation.



### 10.4 ServiceStatistic



Represents a measurable operational service quantity.



Examples include:



\- Units.

\- Hours.

\- Attendance.

\- Service days.

\- Other program-defined measures.



A statistic must retain its definition and source. A service statistic is not automatically a billable unit or approved financial value.



## 11. Financial Operations



Financial Operations stores customer business facts. It does not determine authoritative financial treatment.



### 11.1 FinancialAccount



Represents a financial account or accounting classification used by an organization.



### 11.2 FinancialPeriod



Represents an accounting, reporting, or operational period.



The period type and applicable calendar must be explicit.



### 11.3 FinancialTransaction



Represents a financial event recorded by the organization.



Examples include:



\- Payments.

\- Receipts.

\- Purchases.

\- Payroll transactions.

\- Other financial activity.



### 11.4 TransactionLine



Represents the individual lines associated with a financial transaction.



### 11.5 Vendor



Represents a supplier or other business entity involved in financial activity.



### 11.6 PayrollRecord



Represents a payroll processing event or payroll record.



### 11.7 PayrollLine



Represents individual payroll amounts and related details.



### 11.8 TimeEntry



Represents recorded employee time or work activity.



### 11.9 BenefitRecord



Represents employee benefit information and related financial amounts.



### 11.10 RevenueRecord



Represents revenue recorded by the organization.



### 11.11 ExpenseRecord



Represents expenses recorded by the organization.



An expense is not automatically an allowable cost for a particular program or reporting schedule.



### 11.12 PaymentRecord



Represents a payment event.



### 11.13 ClaimRecord



Represents a claim or billing record when applicable to the organization or program.



### 11.14 CostAllocation



Represents an allocation process or allocation decision.



### 11.15 CostAllocationDetail



Represents the individual allocation results and their supporting calculations.



### 11.16 Financial Domain Distinctions



The model must preserve these distinctions:



\- A transaction is not the same as a financial classification.

\- An expense is not automatically an allowable cost.

\- An allocation is not the same as the original transaction.

\- A management accounting value is not automatically an official reporting value.

\- A reimbursement rate is not the same as recorded revenue.

\- A financial calculation must preserve the methodology and version used.



The Financial Knowledge Engine owns authoritative financial classifications, cost principles, allowability rules, allocation methodologies, formulas, and reporting definitions.



## 12. Documents and Evidence



### 12.1 Document



Represents a stored business document.



Examples include:



\- Contracts.

\- Policies.

\- Plans.

\- Financial records.

\- Personnel records.

\- Service documentation.

\- Regulatory source documents.



### 12.2 DocumentRelationship



Connects a document to the relevant organization, person, employee, location, contract, transaction, or other business record.



### 12.3 EvidenceRecord



Represents evidence collected or submitted to support a requirement, finding, validation, or business record.



### 12.4 EvidenceLink



Connects evidence to the relevant subject and preserves its purpose.



Evidence must retain sufficient metadata to identify:



\- Source.

\- Owner.

\- Collection date.

\- Relevant business record.

\- Relevant requirement or validation.

\- Version or integrity information.

\- Review status where applicable.



Evidence storage and evidence evaluation are separate responsibilities.



## 13. Identity and Authorization



### 13.1 User



Represents an authenticated platform user.



### 13.2 Role



Represents a collection of permissions.



### 13.3 Permission



Represents an individual authorized action.



### 13.4 RolePermission



Connects roles to permissions.



### 13.5 UserRoleAssignment



Connects users to roles within a defined scope.



Scope may include:



\- Tenant.

\- Organization.

\- Location.

\- Program.

\- Assigned operational responsibility.



### 13.6 External Reviewer Identity



External reviewers and surveyors must have identities separate from provider employee records.



External access must support:



\- Individual accounts.

\- Strong authentication and MFA.

\- Explicit assignment scope.

\- Time-limited access.

\- Revocation.

\- Auditable activity.

\- Controlled document viewing and downloading.



An external reviewer must not inherit provider employee permissions simply because the reviewer is accessing provider records.



## 14. Audit and Historical Records



### 14.1 AuditEvent



Represents a recorded system or user action.



Audit events should preserve:



\- Actor.

\- Action.

\- Target record.

\- Timestamp.

\- Scope.

\- Relevant request or execution context.

\- Outcome.



### 14.2 RecordVersion



Represents a historical version of a business record.



### 14.3 Historical Relationships



Relationships that affect compliance, financial reporting, or service delivery must preserve effective dates and historical context.



Examples include:



\- Organization-program participation.

\- Employee-location assignments.

\- Person-service assignments.

\- Contract-location relationships.

\- Financial allocations.



### 14.4 Knowledge Version References



Evaluations and financial reporting results must preserve references to the exact knowledge definitions and versions used.



Historical results must not silently change when a knowledge pack is updated.



## 15. Data Intake and Import



### 15.1 ImportBatch



Represents a group of records imported into the platform.



### 15.2 ImportSource



Identifies the originating system or source file.



### 15.3 ImportRecord



Represents an individual imported record.



### 15.4 ImportMapping



Defines how source fields map to platform fields.



### 15.5 ImportReconciliation



Records the results of matching, validation, and reconciliation.



Import processes must preserve original source values and support traceability to the imported record.



Imported financial transactions do not automatically establish allowability.



Imported regulatory documents do not automatically become approved or published knowledge.



## 16. Domain Relationships and Ownership



The following ownership relationships establish the basic model:



| Relationship | Ownership or responsibility |

|---|---|

| Tenant → Organization | Tenant administration and customer ownership |

| Organization → Jurisdiction | Organization operating scope |

| Organization → Program | Organization program participation |

| Organization → Contract | Contractual business relationship |

| Organization → Location | Operational location ownership or administration |

| Person → ProgramParticipation | Person's program relationship |

| Employee → WorkforceAssignment | Workforce placement and responsibility |

| Person → ServiceAssignment | Service relationship |

| ServiceAssignment → ServiceDeliveryRecord | Actual service delivery |

| Organization → FinancialTransaction | Customer financial activity |

| FinancialTransaction → TransactionLine | Transaction detail |

| FinancialTransaction → Evidence | Supporting financial documentation |

| BusinessRecord → Document | Business documentation relationship |

| BusinessRecord → EvidenceRecord | Supporting evidence |

| User → UserRoleAssignment | Scoped platform authorization |

| Record → AuditEvent | Historical action traceability |



The Regulatory Knowledge Engine and Financial Knowledge Engine are separate authorities and are not owned by customer organizations.



Customer operational records must not be treated as shared regulatory knowledge.



## 17. Universal Versus Program-Specific Modeling



Universal entities must remain independent of specific jurisdictional requirements.



For example, a universal Location must not require a Texas HCS residential type.



A universal Person must not require a Texas Medicaid identifier.



A universal ServiceDeliveryRecord must not require a Texas-specific service form.



Program-specific information should be implemented through:



\- Program-specific extension models.

\- Explicit relationships.

\- Specialized domain entities.

\- Governed configuration where appropriate.



Extensions must preserve their program and jurisdiction context.



The universal model must not become a collection of state-specific fields.



## 18. Relationship to the Knowledge Authorities



### 18.1 Regulatory Knowledge Engine



The Regulatory Knowledge Engine defines authoritative regulatory information, including:



\- Jurisdictions.

\- Regulatory authorities.

\- Sources and source versions.

\- Provisions.

\- Obligations.

\- Applicability.

\- Interpretations.

\- Regulatory definitions.

\- Knowledge packs.

\- Approval and publication lifecycle.



It determines which requirements apply to an organization, location, person, service, or other business context.



### 18.2 Financial Knowledge Engine



The Financial Knowledge Engine defines authoritative financial information, including:



\- Financial authorities and sources.

\- Financial source versions.

\- Financial concepts.

\- Classifications.

\- Cost principles.

\- Allowability rules.

\- Allocation methodologies.

\- Reimbursement and rate definitions.

\- Formulas.

\- Reporting schedules and lines.

\- Statistical definitions.

\- Validation definitions.

\- Financial knowledge packs.

\- Approval and publication lifecycle.



### 18.3 Separation of Authority



The two knowledge authorities must remain independent.



A regulatory obligation does not automatically establish a financial classification.



A financial classification does not automatically establish a regulatory obligation.



Shared validation infrastructure may execute definitions from either authority, but must preserve the originating authority and exact definition version.



## 19. Data Integrity and Historical Preservation



The platform must preserve the historical state necessary to reproduce important decisions.



For compliance evaluations and financial calculations, the platform must retain:



\- Tenant and organization context.

\- Jurisdiction and program context.

\- Knowledge authority.

\- Knowledge pack and version.

\- Source and provision references where applicable.

\- Business record identifiers and versions.

\- Evidence references.

\- Validation definition and version.

\- Execution date and context.

\- Result and findings.



Changes to customer business records must not erase the history of prior evaluations.



Changes to regulatory or financial knowledge must not rewrite prior results.



## 20. Security and Privacy Considerations



The domain model must support:



\- Tenant isolation.

\- Organization-level authorization.

\- Location and program scoping.

\- Least-privilege access.

\- Sensitive data protection.

\- Auditable access.

\- Controlled external reviewer access.

\- Document access restrictions.

\- Retention and lawful disposal policies.

\- Historical traceability.



Authorization must be enforced by the platform services and APIs, not merely by hiding information in the user interface.



## 21. Relationship to Existing Implementation



The current repository contains existing Texas HCS and residential implementation work.



The universal model is the target architecture for future reconciliation and controlled evolution.



Existing entities and services must be reviewed and mapped to the universal model before changes are authorized.



This document does not authorize:



\- Destructive schema changes.

\- Deletion of existing entities.

\- Removal of existing functionality.

\- Rewriting of historical data.

\- Replacement of existing uncommitted work.

\- Automatic migration of all existing code.



Existing work must be preserved and evaluated through an explicit reconciliation plan.



## 22. Open Domain Design Decisions



The following matters require resolution during detailed domain review:



1\. Whether a tenant may contain multiple legal organizations.

2\. Whether an organization may belong to multiple tenants.

3\. The standard composition of organization addresses and contact records.

4\. The jurisdiction hierarchy and its representation.

5\. Program versioning and historical participation.

6\. Contract parties and multi-party agreements.

7\. The relationship between Location and Facility.

8\. Person identity matching across imported systems.

9\. The relationship between Employee and Person.

10\. Service definition versioning.

11\. Financial transaction normalization.

12\. Payroll and compensation data boundaries.

13\. Financial period relationships.

14\. Cost allocation history and recalculation policy.

15\. Document storage and retention architecture.

16\. Evidence sufficiency and review workflow.

17\. Audit and record-versioning implementation.

18\. Program extension strategy.

19\. Universal identifier strategy.

20\. Retention requirements by data category.

21\. Shared operational template ownership and customization.

22\. Reusable capability configuration versus customer-specific operational records.

23\. ISS capability implementation sequence and dependencies.



These decisions must be resolved before the affected implementation contracts are finalized.



## 23. Domain Model Acceptance Criteria



The universal domain model is acceptable when:



\- Tenant and organization boundaries are explicit.

\- Customer-owned records have clear ownership.

\- Multiple jurisdictions and programs can be represented.

\- Universal entities do not require Texas HCS-specific fields.

\- Program-specific information has an explicit extension strategy.

\- Financial operations are distinct from financial knowledge.

\- Regulatory requirements are distinct from customer business facts.

\- Evidence and documents have explicit relationships.

\- Identity and authorization are separately modeled.

\- External reviewer identities are distinct from provider employees.

\- Historical records and knowledge versions are traceable.

\- Data intake preserves source information.

\- Reusable operational capabilities are separated from individual customer implementations.

\- The model supports the Regulatory and Financial Knowledge Engines independently.

\- The model can be reconciled with existing implementation without destructive assumptions.



## 24. Customer, Provider, and Platform Separation



The platform must distinguish the software product, reusable operational capabilities, regulatory knowledge packs, and customer organizations.



These are separate architectural concepts.



### 24.1 Platform



The Regulatory Intelligence Platform is the reusable software product.



It provides:



\- Shared platform services.

\- Tenant isolation.

\- Identity and authorization.

\- Knowledge authority infrastructure.

\- Evidence and validation services.

\- Audit and traceability.

\- Operational workspaces.

\- Reusable business capabilities.



The platform is not a customer organization and must not contain customer-specific business records as hardcoded defaults.



### 24.2 Customer Tenant



A customer tenant is the security and operational boundary for a customer using the platform.



A tenant owns or administers its customer-specific operational data according to the platform's tenancy model.



### 24.3 Customer Organization



A customer organization represents the actual legal or operating entity using a platform capability.



The organization may have provider profiles, licenses, contracts, locations, employees, participants, and operational records.



### 24.4 Provider Profile



A Provider Profile represents a provider's participation in a specific jurisdiction or program.



It may contain:



\- Provider identifiers.

\- Licensing information.

\- Program enrollment.

\- Contract relationships.

\- Provider status.

\- Program-specific attributes.



Provider profiles are customer-owned operational records. They are not regulatory knowledge packs.



## 25. Reusable ISS Capability and Customer Independence



### 25.1 ISS Capability



Individualized Skills and Socialization (ISS) is a reusable operational capability within the Regulatory Intelligence Platform.



The ISS capability provides reusable workflows and domain functionality for organizations delivering ISS services.



It must not be hardcoded for one provider.



### 25.2 Texas ISS Knowledge Pack



The Texas ISS Knowledge Pack belongs to the Regulatory Knowledge Engine.



It contains the approved regulatory requirements applicable to Texas ISS operations.



It is centrally governed and independent of any individual customer.



It must not contain LevelUp Adventures' participant records, employees, schedules, service delivery records, or business documents.



### 25.3 Customer-Owned ISS Operational Data



Each provider using the ISS capability owns its own operational records within its tenant boundary.



These records may include:



\- Provider profile and licensing information.

\- Locations.

\- Participants.

\- Participant plans.

\- Individualized goals and objectives.

\- Employee assignments.

\- Adventure schedules.

\- Service delivery records.

\- Support observations.

\- Evidence.

\- Progress records.

\- Reviews.

\- Operational documents.



### 25.4 LevelUp Adventures as the First ISS Customer



LevelUp Adventures is the first customer organization intended to use the ISS capability.



LevelUp Adventures must be represented as a customer tenant or organization under the platform's approved tenancy model.



It must not be embedded into:



\- Universal platform code.

\- The ISS capability definition.

\- The Texas ISS Knowledge Pack.

\- Regulatory source definitions.

\- Shared platform services.



LevelUp Adventures uses the same reusable ISS capability and applicable Texas ISS Knowledge Pack that another eligible provider could use.



Its own participants, staff, goals, activities, schedules, service records, evidence, and business documents remain customer-owned operational data.



### 25.5 Multi-Customer Reusability



The architecture must support another provider using the same ISS capability and the same applicable regulatory knowledge pack without sharing customer-specific records.



The capability is reusable.



The knowledge pack is independently governed.



The customer data remains isolated.



### 25.6 Evaluation Traceability



An ISS compliance evaluation must preserve:



\- Customer tenant and organization.

\- Provider profile.

\- Jurisdiction and program.

\- Regulatory Knowledge Pack and version.

\- Applicable source and provision references.

\- Relevant business record identifiers and versions.

\- Evidence references.

\- Validation definition and version.

\- Evaluation date and result.



This allows the platform to evaluate each customer's actual operations against the same authoritative requirements while preserving independent customer records.



## 26. ISS Operational Domain Model



The ISS capability may introduce specialized operational entities without placing ISS-specific fields into universal core entities.



### 26.1 Participant



Represents an individual receiving ISS services from a provider.



The participant is connected to the universal Person model through an explicit relationship.



### 26.2 ParticipantPlan



Represents the participant's applicable plan and person-directed outcomes.



The plan must preserve source, effective dates, version, and review history.



### 26.3 GoalDomain



Represents a reusable skill-development domain.



The initial LevelUp Adventures concept includes:



1\. Independent Living Skills.

2\. Community Participation.

3\. Socialization and Communication.

4\. Self-Advocacy and Personal Choice.

5\. Money and Consumer Skills.

6\. Transportation and Community Navigation.

7\. Employment and Volunteer Development.

8\. Recreation, Leisure and Wellness.

9\. Problem-Solving and Decision-Making.



These domains are operational organization and planning concepts, not regulatory requirements.



### 26.4 ObjectiveTemplate



Represents a reusable objective pattern that may help staff create individualized objectives.



The initial LevelUp concept includes 72 objective templates, with eight templates per goal domain.



Templates must not become automatically assigned participant goals.



A template must be individualized to the participant's documented outcomes, strengths, preferences, needs, and abilities.



### 26.5 IndividualizedObjective



Represents a participant-specific, measurable objective.



It must be:



\- Individualized.

\- Observable.

\- Measurable.

\- Outcome-oriented.

\- Connected to the applicable plan.

\- Supported by a documented baseline or relevant starting point.

\- Reviewed and updated as appropriate.



### 26.6 AdventureDefinition



Represents a reusable activity or community experience that may support skill development.



Examples include:



\- Shopping.

\- Restaurants.

\- Bowling.

\- Fitness activities.

\- Museums.

\- Public transportation.

\- Volunteering.

\- Community participation activities.



An adventure is a method of delivering an opportunity for skill development. It is not itself proof that an individualized objective was addressed.



### 26.7 AdventurePlan



Represents a planned activity connected to one or more individualized objectives.



It should preserve:



\- Participant.

\- Planned activity.

\- Intended outcomes.

\- Date and time.

\- Location.

\- Assigned workforce.

\- Relevant safety and support considerations.



### 26.8 ServiceAuthorization



Represents the applicable authorization or approved service scope.



The authorization must be checked before service delivery and billing-related processing.



### 26.9 ISSServiceDeliveryRecord



Represents actual ISS service delivery.



It must preserve the actual service date, time, setting, participant, staff, and relevant delivery details.



Planned activities must not be treated as proof that services occurred.



### 26.10 SupportObservation



Represents an observed participant action, response, prompt, or support provided during service delivery.



It should record the actual level and type of support.



### 26.11 ProgressRecord



Represents documented progress toward an individualized objective.



The initial operational progression concept includes:



\- Guided.

\- Supported.

\- Independent.



The progression label alone is insufficient. The record must describe actual performance and assistance or prompts provided.



### 26.12 ProgressReview



Represents a formal review of progress, objectives, and the participant's ongoing plan.



### 26.13 ISS Domain Distinctions



The model must preserve these distinctions:



\- A goal domain is not an individualized objective.

\- An objective template is not a participant's assigned goal.

\- An adventure is not an individualized outcome.

\- A planned activity is not proof of service delivery.

\- Service delivery is not automatically billable.

\- A progression label is not a substitute for documented observations.

\- Evidence must support the actual service and applicable requirement.



### 26.14 Operational Template Governance



Reusable goal domains, objective templates, and adventure definitions are operational resources.



They are not automatically regulatory knowledge.



The architecture must distinguish:



\- Platform-maintained reusable templates.

\- Customer-customized template copies or versions.

\- Participant-specific individualized objectives.

\- Actual customer service delivery and evidence.



The detailed ownership and customization model remains subject to domain review.



## 27. ISS Capability Acceptance Requirements



The ISS domain model is acceptable when:



\- ISS is represented as a reusable platform capability.

\- LevelUp Adventures is represented as a customer organization, not a platform component.

\- The Texas ISS Knowledge Pack remains independently governed.

\- Another eligible provider can use the same capability and knowledge pack.

\- Customer operational records remain tenant-isolated.

\- Participant records connect to the universal Person model.

\- Participant plans and individualized objectives preserve their history.

\- Objective templates are not treated as automatically assigned goals.

\- Adventure planning is distinct from actual service delivery.

\- Service authorization is represented separately.

\- Support observations preserve actual assistance provided.

\- Progress records preserve measurable observations.

\- Compliance evaluations retain knowledge versions, business-record versions, and evidence references.

\- ISS-specific fields do not become mandatory fields in universal entities.



\---



## Document 05 Completion Statement



This document establishes the proposed universal domain model for the Regulatory Intelligence Platform.



It defines the separation between:



1\. The platform and its shared services.

2\. Customer tenants and organizations.

3\. Universal business and operational domains.

4\. Reusable operational capabilities such as ISS.

5\. Regulatory knowledge packs.

6\. Financial knowledge and reporting definitions.

7\. Customer-owned operational records and evidence.



The document is a design baseline for review and acceptance. It does not authorize implementation.



**Next document:** Document 06 — Regulatory Knowledge Engine Architecture.

