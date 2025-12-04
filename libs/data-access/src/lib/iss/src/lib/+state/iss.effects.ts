// libs/data-access/src/lib/iss/src/lib/+state/iss.effects.ts

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import * as IssActions from './iss.actions';

// Existing services (keep these so year page stays working)
import { ConsumersService } from '../services/consumers.service';
import { StaffLogService } from '../services/staff-log.service';

// Store + selectors
import { Store } from '@ngrx/store';
import * as IssSelectors from './iss.selectors';
import { IssPartialState } from './iss.models';

// Shared models / DTOs
import {
  CreateStaffLogDto,
  UpdateStaffLogDto,
  StaffLog,
  StaffLogHeader,
  ServiceWeek,
  Consumer,
} from '@hhsc-compliance/shared-models';

@Injectable()
export class IssEffects {
  private readonly actions$ = inject(Actions);
  private readonly consumersService = inject(ConsumersService);
  private readonly staffLogService = inject(StaffLogService);
  private readonly store = inject<Store<IssPartialState>>(Store);

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
                providerId: 1, // TODO: derive from auth / selected provider
                serviceDate,
                header: {} as StaffLogHeader,
                serviceWeek: {} as ServiceWeek,
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
      withLatestFrom(
        this.store.select(IssSelectors.selectSelectedConsumerId),
        this.store.select(IssSelectors.selectSelectedServiceDate),
        this.store.select(IssSelectors.selectSelectedConsumer),
      ),
      mergeMap(([{ logId, payload }, consumerId, serviceDate, consumer]) => {
        // Guard — if somehow we lost route context, fail gracefully
        if (!consumerId || !serviceDate) {
          console.warn(
            '[ISS] Missing consumerId or serviceDate when saving log',
            { logId, consumerId, serviceDate },
          );
          return of(
            IssActions.saveLogFailure({
              error: new Error(
                'Missing consumer or service date when saving ISS log',
              ) as any,
            }),
          );
        }

        const c = consumer as Consumer | null;

        // Derive providerId from consumer, fall back to 1 (or whatever default you want)
        const providerIdFromConsumer =
          (c as any)?.issProviderId ??
          (c as any)?.providerId ??
          (c as any)?.issProvider?.id ??
          1;

        const isCreate = !logId;

        if (isCreate) {
          // --- New log (no id yet) ---
          const partial = payload as UpdateStaffLogDto;

          // These are required by CreateStaffLogDto, so always send something
          const header: StaffLogHeader =
            (partial.header as StaffLogHeader) ?? ({} as StaffLogHeader);

          const serviceWeek: ServiceWeek =
            (partial.serviceWeek as ServiceWeek) ?? ({} as ServiceWeek);

          const body: CreateStaffLogDto = {
            consumerId,
            providerId: providerIdFromConsumer,
            serviceDate,
            header,
            serviceWeek,
          };

          return this.staffLogService.createLog(body).pipe(
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
        }

        // --- Existing log (update) ---
        return this.staffLogService
          .updateLog(logId, payload as UpdateStaffLogDto)
          .pipe(
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
