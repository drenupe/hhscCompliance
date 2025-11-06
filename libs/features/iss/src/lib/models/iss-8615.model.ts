export interface Form8615Header {
  individualName: string;
  date: string;
  staffNameTitle?: string;
  startTime?: string;
  endTime?: string;
  totalMinutes?: number;
  setting?: 'on_site' | 'off_site';
  individualsCount?: number;
  staffCount?: number;
  lon?: string;
  provider?: string;
  license?: string;
}

export interface Form8615Row {
  date: string;
  initials: string;
  comment: string;
}

/**
 * New: one row per weekday
 */
export interface Form8615DailyService {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  start?: string | null;
  end?: string | null;
  minutes?: number | null;
}

/**
 * Optional: for the M–F initial grids we built
 */
export interface Form8615ActivityRow {
  name: string;
  mon?: string | null;
  tue?: string | null;
  wed?: string | null;
  thu?: string | null;
  fri?: string | null;
}
