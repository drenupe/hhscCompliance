import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PROVIDERS_FEATURE_KEY,
  ProvidersState,
} from './providers.models';

export const selectProvidersState =
  createFeatureSelector<ProvidersState>(PROVIDERS_FEATURE_KEY);

export const selectAllProviders = createSelector(
  selectProvidersState,
  (state) => state.items
);

export const selectSelectedProviderId = createSelector(
  selectProvidersState,
  (state) => state.selectedProviderId
);

export const selectSelectedProvider = createSelector(
  selectAllProviders,
  selectSelectedProviderId,
  (providers, selectedProviderId) =>
    providers.find((p) => p.id === selectedProviderId) ?? null
);

export const selectProvidersLoading = createSelector(
  selectProvidersState,
  (state) => state.loading
);

export const selectProvidersSaving = createSelector(
  selectProvidersState,
  (state) => state.saving
);

export const selectProvidersError = createSelector(
  selectProvidersState,
  (state) => state.error
);