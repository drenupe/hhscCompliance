import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { OperationsService } from '../services/operations.service';
import { OperationsActions } from './operations.actions';

@Injectable()
export class OperationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly operationsService = inject(OperationsService);

  readonly loadCommandCenter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadCommandCenter),
      switchMap(() =>
        this.operationsService.getCommandCenter().pipe(
          map((commandCenter) =>
            OperationsActions.loadCommandCenterSuccess({
              commandCenter,
            }),
          ),
          catchError((error: unknown) =>
            of(
              OperationsActions.loadCommandCenterFailure({
                error:
                  error instanceof Error
                    ? error.message
                    : 'Unable to load Provider Operations.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}