// libs/shared-models/src/lib/iss/iss.mappers.ts

import {
  StaffLog,
  StaffLogHeader,
  ServiceWeek,
  ServiceDayEntry,
  WeeklyNote,
  
} from './iss.models';

/**
 * Normalize a date-like string to `YYYY-MM-DD`, or return null if falsy.
 * Works with:
 * - '2025-10-01'
 * - '2025-10-01T00:00:00.000Z'
 */
function normalizeDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    // new Date(...) works for both 'YYYY-MM-DD' and full ISO strings.
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return value; // fallback: leave as-is if parsing fails
    }
    return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  } catch {
    return value;
  }
}

/**
 * Normalize header fields that contain dates:
 * - header.date
 * - header.notes[].date
 */
function normalizeHeaderDates(header: StaffLogHeader | any): StaffLogHeader {
  if (!header) return {} as StaffLogHeader;

  const normalized: StaffLogHeader = {
    ...header,
  };

  // Normalize header.date if present
  if (header.date) {
    normalized.date = normalizeDateOnly(header.date) ?? header.date;
  }

  // Normalize header.notes[].date if present
  if (Array.isArray(header.notes)) {
    const notes = header.notes as WeeklyNote[];

    normalized.notes = notes.map((n) => ({
      ...n,
      date: normalizeDateOnly(n.date) ?? n.date,
    }));
  }

  return normalized;
}

/**
 * Normalize ServiceWeek day entries that contain dates:
 * - serviceWeek.monday[i].date, tuesday[i].date, etc.
 */
function normalizeServiceWeekDates(serviceWeek: ServiceWeek | any): ServiceWeek {
  if (!serviceWeek) {
    return {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    };
  }

  const normalizeEntries = (entries: ServiceDayEntry[] | undefined) =>
    (entries ?? []).map((e) => ({
      ...e,
      date: normalizeDateOnly(e.date) ?? e.date,
    }));

  return {
    ...serviceWeek,
    monday: normalizeEntries(serviceWeek.monday),
    tuesday: normalizeEntries(serviceWeek.tuesday),
    wednesday: normalizeEntries(serviceWeek.wednesday),
    thursday: normalizeEntries(serviceWeek.thursday),
    friday: normalizeEntries(serviceWeek.friday),
    // keep weekend if present
    saturday: serviceWeek.saturday
      ? normalizeEntries(serviceWeek.saturday)
      : serviceWeek.saturday,
    sunday: serviceWeek.sunday
      ? normalizeEntries(serviceWeek.sunday)
      : serviceWeek.sunday,
  };
}

/**
 * Main entry point: normalize a StaffLog coming back from the API so:
 * - serviceDate is `YYYY-MM-DD`
 * - header.date is `YYYY-MM-DD` (if present)
 * - header.notes[].date are `YYYY-MM-DD`
 * - serviceWeek.*[].date are `YYYY-MM-DD`
 *
 * Everything else is left as-is.
 */
export function normalizeStaffLogFromApi(log: StaffLog): StaffLog {
  if (!log) return log;

  const normalizedServiceDate =
    normalizeDateOnly(log.serviceDate) ?? log.serviceDate;

  return {
    ...log,
    serviceDate: normalizedServiceDate,
    header: normalizeHeaderDates(log.header as any),
    serviceWeek: normalizeServiceWeekDates(log.serviceWeek as any),
  };
}
