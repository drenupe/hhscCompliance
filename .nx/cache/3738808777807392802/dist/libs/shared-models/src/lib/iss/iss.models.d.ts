export interface Provider {
    id: number;
    name: string;
    licenseNumber: string;
    active?: boolean;
    createdAt: string;
    updatedAt: string;
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
    levelOfNeed?: string | number;
    placeOfService?: PlaceOfService;
    dateOfBirth?: string | null;
    medicaidNumber?: string | null;
    mrn?: string | null;
    medicaidId?: string | null;
    active?: boolean;
    issProvider?: Provider;
    createdAt: string;
    updatedAt: string;
    providerId?: number;
}
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
    individualName?: string;
    date?: string;
    lon?: string;
    levelOfNeed?: number | string;
    placeOfService?: PlaceOfService;
    provider?: string;
    license?: string;
    staffNameTitle?: string;
    issProviderName?: string;
    issProviderLicense?: string;
    locationName?: string;
    staffInitials?: string;
    ratio?: string;
    socialization?: WeeklyInitialRow[];
    selfHelp?: WeeklyInitialRow[];
    adaptive?: WeeklyInitialRow[];
    implementation?: WeeklyInitialRow[];
    community?: WeeklyInitialRow[];
    notes?: WeeklyNote[];
    [key: string]: any;
}
/**
 * A single service entry for one day.
 * The API returns this shape under serviceWeek.monday[0], etc.
 */
export interface ServiceDayEntry {
    timeIn?: string | null;
    timeOut?: string | null;
    activity?: string | null;
    notes?: string | null;
    date?: string | null;
    providerName?: string | null;
    providerSignature?: string | null;
    start?: string | null;
    end?: string | null;
    minutes?: number | null;
    setting?: 'on_site' | 'off_site' | string | null;
    individualsCount?: number | null;
    staffCount?: number | null;
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
    [key: string]: any;
}
export type StaffLogStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'voided';
/**
 * Full staff log as returned by the API.
 * Your JSON currently nests consumer + issProvider.
 */
export interface StaffLog {
    id: number;
    providerId?: number;
    consumerId?: number;
    /**
     * Monday of the week (ISO "YYYY-MM-DD")
     * e.g. "2025-09-29"
     */
    serviceDate: string;
    header: StaffLogHeader;
    serviceWeek: ServiceWeek;
    weeklySections?: any[];
    notes?: any[];
    status?: StaffLogStatus;
    createdAt: string;
    updatedAt: string;
    consumer?: Consumer;
    issProvider?: Provider;
}
export interface WeekSummary {
    serviceDate: string;
    hasLog: boolean;
    logId?: number | null;
    status?: StaffLogStatus;
    weekNumber?: number;
    totalHours?: number;
}
export interface CreateStaffLogDto {
    providerId: number;
    consumerId: number;
    serviceDate: string;
    header: StaffLogHeader;
    serviceWeek: ServiceWeek;
}
export interface UpdateStaffLogDto {
    header?: StaffLogHeader;
    serviceWeek?: ServiceWeek;
    status?: StaffLogStatus;
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
export declare function normalizeStaffLogFromApi(log: StaffLog): StaffLog;
/**
 * UI → API:
 * Build the correct payload (CreateStaffLogDto vs UpdateStaffLogDto)
 * from a raw form value, and normalize all date fields on the way out.
 */
export declare function buildStaffLogSavePayload(args: {
    currentLogId: number | null;
    providerId: number;
    consumerId: number;
    serviceDate: string;
    rawForm: any;
}): {
    logId: number | null;
    payload: CreateStaffLogDto | UpdateStaffLogDto;
};
