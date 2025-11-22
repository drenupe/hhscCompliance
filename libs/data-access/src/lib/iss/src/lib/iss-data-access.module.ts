import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { issReducer } from './+state/iss.reducer';
import { ISS_FEATURE_KEY } from './+state/iss.models';
import { IssEffects } from './+state/iss.effects';

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forFeature(ISS_FEATURE_KEY, issReducer),
    EffectsModule.forFeature([IssEffects]),
  ],
})
export class IssDataAccessModule {}
