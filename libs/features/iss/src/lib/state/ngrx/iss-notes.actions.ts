import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IssNote } from '../../models/iss-note.model';

export const IssNotesActions = createActionGroup({
  source: 'IssNotes',
  events: {
    'Load Week Requested': props<{ start: string; end: string; consumer?: string; location?: string; q?: string }>(),
    'Load Week Succeeded': props<{ notes: IssNote[] }>(),
    'Load Week Failed': props<{ error: unknown }>(),

    'Create Requested': props<{ note: Omit<IssNote,'id'|'createdAt'|'updatedAt'> }>(),
    'Create Succeeded': props<{ note: IssNote }>(),
    'Create Failed': props<{ error: unknown }>(),

    'Update Requested': props<{ id: string; patch: Partial<IssNote> }>(),
    'Update Succeeded': props<{ note: IssNote }>(),
    'Update Failed': props<{ error: unknown }>(),

    'Remove Requested': props<{ id: string }>(),
    'Remove Succeeded': props<{ id: string }>(),
    'Remove Failed': props<{ error: unknown }>(),

    'Clear Local': emptyProps(),

    'Set Week Anchor': props<{ anchor: string }>(),        // 'YYYY-MM-DD'
    'Set Filter Consumer': props<{ consumer?: string }>(),
    'Set Filter Location': props<{ location?: string }>(),
    'Set Filter Query': props<{ q?: string }>(),
  }
});
