# REC-006 — Event Contract, Delivery Reliability, and Audit Traceability Verification

**Program:** McCaskill Projects — Regulatory Intelligence Platform  
**Version:** 1.0 — Evidence-Based Assessment Draft  
**Proposed repository path:** `docs/governance/reconciliation/rec-006-event-contract-delivery-reliability-and-audit-traceability-verification.md`  
**Source snapshot:** User-supplied `hhscCompliance-develop.zip`  
**Implementation authorization:** **NOT GRANTED**  
**Verification level:** Static inspection only; no runtime, integration, migration, or security tests executed.

## 1. Purpose and scope

Reconcile approved architecture decision REC-001-D2 (Canonical Event Registry and Contract Ownership), AD-005 (Cross-Engine Integration), AD-004 (Historical Reproducibility), AD-010 (Contract Registry), and AD-011 (Security) with actual source evidence. This document is an assessment and acceptance plan, **not** a claim that event delivery or audit controls work.

## 2. Assessment methodology

The uploaded ZIP was inspected without changing repository contents. Source filenames and selected textual markers were searched for event publishing/handling, queues, transactional outbox patterns, and audit implementation. A string search cannot conclusively prove absence of functionality implemented under different names, in external infrastructure, or in dependencies; findings below use appropriately limited language.

## 3. Evidence inventory — confirmed source paths

| Evidence | Path | What is confirmed | What is not confirmed |
|---|---|---|---|
| Audit module | `server/src/app/audit/audit.module.ts` | Source file exists | Correct global/module wiring and authorization |
| Audit service | `server/src/app/audit/audit.service.ts` | Source file exists | Complete, tamper-resistant capture |
| Audit interceptor | `server/src/app/audit/interceptors/audit.interceptor.ts` | Source file exists | Coverage of all protected operations |
| Audit entity | `server/src/app/audit/entities/audit.entity.ts` | Source file exists | Schema consistency and persistence success |
| Audit migration | `server/migrations/1800000000223-CreateAuditLogs.ts` | Migration file exists | Migration executed successfully |
| Security audit service | `server/src/app/security/services/audit-logs.service.ts` | Source file exists | Whether this shares the same authoritative audit store |
| Security audit entity | `server/src/app/security/entities/audit-log.entity.ts` | Source file exists | Duplicate or divergent schemas resolved |
| Audit API controller | `server/src/app/security/controllers/audit-logs.controller.ts` | Source file exists | Endpoint authorization, masking, pagination |
| Audit dashboard controller | `server/src/app/audit/dashboard/dashboard.controller.ts` | Source file exists | Tenant-safe analytics |
| Compliance results service | `server/src/app/compliance/compliance-results.service.ts` | References audit service | All relevant changes audited |
| Fire drills service | `server/src/app/fire-drills/fire-drills.service.ts` | References audit service | Reliable audit on failures/rollbacks |
| Providers service | `server/src/app/providers/providers.service.ts` | References audit service | Full coverage of sensitive changes |
| Residential locations service | `server/src/app/residential/residential-locations.service.ts` | References audit service | Full coverage of sensitive changes |

## 4. Event infrastructure search findings

| Source marker | Static hits | Interpretation |
|---|---:|---|
| `@OnEvent` | 0 | No matching NestJS event-listener decorator found |
| `@EventPattern` | 0 | No matching microservice event-pattern decorator found |
| `@MessagePattern` | 0 | No matching microservice message-pattern decorator found |
| `ClientProxy` | 0 | No matching NestJS microservice client proxy found |
| `outbox` | 0 | No source reference containing this literal string found |
| `BullModule` | 0 | No matching Bull queue module marker found |
| `publish(` | 0 | No matching literal method call found |
| `EventEmitter` | 20 files | Predominantly Angular component outputs; **not evidence of backend durable domain events** |
| `emit(` | 16 files | Predominantly UI outputs; **not evidence of backend delivery guarantees** |

