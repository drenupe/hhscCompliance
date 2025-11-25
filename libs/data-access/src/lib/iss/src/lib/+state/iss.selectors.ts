// libs/data-access/src/lib/iss/src/lib/+state/iss.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IssState } from './iss.models';
import { issFeatureKey } from './iss.reducer';
import { Consumer, WeekSummary, StaffLog } from '@hhsc-compliance/shared-models';

/**
 * Feature selector – grabs the whole ISS slice under the key "iss"
 * (issFeatureKey is exported from iss.reducer.ts as alias of ISS_FEATURE_KEY)
 */
export const selectIssState =
  createFeatureSelector<IssState>(issFeatureKey);

/* ========== BASIC FIELD SELECTORS ========== */

export const selectConsumers = createSelector(
  selectIssState,
  (state) => state.consumers
);

export const selectConsumersLoading = createSelector(
  selectIssState,
  (state) => state.consumersLoading
);

export const selectConsumersError = createSelector(
  selectIssState,
  (state) => state.consumersError
);

export const selectSelectedConsumerId = createSelector(
  selectIssState,
  (state) => state.selectedConsumerId
);

export const selectWeeksLoading = createSelector(
  selectIssState,
  (state) => state.weeksLoading
);

export const selectWeeksError = createSelector(
  selectIssState,
  (state) => state.weeksError
);

export const selectWeeksByConsumer = createSelector(
  selectIssState,
  (state) => state.weeksByConsumer
);

export const selectSelectedServiceDate = createSelector(
  selectIssState,
  (state) => state.selectedServiceDate
);

export const selectCurrentLog = createSelector(
  selectIssState,
  (state) => state.currentLog
);

export const selectCurrentLogLoading = createSelector(
  selectIssState,
  (state) => state.currentLogLoading
);

export const selectCurrentLogSaving = createSelector(
  selectIssState,
  (state) => state.currentLogSaving
);

export const selectCurrentLogError = createSelector(
  selectIssState,
  (state) => state.currentLogError
);

/* ========== DERIVED SELECTORS ========== */

/**
 * Currently selected consumer object
 */
export const selectSelectedConsumer = createSelector(
  selectConsumers,
  selectSelectedConsumerId,
  (consumers, selectedId): Consumer | null => {
    if (!selectedId) return null;
    return consumers.find((c) => c.id === selectedId) ?? null;
  }
);

/**
 * Weeks for the currently selected consumer.
 * This is what IssFacade.weeks$ uses, and what the year page
 * subscribes to directly.
 *
 * Shape: WeekSummary[] with hasLog / logId / status already set
 * by StaffLogService.getWeeksForConsumer().
 */
export const selectWeeksForConsumer = createSelector(
  selectWeeksByConsumer,
  selectSelectedConsumerId,
  (weeksByConsumer, consumerId): WeekSummary[] => {
    if (!consumerId) {
      return [];
    }
    return weeksByConsumer[consumerId] ?? [];
  }
);

/**
 * Optional: helper to grab the current log with its week metadata,
 * if you ever want that on the week page.
 */
export const selectCurrentLogWithMeta = createSelector(
  selectCurrentLog,
  selectSelectedServiceDate,
  (log, serviceDate): (StaffLog & { serviceDateFromRoute?: string }) | null => {
    if (!log) return null;
    return {
      ...log,
      serviceDateFromRoute: serviceDate ?? undefined,
    };
  }
);
