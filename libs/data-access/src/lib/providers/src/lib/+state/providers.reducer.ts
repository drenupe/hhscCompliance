import { createReducer, on } from '@ngrx/store';
import { ProvidersActions } from './providers.actions';
import { initialProvidersState } from './providers.models';

export const providersReducer = createReducer(
  initialProvidersState,

  on(ProvidersActions.loadProviders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProvidersActions.loadProvidersSuccess, (state, { providers }) => ({
    ...state,
    items: providers,
    loading: false,
  })),

  on(ProvidersActions.loadProvidersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ProvidersActions.selectProvider, (state, { providerId }) => ({
    ...state,
    selectedProviderId: providerId,
  })),

  on(ProvidersActions.createProvider, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(ProvidersActions.createProviderSuccess, (state, { provider }) => ({
    ...state,
    saving: false,
    items: [provider, ...state.items],
  })),

  on(ProvidersActions.createProviderFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(ProvidersActions.updateProvider, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(ProvidersActions.updateProviderSuccess, (state, { provider }) => ({
    ...state,
    saving: false,
    items: state.items.map((p) =>
      p.id === provider.id ? provider : p
    ),
  })),

  on(ProvidersActions.updateProviderFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),

  on(ProvidersActions.deleteProvider, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),

  on(ProvidersActions.deleteProviderSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    items: state.items.filter((p) => p.id !== id),
    selectedProviderId:
      state.selectedProviderId === id ? null : state.selectedProviderId,
  })),

  on(ProvidersActions.deleteProviderFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
);