These counts describe textual matches in `.ts` and `.json` files within this ZIP, not runtime behavior or an exhaustive architectural proof.

## 5. Architectural ownership requirements

Each canonical event has one owning component, a documented producer, authorized consumers, immutable event identifier, schema version, tenant context, correlation/causation identifiers, and a documented lifecycle. RKE and FKE own their knowledge-change semantics; Shared Intelligence may supply delivery and audit infrastructure without becoming a knowledge authority. Operational domains own fact-change semantics; Applied Intelligence owns determination/result events.

## 6. Canonical event registry record

Each registry entry MUST include: `canonicalEventId`, `canonicalName`, `schemaVersion`, `owningComponent`, `producer`, `consumerContracts`, `trigger`, `payloadSchema`, `tenantScope`, `authorizationContext`, `aggregateId`, `aggregateVersion`, `occurredAt`, `recordedAt`, `correlationId`, `causationId`, `knowledgeVersionReferences` (when relevant), `dataClassification`, `deliverySemantics`, `orderingScope`, `retryPolicy`, `deadLetterPolicy`, `retentionPolicy`, `auditLink`, `compatibilityPolicy`, `status`, `evidenceLinks`, and `approver`.

## 7. Historical event ID reconciliation

ENG-001's `EVT-001`–`EVT-042` identifiers are historical design references, **not automatically verified implemented events**. Build a one-to-one or explicitly documented many-to-one mapping from each historical event to a canonical event definition; identify aliases, duplicates, retired events, and genuinely new events. No renumbering or publication without registry approval.

## 8. Event families requiring mapping

| Family | Candidate triggers | Authority | Status |
|---|---|---|---|
| Regulatory knowledge | Source ingested, validation completed, pack certified/published/superseded | RKE | Contract reconciliation pending |
| Financial knowledge | Methodology certified/published/superseded | FKE | Contract reconciliation pending |
| Operational records | Service, residential, person, employee, payroll and financial fact changes | Owning OP component | Contract reconciliation pending |
| Compliance | Evaluation completed, finding created, CAP updated, recheck completed | CI | Contract reconciliation pending |
| Financial intelligence | Classification, allocation, reconciliation, report release | FI | Contract reconciliation pending |
| Binder | Binder assembled, approved, released, revoked, archived | BM | Contract reconciliation pending |
| Security | Access granted/denied, external access revoked, sensitive data accessed | PF / audit authority | Contract reconciliation pending |

Candidate names above are conceptual examples, not claims of present events or final canonical IDs.

## 9. Event envelope contract

Recommended minimum envelope: unique `eventId`, `eventType`, `schemaVersion`, `producerComponent`, `tenantId`, `aggregateType`, `aggregateId`, `occurredAt`, `correlationId`, optional `causationId`, effective/knowledge-version references where required, and validated `payload`. Avoid embedding unnecessary PHI, payroll, or personal identifiers. Schema definitions and exact field types remain **proposed**, pending contract approval.

## 10. Publication atomicity

For business transactions that must emit events, require a design that prevents a committed fact change from silently losing its corresponding event. Evaluate a transactional outbox or equivalent evidence-backed mechanism. Confirm same-transaction persistence, dispatcher recovery, deduplication, and monitoring before marking passed.

## 11. Delivery semantics

Specify at-least-once delivery with idempotent consumers unless an alternative is explicitly justified. Do not claim exactly-once processing without end-to-end evidence. Define acknowledgement, retry, poison-message handling, dead-letter handling, replay policy, and consumer ownership.

## 12. Ordering and concurrency

Define ordering per aggregate where business-critical, optimistic concurrency checks, aggregate versions, duplicate detection, and stale-event handling. Global total ordering is not assumed.

## 13. Idempotency

Require consumer idempotency keyed by stable event ID and consumer identity. Validate replay of an event twice produces one business effect and records any duplicate attempt appropriately.

## 14. Retries and dead-letter handling

