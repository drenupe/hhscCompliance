import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FireDrillsActions } from './fire-drills.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { FireDrillsApi } from '../../services/fire-drills.api';

@Injectable()
export class FireDrillsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(FireDrillsApi);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FireDrillsActions.load),
      switchMap(({ locationId }) =>
        this.api.list({ locationId }).pipe(
          map((rows) => FireDrillsActions.loadSuccess({ locationId, rows })),
          catchError((error) => of(FireDrillsActions.loadFailure({ locationId, error }))),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FireDrillsActions.create),
      switchMap(({ input }) =>
        this.api.create(input).pipe(
          map((row) => FireDrillsActions.createSuccess({ row })),
          catchError((error) => of(FireDrillsActions.createFailure({ error }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FireDrillsActions.update),
      switchMap(({ id, input }) =>
        this.api.update(id, input).pipe(
          map((row) => FireDrillsActions.updateSuccess({ row })),
          catchError((error) => of(FireDrillsActions.updateFailure({ error }))),
        ),
      ),
    ),
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FireDrillsActions.remove),
      switchMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => FireDrillsActions.removeSuccess({ id })),
          catchError((error) => of(FireDrillsActions.removeFailure({ error }))),
        ),
      ),
    ),
  );
}
