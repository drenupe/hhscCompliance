// Keep only non-overlapping exports here.
// If you previously exported `ModuleKey` here, REMOVE that export
// (it's now defined in ownership.ts to avoid collisions).

/** Optional: a constant list of module keys for UI/validation */
export const MODULE_KEYS = [
  'residential',
  'programmatic',
  'finance',
  'behavior',
  'ane',
  'restraints',
  'enclosed-beds',
  'protective-devices',
  'prohibitions',
  'iss',
  'staff',
  'cost-report',
  'medical-nursing',
  'medical-med-admin',
] as const;

/** Optional: type guard using MODULE_KEYS (does not export ModuleKey) */
export function isKnownModuleKey(val: unknown): val is (typeof MODULE_KEYS)[number] {
  return typeof val === 'string' && (MODULE_KEYS as readonly string[]).includes(val);
}
