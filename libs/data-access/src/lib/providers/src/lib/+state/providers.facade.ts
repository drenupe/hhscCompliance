import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ProvidersPartialState } from './providers.models';
import * as ProvidersSelectors from './providers.selectors';
import { ProvidersActions } from './providers.actions';
import { CreateProviderDto, UpdateProviderDto } from '../services/providers.api';
@Injectable({ providedIn: 'root' })
export class ProvidersFacade {
  private readonly store = inject<Store<ProvidersPartialState>>(Store);

  readonly items$ = this.store.select(ProvidersSelectors.selectProvidersItems);
  readonly loading$ = this.store.select(ProvidersSelectors.selectProvidersLoading);
  readonly saving$ = this.store.select(ProvidersSelectors.selectProvidersSaving);
  readonly error$ = this.store.select(ProvidersSelectors.selectProvidersError);
  readonly count$ = this.store.select(ProvidersSelectors.selectProvidersCount);

  load(): void {
    this.store.dispatch(ProvidersActions.load());
  }

  create(input: CreateProviderDto): void {
    this.store.dispatch(ProvidersActions.create({ input }));
  }

  update(id: string, changes: UpdateProviderDto): void {
    this.store.dispatch(ProvidersActions.update({ id, changes }));
  }

  delete(id: string): void {
    this.store.dispatch(ProvidersActions.delete({ id }));
  }
}
