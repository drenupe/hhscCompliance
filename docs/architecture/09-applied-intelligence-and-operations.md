# Regulatory Intelligence Platform

# Document 09 — Applied Intelligence and Operations



**Document Version:** 1.0  

**Status:** Proposed Architecture Baseline  

**Architecture Stage:** Applied Intelligence and Operations  

**Implementation Authorization:** Not Granted



\---



## 1. Purpose



This document defines the Applied Intelligence and Operations layer of the Regulatory Intelligence Platform.



It establishes how the platform applies authoritative regulatory and financial knowledge to customer-owned operational and financial information.



The document defines the responsibilities, relationships, workflows, and boundaries of:



\- Compliance Intelligence.

\- Financial Intelligence.

\- Operational domains.

\- Financial Reporting.

\- Financial Binder.

\- Survey Binder and Survey Workspace.

\- Findings and corrective actions.

\- Provider Intelligence Center.

\- Operational workspaces.

\- ISS Operations.

\- Residential Operations.



The objective is to create reusable operational and intelligence capabilities that can serve multiple customers, programs, jurisdictions, and regulatory environments.



## 2. Architectural Position



Applied Intelligence and Operations is Layer 5 of the platform architecture.



It consumes:



1\. Business and operational information.

2\. Regulatory Knowledge Engine outputs.

3\. Financial Knowledge Engine outputs.

4\. Shared Intelligence Services.



It produces:



\- Compliance determinations.

\- Financial determinations.

\- Operational findings.

\- Corrective action workflows.

\- Financial reporting outputs.

\- Evidence packages.

\- Management intelligence.

\- Authorized operational dashboards.



Applied Intelligence does not replace either knowledge authority.



It applies authoritative knowledge to operational facts and preserves the resulting determination and its supporting context.



## 3. Applied Intelligence Principles



The following principles govern this layer.



### 3.1 Knowledge authority remains independent



Regulatory Intelligence uses regulatory knowledge.



Financial Intelligence uses financial knowledge.



Neither capability may redefine the other's authoritative content.



### 3.2 Operational domains own operational activity



Operational capabilities manage the actual work performed by an organization.



Examples include:



\- Residential operations.

\- ISS operations.

\- Workforce operations.

\- Service delivery.

\- Financial operations.

\- Documented business activities.



They do not independently establish regulatory authority.



### 3.3 Applicability connects knowledge to operations



A requirement must be evaluated against the relevant organization, program, service, person, employee, location, transaction, or other applicable subject.



Applicability must be explicit and traceable.



### 3.4 Evidence supports determinations



Evidence must be associated with the relevant operational records and authoritative requirements.



The existence of a document does not automatically establish compliance or financial acceptability.



### 3.5 Determinations remain traceable



Every material determination must retain its originating authority, definition, knowledge pack version, operational inputs, evidence references, execution context, and result.



## 4. Applied Intelligence Capability Model



The platform provides two independent applied intelligence capabilities.



### 4.1 Compliance Intelligence



Compliance Intelligence applies regulatory knowledge to customer operations.



Its responsibilities include:



\- Requirement applicability.

\- Compliance evaluation.

\- Evidence sufficiency evaluation according to governed definitions.

\- Findings.

\- Remediation.

\- Corrective action plans.

\- Reassessment.

\- Compliance reporting.

\- Regulatory change impact assessment.



### 4.2 Financial Intelligence



Financial Intelligence applies financial knowledge to customer financial and operational records.



Its responsibilities include:



\- Financial classification.

\- Cost allowability evaluation.

\- Cost allocation.

\- Reimbursement and rate calculations.

\- Financial validation.

\- Financial reporting.

\- Financial findings.

\- Financial reconciliation.

\- Financial Binder assembly.



### 4.3 Independent conclusions



A compliance determination and a financial determination remain separate even when they concern the same customer, service, employee, location, or transaction.



Combined management reporting may present both, but must preserve their respective authorities and supporting evidence.



## 5. Operational Domain Architecture



Operational domains represent reusable business capabilities.



They are not regulatory knowledge packs and must not contain jurisdiction-specific regulatory conclusions as hardcoded application logic.



### 5.1 Operational domain responsibilities



An operational domain may manage:



