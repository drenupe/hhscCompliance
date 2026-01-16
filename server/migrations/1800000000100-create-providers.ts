import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreProviders1800000000005 implements MigrationInterface {
  name = 'CreateCoreProviders1800000000005';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await q.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        license_number CITEXT UNIQUE,
        phone TEXT,
        email CITEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_providers_updated_at ON providers;`);
    await q.query(`
      CREATE TRIGGER trg_providers_updated_at
      BEFORE UPDATE ON providers
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_name ON providers (name);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_license ON providers (license_number);`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TRIGGER IF EXISTS trg_providers_updated_at ON providers;`);
    await q.query(`DROP TABLE IF EXISTS providers;`);
  }
}
