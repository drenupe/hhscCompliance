import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsumerDiagnoses1800000000218
  implements MigrationInterface
{
  name = 'CreateConsumerDiagnoses1800000000218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "consumer_diagnoses" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),

        "consumer_record_id" uuid NOT NULL,

        "icd10_code" character varying(32),

        "diagnosis_name" character varying(255) NOT NULL,

        "is_primary" boolean NOT NULL DEFAULT false,

        "effective_date" date,

        "resolved_date" date,

        "status" character varying(32) NOT NULL DEFAULT 'ACTIVE',

        "notes" text,

        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_consumer_diagnoses_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_consumer_diagnoses_consumer_record"
          FOREIGN KEY ("consumer_record_id")
          REFERENCES "consumer_records"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_diagnoses_consumer_record"
      ON "consumer_diagnoses" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_diagnoses_icd10"
      ON "consumer_diagnoses" ("icd10_code")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_diagnoses_status"
      ON "consumer_diagnoses" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_diagnoses_primary"
      ON "consumer_diagnoses" ("is_primary")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_diagnoses_primary"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_diagnoses_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_diagnoses_icd10"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_consumer_diagnoses_consumer_record"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "consumer_diagnoses"
    `);
  }
}