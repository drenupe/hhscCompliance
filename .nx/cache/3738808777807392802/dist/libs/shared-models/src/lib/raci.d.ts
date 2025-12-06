/** Coarse-grained RACI roles used for access buckets (API + web) */
export type RaciRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'READONLY';
/**
 * Logical modules that participate in the RACI matrix.
 * These should line up with:
 *  - RaciService.catalog keys
 *  - ModuleCatalog keys in the DB
 *  - Any routes that use the raciGuard(moduleKey)
 */
export type ModuleKey = 'dashboard' | 'residential' | 'programmatic' | 'finance' | 'behavior' | 'ane' | 'restraints' | 'enclosed-beds' | 'protective-devices' | 'prohibitions' | 'medical-nursing' | 'medical-med-admin' | 'iss' | 'staff' | 'cost-report' | 'billing' | 'settings' | 'raci';
/** Quick helper used by guards & services: which RACI roles can access this module? */
export declare function allowedRolesFor(moduleKey: ModuleKey): RaciRole[];
/**
 * Full RACI matrix shape for a given module.
 * - r: Responsible
 * - a: Accountable
 * - c: Consulted
 * - i: Informed
 */
export interface Raci {
    r: RaciRole[];
    a: RaciRole[];
    c: RaciRole[];
    i: RaciRole[];
}
/**
 * Default RACI configuration per module.
 * You can:
 *  - use this as an in-memory fallback (what you're doing now)
 *  - or seed it into the DB for ModuleCatalog / RaciAssignment
 */
export declare const DEFAULT_RACI: Record<ModuleKey, Raci>;
/** Convenience list if you ever need to iterate safely */
export declare const ALL_MODULE_KEYS: ModuleKey[];
