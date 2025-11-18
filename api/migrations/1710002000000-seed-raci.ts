// api/migrations/1710002000000-seed-raci.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

// Use a RELATIVE import so we don't depend on tsconfig path mapping here.
// Adjust the path if your folder layout is slightly different.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DEFAULT_RACI, type Raci } from '../../libs/shared-models/src/lib/raci';

// ---- seed data ----

const ROLES = [
  'Admin',
  'ProgramDirector',
  'ComplianceOfficer',
  'CaseManager',
  'BehaviorSupportLead',
  'Nurse',
  'FinanceOfficer',
  'MedicalDirector',
  'DirectCareStaff',
  'ISSStaff',
  'ISSManager',
] as const;

const MODULES: { key: string; label: string; icon: string; path: string }[] = [
  { key: 'dashboard',         label: 'Dashboard',         icon: 'layout-dashboard', path: '/dashboard' },
  { key: 'residential',       label: 'Residential',       icon: 'home',             path: '/compliance/residential' },
  { key: 'programmatic',      label: 'Programmatic',      icon: 'list-checks',      path: '/compliance/programmatic' },
  { key: 'finance',           label: 'Finance & Rent',    icon: 'banknote',         path: '/compliance/finance' },
  { key: 'behavior',          label: 'Behavior Support',  icon: 'brain',            path: '/compliance/behavior' },
  { key: 'ane',               label: 'ANE',               icon: 'shield-alert',     path: '/compliance/ane' },
  { key: 'restraints',        label: 'Restraints',        icon: 'lock',             path: '/compliance/restraints' },
  { key: 'enclosed-beds',     label: 'Enclosed Beds',     icon: 'bed-double',       path: '/compliance/enclosed-beds' },
  { key: 'protective-devices',label: 'Protective Devices',icon: 'shield',           path: '/compliance/protective-devices' },
  { key: 'prohibitions',      label: 'Prohibitions',      icon: 'ban',              path: '/compliance/prohibitions' },
  { key: 'medical',           label: 'Medical',           icon: 'stethoscope',      path: '/compliance/medical' },
  { key: 'staff',             label: 'Staff',             icon: 'users',            path: '/staff' },
  { key: 'policies',          label: 'Policies',          icon: 'briefcase',        path: '/admin/policies' },
  { key: 'users',             label: 'Users',             icon: 'user-cog',         path: '/admin/users' },
  { key: 'issAttendance',     label: 'ISS Attendance',    icon: 'calendar',         path: '/iss/attendance' },
  { key: 'issServicePlans',   label: 'ISS Service Plans', icon: 'file-text',        path: '/iss/service-plans' },
  { key: 'issTransportation', label: 'ISS Transportation',icon: 'route',            path: '/iss/transportation' },
  { key: 'issIncidents',      label: 'ISS Incidents',     icon: 'alert-triangle',   path: '/iss/incidents' },
  { key: 'costReport',        label: 'Cost Report',       icon: 'receipt',          path: '/admin/cost-report' },
];

export class SeedRaci1710002000000 implements MigrationInterface {
  name = 'SeedRaci1710002000000';

  public async up(q: QueryRunner): Promise<void> {
    // 1) Seed roles
    for (const r of ROLES) {
      await q.query(
        `INSERT INTO roles_catalog("name") VALUES ($1) ON CONFLICT DO NOTHING`,
        [r],
      );
    }

    // 2) Seed modules
    for (const m of MODULES) {
      await q.query(
        `INSERT INTO modules_catalog("key","label","icon","path") VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [m.key, m.label, m.icon, m.path],
      );
    }

    // 3) Load DB ids into maps
    const roleRows: { id: string; name: string }[] =
      await q.query(`SELECT id,name FROM roles_catalog`);
    const moduleRows: { id: string; key: string }[] =
      await q.query(`SELECT id,"key" FROM modules_catalog`);

    const roleId = Object.fromEntries(roleRows.map(r => [r.name, r.id])) as Record<string, string>;
    const moduleId = Object.fromEntries(moduleRows.map(m => [m.key, m.id])) as Record<string, string>;

    // 4) Push helper, typed so 'raci' is NOT unknown
    const push = async (moduleKey: string, lvl: 'R' | 'A' | 'C' | 'I', list: string[] | undefined) => {
      const mId = moduleId[moduleKey];
      if (!mId || !list || list.length === 0) return;

      for (const name of list) {
        const rId = roleId[name];
        if (!rId) continue;

        await q.query(
          `INSERT INTO raci_assignments("moduleId","roleId","level") VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
          [mId, rId, lvl],
        );
      }
    };

    // 5) Iterate DEFAULT_RACI with an explicit cast so TS knows the shape
    const entries = Object.entries(DEFAULT_RACI) as [string, Raci][];

    for (const [key, raci] of entries) {
      await push(key, 'R', raci.R);
      await push(key, 'A', raci.A);
      await push(key, 'C', raci.C);
      await push(key, 'I', raci.I);
    }
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DELETE FROM raci_assignments`);
    await q.query(`DELETE FROM modules_catalog`);
    await q.query(`DELETE FROM roles_catalog`);
  }
}
