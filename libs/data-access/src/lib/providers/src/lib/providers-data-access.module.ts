import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { providersReducer } from './+state/providers.reducer';
import { PROVIDERS_FEATURE_KEY } from './+state/providers.models';
import { ProvidersEffects } from './+state/providers.effects';

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forFeature(PROVIDERS_FEATURE_KEY, providersReducer),
    EffectsModule.forFeature([ProvidersEffects]),
  ],
})
export class ProvidersDataAccessModule {}
