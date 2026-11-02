# REC-021 — Emergency Preparedness Regulatory Citation and Crosswalk Source Verification Register

**Project:** McCaskill Projects Regulatory Intelligence Platform  
**Scope:** Texas HCS Knowledge Pack — Emergency Preparedness  
**Classification:** Regulatory-source verification and engineering reconciliation; **not a certified knowledge release**  
**Prepared:** 2026-11-02  
**Proposed repository location:** `docs/governance/reconciliation/rec-021-emergency-preparedness-regulatory-citation-and-crosswalk-source-verification-register.md`  
**Implementation authorization:** NOT GRANTED

## 1. Executive determination

The repository's emergency preparedness rule cites **26 TAC Chapter 565** at chapter level, while the more precise HCS residential emergency-plan and fire-drill duties are located in **26 TAC §565.23(e)–(f)**. The chapter-level citation is directionally relevant but insufficient for an auditable, requirement-level crosswalk. The inspected RKE rule and requirement remain marked `UNDER_REVIEW`; they must not be represented as independently certified. This is a **citation-precision and crosswalk-completeness gap**, not evidence that the rule belongs in an entirely different chapter.

**Regulatory confirmation:** §565.23(e) covers fire drills and associated staff obligations; §565.23(f) covers emergency plans, staff review, access, relevant emergencies, individual needs, fire-drill responses, and posted emergency numbers. See source S1 below. HHSC's provider letter PL 2023-10 and the 2026 Texas Register readoption provide additional authority context. See S2–S3.

## 2. Verification method and limits

Static inspection of the uploaded `hhscCompliance-develop.zip`, plus publicly available legal/regulatory sources. This document does not prove that the online text reflects every amendment through 2026-11-02, and does not establish the exact effective version for an arbitrary historical date. Before certification, an authorized reviewer must reconcile the current Texas Secretary of State TAC text and applicable Texas Register amendments for the release's effective interval.

## 3. Primary source register

