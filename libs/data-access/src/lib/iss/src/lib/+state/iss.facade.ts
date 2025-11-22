import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as IssActions from './iss.actions';
import * as IssSelectors from './iss.selectors';
import { IssPartialState } from './iss.models';

@Injectable({ providedIn: 'root' })
export class IssFacade {
  private readonly store = inject<Store<IssPartialState>>(Store);

  consumers$ = this.store.select(IssSelectors.selectAllIssConsumers);
  selectedConsumer$ = this.store.select(
    IssSelectors.selectSelectedConsumer
  );
  weeks$ = this.store.select(IssSelectors.selectWeeksForConsumer);
  selectedServiceDate$ = this.store.select(
    IssSelectors.selectSelectedServiceDate
  );
  currentLog$ = this.store.select(IssSelectors.selectCurrentLog);
  currentLogLoading$ = this.store.select(
    IssSelectors.selectCurrentLogLoading
  );
  currentLogSaving$ = this.store.select(
    IssSelectors.selectCurrentLogSaving
  );

  loadConsumers() {
    this.store.dispatch(IssActions.loadConsumers());
  }

  selectConsumer(consumerId: string) {
    this.store.dispatch(IssActions.selectConsumer({ consumerId }));
  }

  loadWeeksForConsumer(consumerId: string) {
    this.store.dispatch(IssActions.loadWeeksForConsumer({ consumerId }));
  }

  selectWeek(consumerId: string, serviceDate: string) {
    this.store.dispatch(IssActions.selectWeek({ serviceDate }));
    this.store.dispatch(
      IssActions.loadLogForWeek({ consumerId, serviceDate })
    );
  }

  saveLog(logId: string | null, payload: any) {
    this.store.dispatch(IssActions.saveLog({ logId, payload }));
  }

  deleteLog(logId: string) {
    this.store.dispatch(IssActions.deleteLog({ logId }));
  }
}