\- Operational entities.

\- Business workflows.

\- Scheduling.

\- Assignments.

\- Service activities.

\- Operational documentation.

\- Operational events.

\- Customer-specific configurations.

\- Operational history.



### 5.2 Relationship to regulatory knowledge



A regulatory knowledge pack defines applicable obligations.



An operational domain supplies the business records and activities against which those obligations are evaluated.



Compliance Intelligence connects the two through applicability and validation.



### 5.3 Relationship to financial knowledge



Operational domains may produce information relevant to financial determinations.



Financial Intelligence applies financial classifications, allowability definitions, allocation methodologies, formulas, and reporting definitions to that information.



### 5.4 Reusable domain principle



The same operational capability may serve different customers and jurisdictions.



Customer-specific records remain isolated.



Applicable knowledge packs may differ without requiring the operational capability to be redesigned.



## 6. Residential Operations



### 6.1 Purpose



Residential Operations is a reusable operational capability for organizations managing regulated residential environments.



It manages residential activities, locations, operational records, plans, inspections, events, and supporting documentation.



### 6.2 Core capabilities



Residential Operations may include:



\- Residential location management.

\- Residential assignment management.

\- Emergency preparedness operations.

\- Emergency plan management.

\- Fire drill recording.

\- Inspection management.

\- Safety event recording.

\- Environmental condition monitoring.

\- Residential documentation.

\- Corrective action tracking.

\- Evidence association.



### 6.3 Separation from regulatory knowledge



Residential Operations does not define what every jurisdiction requires.



The applicable Regulatory Knowledge Engine determines:



\- Which residential obligations apply.

\- Which locations or individuals are affected.

\- Required activities and documentation.

\- Applicable frequency or timing.

\- Required evidence.

\- Validation criteria.

\- Effective dates.



Residential Operations records the actual activities and supporting facts.



Compliance Intelligence evaluates those records against the applicable requirements.



### 6.4 Multiple regulatory environments



Residential Operations must not be restricted to Texas HCS.



Different customers may use the same operational capability while being governed by different jurisdictions, programs, licensing structures, and knowledge packs.



### 6.5 Residential operational workspace



The workspace should organize work by operational correction area.



Possible areas include:



\- Emergency Preparedness.

\- Fire and Life Safety.

\- Emergency Plans.

\- Inspections.

\- Environmental Conditions.

\- Medication Operations.

\- Other configured residential activities.



The displayed correction areas must be driven by applicable operational capabilities and knowledge rather than a fixed list of Texas-specific screens.



## 7. Texas HCS Residential Emergency Preparedness



### 7.1 Purpose



Texas HCS Emergency Preparedness is the first regulatory implementation example using Residential Operations.



It demonstrates the complete workflow from authoritative knowledge to operational execution and compliance evaluation.



### 7.2 Architecture



The implementation uses:



\- Texas HCS Regulatory Knowledge Pack.

\- Residential Operations.

\- Applicability definitions.

\- Shared Evidence Service.

\- Shared Validation Service.

\- Document Service.

\- Audit and Traceability.

\- Approval Service where required.

\- Compliance Intelligence.

\- Residential workspace and Provider Intelligence Center.



### 7.3 Operational workflow



The expected workflow is:



1\. The Regulatory Knowledge Engine contains the applicable authoritative requirements.

2\. Applicability determines the affected organization, location, person, or other subject.

3\. Residential Operations provides the appropriate operational activity and record capabilities.

4\. Staff complete applicable operational activities.

5\. Supporting documents and evidence are registered.

6\. Compliance Intelligence requests validation.

7\. The Validation Service executes the authoritative definitions.

8\. Results and findings are preserved.

9\. Corrective actions are assigned where necessary.

10\. Reassessment confirms whether the identified issue has been resolved.



### 7.4 Initial operational areas



The initial implementation should demonstrate the applicable requirements and workflows for:



\- Emergency plans.

\- Fire drills.

\- Emergency preparedness records.

\- Supporting evidence.

\- Validation.

\- Findings.

\- Corrective actions.

\- Reassessment.



The exact regulatory requirements, applicability, evidence expectations, and validation criteria must be certified in the Texas HCS Knowledge Pack before implementation.



