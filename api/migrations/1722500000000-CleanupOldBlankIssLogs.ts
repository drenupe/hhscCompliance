import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupOldBlankIssLogs1722500000000
  implements MigrationInterface
{
  name = 'CleanupOldBlankIssLogs1722500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove old "blank" logs for the 5 seeded consumers
    // These are the ones with empty service_week and notes column.
    await queryRunner.query(
      `
      DELETE FROM "iss_staff_log"
      WHERE "consumer_id" IN (
        SELECT "id"
        FROM "consumer"
        WHERE ("first_name", "last_name") IN (
          ('Chris', 'Brown'),
          ('Paul', 'Sipes'),
          ('James', 'Harris'),
          ('Roy',   'Lemmond'),
          ('Stephanie', 'Trujillo')
        )
      )
      AND (
        "service_week" IS NULL
        OR "service_week" = '[]'::jsonb
      )
      AND (
        "notes" IS NULL
        OR "notes" = '[]'::jsonb
      );
      `,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // No-op rollback (we don't reinsert old blank logs).
    return;
  }
}
