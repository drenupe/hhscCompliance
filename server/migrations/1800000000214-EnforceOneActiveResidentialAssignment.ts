import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceOneActiveResidentialAssignment1800000000214
  implements MigrationInterface
{
  name = 'EnforceOneActiveResidentialAssignment1800000000214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clean up duplicate active assignments first.
    // Keeps the newest active assignment per consumer_record_id.
    await queryRunner.query(`
      WITH ranked AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            PARTITION BY consumer_record_id
            ORDER BY created_at DESC
          ) AS rn
        FROM residential_assignments
        WHERE status = 'ACTIVE'
      )
      UPDATE residential_assignments ra
      SET
        status = 'INACTIVE',
        end_date = COALESCE(end_date, CURRENT_DATE)
      FROM ranked r
      WHERE ra.id = r.id
        AND r.rn > 1
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "ux_res_assign_one_active_consumer"
      ON "residential_assignments" ("consumer_record_id")
      WHERE status = 'ACTIVE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "ux_res_assign_one_active_consumer"
    `);
  }
}