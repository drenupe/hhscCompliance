import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRemediationTables1800000000230 implements MigrationInterface {
  name = 'CreateRemediationTables1800000000230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS corrective_action_plans (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        compliance_result_id uuid NOT NULL,
        status varchar(40) NOT NULL DEFAULT 'OPEN',
        issue text NOT NULL,
        corrective_action text NOT NULL,
        responsible_party varchar(160),
        target_completion_date date,
        completed_at timestamptz,
        created_by_user_id uuid,
        updated_by_user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS compliance_finding_notes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        compliance_result_id uuid NOT NULL,
        note text NOT NULL,
        created_by_user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_caps_compliance_result_id
      ON corrective_action_plans (compliance_result_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_caps_status
      ON corrective_action_plans (status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_finding_notes_compliance_result_id
      ON compliance_finding_notes (compliance_result_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_finding_notes_compliance_result_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_caps_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_caps_compliance_result_id;`);

    await queryRunner.query(`DROP TABLE IF EXISTS compliance_finding_notes;`);
    await queryRunner.query(`DROP TABLE IF EXISTS corrective_action_plans;`);
  }
}