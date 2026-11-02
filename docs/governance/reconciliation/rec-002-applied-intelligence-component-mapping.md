# REC-002 — Section 6: Applied Intelligence Component Mapping

**Platform:** McCaskill Projects Regulatory Intelligence Platform  
**Version:** 1.0 — Assessment Draft  
**Assessment source:** `hhscCompliance-develop.zip` supplied in conversation  
**Status:** Static file-inventory assessment; no executable verification in this section  
**Implementation authorization:** NOT GRANTED

## 1. Purpose
Map the proposed Compliance Intelligence (CI-01–CI-07) and Financial Intelligence (FI-01–FI-11) architecture to existing repository evidence. The existence of a file does not establish correct behavior, integration, security, or compliance.

## 2. Governing architectural boundary
RKE owns certified regulatory definitions; FKE owns certified financial definitions; operational domains own facts; Shared Intelligence provides reusable infrastructure; Applied Intelligence orchestrates and records determinations. Applied Intelligence cannot invent regulatory rules, financial rates, or allowability standards.

## 3. Evidence and verification method
Archive paths listed below were confirmed by ZIP member enumeration. Findings are *source-presence only*. No compilation, tests, database connections, or API requests were executed for this section. Component-to-file assignments are candidate mappings pending contract and behavior review.

## 4. Compliance Intelligence — CI-01 through CI-07

| Component | Intended capability | Candidate repository evidence | Assessment | Required verification |
|---|---|---|---|---|
| CI-01 | Compliance evaluation orchestration | `server/src/app/compliance/engine/compliance-engine.service.ts`; `engine/compliance-engine.module.ts` | Source present | Confirm evaluator invocation, certified RKE resolution, error semantics |
| CI-02 | Rule evaluation and result generation | `server/src/app/compliance/engine/residential/evaluators/*.evaluator.ts`; `compliance/types/rule-result.type.ts` | Source present | Inspect hardcoded rules; trace every rule to versioned RKE knowledge |
| CI-03 | Compliance result persistence and retrieval | `server/src/app/compliance/compliance-results.service.ts`; `entities/compliance-result.entity.ts`; `compliance-results.controller.ts` | Source present | Validate persistence, tenancy, history, version linkage |
| CI-04 | Finding triage and workspaces | `server/src/app/dashboard/services/entity-workbench.service.ts`; `libs/data-access/src/lib/remediation/services/finding-workspace.service.ts` | Source present | Confirm lifecycle, assignment, access and deep links |
| CI-05 | Corrective action and evidence | `server/src/app/remediation/services/remediation.service.ts`; `entities/corrective-action-plan.entity.ts`; `entities/cap-evidence.entity.ts` | Source present | Validate CAP state transitions, evidence ACLs, audit |
| CI-06 | Reassessment / recheck | `server/src/app/compliance/engine/compliance-engine.service.ts`; remediation status history entities | Candidate partial | Verify dedicated recheck orchestration, prior-result linkage, repeatability |
| CI-07 | Provider intelligence and reporting | `server/src/app/dashboard/services/provider-intelligence.service.ts`; `dashboard-summary.service.ts`; `provider-intelligence/scoring/provider-health-score.service.ts` | Source present | Confirm provider-wide scope, scoring provenance, permission filtering |

*Note:* CI-01–CI-07 descriptions above are working capability labels for mapping; final canonical names and ownership require reconciliation against ENG-008 and ENG-020. The archive path prefix `hhscCompliance-develop/` is omitted from tables for readability.

## 5. Financial Intelligence — FI-01 through FI-11

The archive contains a finance data-access service (`libs/data-access/src/lib/finance/finance.service.ts`) and provider financial-health-related UI/backend code. **These do not establish a complete Financial Intelligence system or a certified Financial Knowledge Engine.** The following are required target capabilities, not claims of implementation.

| Component | Target capability to reconcile | Evidence status | Gap / verification |
|---|---|---|---|
| FI-01 | Financial source ingestion and normalization | Not established | Locate transaction intake, lineage, reconciliation inputs |
| FI-02 | Cost classification orchestration | Not established | Require certified FKE classification references |
| FI-03 | Allowability determination | Not established | Require source-backed FKE methodology and effective dates |
| FI-04 | Allocation execution | Not established | Verify drivers, rounding, decimal precision, lineage |
| FI-05 | Rate and methodology application | Not established | Resolve certified rates and reporting periods |
| FI-06 | Calculation and schedule generation | Not established | Verify deterministic calculation and reproducibility |
| FI-07 | Financial reconciliation and exceptions | Not established | Verify controls, exceptions, approvals, audit |
| FI-08 | Cost reporting assembly | Placeholder UI reported in prior assessment; runtime unverified | Verify full Texas HCS Cost Reporting vertical slice |
| FI-09 | Financial findings and remediation | Not established | Define finding ownership and re-evaluation workflow |
| FI-10 | Financial reporting / management insights | Candidate `finance.service.ts`; financial-health services | Inspect calculations, provenance, security, actual API outputs |
| FI-11 | Financial binder handoff and historical reproduction | Not established | Verify shared Binder Management integration and release snapshot |

**Naming caution:** FI labels above are candidate functional groupings. Final component titles, IDs, and interfaces must be taken from the authoritative canonical registry once reconciled, not inferred from this assessment.

