import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ComplianceResultDto,
  CreateComplianceResultInput,
  ModuleKey,
  UpdateComplianceResultInput,
} from '@hhsc-compliance/shared-models';

// ✅ add this import (adjust path to match where this actions file lives)
import { StatusFilter } from '../+state/compliance-results.models';

export const ComplianceResultsActions = createActionGroup({
  source: 'ComplianceResults',
  events: {
    'Select Location': props<{ locationId: string }>(),

    'Load': props<{ locationId: string }>(),
    'Load Success': props<{ locationId: string; rows: ComplianceResultDto[] }>(),
    'Load Failure': props<{ error: string }>(),

    'Create': props<{ payload: CreateComplianceResultInput }>(),
    'Create Success': props<{ row: ComplianceResultDto }>(),
    'Create Failure': props<{ error: string }>(),

    'Update': props<{ id: string; changes: UpdateComplianceResultInput }>(),
    'Update Success': props<{ row: ComplianceResultDto }>(),
    'Update Failure': props<{ error: string }>(),

    'Remove': props<{ id: string }>(),
    'Remove Success': props<{ id: string }>(),
    'Remove Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),

    'Set Module': props<{ module: ModuleKey }>(),
    'Set Status': props<{ status: StatusFilter }>(),
    'Set Subcategory': props<{ subcategory: string | null }>(),
  },
});
