// libs/features/iss/src/lib/data-access/iss-api.models.ts

import {
  ISODate,
  ISODateTime,
  TimeHHMM,
  RatioString,
  JsonBlob,
  PaginationMeta,
} from '@hhsc-compliance/shared';

export type IssServiceSetting =
  | 'on_site'
  | 'off_site'
  | 'community'
  | 'other'
  | string;

/* ============================================================
 * Core DTOs
 * ============================================================ */

export interface IssProviderDto {
  id: number;
  name: string;
  licenseNumber: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ConsumerDto {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: ISODate | null;
  medicaidNumber: string | null;
  levelOfNeed: string | null;
  placeOfService: string | null;
  issProvider: IssProviderDto;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/* ============================================================
 * JSONB: iss_staff_log shapes
 * ============================================================ */

/**
 * Shape of the JSON blobs in iss_staff_log.
 * Keep these as loose as needed to match your Angular form.
 */
export interface IssStaffLogHeader extends JsonBlob {
  individualName: string;
  date: ISODate;
  lon?: string | number | null;
  levelOfNeed?: string | number | null;
  placeOfService?: string | null;
  issProviderName?: string | null;
  issProviderLicense?: string | null;
  staffNameTitle?: string | null;
}

export interface IssServiceDay extends JsonBlob {
  day: string; // 'Monday', etc.
  date: ISODate;

  providerName: string;
  providerSignature: string;

  start: TimeHHMM;
  end: TimeHHMM;
  minutes: number;

  setting: IssServiceSetting;

  individualsCount: number;
  staffCount: number;
  ratio: RatioString;

  description?: string;
}

export interface IssWeeklySectionRow extends JsonBlob {
  label: string;
  monday?: string | null;
  tuesday?: string | null;
  wednesday?: string | null;
  thursday?: string | null;
  friday?: string | null;
}

export interface IssWeeklySections extends JsonBlob {
  socialization?: IssWeeklySectionRow[];
  selfHelp?: IssWeeklySectionRow[];
  adaptive?: IssWeeklySectionRow[];
  implementation?: IssWeeklySectionRow[];
  community?: IssWeeklySectionRow[];
}

export interface IssNote extends JsonBlob {
  date: ISODate;
  initials: string;
  comment: string;
}

/* ============================================================
 * Staff Log DTO
 * ============================================================ */

export interface IssStaffLogDto {
  id: number;
  consumer: ConsumerDto;
  issProvider: IssProviderDto;

  serviceDate: ISODate;

  header: IssStaffLogHeader;
  serviceWeek: IssServiceDay[]; // JSONB array
  weeklySections: IssWeeklySections;
  notes: IssNote[];

  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/* ============================================================
 * Requests
 * ============================================================ */

export interface CreateIssStaffLogRequest {
  consumerId: number;
  serviceDate: ISODate;
  header: IssStaffLogHeader;
  serviceWeek: IssServiceDay[];
  weeklySections: IssWeeklySections;
  notes: IssNote[];
}

export type UpdateIssStaffLogRequest = Partial<CreateIssStaffLogRequest>;

/* ============================================================
 * Responses
 * ============================================================ */

export interface ConsumerWithLatestLogResponse {
  consumer: ConsumerDto;
  latestLog: IssStaffLogDto | null;
}

export interface IssStaffLogTemplate {
  serviceDate: ISODate;
  header: IssStaffLogHeader;
  serviceWeek: IssServiceDay[];
  weeklySections: IssWeeklySections;
  notes: IssNote[];
}

export interface GetLogForDateResponse {
  consumer: ConsumerDto;
  log: IssStaffLogDto | null;
  defaultTemplate?: IssStaffLogTemplate;
}

export interface WeeksListItem {
  weekNumber: number;
  serviceDate: ISODate; // Monday of that week
  staffLogId: number;
}

export interface WeeksListResponse {
  data: WeeksListItem[];
  meta: PaginationMeta;
}
