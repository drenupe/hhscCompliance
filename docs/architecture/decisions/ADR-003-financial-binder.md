# ADR-003: Financial Binder as a First-Class Platform Capability

- Status: Accepted Architectural Direction
- Date: 2026-10-30
- Scope: Platform-wide

## Context

Financial reporting requires more than calculated totals and exported
spreadsheets. Reported amounts must be supported by source records,
classification decisions, allocation calculations, validation results,
and approval history.

## Decision

The Financial Binder will be a first-class platform capability.

It will maintain the reporting-period record of:

- Applicable financial knowledge pack and version.
- Official source references.
- Original financial data imports.
- Transaction mappings.
- Classification decisions.
- Allowability assessments.
- Allocation calculations.
- Calculation results.
- Validation findings.
- Supporting evidence.
- Reconciliation results.
- Reviewer comments.
- Approvals.
- Report versions.
- Audit history.

## Traceability

A reviewer must be able to trace a reported amount through its
reporting line, calculation, allocation, source transaction,
and supporting evidence.

## Relationship to Survey Binder

The Financial Binder and Survey Binder are separate business
capabilities.

They may use shared document, evidence, audit, access-control,
and reporting infrastructure.

## Consequences

Financial reporting becomes reproducible, reviewable, and auditable.

The Financial Binder must preserve historical report versions
and must not silently overwrite approved reporting records.

## Implementation Status

This ADR records architectural direction. It does not authorize
implementation.