| ID | Source | Role | Verification disposition |
|---|---|---|---|
| S1 | [26 TAC §565.23 — Residential Requirements](https://www.law.cornell.edu/regulations/texas/26-Tex-Admin-Code-SS-565-23) | Subsection-level HCS residential requirements | Text reviewed via public secondary republication; compare to official TAC before certification |
| S2 | [HHSC Provider Letter PL 2023-10](https://www.hhs.texas.gov/sites/default/files/documents/pl2023-10.pdf) | HHSC explanation of revised HCS certification standards and emergency-plan definition | Official agency publication; interpretive context, not substitute for controlling rule |
| S3 | [Texas Register, March 6, 2026 rule review](https://www.sos.texas.gov/texreg/archive/March62026/Review%20of%20Agency%20Rules/Review%20of%20Agency%20Rules.html) | HHSC readoption of Chapter 565 | Official review; does not by itself establish absence of later amendments |
| S4 | [Texas Register, July 24, 2026 adopted rules](https://www.sos.texas.gov/texreg/archive/July242026/Adopted%20Rules/26.HEALTH%20AND%20HUMAN%20SERVICES.html) | Example of later Chapter 565 amendment to §565.9 | Shows chapter evolves; not evidence §565.23 was amended |
| S5 | [26 TAC §565.3 — Definitions](https://www.law.cornell.edu/regulations/texas/26-Tex-Admin-Code-SS-565-3) | Emergency plan definition | Supporting context |
| S6 | [HHSC Emergency Preparedness guidance](https://www.hhs.texas.gov/providers/long-term-care-providers/long-term-care-provider-resources/emergency-preparedness) | General guidance across provider types | Do not transfer HCSSA Chapter 558 duties to HCS by default |

## 4. Repository source inventory and content fingerprints

The hashes below are truncated SHA-256 identifiers for source tracing, not signatures or proof of certified provenance.

| Source file | Bytes | SHA-256 prefix | 
|---|---:|---|

| `libs/features/residential/src/lib/residential/pages/emergency/emergency-plans.page.ts` | 632 | `f74c8d3f2b8b1f32` |
| `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` | 32117 | `f3a5ec463ee53393` |
| `libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/fire-drill.rule.ts` | 0 | `e3b0c44298fc1c14` |
| `libs/regulatory/knowledge/src/lib/packs/texas-hcs/texas-hcs.knowledge-pack.ts` | 2059 | `c39a690abd20cbe1` |
| `server/src/app/compliance/engine/residential/evaluators/emergency-plans.evaluator.ts` | 3883 | `ff9ebf4c75e78afd` |


## 5. Actual RKE citation evidence

`libs/regulatory/knowledge/src/lib/packs/texas-hcs/rules/emergency-preparedness.rule.ts` defines `TEXAS_HCS_EMERGENCY_PREPAREDNESS_IDS`, a regulatory source code `TX-26-TAC-CH-565`, a rule code `TX-HCS-EMERGENCY-PREPAREDNESS`, and `citation: '26 TAC Chapter 565'`. The rule is `UNDER_REVIEW`, and the `TX-HCS-EP-001` requirement is also `UNDER_REVIEW`. The source's `version: '2026.1'` is repository metadata, **not independent proof of a legally effective rule revision or approval**.

## 6. Source applicability boundaries

The relevant program is HCS residential settings covered by §565.23(a), including three-person, four-person, and host home/companion care settings, subject to the section's specific qualifications. Do not assume an HCSSA emergency-plan standard in **26 TAC §558.256** applies merely because both programs use the phrase 'emergency preparedness'. Check provider licensure and program applicability independently.

## 7. Proposed granular citation crosswalk

The table distinguishes **source-backed regulatory duties** from **proposed evidence mappings**. The proposed evidence keys are engineering suggestions and are not asserted to be mandatory form fields.

| Crosswalk ID | Controlling provision | Source-backed duty (paraphrased) | Proposed evidence | Verification status |
|---|---|---|---|---|
| EP-CW-001 | §565.23(f)(1) | Staff review each individual's emergency plans before providing services | Staff plan-review acknowledgment with person, residence, and date | Provision identified; mapping proposed |
| EP-CW-002 | §565.23(f)(2) | Staff are instructed where residence emergency plans are located | Location/accessibility instruction record | Provision identified; mapping proposed |
| EP-CW-003 | §565.23(f)(3) | Emergency preparedness documentation is accessible to staff at residence | Accessible plan location and evidence of availability | Provision identified; mapping proposed |
| EP-CW-004 | §565.23(f)(3)(A)(i) | Plans address emergencies relevant to geography | Plan hazard/geography section | Provision identified; mapping proposed |
| EP-CW-005 | §565.23(f)(3)(A)(ii) | Plans address needs of individuals in residence | Person-specific support mapping | Provision identified; mapping proposed |
| EP-CW-006 | §565.23(f)(3)(A)(iii) | Plans address fire-drill responses | Plan section linked to fire-drill outcomes | Provision identified; mapping proposed |
| EP-CW-007 | §565.23(f)(3)(B) | Emergency numbers are publicly posted and accessible to staff | Posted-number verification | Provision identified; mapping proposed |
| EP-CW-008 | §565.23(e)(1)(A) | At least one fire drill per 90 days at each residence | Dated fire-drill records | Provision identified; mapping proposed |
| EP-CW-009 | §565.23(e)(1)(B) | At least four fire drills per 365 days at each residence | Rolling-window drill records | Provision identified; mapping proposed |
| EP-CW-010 | §565.23(e)(1)(C) | Two of four annual drills during sleeping hours | Drill time classification and logs | Provision identified; mapping proposed |
| EP-CW-011 | §565.23(e)(2) | Staff participate within 90 days of hire and at least annually | Staff roster, hire date, drill attendance | Provision identified; mapping proposed |
| EP-CW-012 | §565.23(e)(3) | Staff can explain residence emergency plans | Staff demonstration/assessment record | Provision identified; mapping proposed |
| EP-CW-013 | §565.23(e)(4) | Training for staff who do not follow plan during drill | Training and follow-up record | Provision identified; mapping proposed |
| EP-CW-014 | §565.23(e)(5) | Revise plan when individual cannot exit safely under plan | Drill outcome, revision record, reassessment | Provision identified; mapping proposed |

## 8. Citation discrepancies to resolve

**D-01 — Citation granularity:** `26 TAC Chapter 565` is broad; each atomic requirement should cite its exact §565.23 subsection. **Open** until RKE requirement source mapping is reviewed and approved.

**D-02 — Requirement aggregation:** `TX-HCS-EP-001` describes a broad location-specific plan, but the statute contains several distinct duties with different actors and timing. **Open** pending approved requirement decomposition.

**D-03 — Regulatory versus operational design:** The RKE questionnaire asks for coordinator, continuity, utility failure, medication procedures, signatures, and other fields. Those can be good operational controls, but not every field is expressly mandated by §565.23(f). **Open** pending source-backed classification of `REQUIRED_BY_RULE`, `IMPLEMENTATION_CONTROL`, or `GUIDANCE_ONLY`.

**D-04 — Status mismatch:** Source status `ACTIVE` does not convert the rule and requirement statuses `UNDER_REVIEW` into certification. **Open** pending independent certification.

**D-05 — Historical applicability:** The label `2026.1` is not enough to establish the legal effective interval of each provision. **Open** pending dated source snapshot and temporal resolution.

**D-06 — Cross-program contamination:** HHSC HCSSA §558.256 requirements must not be merged into HCS §565.23 without an independent applicability basis. **Open**.

## 9. Rule-to-evidence mapping policy

Every crosswalk entry must store source ID, exact citation, quoted or paraphrased obligation with editorial review, effective interval, subject scope, responsible actor, evidence type, evaluation predicate, missing-evidence behavior, approval identity, and content digest. An evidence field may support multiple obligations, but must not be interpreted as proof of compliance absent evaluator checks.

## 10. Finding-state semantics

Distinguish `COMPLIANT`, `NONCOMPLIANT`, `INSUFFICIENT_EVIDENCE`, `NOT_APPLICABLE`, and `REQUIRES_REVIEW`. A missing document may justify a definitive finding only when the certified rule and verified evidence establish the absence of a required document; a failed database lookup or unexamined record must not be treated as verified absence.

## 11. Historical and provenance controls

Store the immutable source snapshot, section/subsection, effective date, known-at date, certified knowledge revision, crosswalk revision, evaluator version, operational evidence IDs/digests, and decision manifest. Do not reissue prior findings under newer rules without a distinct replay or reassessment record.

## 12. Certification blocker matrix

| Gate | Required proof | Current assessment |
|---|---|---|
| C-01 | Official §565.23 text and amendment history captured | Pending official primary-text comparison |
| C-02 | Applicability to HCS residence type documented | Partially source-supported; reviewer sign-off pending |
| C-03 | Atomic subsection crosswalk reviewed | Proposed, not approved |
| C-04 | All questionnaire fields classified by legal authority | Pending |
| C-05 | Effective-dated source snapshot and digest | Not established |
| C-06 | Independent reviewer/certifier approval | Not established |
| C-07 | Evaluator consumes certified crosswalk and real evidence | Not established |
| C-08 | Tests for missing, conflicting, expired, and negative evidence | Not executed |
| C-09 | Tenant and residence scope security verified | Not executed |
| C-10 | Historical determination replay verified | Not executed |

## 13. Acceptance test specifications

| ID | Scenario | Expected result |
|---|---|---|
| EP-021-T01 | Chapter-only citation submitted for atomic certification | Reject or require subsection precision |
| EP-021-T02 | §565.23(f)(3)(B) emergency-number posting evidence present | Evaluate only corresponding posting obligation |
| EP-021-T03 | Staff plan review completed after first service | Flag temporal requirement if dates establish failure |
| EP-021-T04 | Fire drills 90-day and 365-day windows differ | Apply both separate rolling-window requirements |
| EP-021-T05 | Two sleeping-hour drills missing | Evaluate §565.23(e)(1)(C) separately |
| EP-021-T06 | Plan field required by internal policy only | Do not falsely cite it as explicit §565.23 mandate |
| EP-021-T07 | Evidence repository unavailable | Return insufficient evidence / error, not noncompliance |
| EP-021-T08 | RKE rule status UNDER_REVIEW | Disallow certified determination publication |
| EP-021-T09 | HCSSA §558.256 injected into HCS pack | Reject without documented cross-program authority |
| EP-021-T10 | Source amendment effective after assessment date | Resolve historical applicable revision |
| EP-021-T11 | Cross-tenant evidence identifier supplied | Deny access; log security event |
| EP-021-T12 | Previous finding replayed after pack revision | Reproduce prior manifest without silent substitution |

**Execution status:** All 12 tests are specifications only; no execution evidence is asserted.

## 14. Decision requests for regulatory owner

1. Approve §565.23(e) and (f) as the initial atomic source anchors for the HCS residential emergency-plan/fire-drill slice, subject to official source verification.
2. Decide whether the existing broad `TX-HCS-EP-001` is retained as a parent grouping or decomposed into independent certified requirements.
3. Classify every questionnaire/evidence field as express regulation, interpretation, or optional operational practice.
4. Approve effective-date and amendment-history source snapshots.
5. Appoint distinct reviewer and certifier, and record formal approvals.

## 15. Proposed implementation sequence — not authorized

First verify official regulatory text and applicability; then ratify the crosswalk; then create immutable certified revisions; then connect operational evidence; then replace unconditional evaluator findings; finally execute tenant-isolation, historical-replay, and end-to-end acceptance tests. Do not reverse this order by coding evaluator assumptions before rule certification.

## 16. Relationship to prior reconciliation documents

REC-017 and REC-018 identified the Emergency Preparedness evaluator and evidence integration gaps; REC-019 proposed the source-of-truth and crosswalk decisions; REC-020 organized implementation readiness. This register narrows the unresolved citation issue to subsection-level source verification and differentiates regulatory duties from additional operational controls.

## 17. Closure assessment

**Source identification: PARTIALLY VERIFIED.** The relevant HCS residential provisions have been identified in a public legal text, and HHSC materials corroborate the regulatory framework. **Regulatory certification: NOT COMPLETE.** Official TAC version history, exact effective intervals, requirement decomposition, independent approvals, and executable verification remain open. No source code or database migrations were changed.

## 18. Next artifact

**REC-022 — Emergency Preparedness Atomic Requirement Decomposition and Evidence Predicate Contract.** This should convert the ratified §565.23 subsection crosswalk into versioned requirement IDs, evidence predicates, temporal rules, and evaluator outcomes, without assuming ratification has already occurred.
