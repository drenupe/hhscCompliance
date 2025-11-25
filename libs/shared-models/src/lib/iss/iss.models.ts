// libs/shared-models/src/lib/iss/iss.models.ts

// ---------- Core ISS domain models ----------

export interface Provider {
  id: number;
  name: string;
  licenseNumber: string;

  // backend currently doesn't send `active`, keep optional for future use
  active?: boolean;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type PlaceOfService = 'ON_SITE' | 'OFF_SITE' | string;

/**
 * Consumer as returned by the ISS API
 * (note: issProvider is embedded, not just providerId)
 */
export interface Consumer {
  id: number;

  firstName: string;
  lastName: string;

  // your API returns these as strings
  levelOfNeed?: string | number;
  placeOfService?: PlaceOfService;

  dateOfBirth?: string | null;
  medicaidNumber?: string | null;

  // legacy / optional
  mrn?: string | null;
  medicaidId?: string | null;
  active?: boolean;

  // relation
  issProvider?: Provider;

  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime;

  // Optional FK if you want it on the client
  providerId?: number;
}

// ---------- Weekly initials + notes (for staff log header) ----------

/**
 * One row in a weekly initials grid, e.g. "Communication" with Mon–Fri cells.
 * Used for:
 * - Socialization
 * - Self-help
 * - Adaptive
 * - Implementation
 * - Community integration
 */
export interface WeeklyInitialRow {
  label: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}

/**
 * One note row for:
 * "Community Locations Visited & Special Events or Occurrences"
 */
export interface WeeklyNote {
  /** ISO date "YYYY-MM-DD" */
  date: string;
  initials: string;
  comment: string;
}

// ---------- Staff log structure ----------

/**
 * Staff-log header:
 * - Core ISS 8615-style fields
 * - Weekly initials groups
 * - Weekly narrative notes
 * - Extra keys allowed via index signature
 *
 * This matches the `header` object in your JSON:
 *   "header": {
 *     "lon": "5",
 *     "levelOfNeed": 5,
 *     "individualName": "Chris Brown",
 *     "placeOfService": "OFF_SITE",
 *     "staffNameTitle": "ISS Direct Care Staff",
 *     "issProviderName": "Ellis Works",
 *     "issProviderLicense": "311123",
 *     ...
 *   }
 */
export interface StaffLogHeader {
  // ISS 8615-style fields
  individualName?: string;
  date?: string;                     // "YYYY-MM-DD" for Monday of week
  lon?: string;
  levelOfNeed?: number | string;
  placeOfService?: PlaceOfService;

  provider?: string;                 // Name of ISS provider
  license?: string;                  // License number
  staffNameTitle?: string;

  issProviderName?: string;
  issProviderLicense?: string;

  // Older / generic fields (keep for flexibility)
  locationName?: string;
  staffInitials?: string;
  ratio?: string;

  // Weekly initials groups (used by ISS week page)
  socialization?: WeeklyInitialRow[];
  selfHelp?: WeeklyInitialRow[];
  adaptive?: WeeklyInitialRow[];
  implementation?: WeeklyInitialRow[];
  community?: WeeklyInitialRow[];

  // Weekly narrative notes
  notes?: WeeklyNote[];

  // room for extra header fields
  [key: string]: any;
}

/**
 * A single service entry for one day.
 * The API returns this shape under serviceWeek.monday[0], etc.
 */
export interface ServiceDayEntry {
  // Core time/activity fields
  timeIn?: string | null;          // kept for backward compat
  timeOut?: string | null;
  activity?: string | null;
  notes?: string | null;

  // Rich ISS week card fields
  date?: string | null;            // "YYYY-MM-DD"
  providerName?: string | null;
  providerSignature?: string | null;
  start?: string | null;
  end?: string | null;
  minutes?: number | null;
  setting?: 'on_site' | 'off_site' | string | null;
  individualsCount?: number | null;
  staffCount?: number | null;

