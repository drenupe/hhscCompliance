// libs/data-access/src/lib/iss/src/lib/+state/iss.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ISS_FEATURE_KEY, IssState } from './iss.models';
import { selectAllConsumers } from './iss.reducer';

export const selectIssState =
  createFeatureSelector<IssState>(ISS_FEATURE_KEY);

// Consumers
export const selectConsumersState = createSelector(
  selectIssState,
  (state) => state.consumers
);

export const selectAllIssConsumers = createSelector(
  selectConsumersState,
  (state) => selectAllConsumers(state)
);

export const selectSelectedConsumerId = createSelector(
  selectConsumersState,
  (state) => state.selectedConsumerId
);

export const selectSelectedConsumer = createSelector(
  selectAllIssConsumers,
  selectSelectedConsumerId,
  (consumers, id) => consumers.find((c) => c.id === id) || null
);

// Weeks
export const selectWeeksState = createSelector(
  selectIssState,
  (state) => state.weeks
);

export const selectWeeksForConsumer = createSelector(
  selectWeeksState,
  (state) => state.weeks
);

export const selectSelectedServiceDate = createSelector(
  selectWeeksState,
  (state) => state.selectedServiceDate
);

// Current log
export const selectCurrentLogState = createSelector(
  selectIssState,
  (state) => state.currentLog
);

export const selectCurrentLog = createSelector(
  selectCurrentLogState,
  (state) => state.log
);

export const selectCurrentLogLoading = createSelector(
  selectCurrentLogState,
  (state) => state.loading
);

export const selectCurrentLogSaving = createSelector(
  selectCurrentLogState,
  (state) => state.saving
);
