// Shared ISS domain models

export interface Provider {
  id: string;
  name: string;
  licenseNumber: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Consumer {
  id: string;
  providerId: string;
  firstName: string;
  lastName: string;
  mrn?: string;
  medicaidId?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffLogHeader {
  locationName?: string;
  staffInitials?: string;
  ratio?: string;
  [key: string]: any;
}

export interface ServiceDayEntry {
  timeIn: string | null;
  timeOut: string | null;
  activity: string | null;
  notes?: string | null;
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

export interface StaffLog {
  id: string;
  providerId: string;
  consumerId: string;
  serviceDate: string; // Monday of week (ISO date)
  header: StaffLogHeader;
  serviceWeek: ServiceWeek;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'voided';
  createdAt: string;
  updatedAt: string;
}

export interface WeekSummary {
  serviceDate: string;
  hasLog: boolean;
  logId?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'voided';
}

export interface CreateStaffLogDto {
  providerId: string;
  consumerId: string;
  serviceDate: string;
  header: StaffLogHeader;
  serviceWeek: ServiceWeek;
}

export interface UpdateStaffLogDto {
  header?: StaffLogHeader;
  serviceWeek?: ServiceWeek;
  status?: StaffLog['status'];
}
