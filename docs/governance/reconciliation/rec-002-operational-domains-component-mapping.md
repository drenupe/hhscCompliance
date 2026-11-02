# REC-002 — Component-to-Service Mapping and Dependency Reconciliation
## Section 2: Operational Domains (OP-01–OP-12)

**Project:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Evidence:** User-provided `hhscCompliance-develop.zip`  
**Method:** Static ZIP entry/path inspection; targeted file existence inventory  
**Implementation authorization:** NOT GRANTED

## 1. Scope and evidence rules

This section maps the twelve *proposed* operational-domain slots to repository artifacts. A file's existence is **observed**; its domain suitability is **inferred** until code and behavior are verified. No build, tests, database migration, API startup, security testing, or production deployment was performed. Canonical component descriptions must be checked against ENG-008 and ENG-019 before the final registry is signed off. No final Reuse/Modify/Replace/Build classification is granted by this document.

## 2. Operational domain inventory

| Slot | Proposed responsibility | Static repository signal | Assessment |
|---|---|---|---|
| OP-01 | Organization / Provider | `server/src/app/providers/` | Source files observed; runtime unverified |
| OP-02 | Location / Facility | `server/src/app/residential/` | Source files observed; runtime unverified |
| OP-03 | Person and Relationships | `server/src/app/people/` | Source files observed; runtime unverified |
| OP-04 | Employee / Workforce | `server/src/app/people/entities/employee-profile.entity.ts` | Source files observed; runtime unverified |
| OP-05 | Service Delivery | `server/src/app/consumers/` | Source files observed; runtime unverified |
| OP-06 | Contracts and Authorizations | `server/src/app/providers/` | Source files observed; runtime unverified |
| OP-07 | Payroll | `payroll` | No matching TS paths identified in targeted scan; runtime unverified |
| OP-08 | Financial Transactions | `financial` | Source files observed; runtime unverified |
| OP-09 | Service Statistics | `statistics` | No matching TS paths identified in targeted scan; runtime unverified |
| OP-10 | Operational Evidence / Documents | `evidence` | Source files observed; runtime unverified |
| OP-11 | Residential Operations | `server/src/app/fire-drills/` | Source files observed; runtime unverified |
| OP-12 | ISS Operations | `server/src/app/iss/` | Source files observed; runtime unverified |

## 3. Component-by-component evidence and next verification

### OP-01 — Organization / Provider

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/providers/provider.entity.ts`
- `server/src/app/providers/providers.controller.ts`
- `server/src/app/providers/providers.dto.ts`
- `server/src/app/providers/providers.module.ts`
- `server/src/app/providers/providers.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-02 — Location / Facility

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/residential/residential-location.dto.ts`
- `server/src/app/residential/residential-location.entity.ts`
- `server/src/app/residential/residential-locations.controller.ts`
- `server/src/app/residential/residential-locations.module.ts`
- `server/src/app/residential/residential-locations.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-03 — Person and Relationships

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/people/dto/create-clinical-contact-profile.dto.ts`
- `server/src/app/people/dto/create-consumer-care-team-assignment.dto.ts`
- `server/src/app/people/dto/create-consumer-diagnosis.dto.ts`
- `server/src/app/people/dto/create-consumer-guardian.dto.ts`
- `server/src/app/people/dto/create-consumer-legal-status.dto.ts`
- `server/src/app/people/dto/create-consumer-record.dto.ts`
- `server/src/app/people/dto/create-employee-profile.dto.ts`
- `server/src/app/people/dto/create-iss-consumer-assignment.dto.ts`
- `server/src/app/people/dto/create-medicaid-benefits.dto.ts`
- `server/src/app/people/dto/create-person.dto.ts`
- `server/src/app/people/dto/create-residential-assignment.dto.ts`
- `server/src/app/people/dto/end-care-team-assignment.dto.ts`
- … 34 additional matching TypeScript paths in archive

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-04 — Employee / Workforce

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/people/entities/employee-profile.entity.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-05 — Service Delivery

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/consumers/consumers.controller.ts`
- `server/src/app/consumers/consumers.module.ts`
- `server/src/app/consumers/consumers.service.ts`
- `server/src/app/consumers/dto/create-consumer.dto.ts`
- `server/src/app/consumers/dto/update-consumer.dto.ts`
- `server/src/app/consumers/entities/consumer.entity.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-06 — Contracts and Authorizations

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/providers/provider.entity.ts`
- `server/src/app/providers/providers.controller.ts`
- `server/src/app/providers/providers.dto.ts`
- `server/src/app/providers/providers.module.ts`
- `server/src/app/providers/providers.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-07 — Payroll

**Observed candidate files** (up to 12 representative paths):

- No matching TypeScript path was identified by this targeted filename/path scan. **This is not proof that the capability is absent.**

**Assessment:** Capability coverage remains unknown; search alternate naming, entities, migrations, and external integrations before marking Build New.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-08 — Financial Transactions

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/executive/services/financial-health.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-09 — Service Statistics

**Observed candidate files** (up to 12 representative paths):

- No matching TypeScript path was identified by this targeted filename/path scan. **This is not proof that the capability is absent.**

**Assessment:** Capability coverage remains unknown; search alternate naming, entities, migrations, and external integrations before marking Build New.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-10 — Operational Evidence / Documents

**Observed candidate files** (up to 12 representative paths):

- `libs/features/residential/src/lib/residential/pages/home/components/home-environment-evidence-sheet.component.ts`
- `libs/regulatory/knowledge/src/lib/models/evidence-requirement.model.ts`
- `server/src/app/remediation/dto/cap-evidence.dto.ts`
- `server/src/app/remediation/dto/upload-cap-evidence.dto.ts`
- `server/src/app/remediation/entities/cap-evidence.entity.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-11 — Residential Operations

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/fire-drills/fire-drill.entity.ts`
- `server/src/app/fire-drills/fire-drills.controller.ts`
- `server/src/app/fire-drills/fire-drills.dto.ts`
- `server/src/app/fire-drills/fire-drills.module.ts`
- `server/src/app/fire-drills/fire-drills.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

