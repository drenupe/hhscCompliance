// libs/data-access/src/lib/iss/src/lib/+state/iss.models.ts

import {
  Consumer,
  StaffLog,
  WeekSummary,
} from '@hhsc-compliance/shared-models';

/**
 * Feature key for the ISS slice.
 * Kept UPPER_SNAKE to satisfy existing imports:
 * - iss-data-access.module.ts
 * - app.config.ts (via @hhsc-compliance/data-access)
 */
export const ISS_FEATURE_KEY = 'iss';

export interface IssState {
  consumers: Consumer[];
  consumersLoading: boolean;
  consumersError: string | null;

  selectedConsumerId: number | null;

  // key = consumerId
  weeksByConsumer: Record<number, WeekSummary[]>;
  weeksLoading: boolean;
  weeksError: string | null;

  selectedServiceDate: string | null;

  currentLog: StaffLog | null;
  currentLogLoading: boolean;
  currentLogSaving: boolean;
  currentLogError: string | null;
}

export interface IssPartialState {
  // state.iss (or state[ISS_FEATURE_KEY])
  readonly [ISS_FEATURE_KEY]: IssState;
}

export const initialIssState: IssState = {
  consumers: [],
  consumersLoading: false,
  consumersError: null,

  selectedConsumerId: null,

  weeksByConsumer: {},
  weeksLoading: false,
  weeksError: null,

  selectedServiceDate: null,

  currentLog: null,
  currentLogLoading: false,
  currentLogSaving: false,
  currentLogError: null,
};
