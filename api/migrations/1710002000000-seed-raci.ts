import { MigrationInterface, QueryRunner } from 'typeorm';
import { DEFAULT_RACI_MAP } from '@hhsc-compliance/shared-models';

const ROLES = [
  'Admin','ProgramDirector','ComplianceOfficer','CaseManager','BehaviorSupportLead',
  'Nurse','FinanceOfficer','MedicalDirector','DirectCareStaff','ISSStaff','ISSManager',
];

const MODULES: { key: string; label: string; icon: string; path: string }[] = [
  { key: 'dashboard',         label: 'Dashboard',         icon: 'layout-dashboard', path: '/dashboard' },
  { key: 'residential',       label: 'Residential',       icon: 'home',             path: '/compliance/residential' },
  { key: 'programmatic',      label: 'Programmatic',      icon: 'list-checks',      path: '/compliance/programmatic' },
  { key: 'finance',           label: 'Finance & Rent',    icon: 'banknote',         path: '/compliance/finance' },
  { key: 'behavior',          label: 'Behavior Support',  icon: 'brain',            path: '/compliance/behavior' },
  { key: 'ane',               label: 'ANE',               icon: 'shield-alert',     path: '/compliance/ane' },
  { key: 'restraints',        label: 'Restraints',        icon: 'lock',             path: '/compliance/restraints' },
  { key: 'enclosedBeds',      label: 'Enclosed Beds',     icon: 'bed-double',       path: '/compliance/enclosed-beds' },
  { key: 'protectiveDevices', label: 'Protective Devices',icon: 'shield',           path: '/compliance/protective-devices' },
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
    for (const r of ROLES) {
      await q.query(`INSERT INTO roles_catalog("name") VALUES ($1) ON CONFLICT DO NOTHING`, [r]);
    }
    for (const m of MODULES) {
      await q.query(
        `INSERT INTO modules_catalog("key","label","icon","path") VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
        [m.key, m.label, m.icon, m.path],
      );
    }

    const roleRows: { id: string; name: string }[] = await q.query(`SELECT id,name FROM roles_catalog`);
    const moduleRows: { id: string; key: string }[] = await q.query(`SELECT id,"key" FROM modules_catalog`);
    const roleId = Object.fromEntries(roleRows.map(r => [r.name, r.id]));
    const moduleId = Object.fromEntries(moduleRows.map(m => [m.key, m.id]));

    for (const [key, raci] of Object.entries(DEFAULT_RACI_MAP)) {
      const mId = moduleId[key];
      if (!mId) continue;
      const push = async (lvl: 'R'|'A'|'C'|'I', list: string[]|undefined) => {
        for (const name of list ?? []) {
          await q.query(
            `INSERT INTO raci_assignments("moduleId","roleId","level") VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
            [mId, roleId[name], lvl],
          );
        }
      };
      await push('R', raci.responsible);
      await push('A', raci.accountable);
      await push('C', raci.consulted);
      await push('I', raci.informed);
    }
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DELETE FROM raci_assignments`);
    await q.query(`DELETE FROM modules_catalog`);
    await q.query(`DELETE FROM roles_catalog`);
  }
}
