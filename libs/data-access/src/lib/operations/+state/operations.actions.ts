import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OperationsCommandCenterView } from '../types/operations.types';


export const OperationsActions = createActionGroup({
  source: 'Operations',
  events: {
    'Load Command Center': emptyProps(),
    'Load Command Center Success': props<{
      commandCenter: OperationsCommandCenterView;
    }>(),
    'Load Command Center Failure': props<{ error: string }>(),
  },
});