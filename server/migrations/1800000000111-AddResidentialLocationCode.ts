import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResidentialLocationCode1800000000111 implements MigrationInterface {
  name = 'AddResidentialLocationCode1800000000111';

  public async up(q: QueryRunner): Promise<void> {
    // Add column nullable first (avoids failure if table has rows)
    await q.query(`
      ALTER TABLE public.residential_locations
      ADD COLUMN IF NOT EXISTS location_code CHAR(4);
    `);

    // Backfill (placeholder). Replace with your real scheme if needed.
    await q.query(`
      UPDATE public.residential_locations
      SET location_code = COALESCE(location_code, '0000')
      WHERE location_code IS NULL;
    `);

    // Enforce NOT NULL
    await q.query(`
      ALTER TABLE public.residential_locations
      ALTER COLUMN location_code SET NOT NULL;
    `);

    // Add CHECK constraint only if it doesn't exist (Postgres doesn't support "IF NOT EXISTS" here)
    await q.query(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'chk_res_locs_location_code_format'
      AND t.relname = 'residential_locations'
      AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.residential_locations
    ADD CONSTRAINT chk_res_locs_location_code_format
    CHECK (location_code ~ '^[A-Z0-9]{4}$');
  END IF;
END $$;
    `);

    await q.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_res_locs_provider_location_code
      ON public.residential_locations(provider_id, location_code)
      WHERE deleted_at IS NULL;
    `);

    await q.query(`
      CREATE INDEX IF NOT EXISTS idx_res_locs_location_code
      ON public.residential_locations(location_code);
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP INDEX IF EXISTS public.idx_res_locs_location_code;`);
    await q.query(`DROP INDEX IF EXISTS public.uq_res_locs_provider_location_code;`);

    await q.query(`
      ALTER TABLE public.residential_locations
      DROP CONSTRAINT IF EXISTS chk_res_locs_location_code_format;
    `);

    await q.query(`
      ALTER TABLE public.residential_locations
      DROP COLUMN IF EXISTS location_code;
    `);
  }
}
