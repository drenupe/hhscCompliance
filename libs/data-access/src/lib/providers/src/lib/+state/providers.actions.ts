import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProviderDto, UpsertProviderInput } from '@hhsc-compliance/shared-models';

export const ProvidersActions = createActionGroup({
  source: 'Providers',
  events: {
    'Load Providers': emptyProps(),
    'Load Providers Success': props<{ providers: ProviderDto[] }>(),
    'Load Providers Failure': props<{ error: string }>(),

    'Select Provider': props<{ providerId: string | null }>(),

    'Create Provider': props<{ input: UpsertProviderInput }>(),
    'Create Provider Success': props<{ provider: ProviderDto }>(),
    'Create Provider Failure': props<{ error: string }>(),

    'Update Provider': props<{ id: string; input: UpsertProviderInput }>(),
    'Update Provider Success': props<{ provider: ProviderDto }>(),
    'Update Provider Failure': props<{ error: string }>(),

    'Delete Provider': props<{ id: string }>(),
    'Delete Provider Success': props<{ id: string }>(),
    'Delete Provider Failure': props<{ error: string }>(),
  },
});