### 7.5 Implementation boundary



This is an implementation of a reusable Residential Operations capability governed by Texas HCS knowledge.



It is not a separate Texas-only emergency preparedness application.



## 8. ISS Operations



### 8.1 Purpose



ISS Operations is a reusable operational capability for managing Individualized Skills and Socialization services.



It belongs inside the Regulatory Intelligence Platform.



It must not be hardcoded as a single customer's application.



### 8.2 Core operational capabilities



ISS Operations may include:



\- Participant management.

\- Participant discovery.

\- Individualized planning.

\- Goal management.

\- Objective management.

\- Activity and adventure management.

\- Scheduling.

\- Staff assignment.

\- Service delivery recording.

\- Support observations.

\- Documentation.

\- Evidence management.

\- Progress tracking.

\- Review and reporting.



### 8.3 Participant-centered planning



The operational model must support individualized participant goals and objectives.



Reusable goal and activity templates may assist planning, but they do not replace individualization.



Each participant's objectives must reflect the participant's own strengths, preferences, needs, desired outcomes, and applicable person-directed planning.



### 8.4 Goal and objective management



The ISS capability may provide a standardized goal library with the following skill domains:



1\. Independent Living Skills.

2\. Community Participation.

3\. Socialization and Communication.

4\. Self-Advocacy and Personal Choice.

5\. Money and Consumer Skills.

6\. Transportation and Community Navigation.

7\. Employment and Volunteer Development.

8\. Recreation, Leisure and Wellness.

9\. Problem-Solving and Decision-Making.



Reusable objective templates may be organized within these domains.



Templates are planning resources, not regulatory obligations or automatically assigned participant goals.



### 8.5 Support and progression recording



The capability should support progression indicators such as:



\- Guided.

\- Supported.

\- Independent.



The operational record must also capture the actual assistance, prompts, and support provided.



A progression label alone is insufficient to describe the service delivered.



### 8.6 Activity and adventure management



ISS Operations may include a reusable activity and adventure library.



Examples include:



\- Community shopping.

\- Restaurants.

\- Bowling.

\- Fitness and wellness activities.

\- Museums.

\- Public transportation.

\- Volunteer activities.

\- Community recreation.



Activities provide opportunities for participants to work toward individualized objectives.



The activity itself is not the outcome.



### 8.7 Service delivery and documentation



ISS Operations must distinguish between:



\- Scheduled service.

\- Authorized service.

\- Actual service delivered.

\- Nonbillable activity or time.

\- Staff support provided.

\- Documentation completed.

\- Evidence collected.

\- Financially reportable information.



A scheduled six-hour day does not automatically establish six billable hours.



The system must apply the applicable authorization, service definition, documentation, and billing requirements from the relevant knowledge authorities.



### 8.8 Texas ISS Knowledge Pack



The Texas ISS Knowledge Pack independently defines applicable Texas regulatory requirements.



Potential research areas include:



\- Provider licensing.

\- Applicable service definitions.

\- Individualization.

\- Community-based delivery.

\- Documentation.

\- Staffing and training.

\- Rights and protections.

\- Safety.

\- Incident reporting.

\- Authorization.

\- Billing limitations.



All candidate regulatory sources and requirements must be verified and certified before being treated as authoritative platform knowledge.



### 8.9 Customer separation



The platform, ISS capability, Texas ISS Knowledge Pack, and customer are separate architectural components.



| Component | Responsibility |

|---|---|

| Regulatory Intelligence Platform | Reusable software |

| ISS Operations | Reusable operational capability |

| Texas ISS Knowledge Pack | Authoritative Texas regulatory knowledge |

| LevelUp Adventures | First ISS customer/tenant |

| LevelUp operational records | Customer-owned data |



LevelUp Adventures owns its participant profiles, individualized goals, employees, schedules, adventures, service records, evidence, and progress history.



Another customer may use ISS Operations and the applicable knowledge pack without sharing LevelUp data.



### 8.10 ISS participant journey



The operational workflow should support:



1\. Referral.

2\. Intake.

3\. Participant discovery.

4\. Plan and applicable authorization review.

5\. Individualized goal mapping.

6\. Objective development.

7\. Activity planning.

8\. Authorization and applicability checks.

