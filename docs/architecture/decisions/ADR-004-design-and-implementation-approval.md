# ADR-004: Separate Design Approval and Implementation Approval

- Status: Accepted Architectural Direction
- Date: 2026-10-30
- Scope: All platform sprints

## Context

The platform is being designed as a long-term, extensible system.
Implementation must not begin from incomplete architecture or
unreviewed assumptions.

## Decision

Every sprint requires two separate approvals.

### Design Approval

Confirms:

- Sprint scope and objectives.
- Requirements and source authority.
- Architecture and domain model.
- Data model.
- API and service contracts.
- Security assessment.
- User experience.
- Dependencies and risks.
- Acceptance criteria.
- Test strategy.
- Software change register.

### Implementation Approval

Explicitly authorizes development of the approved sprint scope.

Design approval alone does not authorize implementation.

## Software Change Register

Every sprint must document:

- Existing files and modules affected.
- New files and modules proposed.
- Files to be modified or removed.
- Database and migration changes.
- API and contract changes.
- Security implications.
- Backward compatibility.
- Tests and documentation changes.

## Repository Protection

Existing user changes must be preserved.
No destructive Git operation, broad reset, cleanup, or commit
may be performed without explicit authorization.

## Consequences

The project maintains a clear distinction between proposed design,
approved design, active implementation, and accepted implementation.

## Implementation Status

This ADR records architectural direction. It does not authorize
implementation.
