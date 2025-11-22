import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIssIndexes1721800000000 implements MigrationInterface {
  name = 'AddIssIndexes1721800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- iss_staff_log indexes ---

    // Single-column index for lookups by consumer
    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_consumer_id"
      ON "iss_staff_log" ("consumer_id");
    `);

    // Single-column index for date-based queries
    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_service_date"
      ON "iss_staff_log" ("service_date");
    `);

    // Composite index for "all weeks for consumer ordered by date"
    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_consumer_date"
      ON "iss_staff_log" ("consumer_id", "service_date");
    `);

    // --- consumer indexes ---

    // For "all consumers for provider" screens
    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_iss_provider_id"
      ON "consumer" ("iss_provider_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order to avoid dependency surprises
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_iss_provider_id";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_iss_staff_log_consumer_date";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_iss_staff_log_service_date";
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_iss_staff_log_consumer_id";
    `);
  }
}
