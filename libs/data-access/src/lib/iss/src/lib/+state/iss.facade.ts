// libs/data-access/src/lib/iss/src/lib/+state/iss.facade.ts
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as IssActions from './iss.actions';
import * as IssSelectors from './iss.selectors';
import { IssPartialState } from './iss.models';

@Injectable({ providedIn: 'root' })
export class IssFacade {
  private readonly store = inject<Store<IssPartialState>>(Store);

  consumers$ = this.store.select(IssSelectors.selectAllIssConsumers);
  selectedConsumer$ = this.store.select(IssSelectors.selectSelectedConsumer);
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

  loadConsumers(): void {
    this.store.dispatch(IssActions.loadConsumers());
  }

  loadWeeksForConsumer(consumerId: string): void {
    this.store.dispatch(IssActions.loadWeeksForConsumer({ consumerId }));
  }

  selectConsumer(consumerId: string): void {
    this.store.dispatch(IssActions.selectConsumer({ consumerId }));
  }

  // 🔹 only pass serviceDate
  selectWeek(serviceDate: string): void {
    this.store.dispatch(IssActions.selectWeek({ serviceDate }));
  }

  loadLogForWeek(consumerId: string, serviceDate: string): void {
    this.store.dispatch(IssActions.loadLogForWeek({ consumerId, serviceDate }));
  }

  saveLog(logId: string | null, payload: unknown): void {
    this.store.dispatch(IssActions.saveLog({ logId, payload }));
  }
}
