// server/migrations/1800000000220-CreateConsumerLegalStatuses.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsumerLegalStatuses1800000000220
  implements MigrationInterface
{
  name = 'CreateConsumerLegalStatuses1800000000220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "consumer_legal_statuses" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),

        "consumer_record_id" uuid NOT NULL,

        "legal_status_type" character varying(100) NOT NULL,

        "court_order_date" date,

        "effective_date" date,

        "expiration_date" date,

        "notes" text,

        "status" character varying(32) NOT NULL DEFAULT 'ACTIVE',

        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_consumer_legal_statuses_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_consumer_legal_statuses_consumer_record"
          FOREIGN KEY ("consumer_record_id")
          REFERENCES "consumer_records"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_legal_statuses_consumer_record"
      ON "consumer_legal_statuses" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_legal_statuses_status"
      ON "consumer_legal_statuses" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_legal_statuses_type"
      ON "consumer_legal_statuses" ("legal_status_type")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_legal_statuses_type"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_legal_statuses_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_legal_statuses_consumer_record"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "consumer_legal_statuses"
    `);
  }
}