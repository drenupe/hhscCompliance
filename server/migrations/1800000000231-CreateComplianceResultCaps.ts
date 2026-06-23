import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplianceResultCaps1800000000231
  implements MigrationInterface
{
  name = 'CreateComplianceResultCaps1800000000231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS compliance_result_caps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        compliance_result_id uuid NOT NULL,
        cap_id uuid NOT NULL,

        created_at timestamptz NOT NULL DEFAULT now(),

        CONSTRAINT fk_crc_compliance_result
          FOREIGN KEY (compliance_result_id)
          REFERENCES compliance_results(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_crc_cap
          FOREIGN KEY (cap_id)
          REFERENCES corrective_action_plans(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_compliance_result_cap
      ON compliance_result_caps (
        compliance_result_id,
        cap_id
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_crc_compliance_result
      ON compliance_result_caps (
        compliance_result_id
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_crc_cap
      ON compliance_result_caps (
        cap_id
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_crc_cap;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_crc_compliance_result;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS ux_compliance_result_cap;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS compliance_result_caps;
    `);
  }
}