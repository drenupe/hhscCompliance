import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecheckFieldsToComplianceResults1800000000235
  implements MigrationInterface
{
  name = 'AddRecheckFieldsToComplianceResults1800000000235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS needs_recheck boolean NOT NULL DEFAULT false;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS next_check_at timestamptz;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS last_rechecked_at timestamptz;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS recheck_reason text;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_compliance_results_recheck_queue
      ON compliance_results (needs_recheck, next_check_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_compliance_results_recheck_queue;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS recheck_reason;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS last_rechecked_at;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS next_check_at;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS needs_recheck;
    `);
  }
}