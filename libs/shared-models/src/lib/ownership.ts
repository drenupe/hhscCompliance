// libs/shared-models/src/lib/ownership.ts

import type { AppRole } from './auth/roles';

/**
 * Ownership domains in your app.
 * These are the areas where you assign a single "owner" role.
 */
export type OwnershipKey =
  | 'dashboard'
  | 'residential'
  | 'iss'
  | 'billing'
  | 'settings'
  | 'raci'
  | 'programmatic'
  | 'finance'; // 👈 added

/**
 * Single "owner" role for each domain.
 * Adjust mappings to whatever fits your org.
 */
export const OWNERSHIP_OWNER: Record<OwnershipKey, AppRole> = {
  dashboard: 'ProgramDirector',
  residential: 'ProgramDirector',
  iss: 'ISSManager',
  billing: 'FinanceOfficer',
  settings: 'Admin',
  raci: 'ComplianceOfficer',
  programmatic: 'ProgramDirector',
  finance: 'FinanceOfficer',
};
