import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  OPERATIONS_FEATURE_KEY,
  OperationsState,
} from './operations.models';

export const selectOperationsState =
  createFeatureSelector<OperationsState>(OPERATIONS_FEATURE_KEY);

export const selectOperationsCommandCenterView = createSelector(
  selectOperationsState,
  (state) => state.commandCenter,
);

export const selectOperationsLoading = createSelector(
  selectOperationsState,
  (state) => state.loading,
);

export const selectOperationsError = createSelector(
  selectOperationsState,
  (state) => state.error,
);

export const selectOperationsServiceLines = createSelector(
  selectOperationsCommandCenterView,
  (view) => view?.serviceLines ?? [],
);

export const selectOperationsCoreModules = createSelector(
  selectOperationsCommandCenterView,
  (view) => view?.coreModules ?? [],
);

export const selectOperationsPriorities = createSelector(
  selectOperationsCommandCenterView,
  (view) => view?.priorities ?? [],
);

export const selectOperationsRecentActivity = createSelector(
  selectOperationsCommandCenterView,
  (view) => view?.recentActivity ?? [],
);

export const selectOperationsExecutiveIntelligence = createSelector(
  selectOperationsCommandCenterView,
  (view) => view?.executive ?? null,
);