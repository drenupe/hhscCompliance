import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComplianceResultsActions } from './compliance-results.actions';
import {
  selectError,
  selectLoading,
  selectRows,
  selectSaving,
  selectSelectedLocationId,
} from './compliance-results.selectors';
import {
  CreateComplianceResultInput,
  UpdateComplianceResultInput,
} from'@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class ComplianceResultsFacade {
  private readonly store = inject(Store);

  readonly selectedLocationId$ = this.store.select(selectSelectedLocationId);
  readonly rows$ = this.store.select(selectRows);
  readonly loading$ = this.store.select(selectLoading);
  readonly saving$ = this.store.select(selectSaving);
  readonly error$ = this.store.select(selectError);

  selectLocation(locationId: string) {
    this.store.dispatch(ComplianceResultsActions.selectLocation({ locationId }));
    this.store.dispatch(ComplianceResultsActions.load({ locationId }));
  }

  create(payload: CreateComplianceResultInput) {
    this.store.dispatch(ComplianceResultsActions.create({ payload }));
  }

  update(id: string, changes: UpdateComplianceResultInput) {
    this.store.dispatch(ComplianceResultsActions.update({ id, changes }));
  }

  remove(id: string) {
    this.store.dispatch(ComplianceResultsActions.remove({ id }));
  }

  clearError() {
    this.store.dispatch(ComplianceResultsActions.clearError());
  }
}
