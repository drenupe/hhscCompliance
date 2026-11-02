# ADR-001: Independent Regulatory and Financial Knowledge Authorities

- Status: Accepted Architectural Direction
- Date: 2026-10-30
- Scope: Platform-wide

## Context

The Regulatory Intelligence Platform must support regulatory compliance
and financial intelligence across multiple jurisdictions, industries,
programs, and organizations.

Regulatory requirements and financial methodologies represent distinct
knowledge domains. Combining them into one knowledge authority would
create unnecessary coupling and make independent governance difficult.

## Decision

The platform will maintain two independent knowledge authorities:

1. Regulatory Knowledge Engine
2. Financial Knowledge Engine

### Regulatory Knowledge Engine

Owns regulatory sources, source versions, provisions, obligations,
applicability, interpretations, regulatory validation definitions,
and regulatory knowledge packs.

### Financial Knowledge Engine

Owns financial sources, source versions, financial concepts,
classifications, cost principles, allowability rules, allocation
methodologies, reimbursement definitions, calculation definitions,
reporting definitions, and financial knowledge packs.

## Shared Capabilities

Both engines may use shared platform capabilities, including:

- Evidence
- Validation execution
- Audit and traceability
- Document management
- Version management infrastructure
- Approval workflows

Shared infrastructure does not transfer knowledge ownership
from either engine.

## Governance

Each knowledge authority independently governs its sources,
definitions, versions, reviews, approvals, and publications.

AI may assist with extraction and analysis but cannot independently
approve or publish knowledge.

## Consequences

- Regulatory and financial knowledge can evolve independently.
- Financial reporting does not depend on hardcoded regulatory logic.
- Regulatory obligations can reference financial reporting definitions.
- Both knowledge authorities must preserve source provenance.
- Historical decisions must retain the knowledge versions originally used.

## Implementation Status

This ADR records architectural direction. It does not authorize
implementation.
