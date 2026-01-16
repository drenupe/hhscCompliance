import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreLocations1800000000006 implements MigrationInterface {
  name = 'CreateCoreLocations1800000000006';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "providerId" uuid NOT NULL,

        label TEXT NOT NULL,
        code CITEXT,
        capacity INT NOT NULL DEFAULT 4 CHECK (capacity BETWEEN 1 AND 4),

        street TEXT,
        city TEXT,
        state CHAR(2),
        zip TEXT,

        active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_locations_provider
          FOREIGN KEY ("providerId")
          REFERENCES providers(id)
          ON DELETE CASCADE
      );
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_locations_updated_at ON locations;`);
    await q.query(`
      CREATE TRIGGER trg_locations_updated_at
      BEFORE UPDATE ON locations
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_locations_provider ON locations ("providerId");`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_locations_active ON locations (active);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_locations_label ON locations (label);`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TRIGGER IF EXISTS trg_locations_updated_at ON locations;`);
    await q.query(`DROP TABLE IF EXISTS locations;`);
  }
}
