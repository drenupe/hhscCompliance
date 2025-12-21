import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModulesCatalog1700000000002 implements MigrationInterface {
  name = 'InitModulesCatalog1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extensions are idempotent; safe even if already created.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // Core table for app modules used by seed + app nav
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS modules_catalog (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        -- a stable machine key (e.g., 'dashboard', 'iss', 'finance', etc.)
        key CITEXT UNIQUE NOT NULL,
        -- human label shown in UI
        label TEXT NOT NULL,
        -- optional lucide/heroicon name, etc.
        icon TEXT,
        -- canonical route (e.g., '/dashboard')
        path TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // updated_at trigger
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
      DROP TRIGGER IF EXISTS trg_modules_catalog_updated_at ON modules_catalog;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_modules_catalog_updated_at
      BEFORE UPDATE ON modules_catalog
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_modules_catalog_updated_at ON modules_catalog;`);
   
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at_timestamp;`);
    await queryRunner.query(`DROP TABLE IF EXISTS modules_catalog;`);
  }
}
