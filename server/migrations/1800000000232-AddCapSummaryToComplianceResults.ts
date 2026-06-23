import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCapSummaryToComplianceResults1800000000232
  implements MigrationInterface
{
  name = 'AddCapSummaryToComplianceResults1800000000232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS cap_status text NOT NULL DEFAULT 'NONE';
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      ADD COLUMN IF NOT EXISTS cap_count integer NOT NULL DEFAULT 0;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_compliance_results_cap_status
      ON compliance_results (cap_status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_compliance_results_cap_status;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS cap_count;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_results
      DROP COLUMN IF EXISTS cap_status;
    `);
  }
}