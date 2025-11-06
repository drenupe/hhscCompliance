// libs/shared-models/src/lib/ownership.ts
import type { AppRole } from './auth/roles';

export type ModuleKey =
  | 'residential'
  | 'programmatic'
  | 'finance'
  | 'behavior'
  | 'ane'
  | 'restraints'
  | 'enclosed-beds'
  | 'protective-devices'
  | 'prohibitions'
  | 'medical'
  | 'iss'
  | 'staff'
  | 'cost-report';

export type Raci = {
  R: AppRole[]; // Responsible
  A: AppRole[]; // Accountable
  C: AppRole[]; // Consulted
  I: AppRole[]; // Informed
};

export const RACI_MAP: Record<ModuleKey, Raci> = {
  residential:         { R: ['DirectCareStaff'], A: ['CaseManager'], C: ['Admin'], I: ['Finance'] },
  programmatic:        { R: ['CaseManager'],     A: ['Admin'],       C: ['DirectCareStaff'], I: ['Nurse'] },
  finance:             { R: ['Finance'],         A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  behavior:            { R: ['CaseManager'],     A: ['Admin'],       C: ['Nurse'], I: ['DirectCareStaff'] },
  ane:                 { R: ['DirectCareStaff'], A: ['Admin'],       C: ['CaseManager','Nurse'], I: ['Finance'] },
  restraints:          { R: ['Nurse'],           A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  'enclosed-beds':     { R: ['Nurse'],           A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  'protective-devices':{ R: ['Nurse'],           A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  prohibitions:        { R: ['CaseManager'],     A: ['Admin'],       C: ['Nurse'], I: ['DirectCareStaff'] },
  medical:             { R: ['Nurse'],           A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  iss:                 { R: ['ISSStaff'],        A: ['ISSManager'],  C: ['CaseManager'], I: ['Admin'] },
  staff:               { R: ['Admin'],           A: ['Admin'],       C: ['CaseManager'], I: ['DirectCareStaff'] },
  'cost-report':       { R: ['Finance'],         A: ['Admin'],       C: ['CaseManager'], I: ['Nurse'] },
};

export function allowedRolesFor(moduleKey: ModuleKey): AppRole[] {
  const r = RACI_MAP[moduleKey];
  return Array.from(new Set([...(r?.R ?? []), ...(r?.A ?? []), ...(r?.C ?? []), ...(r?.I ?? [])]));
}
