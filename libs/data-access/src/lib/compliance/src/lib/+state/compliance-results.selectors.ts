import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COMPLIANCE_RESULTS_FEATURE_KEY, ComplianceResultsState } from './compliance-results.models';

export const selectComplianceResultsState =
  createFeatureSelector<ComplianceResultsState>(COMPLIANCE_RESULTS_FEATURE_KEY);

export const selectSelectedLocationId = createSelector(
  selectComplianceResultsState,
  (s) => s.selectedLocationId,
);

export const selectRows = createSelector(selectComplianceResultsState, (s) => s.rows);
export const selectLoading = createSelector(selectComplianceResultsState, (s) => s.loading);
export const selectSaving = createSelector(selectComplianceResultsState, (s) => s.saving);
export const selectError = createSelector(selectComplianceResultsState, (s) => s.error);

export const selectNonCompliantCount = createSelector(selectRows, (rows) =>
  rows.filter((r) => r.status === 'NON_COMPLIANT').length,
);
