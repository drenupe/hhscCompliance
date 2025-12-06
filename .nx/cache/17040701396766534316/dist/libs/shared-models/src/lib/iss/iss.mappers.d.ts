import { StaffLog } from './iss.models';
/**
 * Main entry point: normalize a StaffLog coming back from the API so:
 * - serviceDate is `YYYY-MM-DD`
 * - header.date is `YYYY-MM-DD` (if present)
 * - header.notes[].date are `YYYY-MM-DD`
 * - serviceWeek.*[].date are `YYYY-MM-DD`
 *
 * Everything else is left as-is.
 */
export declare function normalizeStaffLogFromApi(log: StaffLog): StaffLog;
