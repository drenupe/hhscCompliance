import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitRolesCatalog1700000000001 implements MigrationInterface {
  name = 'InitRolesCatalog1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure required extensions exist (idempotent, safe to call again)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // Create the roles_catalog table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles_catalog (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name CITEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
      DROP TRIGGER IF EXISTS trg_roles_catalog_updated_at ON roles_catalog;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_roles_catalog_updated_at
      BEFORE UPDATE ON roles_catalog
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_roles_catalog_updated_at ON roles_catalog;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at_timestamp;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles_catalog;`);
  }
}
