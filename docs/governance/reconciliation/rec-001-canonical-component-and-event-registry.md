# REC-001 — Canonical Component and Event Registry Reconciliation

**Organization:** McCaskill Projects  
**Platform:** Regulatory Intelligence Platform  
**Version:** 1.0 — Reconciliation Working Draft  
**Authority:** Architecture Decision AD-010 (approved principle)  
**Proposed path:** `docs/governance/reconciliation/rec-001-canonical-component-and-event-registry.md`  
**Contract-level approval:** PENDING  
**Implementation authorization:** NOT GRANTED

## 1. Decision objective
Establish a single controlled registry for platform components, API contracts, and events without confusing approval of the *registry principle* (AD-010) with approval of individual mappings. This document initiates the first detailed reconciliation workstream from ENG-024 and ENG-029.

## 2. Evidence and limitations
The approved Architecture Decision Register v1.0 confirms AD-001–AD-012. ENG-024 explicitly identifies competing naming schemes and instructs that mappings be checked, not assumed. ENG-029 identifies contract reconciliation as a required remediation workstream. Earlier ENG-001–019 source specifications were not all available as standalone files for direct comparison in this working session; consequently this document does **not** certify one-to-one mappings or invent event identities. The uploaded repository's historical state is not proof of a canonical architectural contract. No builds or tests are performed by this document.

## 3. Binding rules inherited from approved decisions
- AD-001, AD-002, AD-007: domain ownership and independent RKE/FKE authority cannot be reassigned by an alias.
- AD-003, AD-004: certification, effective dating, and historical versions must remain traceable.
- AD-005: cross-engine contracts must be explicit, versioned, and authorized.
- AD-009: regulated features require knowledge-first traceability.
- AD-010: canonical identifiers and legacy mappings must be governed.
- AD-011: authorization and tenant scope are contract requirements.
- AD-012: no implementation without dependent approvals and verification.

## 4. Proposed canonical namespace policy — decision requested
Use stable **logical architecture IDs** distinct from TypeScript symbols, Nx project names, route paths, and deployment service names. Proposed logical prefixes:

| Logical namespace | Meaning | Existing identifiers to reconcile | Status |
|---|---|---|---|
| `PF` | Platform Foundation | PF-01–PF-09 | Proposed retention; pending detailed check |
| `OP` | Operational Domains | OP-01–OP-12 | Proposed retention; pending detailed check |
| `RKE` | Regulatory Knowledge Engine | RK-01–RK-11 and RKE-01–RKE-11 | Proposed canonical `RKE`; mappings unverified |
| `FKE` | Financial Knowledge Engine | FK-01–FK-13 and FKE-01–FKE-13 | Proposed canonical `FKE`; mappings unverified |
| `SII` | Shared Intelligence Infrastructure | SI-01–SI-15 and SII-01–SII-15 | Proposed canonical `SII`; mappings unverified |
| `CI` | Compliance Intelligence | CI-01–CI-07 | Proposed retention; pending detailed check |
| `FI` | Financial Intelligence | FI-01–FI-11 | Proposed retention; pending detailed check |
| `BM` | Binder Management | BM-01–BM-09 | Retain separate logical catalog until ownership/decomposition is checked |
| `UX` | User Experience | UX-01–UX-05 and expanded ENG-022 components | Canonical cardinality and mapping unresolved |

**Important:** Similar suffixes do not prove semantic equivalence. `RK-01` → `RKE-01`, for example, is a **candidate**, not an approved mapping. `BM` may be a feature/service family that depends on `SII`, not a duplicate namespace. Avoid collapsing it by assumption.

## 5. Component record — mandatory fields
Each canonical component must have: `canonicalId`, `displayName`, `purpose`, `layer`, `authorityOwner`, `businessOwner`, `technicalOwner`, `responsibilities`, `explicitNonResponsibilities`, `legacyAliases`, `sourceDocuments`, `repositoryEvidence`, `interfaces`, `publishedEvents`, `consumedEvents`, `dataOwned`, `tenantScope`, `authorizationPolicy`, `versionPolicy`, `dependencies`, `acceptanceTests`, `reviewStatus`, `reviewer`, `approvalDate`.

## 6. Component reconciliation matrix — working candidates

| Case | Catalog identity | Detailed identity | Required validation | Decision status |
|---|---|---|---|---|
| CMP-01 | RK-01–11 | RKE-01–11 | Compare names, responsibilities, I/O, owners, cardinality | OPEN |
| CMP-02 | FK-01–13 | FKE-01–13 | Compare methodology ownership and certification boundaries | OPEN |
| CMP-03 | SI-01–15 | SII-01–15 | Confirm infrastructure-only scope and validation execution | OPEN |
| CMP-04 | BM-01–09 | ENG-018 binder services and ENG-020 applied workflows | Establish one shared binder core and type extensions without duplicate authority | OPEN |
| CMP-05 | UX-01–05 | ENG-022 expanded UX components | Distinguish service-level identifiers from UI component inventory | OPEN |
| CMP-06 | PF-01–09 | ENG-021 foundation specifications | Validate security, tenancy and infrastructure boundaries | OPEN |
| CMP-07 | OP-01–12 | ENG-019 operational specifications | Validate fact ownership and no embedded regulated authority | OPEN |
| CMP-08 | CI-01–07, FI-01–11 | ENG-020 applied specifications | Verify evaluation vs knowledge definition ownership | OPEN |

