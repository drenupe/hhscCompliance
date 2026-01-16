import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProvidersStatusSoftDelete1800000000104 implements MigrationInterface {
  name = 'AddProvidersStatusSoftDelete1800000000104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add status + deleted_at if missing
    await queryRunner.query(`
      ALTER TABLE providers
        ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE';
    `);

    // Add check constraint (guarded)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'chk_providers_status'
        ) THEN
          ALTER TABLE providers
          ADD CONSTRAINT chk_providers_status
          CHECK (status IN ('ACTIVE','INACTIVE'));
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE providers
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    `);

    // Helpful indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_providers_status ON providers (status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_providers_deleted ON providers (deleted_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first (if they exist)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_providers_deleted;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_providers_status;`);

    // Drop constraint then columns
    await queryRunner.query(`ALTER TABLE providers DROP CONSTRAINT IF EXISTS chk_providers_status;`);
    await queryRunner.query(`ALTER TABLE providers DROP COLUMN IF EXISTS deleted_at;`);
    await queryRunner.query(`ALTER TABLE providers DROP COLUMN IF EXISTS status;`);
  }
}
