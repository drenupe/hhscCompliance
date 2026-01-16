import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreConsumers1800000000007 implements MigrationInterface {
  name = 'CreateCoreConsumers1800000000007';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE IF NOT EXISTS consumers (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        "providerId" uuid NOT NULL,
        "locationId" uuid,

        first_name TEXT NOT NULL,
        last_name  TEXT NOT NULL,
        date_of_birth DATE,

        medicaid_number CITEXT,
        level_of_need INT,
        active BOOLEAN NOT NULL DEFAULT true,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT fk_consumers_provider
          FOREIGN KEY ("providerId")
          REFERENCES providers(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_consumers_location
          FOREIGN KEY ("locationId")
          REFERENCES locations(id)
          ON DELETE SET NULL
      );
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_consumers_updated_at ON consumers;`);
    await q.query(`
      CREATE TRIGGER trg_consumers_updated_at
      BEFORE UPDATE ON consumers
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_consumers_provider ON consumers ("providerId");`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_consumers_location ON consumers ("locationId");`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_consumers_active ON consumers (active);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_consumers_name ON consumers (last_name, first_name);`);

    // Optional uniqueness within provider to prevent duplicates
    await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_consumers_provider_name_dob') THEN
          ALTER TABLE consumers
          ADD CONSTRAINT uq_consumers_provider_name_dob
          UNIQUE ("providerId", first_name, last_name, date_of_birth);
        END IF;
      END $$;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TRIGGER IF EXISTS trg_consumers_updated_at ON consumers;`);
    await q.query(`DROP TABLE IF EXISTS consumers;`);
  }
}
