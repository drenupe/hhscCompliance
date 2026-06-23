import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCapIdToComplianceFindingNotes1800000000233
  implements MigrationInterface
{
  name = 'AddCapIdToComplianceFindingNotes1800000000233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE compliance_finding_notes
      ADD COLUMN IF NOT EXISTS cap_id uuid;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_finding_note_cap
      ON compliance_finding_notes (cap_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_finding_note_cap;
    `);

    await queryRunner.query(`
      ALTER TABLE compliance_finding_notes
      DROP COLUMN IF EXISTS cap_id;
    `);
  }
}