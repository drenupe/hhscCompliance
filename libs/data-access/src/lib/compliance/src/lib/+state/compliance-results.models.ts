// libs/data-access/src/lib/compliance/src/lib/+state/compliance-results.models.ts

import { ComplianceResultDto } from '@hhsc-compliance/shared-models';

/**
 * Matches backend enum-ish strings stored in DB for compliance_results.module
 */
export type ModuleKey =
  | 'RESIDENTIAL'
  | 'PROGRAMMATIC'
  | 'FINANCES_RENT'
  | 'BEHAVIOR_SUPPORT'
  | 'ANE'
  | 'RESTRAINTS'
  | 'ENCLOSED_BEDS'
  | 'PROTECTIVE_DEVICES'
  | 'PROHIBITIONS'
  | 'ISS';

/**
 * UI filter. NOTE: backend only understands COMPLIANT | NON_COMPLIANT | UNKNOWN
 * "ALL" means: omit status param.
 */
export type StatusFilter = 'ALL' | 'NON_COMPLIANT' | 'UNKNOWN' | 'COMPLIANT';

export const COMPLIANCE_RESULTS_FEATURE_KEY = 'complianceResults' as const;

export interface ComplianceResultsState {
  // selection / filters
  selectedLocationId: string;
  module: ModuleKey;
  status: StatusFilter;
  subcategory: string | null;

  // data
  rows: ComplianceResultDto[];

  // ui flags
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialComplianceResultsState: ComplianceResultsState = {
  selectedLocationId: '',
  module: 'RESIDENTIAL',
  status: 'ALL',
  subcategory: null,

  rows: [],
  loading: false,
  saving: false,
  error: null,
};

export const COMPLIANCE_ALLOWED_MODULES: readonly ModuleKey[] = [
  'RESIDENTIAL',
  'PROGRAMMATIC',
  'FINANCES_RENT',
  'BEHAVIOR_SUPPORT',
  'ANE',
  'RESTRAINTS',
  'ENCLOSED_BEDS',
  'PROTECTIVE_DEVICES',
  'PROHIBITIONS',
  'ISS',
] as const;

export function normalizeModule(v: unknown): ModuleKey {
  const up = String(v ?? '').trim().toUpperCase();
  return (COMPLIANCE_ALLOWED_MODULES as readonly string[]).includes(up)
    ? (up as ModuleKey)
    : 'RESIDENTIAL';
}

export function normalizeStatus(v: unknown): StatusFilter {
  const up = String(v ?? '').trim().toUpperCase();
  return up === 'ALL' || up === 'COMPLIANT' || up === 'NON_COMPLIANT' || up === 'UNKNOWN'
    ? (up as StatusFilter)
    : 'ALL';
}
