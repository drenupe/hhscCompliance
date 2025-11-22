// libs/features/iss/src/lib/data-access/iss-api.models.ts

export interface IssProviderDto {
  id: number;
  name: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumerDto {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  medicaidNumber: string | null;
  levelOfNeed: string | null;
  placeOfService: string | null;
  issProvider: IssProviderDto;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shape of the JSON blobs in iss_staff_log.
 * Keep these as loose as needed to match your Angular form,
 * we can tighten types later.
 */
export interface IssStaffLogHeader {
  individualName: string;
  date: string;
  lon?: string | number | null;
  levelOfNeed?: string | number | null;
  placeOfService?: string | null;
  issProviderName?: string | null;
  issProviderLicense?: string | null;
  staffNameTitle?: string | null;
  [key: string]: any;
}

export interface IssServiceDay {
  day: string;          // 'Monday', etc.
  date: string;         // 'YYYY-MM-DD'
  providerName: string;
  providerSignature: string;
  start: string;        // 'HH:mm'
  end: string;          // 'HH:mm'
  minutes: number;
  setting: 'on_site' | 'off_site' | string;
  individualsCount: number;
  staffCount: number;
  ratio: string;        // '2:5'
  description?: string;
  [key: string]: any;
}

export interface IssWeeklySectionRow {
  label: string;
  monday?: string | null;
  tuesday?: string | null;
  wednesday?: string | null;
  thursday?: string | null;
  friday?: string | null;
  [key: string]: any;
}

export interface IssWeeklySections {
  socialization?: IssWeeklySectionRow[];
  selfHelp?: IssWeeklySectionRow[];
  adaptive?: IssWeeklySectionRow[];
  implementation?: IssWeeklySectionRow[];
  community?: IssWeeklySectionRow[];
  [key: string]: any;
}

export interface IssNote {
  date: string;      // 'YYYY-MM-DD'
  initials: string;
  comment: string;
  [key: string]: any;
}

export interface IssStaffLogDto {
  id: number;
  consumer: ConsumerDto;
  issProvider: IssProviderDto;
  serviceDate: string;           // 'YYYY-MM-DD'
  header: IssStaffLogHeader;
  serviceWeek: IssServiceDay[];  // JSONB array
  weeklySections: IssWeeklySections;
  notes: IssNote[];
  createdAt: string;
  updatedAt: string;
}

/** Shape of the POST body for creating a staff log */
export interface CreateIssStaffLogRequest {
  consumerId: number;
  serviceDate: string; // 'YYYY-MM-DD'
  header: IssStaffLogHeader;
  serviceWeek: IssServiceDay[];
  weeklySections: IssWeeklySections;
  notes: IssNote[];
}

/** Shape of the PATCH body for updating an existing log */
export type UpdateIssStaffLogRequest = Partial<CreateIssStaffLogRequest>;

export interface ConsumerWithLatestLogResponse {
  consumer: ConsumerDto;
  latestLog: IssStaffLogDto | null;
}

export interface GetLogForDateResponse {
  consumer: ConsumerDto;
  log: IssStaffLogDto | null;
  defaultTemplate?: {
    serviceDate: string;
    header: IssStaffLogHeader;
    serviceWeek: IssServiceDay[] | any;
    weeklySections: IssWeeklySections | any;
    notes: IssNote[] | any;
  };
}

export interface WeeksListItem {
  weekNumber: number;
  serviceDate: string; // Monday of that week
  staffLogId: number;
}

export interface WeeksListResponse {
  data: WeeksListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}
