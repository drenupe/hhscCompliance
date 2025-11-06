import { createSelector } from '@ngrx/store';
import { selectIssNotesState, selectAll } from './iss-notes.reducer';

export const selectLoading = createSelector(selectIssNotesState, s => s.loading);
export const selectWeekAnchor = createSelector(selectIssNotesState, s => s.weekAnchor);
export const selectFilterConsumer = createSelector(selectIssNotesState, s => s.filterConsumer);
export const selectFilterLocation = createSelector(selectIssNotesState, s => s.filterLocation);
export const selectFilterQuery = createSelector(selectIssNotesState, s => s.filterQuery);

// Keep your existing filtered/sorted projector if you had one:
export const selectFilteredSortedNotes = createSelector(
  selectIssNotesState,
  selectAll,
  (state, list) => {
    const q = (state.filterQuery ?? '').toLowerCase().trim();
    const consumer = (state.filterConsumer ?? '').toLowerCase().trim();
    const location = (state.filterLocation ?? '').toLowerCase().trim();
    return (list ?? [])
      .filter(n => {
        const matchesQ = !q || n.comment.toLowerCase().includes(q)
          || n.activity?.toLowerCase().includes(q)
          || n.location?.toLowerCase().includes(q);
        const matchesConsumer = !consumer || n.consumer.toLowerCase().includes(consumer);
        const matchesLocation = !location || (n.location ?? '').toLowerCase().includes(location);
        return matchesQ && matchesConsumer && matchesLocation;
      })
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }
);