### OP-12 — ISS Operations

**Observed candidate files** (up to 12 representative paths):

- `server/src/app/iss/dto/create-iss-provider.dto.ts`
- `server/src/app/iss/dto/create-iss-staff-log.dto.ts`
- `server/src/app/iss/dto/update-iss-provider.dto.ts`
- `server/src/app/iss/dto/update-iss-staff-log.dto.ts`
- `server/src/app/iss/entities/iss-provider.entity.ts`
- `server/src/app/iss/entities/iss-staff-log.entity.ts`
- `server/src/app/iss/iss.controller.ts`
- `server/src/app/iss/iss.module.ts`
- `server/src/app/iss/iss.service.ts`

**Assessment:** Potential implementation assets exist, but ownership, entity constraints, API coverage, authorization, and test behavior are unverified.

**Verification required:** inspect entity and DTO semantics; trace controllers/services/repositories; check provider and location scoping; review migrations and tests; verify cross-domain dependencies; execute applicable tests when dependencies are available.

**Disposition:** PENDING — Reuse / Modify / Replace / Build New decision requires evidence.

## 4. Cross-domain ownership rules

- Operational Domains own factual records, not regulatory requirements or financial allowability.
- RKE and FKE remain the independent authoritative definition systems under AD-001, AD-002, and AD-007.
- Service delivery records, payroll transactions, and cost-reporting classifications must not be conflated.
- Residential fire-drill records are operational facts; compliance evaluation belongs to Applied Intelligence using certified RKE rules.
- ISS activity logs are operational facts; documentation, billing, and eligibility determinations require their own governed knowledge contracts.
- Shared Intelligence may handle evidence and document infrastructure without owning underlying operational facts.

## 5. Cross-cutting gap register (unverified)

| ID | Question | Evidence needed | Status |
|---|---|---|---|
| OP-G01 | Are provider-scoped foreign keys and access checks consistently enforced? | Entity/service review and tenant-isolation tests | OPEN |
| OP-G02 | Do people, consumer and employee profiles have one canonical identity model? | Entity/migration and API reconciliation | OPEN |
| OP-G03 | Are residential assignments unique and effective-dated? | Constraint and lifecycle tests | OPEN |
| OP-G04 | Are service delivery facts independent of compliance determinations? | Dependency/import and evaluator review | OPEN |
| OP-G05 | Is payroll present as a complete governed operational domain? | Repository-wide semantic search and tests | OPEN |
| OP-G06 | Are financial transactions distinct from financial classification rules? | Entity/service review and FKE mapping | OPEN |
| OP-G07 | Is operational evidence retained with provenance and access controls? | Storage, authorization and audit review | OPEN |
| OP-G08 | Does ISS support reliable service/activity logging and appropriate rights? | Workflow and authorization tests | OPEN |
| OP-G09 | Are provider/location dashboards consuming governed operational contracts? | Frontend/backend contract tests | OPEN |
| OP-G10 | Can historical facts be reconstructed without rewriting released determinations? | Migration, temporal and audit tests | OPEN |

## 6. Suggested verification sequence

1. Lock exact canonical descriptions for OP-01–OP-12 against ENG-008 and ENG-019.
2. Expand path inventory into class-level entity/controller/service/DTO/migration/test references.
3. Trace provider, location, person, consumer, employee, residential and ISS relationships.
4. Review operational evidence and financial/payroll/service statistics using semantic searches, not filenames alone.
5. Verify Nx dependency constraints and API contract ownership.
6. Run builds/tests when dependencies and environment are available; capture commands, dates and outputs.
7. Record evidence-backed disposition per component with decision owner and acceptance gate.

## 7. Decision worksheet

| Component | Verified owner | Current state | Gaps | Decision (Reuse/Modify/Replace/Build) | Evidence | Approver |
|---|---|---|---|---|---|---|
| OP-01 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-02 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-03 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-04 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-05 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-06 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-07 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-08 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-09 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-10 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-11 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |
| OP-12 | Pending | Static paths only | Pending | **Not assigned** | Pending | Pending |

## 8. Exit criteria and handoff

This assessment can be closed only when the twelve canonical component definitions are reconciled, source assets are inspected at class/contract level, cross-domain boundaries are verified, and all disposition decisions are supported by evidence and approved. This document is **not** a claim of functional readiness.

**Next:** REC-002 Section 3 — Regulatory Knowledge Engine component mapping (RKE-01–RKE-11).

**No source files modified. Implementation authorization: NOT GRANTED.**