9\. Service scheduling.

10\. Actual service delivery.

11\. Support and observation recording.

12\. Evidence association.

13\. Validation where applicable.

14\. Progress tracking.

15\. Participant review and plan updates.



### 8.11 Off-site operational documentation



Where required by the applicable rules and operational design, service records should capture actual community locations and the areas in which staff provided support.



The exact required fields and documentation timeframes must come from verified knowledge definitions, not hardcoded assumptions.



## 9. Workforce Operations



### 9.1 Purpose



Workforce Operations manages reusable workforce and staffing activities.



### 9.2 Core capabilities



\- Employee profiles.

\- Qualifications and credentials.

\- Training records.

\- Competency records.

\- Assignments.

\- Scheduling.

\- Role relationships.

\- Workforce documentation.

\- Training renewal tracking.



### 9.3 Regulatory integration



The Regulatory Knowledge Engine defines applicable workforce obligations.



Workforce Operations maintains the underlying employee and training records.



Compliance Intelligence evaluates applicable requirements against those records.



## 10. Financial Operations



### 10.1 Purpose



Financial Operations manages customer-owned financial and transactional activities.



### 10.2 Core capabilities



\- Financial transactions.

\- Payroll and expense records.

\- Vendor records.

\- Financial accounts.

\- Revenue and reimbursement records.

\- Cost center relationships.

\- Operational statistics.

\- Supporting documentation.

\- Reconciliation records.



### 10.3 Financial authority



Financial Operations supplies operational financial facts.



The Financial Knowledge Engine defines authoritative classifications, cost treatment, allowability, allocation methodologies, formulas, and reporting rules.



Financial Intelligence applies those definitions.



## 11. Financial Reporting



### 11.1 Purpose



Financial Reporting applies Financial Intelligence to produce governed financial reporting outputs.



### 11.2 Core capabilities



\- Reporting period management.

\- Financial data assembly.

\- Classification.

\- Allowability evaluation.

\- Allocation.

\- Calculation.

\- Statistical data association.

\- Validation.

\- Exception identification.

\- Report generation.

\- Review and approval.

\- Historical report preservation.



### 11.3 First financial implementation



Texas HCS Cost Reporting is the first financial implementation example.



It must demonstrate the complete financial reporting lifecycle, including:



1\. Financial knowledge pack identification.

2\. Source data collection.

3\. Financial classification.

4\. Allowability evaluation.

5\. Allocation.

6\. Required calculations.

7\. Statistical information.

8\. Validation.

9\. Exception management.

10\. Review and approval.

11\. Report generation.

12\. Financial Binder assembly.

13\. Historical preservation.



The applicable Texas HCS financial rules, forms, reporting periods, and source requirements must be verified before implementation.



### 11.4 Submission boundary



Electronic submission to an external authority is outside the initial implementation scope unless separately researched, designed, and approved.



Generating and approving a report does not automatically authorize external submission.



## 12. Financial Binder



### 12.1 Purpose



The Financial Binder is a first-class applied capability for organizing and preserving financial reporting support.



### 12.2 Binder contents



A Financial Binder may contain:



\- Reporting period information.

\- Financial source records.

\- Transaction detail.

\- Classification results.

\- Allowability determinations.

\- Allocation calculations.

\- Statistical support.

\- Validation results.

\- Supporting evidence.

\- Financial reports.

\- Reviewer comments.

\- Approvals.

\- Finalized snapshots.

\- Historical versions.



### 12.3 Traceability



Every material financial conclusion should be traceable to:



\- Financial Knowledge Engine definition.

\- Knowledge pack version.

\- Source records and versions.

\- Supporting evidence.

\- Calculation or validation execution.

\- Reviewer and approval history.

\- Final reporting output.



### 12.4 Historical integrity



Finalized binders must preserve their original historical contents and references.



Changes create new versions or controlled supplements rather than silently replacing finalized history.



## 13. Survey Binder and Survey Workspace



### 13.1 Purpose



The Survey Binder and Survey Workspace provide a controlled mechanism for external reviewers to inspect authorized provider information.



They remain separate from the Financial Binder.



### 13.2 Surveyor identity



Surveyors must have individually identified accounts.



