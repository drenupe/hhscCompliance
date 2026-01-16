import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResidentialLocations1800000000110 implements MigrationInterface {
  name = 'CreateResidentialLocations1800000000110';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // If you already have this function elsewhere, you can remove this block safely.
    await q.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await q.query(`
      CREATE TABLE IF NOT EXISTS residential_locations (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        provider_id uuid NOT NULL
          REFERENCES providers(id)
          ON DELETE CASCADE,

        name TEXT NOT NULL,

        -- TAC §565.23 applies to: three-person, four-person, host home/companion care
        type TEXT NOT NULL
          CHECK (type IN ('THREE_PERSON','FOUR_PERSON','HOST_HOME')),

        address TEXT,
        city TEXT,
        state TEXT DEFAULT 'TX',
        zip TEXT,

        status TEXT NOT NULL DEFAULT 'ACTIVE'
          CHECK (status IN ('ACTIVE','INACTIVE')),

        deleted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_residential_locations_updated_at ON residential_locations;`);
    await q.query(`
      CREATE TRIGGER trg_residential_locations_updated_at
      BEFORE UPDATE ON residential_locations
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_res_locs_provider ON residential_locations(provider_id);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_res_locs_name ON residential_locations(name);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_res_locs_status ON residential_locations(status);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_res_locs_deleted ON residential_locations(deleted_at);`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TRIGGER IF EXISTS trg_residential_locations_updated_at ON residential_locations;`);
    await q.query(`DROP TABLE IF EXISTS residential_locations;`);
  }
}
