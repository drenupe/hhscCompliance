import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderCoreFields1800000000107 implements MigrationInterface {
  name = 'AddProviderCoreFields1800000000107';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await q.query(`
      ALTER TABLE providers
        ADD COLUMN IF NOT EXISTS contract_number TEXT,
        ADD COLUMN IF NOT EXISTS component_code TEXT,
        ADD COLUMN IF NOT EXISTS npi TEXT,
        ADD COLUMN IF NOT EXISTS ein TEXT,

        ADD COLUMN IF NOT EXISTS address TEXT,
        ADD COLUMN IF NOT EXISTS city TEXT,
        ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'TX',
        ADD COLUMN IF NOT EXISTS zip TEXT;
    `);

    // optional helpful indexes
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_contract_number ON providers (contract_number);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_component_code ON providers (component_code);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_npi ON providers (npi);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_ein ON providers (ein);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_city ON providers (city);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_state ON providers (state);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_providers_zip ON providers (zip);`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP INDEX IF EXISTS idx_providers_zip;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_state;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_city;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_ein;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_npi;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_component_code;`);
    await q.query(`DROP INDEX IF EXISTS idx_providers_contract_number;`);

    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS zip;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS state;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS city;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS address;`);

    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS ein;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS npi;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS component_code;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS contract_number;`);
  }
}