Surveyor identities are distinct from provider employee identities.



### 13.3 Security requirements



The workspace must support:



\- Multifactor authentication.

\- Individually assigned reviewer access.

\- Provider-level assignment.

\- Location-level scope.

\- Person-level scope where authorized.

\- Record-level scope.

\- Secure document viewing.

\- Large-file streaming.

\- Access expiration.

\- Immediate revocation.

\- Access auditing.

\- Authorized document requests.

\- Provider responses.

\- Controlled downloads where permitted.



### 13.4 Survey Binder contents



A Survey Binder may organize:



\- Requested documents.

\- Authorized evidence.

\- Applicable compliance records.

\- Provider responses.

\- Reviewer requests.

\- Access history.

\- Submission history.

\- Supporting audit references.



### 13.5 Access boundary



Survey access must not bypass normal tenant authorization, Document Service controls, or applicable privacy restrictions.



## 14. Findings and Corrective Action Management



### 14.1 Purpose



The platform provides reusable finding and corrective action workflows.



### 14.2 Finding origins



Findings may originate from:



\- Regulatory validation.

\- Financial validation.

\- Operational inspections.

\- Internal reviews.

\- External survey activity.

\- Authorized human review.



The originating authority and source must remain identifiable.



### 14.3 Finding record



A finding should preserve:



\- Finding ID.

\- Tenant and organization.

\- Originating capability.

\- Authority type.

\- Applicable knowledge pack and definition versions.

\- Affected business records.

\- Evidence references.

\- Severity and status where defined.

\- Description.

\- Responsible owner.

\- Required response.

\- Due date where applicable.

\- Resolution evidence.

\- Closure or reassessment history.



### 14.4 Corrective action workflow



A corrective action may follow:



1\. Finding identified.

2\. Finding reviewed.

3\. Responsibility assigned.

4\. Corrective action defined.

5\. Due date established.

6\. Work performed.

7\. Supporting evidence submitted.

8\. Validation or reassessment performed.

9\. Closure reviewed.

10\. Historical outcome preserved.



### 14.5 Authority boundary



A finding workflow manages remediation.



It cannot independently redefine the underlying regulatory or financial requirement.



## 15. Provider Intelligence Center



### 15.1 Purpose



The Provider Intelligence Center is the customer-facing operational command center.



It presents an integrated view of applicable compliance, financial, and operational information.



### 15.2 Dashboard capabilities



The command center may display:



\- Overall compliance status.

\- Financial reporting status.

\- Outstanding findings.

\- Corrective action deadlines.

\- Residential operational issues.

\- ISS operational activity.

\- Workforce qualifications and training.

\- Location-level issues.

\- Pending approvals.

\- Evidence gaps.

\- Knowledge pack updates.

\- Important operational alerts.



### 15.3 Provider-wide visibility



Provider-wide views should not require a location identifier.



Location-specific workspaces may apply location filters and authorization constraints.



### 15.4 Authority preservation



The dashboard may combine regulatory and financial information for management visibility.



It must not merge their underlying authorities or represent one determination as proof of another.



## 16. Workspaces and User Experience



The platform should provide purpose-built workspaces aligned with operational responsibilities.



### 16.1 Regulatory Workbench



Supports:



\- Regulatory knowledge administration.

\- Source review.

\- Obligation management.

\- Applicability.

\- Knowledge pack lifecycle.

\- Validation definition governance.



### 16.2 Compliance Workbench



Supports:



\- Compliance evaluation.

\- Findings.

\- Evidence review.

\- Corrective actions.

\- Reassessment.

\- Compliance history.



### 16.3 Financial Workbench



Supports:



\- Financial classifications.

\- Cost treatment.

\- Allocation.

\- Calculations.

\- Financial validation.

\- Reporting.

\- Financial exceptions.



### 16.4 Residential Workbench



Supports residential operations, emergency preparedness, fire drills, plans, inspections, evidence, and applicable corrective actions.



Correction areas should be presented before affected locations when that organization of work is appropriate.



### 16.5 ISS Workbench



Supports participant-centered ISS operations, goals, objectives, activities, scheduling, service delivery, documentation, and progress.



### 16.6 Financial Binder Workspace



