// libs/data-access/src/lib/iss/src/lib/+state/iss.effects.ts

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';

import * as IssActions from './iss.actions';

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
import { ConsumersApi } from '../services/consumers.service';
import { StaffLogsApi } from '../services/staff-log.service';

// ✅ New API classes (FireDrillsApi style)

@Injectable()
export class IssEffects {
  private readonly actions$ = inject(Actions);
  private readonly consumersApi = inject(ConsumersApi);
  private readonly staffLogsApi = inject(StaffLogsApi);
  private readonly store = inject<Store<IssPartialState>>(Store);

  // ---------- Consumers (ISS Home) ----------
  loadConsumers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssActions.loadConsumers),
      switchMap(() =>
        this.consumersApi.list().pipe(
          map((consumers) => IssActions.loadConsumersSuccess({ consumers })),
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
        this.staffLogsApi.getWeeksForConsumer(consumerId).pipe(
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
        this.staffLogsApi.getLogByServiceDate(consumerId, serviceDate).pipe(
          switchMap((log: StaffLog | null) => {
            if (log) {
              return of(IssActions.loadLogForWeekSuccess({ log }));
            }

            // No log → create skeleton
            const body: CreateStaffLogDto = {
              consumerId,
              providerId: 1, // TODO: derive from auth / selected provider
              serviceDate,
              header: {} as StaffLogHeader,
              serviceWeek: {} as ServiceWeek,
            };

            return this.staffLogsApi.create(body).pipe(
              map((created) => IssActions.loadLogForWeekSuccess({ log: created })),
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
        if (!consumerId || !serviceDate) {
          console.warn('[ISS] Missing consumerId or serviceDate when saving log', {
            logId,
            consumerId,
            serviceDate,
          });

          return of(
            IssActions.saveLogFailure({
              error:
                'Missing consumer or service date when saving ISS log',
            }),
          );
        }

        const c = consumer as Consumer | null;

        const providerIdFromConsumer =
          (c as any)?.issProviderId ??
          (c as any)?.providerId ??
          (c as any)?.issProvider?.id ??
          1;

        const isCreate = !logId;

        if (isCreate) {
          const partial = payload as UpdateStaffLogDto;

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

          return this.staffLogsApi.create(body).pipe(
            map((log) => IssActions.saveLogSuccess({ log })),
            catchError((err) =>
              of(
                IssActions.saveLogFailure({
                  error: err?.message || 'Failed to save log',
                }),
              ),
            ),
          );
        }

        return this.staffLogsApi.update(logId, payload as UpdateStaffLogDto).pipe(
          map((log) => IssActions.saveLogSuccess({ log })),
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