# ADR-002: Texas HHSC HCS Cost Reporting as the First Vertical Slice

- Status: Accepted Architectural Direction
- Date: 2026-10-30
- Scope: Initial platform implementation

## Context

The platform needs a complete vertical slice that demonstrates
the relationship between knowledge, operational data, financial
processing, evidence, validation, reporting, and human approval.

Texas HHSC HCS Cost Reporting provides the initial business use case
for the Financial Knowledge Engine.

## Decision

Texas HHSC HCS Cost Reporting will be the first complete
platform vertical slice.

The slice will demonstrate:

1. Official source registration.
2. Financial knowledge modeling.
3. HCS financial knowledge pack validation and publication.
4. Financial data intake.
5. Financial account mapping.
6. Cost classification.
7. Cost allowability assessment.
8. Cost allocation.
9. Financial calculations.
10. Reconciliation and validation.
11. Evidence linking.
12. Financial Binder assembly.
13. Human review and approval.
14. Exportable report preparation.

## Scope Boundary

The initial slice prepares and validates cost-report information.

Electronic submission to HHSC is not included unless an authorized,
supported submission method is established and separately approved.

The initial implementation will not replace a provider's complete
accounting or payroll system.

## Source Authority

Applicable HHSC publications, reporting instructions, forms,
Texas Administrative Code provisions, and reporting-system
documentation must be verified before financial rules are published.

Historical reporting instructions must not be silently treated
as current requirements.

## Consequences

- The initial vertical slice prioritizes the Financial Knowledge Engine.
- Emergency Preparedness remains a future regulatory vertical slice.
- Shared platform services must support both financial and
  regulatory workflows.
- The HCS implementation must not introduce HCS-specific assumptions
  into universal platform models.

## Implementation Status

This ADR records architectural direction. It does not authorize
implementation.