Supports financial reporting review, supporting records, evidence, approvals, and historical binder access.



### 16.7 Survey Workspace



Supports controlled external reviewer access, document viewing, requests, responses, and audit history.



### 16.8 Knowledge Administration Workspace



Supports independent governance and lifecycle management for regulatory and financial knowledge.



## 17. Operational Workflow Orchestration



Applied workflows may coordinate operational domains and shared intelligence services.



A typical workflow is:



1\. Operational activity occurs.

2\. Operational records are created or updated.

3\. Applicability identifies relevant requirements.

4\. Required evidence is associated.

5\. Compliance or Financial Intelligence requests evaluation.

6\. The shared Validation Service executes the appropriate definition.

7\. Results are recorded with full provenance.

8\. Findings are created where necessary.

9\. Workflows assign remediation.

10\. Evidence is updated.

11\. Reassessment occurs.

12\. Approved outputs become available in workspaces and reports.



Each stage must preserve its originating domain and authority.



## 18. Cross-Domain Operations



The platform may coordinate multiple operational domains.



Examples include:



\- A residential service record connected to a participant record.

\- A workforce qualification connected to a staff assignment.

\- A delivered service connected to financial reporting.

\- A residential event connected to emergency preparedness requirements.

\- An ISS service record connected to an individualized objective and financial support information.



Cross-domain relationships must be explicit and authorized.



A shared person, location, employee, or transaction does not imply that all domains have the same authority or data access.



## 19. Regulatory and Financial Cross-Domain Reporting



The platform may provide combined operational and executive reports.



For example, a report may present:



\- Compliance status.

\- Financial reporting status.

\- Operational performance.

\- Open corrective actions.

\- Workforce readiness.



Each conclusion must preserve its source authority and methodology.



A financial result must not be represented as a regulatory determination.



A regulatory result must not be represented as a financial determination.



## 20. AI Assistance



AI may assist applied intelligence workflows through:



\- Document summarization.

\- Evidence organization.

\- Suggested classifications.

\- Draft explanations.

\- Missing-information detection.

\- Workflow recommendations.

\- Draft corrective action language.

\- Operational trend summaries.

\- Knowledge change impact suggestions.



AI must not:



\- Create authoritative requirements without governance.

\- Invent financial methodologies.

\- Certify compliance.

\- Approve financial reports.

\- Replace authorized human decisions.

\- Bypass access controls.

\- Alter finalized historical records without controlled versioning.



AI-generated material must remain distinguishable from certified knowledge and finalized determinations.



## 21. Security, Tenant Isolation, and Privacy



All applied capabilities must operate within the platform security architecture.



Requirements include:



\- Tenant-isolated operational records.

\- Scoped authorization.

\- Role-based access.

\- Minimum-necessary access.

\- Secure document retrieval.

\- Audited access to sensitive information.

\- Controlled external reviewer access.

\- Retention and disposition policies.

\- Traceable administrative actions.



Customer data must not become part of shared knowledge packs.



Shared knowledge packs must not expose one customer's operational records to another customer.



## 22. Historical Determinations and Traceability



Applied Intelligence must preserve sufficient context to reconstruct material historical determinations.



Each determination should reference:



\- Tenant and organization.

\- Operational domain.

\- Affected records and versions.

\- Originating authority.

\- Knowledge pack and version.

\- Definition and version.

\- Evidence references and versions.

\- Evaluation date.

\- Execution timestamp.

\- Result.

\- Findings.

\- Approval history where applicable.



A change in knowledge or operational records should trigger a new evaluation where required, not silently rewrite the historical result.



## 23. Integration with Shared Intelligence Services



Applied capabilities consume the contracts defined in Document 08.



| Shared service | Applied use |

|---|---|

| Evidence Service | Supporting material and provenance |

| Validation Service | Governed evaluation execution |

| Document Service | Secure document management |

| Audit and Traceability | Historical activity and decisions |

| Change and Version Service | Version references and history |

| Approval Service | Controlled review and authorization |

| Reporting Infrastructure | Report generation and distribution |



Applied capabilities retain their own domain-specific workflows and responsibility boundaries.



## 24. Implementation Sequence



The implementation sequence must preserve the previously established platform roadmap and architecture dependencies.



