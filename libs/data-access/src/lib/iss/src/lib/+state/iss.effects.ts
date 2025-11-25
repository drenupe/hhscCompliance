// libs/data-access/src/lib/iss/src/lib/+state/iss.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

import * as IssActions from './iss.actions';
import { ConsumersService } from '../services/consumers.service';
import { StaffLogService } from '../services/staff-log.service';
import {
  CreateStaffLogDto,
  UpdateStaffLogDto,
  StaffLog,
} from '@hhsc-compliance/shared-models';

@Injectable()
export class IssEffects {
  private readonly actions$ = inject(Actions);
  private readonly consumersService = inject(ConsumersService);
  private readonly staffLogService = inject(StaffLogService);

  // ---------- Consumers (ISS Home) ----------
  loadConsumers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadConsumers),
      switchMap(() =>
        this.consumersService.getConsumers().pipe(
          map((consumers) =>
            IssActions.loadConsumersSuccess({ consumers }),
          ),
          catchError((err) =>
            of(
              IssActions.loadConsumersFailure({
                error: err?.message || 'Failed to load consumers',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ---------- Weeks for consumer (year grid) ----------
  loadWeeksForConsumer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadWeeksForConsumer),
      switchMap(({ consumerId }) =>
        this.staffLogService.getWeeksForConsumer(consumerId).pipe(
          map((weeks) =>
            IssActions.loadWeeksForConsumerSuccess({ consumerId, weeks }),
          ),
          catchError((err) =>
            of(
              IssActions.loadWeeksForConsumerFailure({
                error: err?.message || 'Failed to load weeks',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ---------- Load-or-create log for a week ----------
  loadLogForWeek$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadLogForWeek),
      switchMap(({ consumerId, serviceDate }) =>
        this.staffLogService
          .getLogByServiceDate(consumerId, serviceDate)
          .pipe(
            switchMap((log: StaffLog | null) => {
              if (log) {
                // Existing log for this week
                return of(
                  IssActions.loadLogForWeekSuccess({ log }),
                );
              }

              // No log → create a new skeleton log for this week
              const payload: CreateStaffLogDto = {
                consumerId,
                providerId: 1, // TODO: inject from auth / selected provider
                serviceDate,
                header: {} as any,
                serviceWeek: {} as any,
              };

              return this.staffLogService.createLog(payload).pipe(
                map((created: StaffLog) =>
                  IssActions.loadLogForWeekSuccess({ log: created }),
                ),
              );
            }),
            catchError((err) =>
              of(
                IssActions.loadLogForWeekFailure({
                  error: err?.message || 'Failed to load log for week',
                }),
              ),
            ),
          ),
      ),
    ),
  );

  // ---------- Save (create or update) ----------
  saveLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.saveLog),
      mergeMap(({ logId, payload }) => {
        const isCreate = !logId;

        const request$ = isCreate
          ? this.staffLogService.createLog(payload as CreateStaffLogDto)
          : this.staffLogService.updateLog(
              logId,
              payload as UpdateStaffLogDto,
            );

        return request$.pipe(
          map((log: StaffLog) =>
            IssActions.saveLogSuccess({ log }),
          ),
          catchError((err) =>
            of(
              IssActions.saveLogFailure({
                error: err?.message || 'Failed to save log',
              }),
            ),
          ),
        );
      }),
    ),
  );
}