  // free-form extension space
  [key: string]: any;
}

export interface ServiceWeek {
  monday: ServiceDayEntry[];
  tuesday: ServiceDayEntry[];
  wednesday: ServiceDayEntry[];
  thursday: ServiceDayEntry[];
  friday: ServiceDayEntry[];
  saturday?: ServiceDayEntry[];
  sunday?: ServiceDayEntry[];

  // allow extra metadata if needed
  [key: string]: any;
}

export type StaffLogStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'voided';

/**
 * Full staff log as returned by the API.
 * Your JSON currently nests consumer + issProvider.
 */
export interface StaffLog {
  id: number;            // numeric ID

  // FKs (may or may not be present in serialized JSON)
  providerId?: number;
  consumerId?: number;

  /**
   * Monday of the week (ISO "YYYY-MM-DD")
   * e.g. "2025-09-29"
   */
  serviceDate: string;

  header: StaffLogHeader;
  serviceWeek: ServiceWeek;

  // Top-level weekly sections / notes (you are currently using header.notes)
  weeklySections?: any[];
  notes?: any[];

  status?: StaffLogStatus;

  createdAt: string;
  updatedAt: string;

  // relations
  consumer?: Consumer;
  issProvider?: Provider;
}

// ---------- Week summaries ----------

export interface WeekSummary {
  serviceDate: string;
  hasLog: boolean;
  logId?: number | null;
  status?: StaffLogStatus;
  weekNumber?: number;
  totalHours?: number;   // optional, but your template may use it
}

// ---------- DTOs ----------

export interface CreateStaffLogDto {
  providerId: number;    // numeric ID
  consumerId: number;    // numeric ID
  serviceDate: string;   // "YYYY-MM-DD"
  header: StaffLogHeader;
  serviceWeek: ServiceWeek;
}

export interface UpdateStaffLogDto {
  header?: StaffLogHeader;
  serviceWeek?: ServiceWeek;
  status?: StaffLogStatus;
}



// ======================================================================
//  NORMALIZATION HELPERS (API ↔ UI)
// ======================================================================

/**
 * Normalize any date-like value to 'YYYY-MM-DD' or return null if invalid.
 */
function normalizeDateToYmd(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null;

  // Strip any time portion (e.g. '2025-10-01T00:00:00' → '2025-10-01')
  const candidate = value.slice(0, 10);

  // Very lightweight guard – only accept ISO-like 'YYYY-MM-DD'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    return null;
  }

  return candidate;
}

/**
 * Normalize WeeklyNote[] dates coming back from the API.
 */
function normalizeWeeklyNotesDates(notes?: WeeklyNote[]): WeeklyNote[] {
  if (!Array.isArray(notes)) return [];

  return notes.map((n) => {
    const normalized = normalizeDateToYmd(n.date);
    return {
      ...n,
      date: normalized ?? n.date ?? '',
    };
  });
}

/**
 * Normalize ServiceWeek.*[].date fields from various date formats
 * to 'YYYY-MM-DD' where possible.
 */
function normalizeServiceWeekDates(week?: ServiceWeek): ServiceWeek | undefined {
  if (!week) return undefined;

  const normalizeEntries = (entries?: ServiceDayEntry[]): ServiceDayEntry[] => {
    if (!Array.isArray(entries)) return [];
    return entries.map((e) => {
      const normalized = normalizeDateToYmd(e.date);
      return {
        ...e,
        date: normalized ?? e.date ?? null,
      };
    });
  };

  return {
    ...week,
    monday: normalizeEntries(week.monday),
    tuesday: normalizeEntries(week.tuesday),
    wednesday: normalizeEntries(week.wednesday),
    thursday: normalizeEntries(week.thursday),
    friday: normalizeEntries(week.friday),
    saturday: normalizeEntries(week.saturday),
    sunday: normalizeEntries(week.sunday),
  };
}

/**
 * API → UI:
 * Normalize all date-like fields on StaffLog:
 * - serviceDate
 * - header.notes[].date
 * - serviceWeek.*[].date
 *
 * This lets your UI stay stable even if the backend sends
 * '2025-10-01T00:00:00Z', plain '2025-10-01', etc.
 */
