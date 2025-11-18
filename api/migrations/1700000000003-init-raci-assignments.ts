import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitRaciAssignments1700000000003 implements MigrationInterface {
  name = 'InitRaciAssignments1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extensions are idempotent; safe to call.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // Join table: each row ties a role to a module at a R/A/C/I level
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS raci_assignments (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        "moduleId" uuid NOT NULL,
        "roleId"   uuid NOT NULL,
        "level"    CHAR(1) NOT NULL CHECK ("level" IN ('R','A','C','I')),

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_raci_module
          FOREIGN KEY ("moduleId")
          REFERENCES modules_catalog (id)
          ON DELETE CASCADE,

        CONSTRAINT fk_raci_role
          FOREIGN KEY ("roleId")
          REFERENCES roles_catalog (id)
          ON DELETE CASCADE,

        -- prevent duplicates (same module, role, and level)
        CONSTRAINT uq_raci_assignment UNIQUE ("moduleId","roleId","level")
      )
    `);

    // Keep updated_at fresh
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trg_raci_assignments_updated_at ON raci_assignments;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_raci_assignments_updated_at
      BEFORE UPDATE ON raci_assignments
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_raci_module ON raci_assignments ("moduleId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_raci_role   ON raci_assignments ("roleId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_raci_level  ON raci_assignments ("level")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_raci_level`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_raci_role`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_raci_module`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_raci_assignments_updated_at ON raci_assignments`);
  
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at_timestamp`);
    await queryRunner.query(`DROP TABLE IF EXISTS raci_assignments`);
  }
}
