# REC-002 — Section 4: Financial Knowledge Engine Component Mapping

**Program:** McCaskill Projects — Regulatory Intelligence Platform
**Version:** 1.0 — Assessment Draft
**Assessment source:** `hhscCompliance-develop.zip` (uploaded repository snapshot)
**Assessment method:** Static ZIP entry inventory and targeted source inspection
**Implementation authorization:** NOT GRANTED
**Runtime/build/test verification:** NOT PERFORMED for this assessment

## 1. Purpose and scope

Map proposed FKE-01 through FKE-13 against observable repository artifacts. This is a repository-to-architecture reconciliation, not a claim that a financial reporting capability works. Component descriptions are **proposed responsibilities**; exact FKE-01–13 titles and boundaries require confirmation against ENG-017 before becoming canonical.

## 2. Executive assessment

The snapshot contains two Angular cost-report placeholder components and an executive financial-health service file. This evidence does **not** demonstrate a complete Financial Knowledge Engine. No verified certification, source provenance, rate resolution, allocation, allowability, reporting methodology, or deterministic financial calculation implementation is established by this inspection. Absence from the targeted inspection is not proof of absence from all code.

## 3. Directly inspected source artifacts

- `libs/features/admin/cost-report/src/lib.ts` — Angular component shell.
- `libs/features/admin/cost-report/src/lib.html` — placeholder text.
- `libs/features/admin/cost-report/src/lib.spec.ts` — component creation test.
- `libs/features/admin/src/lib/cost-report/cost-report.ts` — Angular component shell.
- `libs/features/admin/src/lib/cost-report/cost-report.html` — placeholder text.
- `libs/features/admin/src/lib/cost-report/cost-report.spec.ts` — component creation test.
- `server/src/app/executive/services/financial-health.service.ts` — file present; content not functionally validated.

**Important:** The `should create` tests are smoke tests, not cost-reporting acceptance tests. The financial-health service is not evidence of certified financial knowledge ownership.

## 4. Proposed component mapping matrix

| Component | Proposed responsibility | Static evidence | Initial treatment | Confidence |
|---|---|---|---|---|
| FKE-01 | Financial authority and source intake | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-02 | Financial source interpretation | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-03 | Financial terminology and taxonomy | Financial-health service filename present; no FKE methodology verified | Assess / likely Build or Modify (provisional) | Low |
| FKE-04 | Cost classification knowledge | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-05 | Cost allowability knowledge | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-06 | Allocation methodology knowledge | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-07 | Rate and reimbursement knowledge | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-08 | Financial formula and calculation definitions | Financial-health service filename present; no FKE methodology verified | Assess / likely Build or Modify (provisional) | Low |
| FKE-09 | Reporting schedule and schema knowledge | Cost-report UI placeholder only; no FKE logic verified | Assess / likely Build or Modify (provisional) | Low |
| FKE-10 | Financial knowledge validation | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-11 | Financial review and certification | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-12 | Knowledge pack publication and resolution | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |
| FKE-13 | Change impact and historical reproduction | No dedicated FKE implementation verified in targeted inspection | Assess / likely Build or Modify (provisional) | Low |

## 5. Component-by-component verification requirements

### FKE-01 — Financial authority and source intake

**Target responsibility:** Source acquisition, provenance, authoritative documents.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-02 — Financial source interpretation

**Target responsibility:** Reporting requirements, effective periods, interpretation.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-03 — Financial terminology and taxonomy

**Target responsibility:** Canonical financial concepts and reporting classifications.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-04 — Cost classification knowledge

**Target responsibility:** Certified mapping of transactions to report categories.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-05 — Cost allowability knowledge

**Target responsibility:** Allowable/unallowable rules and exceptions.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-06 — Allocation methodology knowledge

**Target responsibility:** Cost pools, bases, methods, and effective periods.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-07 — Rate and reimbursement knowledge

**Target responsibility:** Authoritative rate schedules, versioned applicability.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-08 — Financial formula and calculation definitions

**Target responsibility:** Precision, rounding, dependency graphs, deterministic execution.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-09 — Reporting schedule and schema knowledge

**Target responsibility:** Report fields, schedules, submission requirements.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-10 — Financial knowledge validation

**Target responsibility:** Structural, semantic, source and consistency checks.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-11 — Financial review and certification

