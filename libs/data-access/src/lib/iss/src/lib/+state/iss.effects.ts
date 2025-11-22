import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

import * as IssActions from './iss.actions';
import { ConsumersService } from '../services/consumers.service';
import { StaffLogService } from '../services/staff-log.service';
import { CreateStaffLogDto } from '@hhsc-compliance/shared-models';

@Injectable()
export class IssEffects {
  // DI via inject()
  private readonly actions$ = inject(Actions);
  private readonly consumersService = inject(ConsumersService);
  private readonly staffLogService = inject(StaffLogService);

  loadConsumers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadConsumers),
      switchMap(() =>
        this.consumersService.getConsumers().pipe(
          map(consumers => IssActions.loadConsumersSuccess({ consumers })),
          catchError(err =>
            of(
              IssActions.loadConsumersFailure({
                error: err?.message || 'Failed to load consumers',
              })
            )
          )
        )
      )
    )
  );

  loadWeeksForConsumer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadWeeksForConsumer),
      switchMap(({ consumerId }) =>
        this.staffLogService.getWeeksForConsumer(consumerId).pipe(
          map(weeks =>
            IssActions.loadWeeksForConsumerSuccess({ consumerId, weeks })
          ),
          catchError(err =>
            of(
              IssActions.loadWeeksForConsumerFailure({
                error: err?.message || 'Failed to load weeks',
              })
            )
          )
        )
      )
    )
  );

  loadLogForWeek$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadLogForWeek),
      switchMap(({ consumerId, serviceDate }) =>
        this.staffLogService.getLogByServiceDate(consumerId, serviceDate).pipe(
          switchMap(log => {
            if (log) {
              return of(IssActions.loadLogForWeekSuccess({ log }));
            }

            // If no log, call backend load-or-create endpoint
            const payload: CreateStaffLogDto = {
              consumerId,
              providerId: '', // TODO: fill from auth/selected provider
              serviceDate,
              header: {},
              serviceWeek: {} as any, // TODO: build template structure
            };

            return this.staffLogService.loadOrCreateLogForWeek(payload).pipe(
              map(created =>
                IssActions.loadLogForWeekSuccess({ log: created })
              )
            );
          }),
          catchError(err =>
            of(
              IssActions.loadLogForWeekFailure({
                error: err?.message || 'Failed to load log for week',
              })
            )
          )
        )
      )
    )
  );

  saveLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.saveLog),
      mergeMap(({ logId, payload }) => {
        const isCreate = !logId;
        const request$ = isCreate
          ? this.staffLogService.createLog(payload as CreateStaffLogDto)
          : this.staffLogService.updateLog(logId, payload);

        return request$.pipe(
          map(log => IssActions.saveLogSuccess({ log })),
          catchError(err =>
            of(
              IssActions.saveLogFailure({
                error: err?.message || 'Failed to save log',
              })
            )
          )
        );
      })
    )
  );
}