## 6. Verified repository evidence inventory

### Compliance backend
- `server/src/app/compliance/compliance-modules.registry.ts`
- `server/src/app/compliance/compliance-results.controller.ts`
- `server/src/app/compliance/compliance-results.service.ts`
- `server/src/app/compliance/entities/compliance-result.entity.ts`
- `server/src/app/compliance/engine/compliance-engine.service.ts`
- `server/src/app/compliance/engine/residential/residential-compliance.service.ts`
- `server/src/app/compliance/engine/residential/evaluators/fire-drills.evaluator.ts`
- `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts`
- `server/src/app/compliance/engine/residential/evaluators/hot-water.evaluator.ts`
- `server/src/app/compliance/engine/residential/evaluators/medication.evaluator.ts`

### Findings, CAP, dashboard
- `server/src/app/remediation/controllers/remediation.controller.ts`
- `server/src/app/remediation/services/remediation.service.ts`
- `server/src/app/remediation/services/remediation-routing.service.ts`
- `server/src/app/remediation/entities/corrective-action-plan.entity.ts`
- `server/src/app/remediation/entities/cap-evidence.entity.ts`
- `server/src/app/dashboard/services/provider-intelligence.service.ts`
- `server/src/app/dashboard/services/module-correction.service.ts`
- `server/src/app/dashboard/services/entity-workbench.service.ts`
- `libs/data-access/src/lib/compliance/src/services/compliance-results.api.ts`
- `libs/data-access/src/lib/remediation/services/finding-workspace.service.ts`

### Financial candidates
- `libs/data-access/src/lib/finance/finance.service.ts`
- Financial-health and cost-report presentation code requires detailed semantic inspection; no certified FKE-driven reporting pipeline is demonstrated by this inventory.

## 7. Preliminary treatment hypotheses (not approved)

| Area | Hypothesis | Confidence | Reason |
|---|---|---|---|
| Compliance result API/entity | Evaluate for **Reuse / Modify** | Medium for existence, low for compliance | Concrete backend source exists |
| Residential evaluators | Evaluate for **Modify** | Low | Must verify knowledge-first RKE linkage |
| Finding/CAP workflow | Evaluate for **Reuse / Modify** | Medium for existence | Entities, controller and service exist |
| Provider dashboard | Evaluate for **Reuse / Modify** | Medium for existence | Multiple provider-intelligence services exist |
| Financial Intelligence | **Build / Modify** decision deferred | Low | No complete FI chain established |

Do not treat these as approved work classifications. Source and contract inspection, tests, and design gate decisions are required.

## 8. High-priority reconciliation questions
1. Are residential evaluator thresholds embedded directly in TypeScript instead of resolved from certified RKE versions?
2. Does each compliance result record the knowledge pack ID/version, source data snapshot, and evaluation timestamp?
3. Are rechecks separate auditable determinations rather than overwrites?
4. Are CAP transitions, attachments, and notes authorized and tenant-scoped?
5. Is provider-wide dashboard access correctly filtered by tenant and authorized location?
6. Does any financial calculation exist beyond presentation and generic finance services?
7. Are FKE methodologies, reporting periods, and decimal/rounding rules actually referenced?
8. Are Financial Binder artifacts governed by Shared Intelligence rather than private financial document logic?

## 9. Required executable acceptance evidence
- CI evaluation test: given certified knowledge version + controlled operational facts, produce reproducible findings.
- CI change test: new knowledge version does not rewrite historical findings.
- CI remediation test: CAP lifecycle, evidence permissions, recheck and audit trail.
- CI tenant test: cross-tenant access is rejected at API and data boundaries.
- FI cost-report test: source transactions → certified classification → allowability → allocation → reconciliation → reporting schedules → approved binder.
- FI historical test: exact same versioned methodology and source snapshot reproduces released outputs.
- FI security test: no access to unauthorized cost records or source attachments.

All tests above are **NOT RUN** in this assessment.

## 10. Cross-document and registry dependencies
Reconcile ENG-008 component IDs and service ownership with ENG-020 detailed specifications, ENG-009 API/events, ENG-010 permissions, ENG-018 shared services, ENG-023 end-to-end workflows, ENG-024 decisions, and REC-001 canonical contract policy. Preserve historical aliases until mappings are verified.

## 11. Decision worksheet
For each CI/FI component, record: canonical ID; approved name; exact code paths; API/event contracts; dependency graph; source of knowledge authority; tenant scope; data migrations; test evidence; treatment (Reuse/Modify/Replace/Build New); owner; reviewer; decision date; approval reference. **No worksheet row is approved by this document.**

## 12. Exit criteria
Section 6 can close only after canonical identifiers and contract ownership are reconciled, source behavior is inspected, dependency violations are documented, test results are attached, and treatment decisions are explicitly approved.

## 13. Next section
**REC-002 — Section 7: Binder Management and User Experience Component Mapping (BM-01–BM-09; UX-01–UX-05 and ENG-022 extensions).**

---
**Assessment status:** DRAFT — source paths verified by ZIP inventory; behavior, completeness, builds and tests not verified here.  
**Repository modifications:** None.  
**Implementation authorization:** NOT GRANTED.
