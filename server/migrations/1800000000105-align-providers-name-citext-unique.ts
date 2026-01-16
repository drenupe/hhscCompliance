import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignProvidersNameCitextUnique1800000000105 implements MigrationInterface {
  name = 'AlignProvidersNameCitextUnique1800000000105';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // name: TEXT -> CITEXT
    await q.query(`
      ALTER TABLE providers
        ALTER COLUMN name TYPE CITEXT
        USING name::citext;
    `);

    // Unique constraint for name (guarded)
    await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_providers_name'
        ) THEN
          ALTER TABLE providers
            ADD CONSTRAINT uq_providers_name UNIQUE (name);
        END IF;
      END $$;
    `);

    // Ensure updated_at trigger exists (safe re-create)
    await q.query(`DROP TRIGGER IF EXISTS trg_providers_updated_at ON providers;`);
    await q.query(`
      CREATE TRIGGER trg_providers_updated_at
      BEFORE UPDATE ON providers
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    // Optional; usually safe to no-op for schema alignment migrations
  }
}
