import { createReducer, on } from '@ngrx/store';
import { ProvidersActions } from './providers.actions';
import { initialProvidersState } from './providers.models';

export const providersReducer = createReducer(
  initialProvidersState,

  on(ProvidersActions.load, (s) => ({ ...s, loading: true, error: null })),
  on(ProvidersActions.loadSuccess, (s, { items }) => ({ ...s, items, loading: false })),
  on(ProvidersActions.loadFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(ProvidersActions.select, (s, { providerId }) => ({ ...s, selectedProviderId: providerId })),

  // ✅ pessimistic: update store only on success
  on(ProvidersActions.create, (s) => ({ ...s, saving: true, error: null })),
  on(ProvidersActions.createSuccess, (s, { item }) => ({ ...s, saving: false, items: [item, ...s.items] })),
  on(ProvidersActions.createFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(ProvidersActions.update, (s) => ({ ...s, saving: true, error: null })),
  on(ProvidersActions.updateSuccess, (s, { item }) => ({
    ...s,
    saving: false,
    items: s.items.map((p) => (p.id === item.id ? item : p)),
  })),
  on(ProvidersActions.updateFailure, (s, { error }) => ({ ...s, saving: false, error })),

  on(ProvidersActions.delete, (s) => ({ ...s, saving: true, error: null })),
  on(ProvidersActions.deleteSuccess, (s, { id }) => ({
    ...s,
    saving: false,
    items: s.items.filter((p) => p.id !== id),
  })),
  on(ProvidersActions.deleteFailure, (s, { error }) => ({ ...s, saving: false, error })),
);
