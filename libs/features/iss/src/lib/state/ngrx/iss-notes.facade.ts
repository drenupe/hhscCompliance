import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IssNotesActions } from './iss-notes.actions';
import {
  selectFilteredSortedNotes,
  selectWeekAnchor,
  selectFilterConsumer,
  selectFilterLocation,
  selectFilterQuery,
  selectLoading,
} from './iss-notes.selectors';
import { IssNote } from '../../models/iss-note.model';

@Injectable({ providedIn: 'root' })
export class IssNotesFacade {
  private store = inject(Store);

  // ✅ These are referenced by NotesGalleryComponent
  weekNotes$      = this.store.select(selectFilteredSortedNotes);
  weekAnchor$     = this.store.select(selectWeekAnchor);
  filterConsumer$ = this.store.select(selectFilterConsumer);
  filterLocation$ = this.store.select(selectFilterLocation);
  filterQuery$    = this.store.select(selectFilterQuery);
  loading$        = this.store.select(selectLoading);

  // Commands
  setWeekAnchor(anchor: string){ this.store.dispatch(IssNotesActions.setWeekAnchor({ anchor })); }
  setFilterConsumer(consumer?: string){ this.store.dispatch(IssNotesActions.setFilterConsumer({ consumer })); }
  setFilterLocation(location?: string){ this.store.dispatch(IssNotesActions.setFilterLocation({ location })); }
  setFilterQuery(q?: string){ this.store.dispatch(IssNotesActions.setFilterQuery({ q })); }

  loadWeek(start: string, end: string, opts?: { consumer?: string; location?: string; q?: string }){
    this.store.dispatch(IssNotesActions.loadWeekRequested({ start, end, ...opts }));
  }

  create(note: Omit<IssNote, 'id' | 'createdAt' | 'updatedAt'>){
    this.store.dispatch(IssNotesActions.createRequested({ note }));
  }
  update(id: string, patch: Partial<IssNote>){
    this.store.dispatch(IssNotesActions.updateRequested({ id, patch }));
  }
  remove(id: string){
    this.store.dispatch(IssNotesActions.removeRequested({ id }));
  }
  clear(){
    this.store.dispatch(IssNotesActions.clearLocal());
  }
}
