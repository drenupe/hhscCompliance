"use strict";
// libs/shared-models/src/lib/raci.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_MODULE_KEYS = exports.DEFAULT_RACI = void 0;
exports.allowedRolesFor = allowedRolesFor;
/**
 * Which RACI roles can SEE each module at all.
 * (The full R/A/C/I buckets per module are below in DEFAULT_RACI.)
 */
const MODULE_ACCESS = {
    dashboard: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'READONLY'],
    residential: ['OWNER', 'ADMIN', 'MANAGER'],
    programmatic: ['OWNER', 'ADMIN'],
    finance: ['OWNER', 'ADMIN'],
    behavior: ['OWNER', 'ADMIN', 'MANAGER'],
    ane: ['OWNER', 'ADMIN', 'MANAGER'],
    restraints: ['OWNER', 'ADMIN', 'MANAGER'],
    'enclosed-beds': ['OWNER', 'ADMIN', 'MANAGER'],
    'protective-devices': ['OWNER', 'ADMIN', 'MANAGER'],
    prohibitions: ['OWNER', 'ADMIN', 'MANAGER'],
    'medical-nursing': ['OWNER', 'ADMIN', 'MANAGER'],
    'medical-med-admin': ['OWNER', 'ADMIN', 'MANAGER'],
    iss: ['OWNER', 'ADMIN', 'MANAGER', 'STAFF'],
    staff: ['OWNER', 'ADMIN', 'MANAGER'],
    'cost-report': ['OWNER', 'ADMIN'],
    billing: ['OWNER', 'ADMIN'],
    settings: ['OWNER', 'ADMIN'],
    raci: ['OWNER', 'ADMIN'],
};
/** Quick helper used by guards & services: which RACI roles can access this module? */
function allowedRolesFor(moduleKey) {
    var _a;
    return (_a = MODULE_ACCESS[moduleKey]) !== null && _a !== void 0 ? _a : [];
}
/**
 * Default RACI configuration per module.
 * You can:
 *  - use this as an in-memory fallback (what you're doing now)
 *  - or seed it into the DB for ModuleCatalog / RaciAssignment
 */
exports.DEFAULT_RACI = Object.fromEntries(Object.keys(MODULE_ACCESS).map((key) => [
    key,
    {
        r: MODULE_ACCESS[key],
        a: ['OWNER', 'ADMIN'],
        c: ['MANAGER'],
        i: ['STAFF', 'READONLY'],
    },
]));
/** Convenience list if you ever need to iterate safely */
exports.ALL_MODULE_KEYS = Object.keys(MODULE_ACCESS);
//# sourceMappingURL=raci.js.map