import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateProviderDto, ProviderDto, UpdateProviderDto } from '../services/providers.api';

export const ProvidersActions = createActionGroup({
  source: 'Providers',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ items: ProviderDto[] }>(),
    'Load Failure': props<{ error: string }>(),

    Select: props<{ providerId: string }>(),

    Create: props<{ input: CreateProviderDto }>(),
    'Create Success': props<{ item: ProviderDto }>(),
    'Create Failure': props<{ error: string }>(),

    Update: props<{ id: string; changes: UpdateProviderDto }>(),
    'Update Success': props<{ item: ProviderDto }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),
  },
});