## 7. Event registry — no speculative ID assignment
ENG-024 identifies the `EVT-001`–`EVT-042` catalog in ENG-001 and additional named events in ENG-009 and ENG-016–023. **Do not infer which named event corresponds to any numeric EVT ID** without reading both exact definitions.

Each event registry row requires: `canonicalEventId`, `canonicalName`, `aliases`, `sourceDocAndSection`, `producerComponent`, `consumerComponents`, `aggregateOrSubject`, `tenantId`, `correlationId`, `causationId`, `schemaVersion`, `occurredAt`, `effectiveAtIfApplicable`, `knowledgeVersionRefIfApplicable`, `idempotencyKey`, `deliverySemantics`, `orderingScope`, `retryPolicy`, `deadLetterPolicy`, `dataClassification`, `authorizationConstraints`, `retentionPolicy`, `testEvidence`, `approvalStatus`.

### Event reconciliation work queue
1. Extract EVT-001–042 verbatim from ENG-001 with definitions and producers.
2. Extract event contracts verbatim from ENG-009.
3. Extract all proposed named events from ENG-016–023.
4. Compare by semantics, payload, producer, timing, and consumer — not just name.
5. Classify each as `EXACT_MATCH`, `ALIAS`, `SCHEMA_REVISION`, `SPLIT`, `MERGE`, `NEW_EVENT`, `DEPRECATED`, or `CONFLICT`.
6. Require a human-reviewed mapping for every `SPLIT`, `MERGE`, or `CONFLICT`.
7. Assign new canonical IDs only after collision checks and approved change control.
8. Preserve old IDs as immutable aliases and document migration compatibility.

## 8. API registry — minimum contract
For each endpoint or RPC: `apiId`, `ownerComponent`, `operation`, `pathOrTopic`, `method`, `requestSchema`, `responseSchema`, `errorSchema`, `version`, `tenantScope`, `permission`, `rateLimit`, `idempotency`, `auditEvent`, `knowledgeReference`, `consumer`, `backwardCompatibility`, `testCase`, `status`. No backend endpoint should be treated as an approved architectural API merely because a route exists.

## 9. Cross-authority constraints
- RKE may provide regulatory applicability to an authorized consumer; it may not become a financial methodology owner.
- FKE may provide reporting-period financial definitions; it may not certify regulatory obligations.
- Operational services publish facts, not normative conclusions.
- Shared Intelligence may store evidence, approvals, and audit entries but may not certify independently.
- Applied services retain references to the exact source records and certified knowledge versions used.
- Binder release events must not imply unrestricted access to underlying source documents.

## 10. Reconciliation acceptance gates

| Gate | Requirement | Current status |
|---|---|---|
| CR-01 | Every catalog component has a verified canonical row | NOT MET |
| CR-02 | All legacy aliases map without collision or semantic ambiguity | NOT MET |
| CR-03 | All EVT-001–042 and later event definitions accounted for | NOT MET |
| CR-04 | API and event schemas reconciled against ENG-009 | NOT MET |
| CR-05 | Owner and tenant/security rules checked | NOT MET |
| CR-06 | ENG-014/015 dependencies reconciled with canonical IDs | NOT MET |
| CR-07 | Approval signatures and controlled baseline revision recorded | NOT MET |

## 11. Required source comparison procedure
Use a source-by-source comparison sheet with columns `source`, `section`, `literalIdentifier`, `literalName`, `description`, `candidateCanonicalId`, `semanticComparison`, `decision`, `reviewer`, `evidence`. Preserve direct quotations only in internal working evidence; the registry should summarize without replacing source language. If a source is unavailable, mark `SOURCE_MISSING`, not `MATCH`.

## 12. Change governance
Any identifier or contract change requires an impact report listing API consumers, event consumers, database migrations, audit/history effects, security scope, frontend routes, tests, and rollback. Published identifiers cannot be reused for a different meaning. Alias mappings require explicit deprecation windows when compatibility is affected.

## 13. Decisions presented for owner review
**REC-001-D1 (proposed):** Adopt logical canonical prefixes `PF`, `OP`, `RKE`, `FKE`, `SII`, `CI`, `FI`, `BM`, `UX`, subject to semantic validation of every component. This is a naming policy, not automatic mapping approval.

**REC-001-D2 (proposed):** Preserve ENG-001's EVT-001–042 IDs as reserved historical references pending full contract comparison; do not allocate or repurpose IDs during reconciliation.

**REC-001-D3 (proposed):** Separate architecture logical identifiers from repository implementation paths and symbols.

**REC-001-D4 (proposed):** Require explicit owner review for event splits/merges and any authority-boundary conflict.

All four proposals are **PENDING** until expressly approved.

## 14. Immediate next evidence requirements
Retrieve the actual ENG-001, ENG-008, ENG-009, ENG-014, ENG-015, ENG-016, ENG-017, ENG-018, ENG-019, and ENG-022 texts (or controlled repository equivalents), then populate the literal-source comparison matrix. Do not assert full reconciliation without those sources. After that, review the proposed registry row by row and seek approval of the reconciled contract baseline.

## 15. Completion and authorization status
**Completed in this draft:** Defined reconciliation scope, source constraints, registry schemas, initial discrepancy work queue, approval proposals, and acceptance gates.  
**Not completed:** Literal component-by-component mappings, 42-event reconciliation, API reconciliation, final approval, executable verification.  
**Implementation authorization:** **NOT GRANTED**.