export function normalizeStaffLogFromApi(log: StaffLog): StaffLog {
  const header: StaffLogHeader = {
    ...(log.header ?? {}),
  };

  // Normalize header.notes dates
  header.notes = normalizeWeeklyNotesDates(header.notes);

  // Normalize serviceWeek dates
  const normalizedWeek = normalizeServiceWeekDates(log.serviceWeek);

  // Normalize top-level serviceDate
  const serviceDateNormalized =
    normalizeDateToYmd(log.serviceDate) ?? log.serviceDate;

  return {
    ...log,
    serviceDate: serviceDateNormalized,
    header,
    serviceWeek: normalizedWeek ?? log.serviceWeek,
  };
}

/**
 * UI → API:
 * Build the correct payload (CreateStaffLogDto vs UpdateStaffLogDto)
 * from a raw form value, and normalize all date fields on the way out.
 */
export function buildStaffLogSavePayload(args: {
  currentLogId: number | null;
  providerId: number;
  consumerId: number;
  serviceDate: string;
  rawForm: any;
}): { logId: number | null; payload: CreateStaffLogDto | UpdateStaffLogDto } {
  const { currentLogId, providerId, consumerId, serviceDate, rawForm } = args;

  // ----- HEADER (flex bag with index signature) -----
  const rawHeader = rawForm.header ?? {};

  const normalizedNotes: WeeklyNote[] = (rawForm.notes ?? []).map(
    (n: any): WeeklyNote => {
      const normalized = normalizeDateToYmd(n?.date);
      return {
        date: normalized ?? (n?.date ?? ''),
        initials: n?.initials ?? '',
        comment: n?.comment ?? '',
      };
    },
  );

  const header: StaffLogHeader = {
    ...rawHeader,
    socialization: rawForm.socialization ?? [],
    selfHelp: rawForm.selfHelp ?? [],
    adaptive: rawForm.adaptive ?? [],
    implementation: rawForm.implementation ?? [],
    community: rawForm.community ?? [],
    notes: normalizedNotes,
  };

  // Optional: if header has a 'date' field, normalize it
  if ((header as any).date) {
    const normalizedHeaderDate = normalizeDateToYmd((header as any).date);
    if (normalizedHeaderDate) {
      (header as any).date = normalizedHeaderDate;
    }
  }

  // ----- SERVICE WEEK (rows → ServiceWeek) -----
  const rows: any[] = rawForm.serviceWeek ?? [];

  const mapRow = (v: any): ServiceDayEntry => {
    const normalizedRowDate = normalizeDateToYmd(v?.date);

    return {
      // Core fields
      timeIn: v?.start ?? null,
      timeOut: v?.end ?? null,
      activity: null,
      notes: null,

      // Extended ISS fields
      date: normalizedRowDate ?? (v?.date ?? null),
      providerName: v?.providerName ?? null,
      providerSignature: v?.providerSignature ?? null,
      start: v?.start ?? null,
      end: v?.end ?? null,
      minutes: v?.minutes ?? 0,
      setting: v?.setting ?? 'on_site',
      individualsCount: v?.individualsCount ?? 0,
      staffCount: v?.staffCount ?? 1,
    };
  };

  // Always map 5 weekdays (fallback to empty object if missing row)
  const mon = mapRow(rows[0] ?? {});
  const tue = mapRow(rows[1] ?? {});
  const wed = mapRow(rows[2] ?? {});
  const thu = mapRow(rows[3] ?? {});
  const fri = mapRow(rows[4] ?? {});

  const serviceWeek: ServiceWeek = {
    monday: [mon],
    tuesday: [tue],
    wednesday: [wed],
    thursday: [thu],
    friday: [fri],
  };

  // Normalize serviceDate going out
  const normalizedServiceDate =
    normalizeDateToYmd(serviceDate) ?? serviceDate;

  // ----- Decide create vs update -----
  if (currentLogId) {
    const payload: UpdateStaffLogDto = {
      header,
      serviceWeek,
    };
    return { logId: currentLogId, payload };
  }

  const payload: CreateStaffLogDto = {
    providerId,
    consumerId,
    serviceDate: normalizedServiceDate,
    header,
    serviceWeek,
  };

  return { logId: null, payload };
}
