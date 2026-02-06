// apps/api/src/app/compliance/compliance-modules.registry.ts
export type ComplianceModuleKey =
  | 'RESIDENTIAL'
  | 'PROGRAMMATIC'
  | 'FINANCES_RENT'
  | 'BEHAVIOR_SUPPORT'
  | 'ANE'
  | 'RESTRAINTS'
  | 'ENCLOSED_BEDS'
  | 'PROTECTIVE_DEVICES'
  | 'PROHIBITIONS'
  | 'ISS'; // ✅ add now, more later

export const COMPLIANCE_MODULES: Array<{
  key: ComplianceModuleKey;
  title: string;
}> = [
  { key: 'RESIDENTIAL', title: 'Residential Requirements' },
  { key: 'PROGRAMMATIC', title: 'Programmatic Requirements' },
  { key: 'FINANCES_RENT', title: 'Finances & Rent' },
  { key: 'BEHAVIOR_SUPPORT', title: 'Behavior Support Plan' },
  { key: 'ANE', title: 'Abuse/Neglect/Exploitation' },
  { key: 'RESTRAINTS', title: 'Restraints' },
  { key: 'ENCLOSED_BEDS', title: 'Enclosed Beds' },
  { key: 'PROTECTIVE_DEVICES', title: 'Protective Devices' },
  { key: 'PROHIBITIONS', title: 'Prohibitions' },
  { key: 'ISS', title: 'ISS' },
];
