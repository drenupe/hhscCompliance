// libs/compliance/src/lib/compliance-results/store/compliance-results.effects.ts

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom, filter } from 'rxjs';

import { ComplianceResultsActions } from './compliance-results.actions';
import {
  COMPLIANCE_RESULTS_FEATURE_KEY,
  ComplianceResultsState,
} from './compliance-results.models';
import { ComplianceResultsApi } from '../services/compliance-results.api';

@Injectable()
export class ComplianceResultsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ComplianceResultsApi);

  // fallback selector (so effects compile even if you don’t import selectors here)
  private readonly feature$ = this.store.select(
    (s: any) => s?.[COMPLIANCE_RESULTS_FEATURE_KEY] as ComplianceResultsState,
  );

  /**
   * ✅ Load list (Message Center)
   * - Pulls module/status/subcategory from store
   * - status === 'ALL' => omit status param so backend defaults to actionable-only (A)
   */
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceResultsActions.load),
      withLatestFrom(this.feature$),
      switchMap(([{ locationId }, feature]) => {
        const module = feature?.module ?? 'RESIDENTIAL';
        const subcategory = feature?.subcategory ?? null;
        const status = feature?.status ?? 'ALL';

        return this.api
          .list({
            locationId,
            module,
            subcategory: subcategory || undefined,
            status: status === 'ALL' ? undefined : status,
          })
          .pipe(
            map((rows) => ComplianceResultsActions.loadSuccess({ locationId, rows: rows ?? [] })),
            catchError((err) =>
              of(
                ComplianceResultsActions.loadFailure({
                  error:
                    err?.error?.message ??
                    `Failed to load results (${err?.status ?? 'unknown'}).`,
                }),
              ),
            ),
          );
      }),
    ),
  );

  /**
   * ✅ Create
   */
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceResultsActions.create),
      switchMap(({ payload }) =>
        this.api.create(payload).pipe(
          map((row) => ComplianceResultsActions.createSuccess({ row })),
          catchError((err) =>
            of(
              ComplianceResultsActions.createFailure({
                error:
                  err?.error?.message ??
                  `Create failed (${err?.status ?? 'unknown'}).`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * ✅ Update
   */
  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceResultsActions.update),
      switchMap(({ id, changes }) =>
        this.api.update(id, changes).pipe(
          map((row) => ComplianceResultsActions.updateSuccess({ row })),
          catchError((err) =>
            of(
              ComplianceResultsActions.updateFailure({
                error:
                  err?.error?.message ??
                  `Update failed (${err?.status ?? 'unknown'}).`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * ✅ Remove
   */
  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceResultsActions.remove),
      switchMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => ComplianceResultsActions.removeSuccess({ id })),
          catchError((err) =>
            of(
              ComplianceResultsActions.removeFailure({
                error:
                  err?.error?.message ??
                  `Remove failed (${err?.status ?? 'unknown'}).`,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * ✅ After create/update/remove succeeds:
   * Reload current selected location (if we have one)
   */
  reloadAfterMutation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ComplianceResultsActions.createSuccess,
        ComplianceResultsActions.updateSuccess,
        ComplianceResultsActions.removeSuccess,
      ),
      withLatestFrom(this.feature$),
      map(([_, feature]) => feature?.selectedLocationId ?? ''),
      filter((locationId) => !!locationId),
      map((locationId) => ComplianceResultsActions.load({ locationId })),
    ),
  );
}
