// libs/data-access/src/lib/iss/src/lib/+state/iss.reducer.ts
import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Consumer } from '@hhsc-compliance/shared-models';
import * as IssActions from './iss.actions';
import {
  IssConsumersState,
  IssWeeksState,
  IssCurrentLogState,
  IssState,
} from './iss.models';

const consumersAdapter = createEntityAdapter<Consumer>({
  selectId: (c) => c.id,
});

// --- slice initial states ---

const initialConsumersState: IssConsumersState = consumersAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
  selectedConsumerId: null,
});

const initialWeeksState: IssWeeksState = {
  loaded: false,
  loading: false,
  error: null,
  consumerId: null,
  weeks: [],
  selectedServiceDate: null,
};

const initialCurrentLogState: IssCurrentLogState = {
  loading: false,
  saving: false,
  error: null,
  log: null,
};

// --- slice reducers ---

const consumersReducer = createReducer(
  initialConsumersState,
  on(IssActions.loadConsumers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(IssActions.loadConsumersSuccess, (state, { consumers }) =>
    consumersAdapter.setAll(consumers, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(IssActions.loadConsumersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(IssActions.selectConsumer, (state, { consumerId }) => ({
    ...state,
    selectedConsumerId: consumerId,
  }))
);

const weeksReducer = createReducer(
  initialWeeksState,
  on(IssActions.loadWeeksForConsumer, (state, { consumerId }) => ({
    ...state,
    loading: true,
    error: null,
    consumerId,
    weeks: [],
    selectedServiceDate: null,
  })),
  on(IssActions.loadWeeksForConsumerSuccess, (state, { consumerId, weeks }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    consumerId,
    weeks,
  })),
  on(IssActions.loadWeeksForConsumerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(IssActions.selectWeek, (state, { serviceDate }) => ({
    ...state,
    selectedServiceDate: serviceDate,
  }))
);

const currentLogReducer = createReducer(
  initialCurrentLogState,
  on(IssActions.loadLogForWeek, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(IssActions.loadLogForWeekSuccess, (state, { log }) => ({
    ...state,
    loading: false,
    error: null,
    log,
  })),
  on(IssActions.loadLogForWeekFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    log: null,
  })),
  on(IssActions.saveLog, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(IssActions.saveLogSuccess, (state, { log }) => ({
    ...state,
    saving: false,
    error: null,
    log,
  })),
  on(IssActions.saveLogFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
  on(IssActions.deleteLogSuccess, (state) => ({
    ...state,
    log: null,
  }))
);

// --- root ISS state ---

export const initialIssState: IssState = {
  consumers: initialConsumersState,
  weeks: initialWeeksState,
  currentLog: initialCurrentLogState,
};

export function issReducer(
  state: IssState = initialIssState,
  action: Action
): IssState {
  return {
    consumers: consumersReducer(state.consumers, action),
    weeks: weeksReducer(state.weeks, action),
    currentLog: currentLogReducer(state.currentLog, action),
  };
}

// entity selectors
export const {
  selectAll: selectAllConsumers,
  selectEntities: selectConsumerEntities,
} = consumersAdapter.getSelectors();