### 24.1 First financial implementation



Texas HCS Cost Reporting.



The first financial slice should demonstrate the Financial Knowledge Engine and Financial Intelligence lifecycle, with the Financial Binder as a first-class output.



### 24.2 First regulatory implementation



Texas HCS Residential Emergency Preparedness.



The first regulatory slice should demonstrate Residential Operations and the complete regulatory compliance lifecycle.



### 24.3 ISS capability



ISS Operations must be represented as a reusable capability in the target architecture.



Its implementation sequence must be determined during the final architecture integration review based on dependencies, readiness, and business priorities.



It does not automatically replace either established initial vertical slice.



### 24.4 Expansion



After the first slices establish the reusable architecture, additional operational domains and knowledge packs can be introduced without redesigning the platform foundation.



## 25. Implementation Architecture Guidance



The platform should initially remain a modular monolith using the existing Nx, Angular, NestJS, TypeORM, and PostgreSQL architecture.



Applied capabilities should maintain clear module boundaries and contracts.



Implementation should avoid:



\- Texas-specific assumptions in universal operational models.

\- Customer names hardcoded into reusable features.

\- Regulatory rules embedded in UI components.

\- Financial formulas scattered across services.

\- Duplicate evidence or document infrastructure.

\- Direct cross-domain database ownership.

\- Untraceable determinations.

\- Uncontrolled external submissions.



Existing implementation must be reconciled against this target architecture before changes are authorized.



## 26. Implementation Readiness Requirements



Before implementing an applied capability:



1\. Confirm its operational domain owner.

2\. Identify the applicable knowledge authority.

3\. Define applicability relationships.

4\. Define required operational records.

5\. Define evidence expectations.

6\. Identify shared service contracts.

7\. Define determination and finding lifecycles.

8\. Establish tenant and authorization boundaries.

9\. Identify existing repository modules and affected files.

10\. Define migrations, APIs, and frontend integration.

11\. Establish tests and acceptance criteria.

12\. Record all planned changes in the sprint software change register.

13\. Obtain explicit implementation authorization.



## 27. Open Architecture Decisions



The following items require resolution during the final architecture integration review:



\- Exact boundaries between operational domain modules.

\- Operational domain registration and configuration.

\- Applicability orchestration contracts.

\- Cross-domain event and relationship standards.

\- ISS implementation sequencing.

\- Residential implementation dependencies.

\- Financial reporting integration details.

\- Binder snapshot and finalization mechanisms.

\- Surveyor identity integration.

\- Provider dashboard aggregation and authorization.

\- Historical determination reconstruction requirements.

\- Existing repository reconciliation.



These decisions must be resolved before implementation of the affected capabilities.



## 28. Acceptance Criteria



Document 09 is ready for design acceptance when:



\- Compliance Intelligence and Financial Intelligence remain independent.

\- Operational domains remain separate from knowledge authorities.

\- Residential Operations is reusable across customers and jurisdictions.

\- ISS Operations is reusable and independent of LevelUp Adventures.

\- Texas HCS knowledge packs remain independently governed.

\- Applicability connects authoritative requirements to operational facts.

\- Financial Reporting uses the Financial Knowledge Engine.

\- Financial Binder is a first-class capability.

\- Survey Binder and Survey Workspace remain separate.

\- Findings and corrective actions preserve authority and traceability.

\- Provider-wide visibility does not require a location identifier.

\- Tenant isolation applies throughout applied operations.

\- AI remains an assisting capability, not an authority.

\- The first financial and regulatory vertical slices retain their approved sequence.

\- No implementation is authorized by this document alone.



\---



## Document 09 Completion Statement



This document establishes the proposed Applied Intelligence and Operations architecture for the Regulatory Intelligence Platform.



It connects independent regulatory and financial knowledge authorities to reusable operational capabilities, shared intelligence services, and customer-facing workflows.



Residential Operations, ISS Operations, Financial Reporting, Financial Binder, and Survey Workspace are defined as distinct capabilities operating within one coherent platform.



**Next stage:** Final Architecture Integration Review — Documents 01–09, architectural decisions, and Master Sprint Roadmap.



**Status:** Proposed for architecture review and acceptance. No implementation authorization is granted.

