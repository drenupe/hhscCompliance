import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FireDrillsActions } from './fire-drills.actions';
import { selectFireDrillsLoading, selectFireDrillsRows, selectFireDrillsError } from './fire-drills.selectors';
import { CreateFireDrillLogInput, UpdateFireDrillLogInput } from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class FireDrillsFacade {
  private readonly store = inject(Store);

  readonly loading$ = this.store.select(selectFireDrillsLoading);
  readonly rows$ = this.store.select(selectFireDrillsRows);
  readonly error$ = this.store.select(selectFireDrillsError);

  load(locationId: string) {
    this.store.dispatch(FireDrillsActions.load({ locationId }));
  }

  create(input: CreateFireDrillLogInput) {
    this.store.dispatch(FireDrillsActions.create({ input }));
  }

  update(id: string, input: UpdateFireDrillLogInput) {
    this.store.dispatch(FireDrillsActions.update({ id, input }));
  }

  remove(id: string) {
    this.store.dispatch(FireDrillsActions.remove({ id }));
  }
}