Define bounded retry/backoff, transient versus permanent failures, dead-letter capture, operational alerts, manual replay authorization, and tenant-safe diagnostics. Replayed events must not bypass authorization or version resolution.

## 15. Audit event versus integration event

An audit entry answers **who did what, to which resource, when, and with what outcome**. An integration event communicates a governed state change to consumers. These may reference one another but are not interchangeable. UI `EventEmitter` outputs are not durable backend integration events.

## 16. Audit store reconciliation

The repository includes both `server/src/app/audit/...` and `server/src/app/security/...audit-log...` implementations. Determine whether they represent separate intentional audit domains, shared tables, legacy code, or competing models. **Do not merge, delete, or nominate one authoritative implementation before schema, wiring, migration, and usage verification.**

## 17. Audit completeness matrix

| Operation | Evidence to capture | Current status |
|---|---|---|
| Login / MFA / session | Actor, tenant, result, risk context | Not tested |
| Role / permission change | Actor, target, before/after scope | Not tested |
| Regulatory certification | Author/reviewer/certifier, immutable version | Not tested |
| Financial certification | Author/reviewer/certifier, immutable version | Not tested |
| Compliance determination | Input/version/output references | Not tested |
| Financial report release | Methodology, input, output, approver | Not tested |
| Binder release / access | Binder version, user, source ACL decision | Not tested |
| External surveyor access | Grant, use, expiry, revocation | Not tested |
| Failed access | Denied action, reason category, correlation | Not tested |

## 18. Security and tenant isolation

Event producers and consumers must enforce tenant context server-side; message-bus subscriptions and dead-letter queues must not leak cross-tenant data. Audit search endpoints require tenant scoping, least privilege, sensitive-field masking, and controlled export. Cross-tenant replay and event injection are prohibited.

## 19. Sensitive data handling

Minimize payload contents; prefer resource references where feasible. Define encryption in transit/at rest, retention, redaction, access control, and incident investigation handling for regulated data. Never log raw credentials, tokens, or unnecessary protected information.

## 20. Knowledge effective dates

Knowledge publication events must carry immutable version references and separate effective versus publication timestamps. A new pack must not silently rewrite historical findings, financial calculations, or released binders. Backdated changes require explicit correction workflows and audit.

## 21. Traceability chain

Required logical chain: authoritative source → certified knowledge version → operational fact/version → execution/correlation ID → determination → audit record → binder/report release. Each link must be reconstructable through durable identifiers and authorized access.

## 22. Observability

Instrument publish latency, dispatch lag, retry counts, dead-letter backlog, handler failures, duplicate suppressions, missing correlation IDs, and audit persistence failures. Define alert owners and severity thresholds during implementation planning, not by unsupported assumptions.

## 23. Failure-mode test matrix

| Test | Expected evidence | Status |
|---|---|---|
| Transaction rolls back | No orphaned business event | Not run |
| Process crashes after commit | Event eventually dispatched | Not run |
| Consumer receives duplicate | Exactly one authorized business effect | Not run |
| Consumer temporarily unavailable | Retry/recovery and alert | Not run |
| Invalid schema | Rejection and controlled diagnostics | Not run |
| Cross-tenant payload | Rejected, audited, no data disclosure | Not run |
| Old schema version | Supported or explicitly rejected per policy | Not run |
| Historical replay | Correct effective-dated knowledge resolution | Not run |
| External access revoked | No subsequent unauthorized access | Not run |
| Audit storage failure | Defined fail-safe and operational alert | Not run |

## 24. API/event contract integration

Link each event to producer APIs or domain operations, corresponding DTO/schema, owning Nx project, security guard, transaction boundary, and consumer acceptance tests. REC-004 and REC-005 inventories are inputs, not proof of complete contracts.

## 25. Nx dependency checks

Once repository dependencies are installable, run Nx project graph and affected lint/test/build checks; inspect imports for forbidden cross-layer dependencies and backend event adapter coupling. Actual commands and outcomes must be recorded with environment and commit/archive fingerprint.

