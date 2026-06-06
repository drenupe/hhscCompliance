// server/migrations/1800000000221-CreateMedicaidBenefits.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMedicaidBenefits1800000000221
  implements MigrationInterface
{
  name = 'CreateMedicaidBenefits1800000000221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "medicaid_benefits" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),

        "consumer_record_id" uuid NOT NULL,

        "medicaid_number" character varying(64) NOT NULL,

        "waiver_program" character varying(100),

        "mco_name" character varying(100),

        "eligibility_status" character varying(50) NOT NULL DEFAULT 'ACTIVE',

        "effective_date" date,

        "renewal_date" date,

        "notes" text,

        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_medicaid_benefits_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_medicaid_benefits_consumer_record"
          FOREIGN KEY ("consumer_record_id")
          REFERENCES "consumer_records"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_medicaid_benefits_consumer_record"
      ON "medicaid_benefits" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_medicaid_benefits_medicaid_number"
      ON "medicaid_benefits" ("medicaid_number")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_medicaid_benefits_eligibility_status"
      ON "medicaid_benefits" ("eligibility_status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_medicaid_benefits_renewal_date"
      ON "medicaid_benefits" ("renewal_date")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_medicaid_benefits_renewal_date"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_medicaid_benefits_eligibility_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_medicaid_benefits_medicaid_number"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_medicaid_benefits_consumer_record"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "medicaid_benefits"
    `);
  }
}