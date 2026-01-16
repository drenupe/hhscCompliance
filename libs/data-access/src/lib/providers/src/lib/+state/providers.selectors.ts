import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROVIDERS_FEATURE_KEY, ProvidersState } from './providers.models';

export const selectProvidersState =
  createFeatureSelector<ProvidersState>(PROVIDERS_FEATURE_KEY);

export const selectProvidersItems = createSelector(selectProvidersState, (s) => s.items);
export const selectProvidersLoading = createSelector(selectProvidersState, (s) => s.loading);
export const selectProvidersSaving = createSelector(selectProvidersState, (s) => s.saving);
export const selectProvidersError = createSelector(selectProvidersState, (s) => s.error);

export const selectProvidersCount = createSelector(selectProvidersItems, (items) => items.length);

export const selectSelectedProviderId = createSelector(selectProvidersState, (s) => s.selectedProviderId);

export const selectSelectedProvider = createSelector(
  selectProvidersItems,
  selectSelectedProviderId,
  (items, id) => items.find((p) => p.id === id) ?? null,
);
