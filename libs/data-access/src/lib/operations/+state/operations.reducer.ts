import { createReducer, on } from '@ngrx/store';

import { OperationsActions } from './operations.actions';
import { initialOperationsState } from './operations.models';

export const operationsReducer = createReducer(
  initialOperationsState,

  on(OperationsActions.loadCommandCenter, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OperationsActions.loadCommandCenterSuccess, (state, { commandCenter }) => ({
    ...state,
    commandCenter,
    loading: false,
    error: null,
  })),

  on(OperationsActions.loadCommandCenterFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);