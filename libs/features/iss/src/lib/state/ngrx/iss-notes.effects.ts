import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IssNotesActions } from './iss-notes.actions';
import { NotesApi } from '../../services/notes.api';
import { catchError, map, of, switchMap } from 'rxjs';
import { IssNote } from '../../models/iss-note.model';

@Injectable()
export class IssNotesEffects {
  private actions$ = inject(Actions);
  private api = inject(NotesApi);

  loadWeek$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IssNotesActions.loadWeekRequested),
      switchMap(({ start, end, consumer, location, q }) =>
        this.api.list({ start, end, consumer, location, q }).pipe(
          map((notes: IssNote[]) => IssNotesActions.loadWeekSucceeded({ notes })),
          catchError((error: unknown) => of(IssNotesActions.loadWeekFailed({ error })))
        )
      )
    )
  );
}
