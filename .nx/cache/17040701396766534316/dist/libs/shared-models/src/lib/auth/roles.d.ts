/**
 * Application-wide role identifiers (used in JWTs, ACL, etc.)
 * Keep these values consistent across API + Web.
 */
export type AppRole = 'Admin' | 'CaseManager' | 'Nurse' | 'DirectCareStaff' | 'ISSManager' | 'ISSStaff' | 'Finance' | 'ProgramDirector' | 'ComplianceOfficer' | 'BehaviorSupportLead' | 'FinanceOfficer' | 'MedicalDirector';
export declare const ALL_ROLES: AppRole[];