## 26. Database verification

Inspect audit entity/table definitions, migrations, indices, retention constraints, and transactional boundaries. Execute migrations only in a disposable, approved test database with backups/rollback instructions. No migration has been run for this assessment.

## 27. Test fixture governance

Use synthetic tenants, actors, service records, knowledge versions, and binder artifacts. Include cross-tenant negative fixtures, duplicates, out-of-order events, superseded knowledge, failed approvals, and replay cases. Do not use real client records in test fixtures.

## 28. Proposed remediation workstreams (not authorized)

- **ER-01:** Reconcile historical EVT identifiers and designate owners.
- **ER-02:** Define canonical envelope and schema compatibility policy.
- **ER-03:** Evaluate and implement durable publication/consumption if required by approved contracts.
- **ER-04:** Reconcile dual audit namespaces and authoritative persistence.
- **ER-05:** Add tenant/security controls and audit coverage tests.
- **ER-06:** Implement observability, replay controls, and runbooks.
- **ER-07:** Verify end-to-end RKE/FKE/CI/FI/BM event traces.

These are proposed workstreams, not confirmed gaps requiring automatic replacement of code.

## 29. Treatment matrix

| Asset | Preliminary treatment | Rationale | Decision state |
|---|---|---|---|
| Existing audit module/service | Evaluate for **Reuse/Modify** | Source exists; runtime coverage unknown | Unapproved |
| Security audit service/entity | Evaluate for **Reuse/Modify/Consolidate** | Relationship to audit module unresolved | Unapproved |
| UI EventEmitter outputs | **Keep as UI behavior**, not backend event bus | Different semantics | Unapproved |
| Canonical event registry | **Build/Document** if no existing equivalent | Required by REC-001-D2 | Unapproved |
| Durable event delivery | **Investigate**, then classify | No conventional marker found in static scan | Unapproved |

## 30. Verification evidence record template

For each claim record: `evidenceId`, `archive/commit fingerprint`, `path`, `line range`, `method`, `observed behavior`, `expected behavior`, `status (PASS/FAIL/BLOCKED/NOT TESTED)`, `environment`, `reviewer`, `date`, `linked contract`, `linked issue`. Source-file presence alone is **not** a PASS for runtime behavior.

## 31. Acceptance gates

**G1:** All historical event IDs dispositioned.  
**G2:** Canonical event schema and ownership approved.  
**G3:** Durable delivery and idempotency tested where required.  
**G4:** Audit authority and retention reconciled.  
**G5:** Tenant isolation/security tests pass.  
**G6:** RKE/FKE/Applied/Binder historical traceability demonstrated.  
**G7:** Contract tests, build checks, and operational runbooks accepted.

All gates currently **PENDING**.

## 32. Open decisions

Who owns the canonical registry? Which persistence and transport mechanism is selected? Are audit domains unified or deliberately separate? What are delivery and retention SLAs? Which event payload fields may include sensitive data? What is the authorized replay model? All require evidence and explicit decision records.

## 33. Dependencies

REC-001 approved event governance; REC-002 component mapping; REC-003 contract verification register; REC-004 endpoint inventory; REC-005 API security assessment; ENG-009 API/event contracts; ENG-018 Shared Intelligence specification; ENG-023 integration flows; ENG-024/029 reconciliation and decision registers.

## 34. Current conclusion

**Verified:** Audit-related source files, an audit migration, and audit service references exist. Conventional backend event decorator/client/outbox markers were not found by the documented static scan.  
**Unverified:** Runtime audit coverage, durable event publication, consumer reliability, idempotency, tenant-safe replay, event schemas, certification traces, and historical reconstruction.  
**No implementation changes made. No build or runtime tests executed. No implementation authorization granted.**

## 35. Next document

**REC-007 — Knowledge Version Resolution, Certification, and Historical Reproduction Verification**, subject to user direction. Continue to distinguish architectural design, code existence, executed tests, and approved decisions.