**Target responsibility:** Independent review, approvals, immutable certification.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-12 — Knowledge pack publication and resolution

**Target responsibility:** Versioned releases, effective-date resolution, supersession.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

### FKE-13 — Change impact and historical reproduction

**Target responsibility:** Diffs, re-evaluation impact, reproducible prior determinations.

**Observed state:** No production-ready implementation demonstrated by the targeted static inspection. The cost-report UI shells and financial-health service must not be treated as proof of this capability.

**Required evidence:** Identify owning Nx project and service, code paths, persistence entities/migrations, API or event contracts, security boundary, automated tests, authoritative source provenance, and a reproducible acceptance fixture.

**Provisional disposition:** Unclassified pending code-level review; possible Build New or Modify after dependency and ownership analysis. Do not retire existing functionality based on filenames alone.

## 6. Texas HCS Cost Reporting — first financial vertical slice

The first financial vertical slice should demonstrate the entire controlled chain: authoritative source intake → financial knowledge definition → independent review and certification → versioned publication → operational financial fact ingestion → classification/allowability/allocation → deterministic calculation → reconciliation → reporting schedules → review → released Financial Binder.

No specific Texas HCS rate, allowability determination, cost category, or submission deadline is asserted here without verified authoritative source evidence.

## 7. Repository evidence inventory commands (read-only)

```bash
unzip -Z1 hhscCompliance-develop.zip | grep -Ei "financial|cost.report|allocation|allowab|reimburse|rate|payroll|ledger"
rg -n -i "cost report|allocation|allowab|reimbursement|financial knowledge" libs server web
npx nx show projects
```

The `rg` and Nx commands are recommended for an extracted repository with dependencies available; they were **not executed** in this assessment.

## 8. Dependency and ownership rules

- FKE is the sole authority for certified financial definitions and reporting methodologies.
- Operational Domains own payroll, transactions, service statistics, and other source facts.
- Shared Intelligence supplies evidence, approval workflow execution, audit, and binder infrastructure; it does not author financial rules.
- Financial Intelligence consumes certified FKE versions and operational facts to make traceable determinations.
- Cost-report Angular components display results and submit authorized commands; they cannot own allowability or allocation logic.

## 9. Verification checklist

- [ ] Confirm exact FKE-01–13 component labels against ENG-017.
- [ ] Inventory all finance-related source files, not only filename matches.
- [ ] Inspect financial-health service methods and dependencies.
- [ ] Inspect existing finance feature and its API data-access clients.
- [ ] Inspect TypeORM entities, migrations, and schema for financial facts.
- [ ] Locate and validate any existing formula, allocation, or rate code.
- [ ] Validate financial knowledge certification and temporal resolution.
- [ ] Establish secure tenant and provider scope across financial flows.
- [ ] Build, lint, and test affected Nx projects in a supported environment.
- [ ] Execute golden fixtures for calculations and rounding.
- [ ] Verify historical reproduction and binder release access controls.

## 10. Decision worksheet

| ID | Existing implementation | Evidence link | Reuse / Modify / Replace / Build | Dependency | Reviewer | Status |
|---|---|---|---|---|---|---|
| FKE-01 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-02 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-03 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-04 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-05 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-06 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-07 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-08 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-09 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-10 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-11 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-12 | Not established | Pending | Not decided | Pending | Unassigned | Open |
| FKE-13 | Not established | Pending | Not decided | Pending | Unassigned | Open |

## 11. Risks and blockers

1. **Regulatory risk:** Unverified reporting rules or rates must never be encoded as certified financial knowledge.
2. **Architecture risk:** Financial logic embedded in UI or executive summaries would bypass FKE authority.
3. **Historical risk:** Missing effective-date resolution prevents reproducible prior reports.
4. **Security risk:** Tenant and source-document authorization must be proven, not inferred.
5. **Verification blocker:** Dependency installation and executable tests have not been completed for this assessment.

## 12. Exit criteria

REC-002 Section 4 may be accepted for reconciliation only when every FKE component has a reviewed mapping or an explicit verified gap, file-level evidence, named owner, dependency analysis, test evidence, and a disposition approved under AD-012. The present document is an **initial static mapping**, not acceptance or implementation authorization.

## 13. Next section

REC-002 — Section 5: Shared Intelligence Infrastructure Component Mapping (SII-01 through SII-15).
