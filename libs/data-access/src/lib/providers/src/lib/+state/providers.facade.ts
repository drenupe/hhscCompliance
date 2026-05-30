import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { UpsertProviderInput } from '@hhsc-compliance/shared-models';

import { ProvidersActions } from './providers.actions';
import * as ProvidersSelectors from './providers.selectors';

@Injectable({ providedIn: 'root' })
export class ProvidersFacade {
  private readonly store = inject(Store);

  readonly providers$ = this.store.select(
    ProvidersSelectors.selectAllProviders
  );

  readonly selectedProvider$ = this.store.select(
    ProvidersSelectors.selectSelectedProvider
  );

  readonly loading$ = this.store.select(
    ProvidersSelectors.selectProvidersLoading
  );

  readonly saving$ = this.store.select(
    ProvidersSelectors.selectProvidersSaving
  );

  readonly error$ = this.store.select(
    ProvidersSelectors.selectProvidersError
  );

  load(): void {
    this.store.dispatch(ProvidersActions.loadProviders());
  }

  select(providerId: string | null): void {
    this.store.dispatch(
      ProvidersActions.selectProvider({ providerId })
    );
  }

  create(input: UpsertProviderInput): void {
    this.store.dispatch(
      ProvidersActions.createProvider({ input })
    );
  }

  update(id: string, input: UpsertProviderInput): void {
    this.store.dispatch(
      ProvidersActions.updateProvider({ id, input })
    );
  }

  delete(id: string): void {
    this.store.dispatch(
      ProvidersActions.deleteProvider({ id })
    );
  }
}