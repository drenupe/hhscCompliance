import { EntityState } from '@ngrx/entity';
import {
  Consumer,
  StaffLog,
  WeekSummary,
} from '@hhsc-compliance/shared-models';

export const ISS_FEATURE_KEY = 'iss';

export interface IssConsumersState extends EntityState<Consumer> {
  loaded: boolean;
  loading: boolean;
  error?: string | null;
  selectedConsumerId?: string | null;
}

export interface IssWeeksState {
  loaded: boolean;
  loading: boolean;
  error?: string | null;
  consumerId?: string | null;
  weeks: WeekSummary[];
  selectedServiceDate?: string | null;
}

export interface IssCurrentLogState {
  loading: boolean;
  saving: boolean;
  error?: string | null;
  log: StaffLog | null;
}

export interface IssState {
  consumers: IssConsumersState;
  weeks: IssWeeksState;
  currentLog: IssCurrentLogState;
}

// Shape for feature slice in root Store
export interface IssPartialState {
  readonly [ISS_FEATURE_KEY]: IssState;
}
