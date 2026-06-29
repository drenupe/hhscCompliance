import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OperationsEffects } from './operations.effects';
import { OPERATIONS_FEATURE_KEY } from './operations.models';
import { operationsReducer } from './operations.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(OPERATIONS_FEATURE_KEY, operationsReducer),
    EffectsModule.forFeature([OperationsEffects]),
  ],
})
export class OperationsStateModule {}