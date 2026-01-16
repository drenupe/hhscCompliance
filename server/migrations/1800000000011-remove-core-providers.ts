import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCoreProviders1800000000011 implements MigrationInterface {
  name = 'RemoveCoreProviders1800000000011';

  public async up(q: QueryRunner): Promise<void> {
    // If nothing is using it, remove it.
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='core_providers') THEN
          DROP TABLE core_providers CASCADE;
        END IF;
      END $$;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    // no-op (we don't want to re-create a duplicate table)
  }
}
