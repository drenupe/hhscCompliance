import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, of } from 'rxjs';

import { ProvidersActions } from './providers.actions';
import { ProvidersApi } from '../services/providers.api';

function toMsg(error: unknown): string {
  const e = error as {
    error?: { message?: string };
    message?: string;
  };

  return e.error?.message ?? e.message ?? 'Request failed';
}

@Injectable()
export class ProvidersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ProvidersApi);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.loadProviders),
      exhaustMap(() =>
        this.api.list().pipe(
          map((providers) =>
            ProvidersActions.loadProvidersSuccess({ providers })
          ),
          catchError((error) =>
            of(
              ProvidersActions.loadProvidersFailure({
                error: toMsg(error),
              })
            )
          )
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.createProvider),
      concatMap(({ input }) =>
        this.api.create(input).pipe(
          map((provider) =>
            ProvidersActions.createProviderSuccess({ provider })
          ),
          catchError((error) =>
            of(
              ProvidersActions.createProviderFailure({
                error: toMsg(error),
              })
            )
          )
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.updateProvider),
      concatMap(({ id, input }) =>
        this.api.update(id, input).pipe(
          map((provider) =>
            ProvidersActions.updateProviderSuccess({ provider })
          ),
          catchError((error) =>
            of(
              ProvidersActions.updateProviderFailure({
                error: toMsg(error),
              })
            )
          )
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProvidersActions.deleteProvider),
      concatMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() =>
            ProvidersActions.deleteProviderSuccess({ id })
          ),
          catchError((error) =>
            of(
              ProvidersActions.deleteProviderFailure({
                error: toMsg(error),
              })
            )
          )
        )
      )
    )
  );
}