import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsumerGuardians1800000000219
  implements MigrationInterface
{
  name = 'CreateConsumerGuardians1800000000219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "consumer_guardians" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),

        "consumer_record_id" uuid NOT NULL,

        "first_name" character varying(100) NOT NULL,

        "last_name" character varying(100) NOT NULL,

        "relationship" character varying(100),

        "phone" character varying(32),

        "email" character varying(255),

        "address" text,

        "is_primary_guardian" boolean NOT NULL DEFAULT false,

        "is_emergency_contact" boolean NOT NULL DEFAULT false,

        "has_medical_decision_authority" boolean NOT NULL DEFAULT false,

        "has_financial_decision_authority" boolean NOT NULL DEFAULT false,

        "status" character varying(32) NOT NULL DEFAULT 'ACTIVE',

        "notes" text,

        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_consumer_guardians_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_consumer_guardians_consumer_record"
          FOREIGN KEY ("consumer_record_id")
          REFERENCES "consumer_records"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_guardians_consumer_record"
      ON "consumer_guardians" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_guardians_status"
      ON "consumer_guardians" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_guardians_primary"
      ON "consumer_guardians" ("is_primary_guardian")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_guardians_emergency"
      ON "consumer_guardians" ("is_emergency_contact")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_guardians_emergency"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_guardians_primary"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_guardians_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_guardians_consumer_record"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "consumer_guardians"
    `);
  }
}