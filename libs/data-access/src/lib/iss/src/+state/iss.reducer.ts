// libs/data-access/src/lib/iss/src/lib/+state/iss.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as IssActions from './iss.actions';
import {
  ISS_FEATURE_KEY,
  IssState,
  initialIssState,
} from './iss.models';

export const issFeatureKey = ISS_FEATURE_KEY;

export const issReducer = createReducer<IssState>(
  initialIssState,

  // ---------- Consumers ----------
  on(IssActions.loadConsumers, (state) => ({
    ...state,
    consumersLoading: true,
    consumersError: null,
  })),
  on(IssActions.loadConsumersSuccess, (state, { consumers }) => ({
    ...state,
    consumers,
    consumersLoading: false,
  })),
  on(IssActions.loadConsumersFailure, (state, { error }) => ({
    ...state,
    consumersLoading: false,
    consumersError: error,
  })),

  on(IssActions.selectConsumer, (state, { consumerId }) => ({
    ...state,
    selectedConsumerId: consumerId,
  })),

  // ---------- Weeks for consumer ----------
  on(IssActions.loadWeeksForConsumer, (state) => ({
    ...state,
    weeksLoading: true,
    weeksError: null,
  })),
  on(
    IssActions.loadWeeksForConsumerSuccess,
    (state, { consumerId, weeks }) => ({
      ...state,
      weeksLoading: false,
      weeksByConsumer: {
        ...state.weeksByConsumer,
        [consumerId]: weeks,
      },
    }),
  ),
  on(IssActions.loadWeeksForConsumerFailure, (state, { error }) => ({
    ...state,
    weeksLoading: false,
    weeksError: error,
  })),

  on(IssActions.selectWeek, (state, { serviceDate }) => ({
    ...state,
    selectedServiceDate: serviceDate,
  })),

  // ---------- Current log ----------
  on(IssActions.loadLogForWeek, (state) => ({
    ...state,
    currentLogLoading: true,
    currentLogError: null,
    // optional: clear stale log while loading
    // currentLog: null,
  })),
  on(IssActions.loadLogForWeekSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    currentLogLoading: false,
  })),
  on(IssActions.loadLogForWeekFailure, (state, { error }) => ({
    ...state,
    currentLogLoading: false,
    currentLogError: error,
  })),

  // ---------- Save log ----------
  on(IssActions.saveLog, (state) => ({
    ...state,
    currentLogSaving: true,
    currentLogError: null,
  })),
  on(IssActions.saveLogSuccess, (state, { log }) => ({
    ...state,
    currentLog: log,
    currentLogSaving: false,
  })),
  on(IssActions.saveLogFailure, (state, { error }) => ({
    ...state,
    currentLogSaving: false,
    currentLogError: error,
  })),
);
