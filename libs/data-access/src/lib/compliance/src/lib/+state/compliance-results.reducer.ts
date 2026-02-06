import { createReducer, on } from '@ngrx/store';
import { ComplianceResultsActions } from './compliance-results.actions';
import { ComplianceResultDto } from '@hhsc-compliance/shared-models';

export const COMPLIANCE_RESULTS_FEATURE_KEY = 'complianceResults';

export interface ComplianceResultsState {
  selectedLocationId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  rows: ComplianceResultDto[];
}

export const initialState: ComplianceResultsState = {
  selectedLocationId: null,
  loading: false,
  saving: false,
  error: null,
  rows: [],
};

export const complianceResultsReducer = createReducer(
  initialState,

  on(ComplianceResultsActions.selectLocation, (s, { locationId }) => ({
    ...s,
    selectedLocationId: locationId,
  })),

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
