// libs/shared-models/src/lib/raci.ts

/** Coarse-grained RACI roles used for access buckets (API + web) */
export type RaciRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'READONLY';

/**
 * Logical modules that participate in the RACI matrix.
 * These should line up with:
 *  - RaciService.catalog keys
 *  - ModuleCatalog keys in the DB
 *  - Any routes that use the raciGuard(moduleKey)
 */
export type ModuleKey =
  | 'dashboard'
  | 'residential'
  | 'programmatic'
  | 'finance'
  | 'behavior'
  | 'ane'
  | 'restraints'
  | 'enclosed-beds'
  | 'protective-devices'
  | 'prohibitions'
  | 'medical-nursing'
  | 'medical-med-admin'
  | 'iss'
  | 'staff'
  | 'cost-report'
  | 'billing'
  | 'settings'
  | 'raci';

/**
 * Which RACI roles can SEE each module at all.
 * (The full R/A/C/I buckets per module are below in DEFAULT_RACI.)
 */
const MODULE_ACCESS: Record<ModuleKey, RaciRole[]> = {
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
export function allowedRolesFor(moduleKey: ModuleKey): RaciRole[] {
  return MODULE_ACCESS[moduleKey] ?? [];
}

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
export const DEFAULT_RACI: Record<ModuleKey, Raci> = Object.fromEntries(
  (Object.keys(MODULE_ACCESS) as ModuleKey[]).map((key) => [
    key,
    {
      r: MODULE_ACCESS[key],
      a: ['OWNER', 'ADMIN'],
      c: ['MANAGER'],
      i: ['STAFF', 'READONLY'],
    },
  ]),
) as Record<ModuleKey, Raci>;

/** Convenience list if you ever need to iterate safely */
export const ALL_MODULE_KEYS = Object.keys(MODULE_ACCESS) as ModuleKey[];
