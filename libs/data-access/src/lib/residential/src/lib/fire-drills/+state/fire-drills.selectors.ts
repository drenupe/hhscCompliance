import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FireDrillsState } from './fire-drills.reducer';

export const selectFireDrillsState = createFeatureSelector<FireDrillsState>('fireDrills');

export const selectFireDrillsLoading = createSelector(selectFireDrillsState, (s) => s.loading);
export const selectFireDrillsRows = createSelector(selectFireDrillsState, (s) => s.rows);
export const selectFireDrillsError = createSelector(selectFireDrillsState, (s) => s.error);
export const selectFireDrillsLocationId = createSelector(selectFireDrillsState, (s) => s.locationId);
