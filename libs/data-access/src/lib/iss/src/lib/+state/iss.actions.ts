// libs/data-access/src/lib/iss/src/lib/+state/iss.actions.ts
import { createAction, props } from '@ngrx/store';
import {
  Consumer,
  StaffLog,
  WeekSummary,
  CreateStaffLogDto,
  UpdateStaffLogDto,
} from '@hhsc-compliance/shared-models';

// ---------- Consumers ----------

export const loadConsumers = createAction('[ISS] Load Consumers');

export const loadConsumersSuccess = createAction(
  '[ISS] Load Consumers Success',
  props<{ consumers: Consumer[] }>(),
);

export const loadConsumersFailure = createAction(
  '[ISS] Load Consumers Failure',
  props<{ error: string }>(),
);

export const selectConsumer = createAction(
  '[ISS] Select Consumer',
  props<{ consumerId: number }>(),
);

// ---------- Weeks (year grid) ----------

export const loadWeeksForConsumer = createAction(
  '[ISS] Load Weeks For Consumer',
  props<{ consumerId: number }>(),
);

export const loadWeeksForConsumerSuccess = createAction(
  '[ISS] Load Weeks For Consumer Success',
  props<{ consumerId: number; weeks: WeekSummary[] }>(),
);

export const loadWeeksForConsumerFailure = createAction(
  '[ISS] Load Weeks For Consumer Failure',
  props<{ error: string }>(),
);

export const selectWeek = createAction(
  '[ISS] Select Week',
  props<{ serviceDate: string }>(),
);

// ---------- Current log (load-or-create) ----------

export const loadLogForWeek = createAction(
  '[ISS] Load Log For Week',
  props<{ consumerId: number; serviceDate: string }>(),
);

export const loadLogForWeekSuccess = createAction(
  '[ISS] Load Log For Week Success',
  props<{ log: StaffLog }>(),   // always non-null (we create if missing)
);

export const loadLogForWeekFailure = createAction(
  '[ISS] Load Log For Week Failure',
  props<{ error: string }>(),
);

// ---------- Save / Delete ----------

export const saveLog = createAction(
  '[ISS] Save Log',
  props<{
    logId: number | null; // null = create; non-null = update
    payload: CreateStaffLogDto | UpdateStaffLogDto;
  }>(),
);

export const saveLogSuccess = createAction(
  '[ISS] Save Log Success',
  props<{ log: StaffLog }>(),
);

export const saveLogFailure = createAction(
  '[ISS] Save Log Failure',
  props<{ error: string }>(),
);

export const deleteLogSuccess = createAction(
  '[ISS] Delete Log Success',
  props<{ logId: number }>(),
);
