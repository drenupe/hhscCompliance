// Single source of truth for sidebar structure + icons to register
import { AppRole } from '@hhsc-compliance/shared-models';

// ---- Types ----
export type MenuItem = {
  label: string;
  path: string;
  icon: string; // lucide icon name
  badge?: number;
};

export type MenuGroup = {
  id: string; // stable key for trackBy
  label: string;
  items: MenuItem[];
};

// ---- Route constants (keeps paths consistent everywhere) ----
export const ROUTES = {
  dashboard: '/dashboard',

  // Consumers
  consumers: '/consumers',               // list/home for consumers feature
  consumerShell: '/consumers',           // base; shell lives at /consumers/:consumerId/...

  // Residential / Locations (keep your existing behavior)
  locations: '/compliance/residential',

  // Compliance
  complianceResidential: '/compliance/residential',
  complianceProgrammatic: '/compliance/programmatic',
  complianceFinance: '/compliance/finance',
  complianceBehavior: '/compliance/behavior',
  complianceAne: '/compliance/ane',
  complianceRestraints: '/compliance/restraints',
  complianceEnclosedBeds: '/compliance/enclosed-beds',
  complianceProtective: '/compliance/protective',
  complianceProhibitions: '/compliance/prohibitions',

  // Medical
  nursing: '/medical/nursing',
  medAdmin: '/medical/med-admin',

  // Staff (note: you have these commented out in appRoutes right now)
  staffDirectCare: '/staff/direct-care',
  staffCaseManager: '/staff/case-manager',
  staffTraining: '/staff/training',

  // ISS
  issHome: '/iss',
  issManager: '/iss/manager',
  issDailyLog: '/iss/daily-log',
  issNotesReview: '/iss/notes-review',
  issNotesGallery: '/iss/notes-gallery',

  // Admin (note: you have these commented out in appRoutes right now)
  adminCostReport: '/admin/cost-report',
  adminUsers: '/admin/users',
} as const;

// ---- Group presets ----
const CORE: MenuGroup = {
  id: 'core',
  label: 'Core',
  items: [
    { label: 'Dashboard', path: ROUTES.dashboard, icon: 'layout-dashboard' },
    { label: 'Consumers', path: ROUTES.consumers, icon: 'users' },
    { label: 'Locations', path: ROUTES.locations, icon: 'home' },
  ],
};

const COMPLIANCE: MenuGroup = {
  id: 'compliance',
  label: 'Compliance',
  items: [
    { label: 'Residential',        path: ROUTES.complianceResidential,   icon: 'home' },
    { label: 'Programmatic',       path: ROUTES.complianceProgrammatic,  icon: 'list-checks' },
    { label: 'Finance / Rent',     path: ROUTES.complianceFinance,       icon: 'wallet' },
    { label: 'Behavior',           path: ROUTES.complianceBehavior,      icon: 'activity' },
    { label: 'Abuse/Neglect/ANE',  path: ROUTES.complianceAne,           icon: 'shield-alert' },
    { label: 'Restraints',         path: ROUTES.complianceRestraints,    icon: 'hand' },
    { label: 'Enclosed Beds',      path: ROUTES.complianceEnclosedBeds,  icon: 'bed' },
    { label: 'Protective Devices', path: ROUTES.complianceProtective,    icon: 'shield' },
    { label: 'Prohibitions',       path: ROUTES.complianceProhibitions,  icon: 'ban' },
  ],
};

const MEDICAL: MenuGroup = {
  id: 'medical',
  label: 'Medical',
  items: [
    { label: 'Nursing',   path: ROUTES.nursing,   icon: 'stethoscope' },
    { label: 'Med Admin', path: ROUTES.medAdmin,  icon: 'pill' },
  ],
};

const STAFF: MenuGroup = {
  id: 'staff',
  label: 'Staff',
  items: [
    { label: 'Direct Care Staff', path: ROUTES.staffDirectCare, icon: 'users' },
    { label: 'Case Manager',      path: ROUTES.staffCaseManager, icon: 'briefcase' },
    { label: 'Training',          path: ROUTES.staffTraining,     icon: 'graduation-cap' },
  ],
};

const ISS: MenuGroup = {
  id: 'iss',
  label: 'ISS (Day Habilitation)',
  items: [
    { label: 'ISS Home',      path: ROUTES.issHome,        icon: 'user-round' },
    { label: 'ISS Manager',   path: ROUTES.issManager,     icon: 'user-cog' },
    { label: 'Daily Log',     path: ROUTES.issDailyLog,    icon: 'file-text' },
    { label: 'Notes Review',  path: ROUTES.issNotesReview, icon: 'list-checks' },
    { label: 'Notes Gallery', path: ROUTES.issNotesGallery, icon: 'images' },
  ],
};

const ADMIN: MenuGroup = {
  id: 'admin',
  label: 'Admin',
  items: [
    { label: 'Cost Report',   path: ROUTES.adminCostReport, icon: 'file-spreadsheet' },
    { label: 'Users & Roles', path: ROUTES.adminUsers,      icon: 'shield-check' },
  ],
};

// ---- Role → Menus ----
const BY_ROLE: Record<AppRole, MenuGroup[]> = {
  Admin:            [CORE, COMPLIANCE, MEDICAL, STAFF, ISS, ADMIN],
  CaseManager:      [CORE, COMPLIANCE, STAFF],
  Nurse:            [CORE, MEDICAL, COMPLIANCE],
  DirectCareStaff:  [CORE, COMPLIANCE, STAFF],
  ISSManager:       [CORE, ISS, COMPLIANCE],
  ISSStaff:         [CORE, ISS],
  Finance:          [CORE, COMPLIANCE, ADMIN],

  ProgramDirector:     [CORE, COMPLIANCE, STAFF, ISS, MEDICAL],
  ComplianceOfficer:   [CORE, COMPLIANCE, STAFF],
  BehaviorSupportLead: [CORE, COMPLIANCE],
  FinanceOfficer:      [CORE, COMPLIANCE, ADMIN],
  MedicalDirector:     [CORE, MEDICAL, COMPLIANCE],
};

// Pure, synchronous API expected by your Sidebar
export function menuForRole(role: AppRole): MenuGroup[] {
  return BY_ROLE[role] ?? [CORE];
}

// Export the list of Lucide icon names we use so the app can register them at bootstrap.
export const MENU_ICON_NAMES = [
  'layout-dashboard', 'users', 'home',
  'list-checks', 'wallet', 'activity', 'shield-alert', 'hand', 'bed', 'shield', 'ban',
  'stethoscope', 'pill', 'briefcase', 'graduation-cap',
  'user-round', 'user-cog',
  'file-spreadsheet', 'shield-check',
  'file-text', 'images',
] as const;

export type MenuIconName = (typeof MENU_ICON_NAMES)[number];
