import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderAddressFields1800000000106 implements MigrationInterface {
  name = 'AddProviderAddressFields1800000000106';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      ALTER TABLE providers
        ADD COLUMN IF NOT EXISTS address TEXT,
        ADD COLUMN IF NOT EXISTS city TEXT,
        ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'TX',
        ADD COLUMN IF NOT EXISTS zip TEXT;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS zip;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS state;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS city;`);
    await q.query(`ALTER TABLE providers DROP COLUMN IF EXISTS address;`);
  }
}
