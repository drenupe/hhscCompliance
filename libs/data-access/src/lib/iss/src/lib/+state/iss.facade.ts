// libs/data-access/src/lib/iss/src/lib/+state/iss.facade.ts
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as IssActions from './iss.actions';
import * as IssSelectors from './iss.selectors';
import { IssPartialState } from './iss.models';
import {
  CreateStaffLogDto,
  UpdateStaffLogDto,
} from '@hhsc-compliance/shared-models';

@Injectable({ providedIn: 'root' })
export class IssFacade {
  private readonly store = inject<Store<IssPartialState>>(Store);

  // ---------- selectors ----------

  readonly consumers$ = this.store.select(IssSelectors.selectConsumers);
  readonly selectedConsumer$ = this.store.select(
    IssSelectors.selectSelectedConsumer,
  );

  readonly weeks$ = this.store.select(IssSelectors.selectWeeksForConsumer);
  readonly selectedServiceDate$ = this.store.select(
    IssSelectors.selectSelectedServiceDate,
  );

  readonly currentLog$ = this.store.select(IssSelectors.selectCurrentLog);
  readonly currentLogLoading$ = this.store.select(
    IssSelectors.selectCurrentLogLoading,
  );
  readonly currentLogSaving$ = this.store.select(
    IssSelectors.selectCurrentLogSaving,
  );
  readonly currentLogError$ = this.store.select(
    IssSelectors.selectCurrentLogError,
  );

  // ---------- consumers ----------

  loadConsumers(): void {
    this.store.dispatch(IssActions.loadConsumers());
  }

  selectConsumer(consumerId: number): void {
    this.store.dispatch(IssActions.selectConsumer({ consumerId }));
  }

  loadWeeksForConsumer(consumerId: number): void {
    this.store.dispatch(IssActions.loadWeeksForConsumer({ consumerId }));
  }

  // ---------- weeks / current log ----------

  selectWeek(serviceDate: string): void {
    this.store.dispatch(IssActions.selectWeek({ serviceDate }));
  }

  loadLogForWeek(consumerId: number, serviceDate: string): void {
    this.store.dispatch(
      IssActions.loadLogForWeek({ consumerId, serviceDate }),
    );
  }

  saveLog(
    logId: number | null,
    payload: CreateStaffLogDto | UpdateStaffLogDto,
  ): void {
    this.store.dispatch(IssActions.saveLog({ logId, payload }));
  }
}
