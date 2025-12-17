import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { IssNotesActions } from './iss-notes.actions'; // adjust to your path
import { IssNote } from '../../models/iss-note.model'; // your note model

// ----- State -----
export interface IssNotesState extends EntityState<IssNote> {
  filterQuery: string;
  filterConsumer: string;
  filterLocation: string;
  loading: boolean;
  error: unknown | null;
  weekAnchor: string; // ISO YYYY-MM-DD
}

const adapter = createEntityAdapter<IssNote>({ selectId: (n) => n.id });

const initialState: IssNotesState = adapter.getInitialState({
  filterQuery: '',
  filterConsumer: '',
  filterLocation: '',
  loading: false,
  error: null,
  weekAnchor: '', // set by UI
});

// ----- Reducer -----
export const reducer = createReducer(
  initialState,

  on(IssNotesActions.loadWeekRequested, (s) => ({
    ...s,
    loading: true,
    error: null,
  })),
  on(IssNotesActions.loadWeekSucceeded, (s, { notes }) =>
    adapter.setAll(notes, { ...s, loading: false, error: null }),
  ),
  on(IssNotesActions.loadWeekFailed, (s, { error }) => ({
    ...s,
    loading: false,
    error,
  })),

  on(IssNotesActions.createRequested, (s) => ({ ...s, loading: true })),
  on(IssNotesActions.createSucceeded, (s, { note }) =>
    adapter.addOne(note, { ...s, loading: false }),
  ),
  on(IssNotesActions.createFailed, (s, { error }) => ({
    ...s,
    loading: false,
    error,
  })),

  on(IssNotesActions.updateSucceeded, (s, { note }) =>
    adapter.upsertOne(note, s),
  ),
  on(IssNotesActions.removeSucceeded, (s, { id }) => adapter.removeOne(id, s)),
  on(IssNotesActions.clearLocal, (s) => adapter.removeAll(s)),

  on(IssNotesActions.setWeekAnchor, (s, { anchor }) => ({
    ...s,
    weekAnchor: anchor,
  })),
  on(IssNotesActions.setFilterConsumer, (s, { consumer }) => ({
    ...s,
    filterConsumer: consumer ?? '',
  })),
  on(IssNotesActions.setFilterLocation, (s, { location }) => ({
    ...s,
    filterLocation: location ?? '',
  })),
  on(IssNotesActions.setFilterQuery, (s, { q }) => ({
    ...s,
    filterQuery: q ?? '',
  })),
);

// ----- Feature + Selectors (including adapter selectors) -----
export const IssNotesFeature = createFeature({
  name: 'issNotes',
  reducer,
  extraSelectors: ({ selectIssNotesState }) => {
    const { selectAll, selectTotal, selectEntities, selectIds } =
      adapter.getSelectors(selectIssNotesState);

    /**
     * We avoid `any` here.
     * If you have a typed AppState, replace RootState with that.
     */
    type RootState = Record<string, unknown>;

    return {
      selectAll,
      selectTotal,
      selectEntities,
      selectIds,

      // Example filtered list
      selectWeekListFiltered: (root: RootState): IssNote[] => {
        const s = selectIssNotesState(root);
        const list = selectAll(root);

        const q = (s.filterQuery ?? '').toLowerCase();
        const c = (s.filterConsumer ?? '').toLowerCase();
        const l = (s.filterLocation ?? '').toLowerCase();

        return list
          .filter((n) => {
            const inQ = !q || `${n.comment ?? ''}`.toLowerCase().includes(q);
            const inC = !c || `${(n as unknown as { consumer?: string }).consumer ?? ''}`
              .toLowerCase()
              .includes(c);
            const inL = !l || `${(n as unknown as { location?: string }).location ?? ''}`
              .toLowerCase()
              .includes(l);
            return inQ && inC && inL;
          })
          .sort((a, b) => (a.date < b.date ? -1 : 1));
      },
    };
  },
});

// convenient re-exports
export const {
  name: issNotesFeatureKey,
  reducer: issNotesReducer,
  selectIssNotesState,
  selectAll,
  selectTotal,
  selectEntities,
  selectIds,
  selectWeekListFiltered,
} = IssNotesFeature;
