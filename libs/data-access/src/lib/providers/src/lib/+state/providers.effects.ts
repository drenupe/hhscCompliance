import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ProvidersActions } from './providers.actions';
import { ProvidersApi } from '../services/providers.api';

function toMsg(e: unknown): string {
  const anyE = e as any;
  return anyE?.error?.message || anyE?.message || 'Request failed';
}

@Injectable()
export class ProvidersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ProvidersApi);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.load),
      mergeMap(() =>
        this.api.list().pipe(
          map((items) => ProvidersActions.loadSuccess({ items })),
          catchError((e) => of(ProvidersActions.loadFailure({ error: toMsg(e) }))),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.create),
      mergeMap(({ input }) =>
        this.api.create(input).pipe(
          map((item) => ProvidersActions.createSuccess({ item })),
          catchError((e) => of(ProvidersActions.createFailure({ error: toMsg(e) }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.update),
      mergeMap(({ id, changes }) =>
        this.api.update(id, changes).pipe(
          map((item) => ProvidersActions.updateSuccess({ item })),
          catchError((e) => of(ProvidersActions.updateFailure({ error: toMsg(e) }))),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.delete),
      mergeMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => ProvidersActions.deleteSuccess({ id })),
          catchError((e) => of(ProvidersActions.deleteFailure({ error: toMsg(e) }))),
        ),
      ),
    ),
  );
}
