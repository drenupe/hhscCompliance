import { createReducer, on } from '@ngrx/store';
import { ComplianceResultsActions } from './compliance-results.actions';
import {
  COMPLIANCE_RESULTS_FEATURE_KEY, // still exported from models, OK to export here too if you want
  ComplianceResultsState,
  initialComplianceResultsState,
} from './compliance-results.models';

export const complianceResultsReducer = createReducer<ComplianceResultsState>(
  initialComplianceResultsState,

  on(ComplianceResultsActions.selectLocation, (s, { locationId }) => ({
    ...s,
    selectedLocationId: locationId,
  })),

  // If you have module/status/subcategory selection actions, keep them here too

  on(ComplianceResultsActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(ComplianceResultsActions.loadSuccess, (s, { rows }) => ({
    ...s,
    loading: false,
    rows: Array.isArray(rows) ? rows : [],
  })),
  on(ComplianceResultsActions.loadFailure, (s, { error }) => ({
    ...s,
    loading: false,
    error,
  })),

  on(ComplianceResultsActions.create, (s) => ({ ...s, saving: true, error: null })),
  on(ComplianceResultsActions.createSuccess, (s, { row }) => ({
    ...s,
    saving: false,
    rows: [row, ...s.rows],
  })),
  on(ComplianceResultsActions.createFailure, (s, { error }) => ({
    ...s,
    saving: false,
    error,
  })),

  on(ComplianceResultsActions.update, (s) => ({ ...s, saving: true, error: null })),
  on(ComplianceResultsActions.updateSuccess, (s, { row }) => ({
    ...s,
    saving: false,
    rows: s.rows.map((r) => (r.id === row.id ? row : r)),
  })),
  on(ComplianceResultsActions.updateFailure, (s, { error }) => ({
    ...s,
    saving: false,
    error,
  })),

  on(ComplianceResultsActions.remove, (s) => ({ ...s, saving: true, error: null })),
  on(ComplianceResultsActions.removeSuccess, (s, { id }) => ({
    ...s,
    saving: false,
    rows: s.rows.filter((r) => r.id !== id),
  })),
  on(ComplianceResultsActions.removeFailure, (s, { error }) => ({
    ...s,
    saving: false,
    error,
  })),

  on(ComplianceResultsActions.clearError, (s) => ({ ...s, error: null })),
);
