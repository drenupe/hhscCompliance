"use strict";
// libs/shared-models/src/lib/nav/role-menu.ts
// Single source of truth for sidebar structure + icons to register
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU_ICON_NAMES = void 0;
exports.menuForRole = menuForRole;
// ---- Group presets ----
const CORE = {
    id: 'core',
    label: 'Core',
    items: [
        { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
        { label: 'Consumers', path: '/consumers', icon: 'users' },
        { label: 'Locations', path: '/residential/locations', icon: 'home' },
    ],
};
const COMPLIANCE = {
    id: 'compliance',
    label: 'Compliance',
    items: [
        { label: 'Residential', path: '/compliance/residential', icon: 'home' },
        { label: 'Programmatic', path: '/compliance/programmatic', icon: 'list-checks' },
        { label: 'Finance / Rent', path: '/compliance/finance', icon: 'wallet' },
        { label: 'Behavior', path: '/compliance/behavior', icon: 'activity' },
        { label: 'Abuse/Neglect/ANE', path: '/compliance/ane', icon: 'shield-alert' },
        { label: 'Restraints', path: '/compliance/restraints', icon: 'hand' },
        { label: 'Enclosed Beds', path: '/compliance/enclosed-beds', icon: 'bed' },
        { label: 'Protective Devices', path: '/compliance/protective', icon: 'shield' },
        { label: 'Prohibitions', path: '/compliance/prohibitions', icon: 'ban' },
    ],
};
const MEDICAL = {
    id: 'medical',
    label: 'Medical',
    items: [
        { label: 'Nursing', path: '/medical/nursing', icon: 'stethoscope' },
        { label: 'Med Admin', path: '/medical/med-admin', icon: 'pill' },
    ],
};
// Training lives under Staff
const STAFF = {
    id: 'staff',
    label: 'Staff',
    items: [
        { label: 'Direct Care Staff', path: '/staff/direct-care', icon: 'users' },
        { label: 'Case Manager', path: '/staff/case-manager', icon: 'briefcase' },
        { label: 'Training', path: '/staff/training', icon: 'graduation-cap' },
    ],
};
const ISS = {
    id: 'iss',
    label: 'ISS (Day Habilitation)',
    items: [
        { label: 'ISS Home', path: '/iss', icon: 'user-round' },
        { label: 'ISS Manager', path: '/iss/manager', icon: 'user-cog' },
        { label: 'Daily Log', path: '/iss/daily-log', icon: 'file-text' },
        { label: 'Notes Review', path: '/iss/notes-review', icon: 'list-checks' },
        { label: 'Notes Gallery', path: '/iss/notes-gallery', icon: 'images' },
    ],
};
const ADMIN = {
    id: 'admin',
    label: 'Admin',
    items: [
        { label: 'Cost Report', path: '/admin/cost-report', icon: 'file-spreadsheet' },
        { label: 'Users & Roles', path: '/admin/users', icon: 'shield-check' },
    ],
};
// ---- Role → Menus ----
// NOTE: AppRole currently includes:
// 'Admin' | 'CaseManager' | 'Nurse' | 'DirectCareStaff' | 'ISSManager' | 'ISSStaff' | 'Finance'
// | 'ProgramDirector' | 'ComplianceOfficer' | 'BehaviorSupportLead'
// | 'FinanceOfficer' | 'MedicalDirector'
const BY_ROLE = {
    // Full access
    Admin: [CORE, COMPLIANCE, MEDICAL, STAFF, ISS, ADMIN],
    // Program / compliance leadership – treat like Admin for now
    ProgramDirector: [CORE, COMPLIANCE, MEDICAL, STAFF, ISS, ADMIN],
    ComplianceOfficer: [CORE, COMPLIANCE, STAFF, ADMIN],
    // Clinical / behavior leads
    BehaviorSupportLead: [CORE, COMPLIANCE, STAFF],
    MedicalDirector: [CORE, MEDICAL, COMPLIANCE, STAFF],
    // Finance roles
    Finance: [CORE, COMPLIANCE, ADMIN],
    FinanceOfficer: [CORE, COMPLIANCE, ADMIN],
    // Case management / nursing / direct care
    CaseManager: [CORE, COMPLIANCE, STAFF],
    Nurse: [CORE, MEDICAL, COMPLIANCE],
    DirectCareStaff: [CORE, COMPLIANCE, STAFF],
    // ISS
    ISSManager: [CORE, ISS, COMPLIANCE],
    ISSStaff: [CORE, ISS],
};
// Pure, synchronous API expected by your Sidebar
function menuForRole(role) {
    var _a;
    return (_a = BY_ROLE[role]) !== null && _a !== void 0 ? _a : [CORE];
}
// Export the list of Lucide icon names we use so the app can register them at bootstrap.
exports.MENU_ICON_NAMES = [
    'layout-dashboard', 'users', 'home',
    'list-checks', 'wallet', 'activity', 'shield-alert', 'hand', 'bed', 'shield', 'ban',
    'stethoscope', 'pill', 'briefcase', 'graduation-cap',
    'user-round', 'user-cog', 'file-spreadsheet', 'shield-check', 'file-text', 'images',
];
//# sourceMappingURL=role-menu.js.map