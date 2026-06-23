import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCapStatusHistory1800000000234
  implements MigrationInterface
{
  name = 'CreateCapStatusHistory1800000000234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cap_status_history (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        cap_id uuid NOT NULL,
        from_status text,
        to_status text NOT NULL,
        note text,
        changed_by_user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS ix_cap_status_history_cap
      ON cap_status_history (cap_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS ix_cap_status_history_cap;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS cap_status_history;
    `);
  }
}