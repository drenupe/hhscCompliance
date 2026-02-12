import { createReducer, on } from '@ngrx/store';
import { FireDrillsActions } from './fire-drills.actions';
import { FireDrillLogDto } from '@hhsc-compliance/shared-models';

export type FireDrillsState = {
  loading: boolean;
  locationId: string;
  rows: FireDrillLogDto[];
  error: string;
};

export const initialFireDrillsState: FireDrillsState = {
  loading: false,
  locationId: '',
  rows: [],
  error: '',
};

export const fireDrillsReducer = createReducer(
  initialFireDrillsState,

  on(FireDrillsActions.load, (s, a) => ({
    ...s,
    loading: true,
    error: '',
    locationId: a.locationId,
  })),
  on(FireDrillsActions.loadSuccess, (s, a) => ({
    ...s,
    loading: false,
    rows: Array.isArray(a.rows) ? a.rows : [],
  })),
  on(FireDrillsActions.loadFailure, (s, a) => ({
    ...s,
    loading: false,
    rows: [],
    error: String(a.error?.message ?? 'Load failed'),
  })),

  on(FireDrillsActions.createSuccess, (s, a) => ({
    ...s,
    rows: [a.row, ...s.rows],
  })),
  on(FireDrillsActions.updateSuccess, (s, a) => ({
    ...s,
    rows: s.rows.map((x) => (x.id === a.row.id ? a.row : x)),
  })),
  on(FireDrillsActions.removeSuccess, (s, a) => ({
    ...s,
    rows: s.rows.filter((x) => x.id !== a.id),
  })),
);
