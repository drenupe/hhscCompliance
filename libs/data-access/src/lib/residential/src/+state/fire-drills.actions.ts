import { createActionGroup, props } from '@ngrx/store';
import { FireDrillLogDto, CreateFireDrillLogInput, UpdateFireDrillLogInput } from '@hhsc-compliance/shared-models';

export const FireDrillsActions = createActionGroup({
  source: 'FireDrills',
  events: {
    'Load': props<{ locationId: string }>(),
    'Load Success': props<{ locationId: string; rows: FireDrillLogDto[] }>(),
    'Load Failure': props<{ locationId: string; error: any }>(),

    'Create': props<{ input: CreateFireDrillLogInput }>(),
    'Create Success': props<{ row: FireDrillLogDto }>(),
    'Create Failure': props<{ error: any }>(),

    'Update': props<{ id: string; input: UpdateFireDrillLogInput }>(),
    'Update Success': props<{ row: FireDrillLogDto }>(),
    'Update Failure': props<{ error: any }>(),

    'Remove': props<{ id: string }>(),
    'Remove Success': props<{ id: string }>(),
    'Remove Failure': props<{ error: any }>(),
  },
});
