import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCapEvidence1800000000236 implements MigrationInterface {
  name = 'CreateCapEvidence1800000000236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cap_evidence (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        cap_id uuid NOT NULL,
        compliance_result_id uuid NOT NULL,
        file_name text NOT NULL,
        file_type text NOT NULL,
        storage_path text NOT NULL,
        evidence_type text NOT NULL DEFAULT 'OTHER',
        uploaded_by_user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_cap_evidence_cap
      ON cap_evidence (cap_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_cap_evidence_compliance_result
      ON cap_evidence (compliance_result_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_cap_evidence_type
      ON cap_evidence (evidence_type);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS ix_cap_evidence_type;`);
    await queryRunner.query(`DROP INDEX IF EXISTS ix_cap_evidence_compliance_result;`);
    await queryRunner.query(`DROP INDEX IF EXISTS ix_cap_evidence_cap;`);
    await queryRunner.query(`DROP TABLE IF EXISTS cap_evidence;`);
  }
}