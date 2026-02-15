// libs/data-access/src/lib/residential/src/lib/fire-drills/+state/fire-drills.model.ts
// (Matches your ISS pattern exactly: FEATURE_KEY, State, PartialState, initialState)

import { FireDrillLogDto } from '@hhsc-compliance/shared-models';

/**
 * Feature key for the Fire Drills slice.
 * Keep UPPER_SNAKE style consistent with existing feature keys if needed.
 */
export const FIRE_DRILLS_FEATURE_KEY = 'fireDrills';

export interface FireDrillsState {
  // URL-driven scope
  locationId: string | null;

  // data
  rows: FireDrillLogDto[];
  loading: boolean;

  // write operations
  saving: boolean;

  // last error
  error: string | null;
}

export interface FireDrillsPartialState {
  // state.fireDrills (or state[FIRE_DRILLS_FEATURE_KEY])
  readonly [FIRE_DRILLS_FEATURE_KEY]: FireDrillsState;
}

export const initialFireDrillsState: FireDrillsState = {
  locationId: null,

  rows: [],
  loading: false,

  saving: false,

  error: null,
};
