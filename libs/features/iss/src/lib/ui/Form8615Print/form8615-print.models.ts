export interface Form8615Header {
  individualName: string;
  dateOfService: string;             // 'YYYY-MM-DD'
  lon?: string;
  providerName?: string;
  providerLicense?: string;
  staffPrinted?: string;

  // ✅ add this
  setting: 'on_site' | 'off_site';

  individualsCount: number;
  staffCount: number;
}
