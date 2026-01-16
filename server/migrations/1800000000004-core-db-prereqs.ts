import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoreDbPrereqs1800000000004 implements MigrationInterface {
  name = 'CoreDbPrereqs1800000000004';

  public async up(q: QueryRunner): Promise<void> {
    // ✅ Always ensure extensions exist (safe/idempotent)
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // ✅ Single shared updated_at trigger function (safe/idempotent)
    await q.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // ✅ Optional: roles_catalog currently has updated_at but no trigger
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles_catalog') THEN
          EXECUTE 'DROP TRIGGER IF EXISTS trg_roles_catalog_updated_at ON roles_catalog';
          EXECUTE 'CREATE TRIGGER trg_roles_catalog_updated_at
                   BEFORE UPDATE ON roles_catalog
                   FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp()';
        END IF;
      END $$;
    `);

    // ✅ Optional: raci_assignments also has updated_at; ensure trigger exists
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'raci_assignments') THEN
          EXECUTE 'DROP TRIGGER IF EXISTS trg_raci_assignments_updated_at ON raci_assignments';
          EXECUTE 'CREATE TRIGGER trg_raci_assignments_updated_at
                   BEFORE UPDATE ON raci_assignments
                   FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp()';
        END IF;
      END $$;
    `);

    // ✅ Optional: modules_catalog trigger already exists in your migration, but safe to normalize
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'modules_catalog') THEN
          EXECUTE 'DROP TRIGGER IF EXISTS trg_modules_catalog_updated_at ON modules_catalog';
          EXECUTE 'CREATE TRIGGER trg_modules_catalog_updated_at
                   BEFORE UPDATE ON modules_catalog
                   FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp()';
        END IF;
      END $$;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    // ❗Enterprise choice: do NOT drop extensions or shared function.
    // Rolling back prereqs should not break other tables.
    await q.query(`DROP TRIGGER IF EXISTS trg_roles_catalog_updated_at ON roles_catalog`);
    await q.query(`DROP TRIGGER IF EXISTS trg_raci_assignments_updated_at ON raci_assignments`);
    await q.query(`DROP TRIGGER IF EXISTS trg_modules_catalog_updated_at ON modules_catalog`);
  }
}
