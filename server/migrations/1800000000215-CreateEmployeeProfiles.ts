import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeProfiles1800000000215
  implements MigrationInterface
{
  name = 'CreateEmployeeProfiles1800000000215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "employee_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "person_id" uuid NOT NULL,
        "provider_id" uuid NOT NULL,
        "employee_number" text,
        "job_title" text,
        "hire_date" date,
        "termination_date" date,
        "credentials" text,
        "is_direct_care" boolean NOT NULL DEFAULT false,
        "is_case_manager" boolean NOT NULL DEFAULT false,
        "is_nurse" boolean NOT NULL DEFAULT false,
        "requires_background_check" boolean NOT NULL DEFAULT true,
        "background_check_date" date,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_employee_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_employee_profiles_person_id" UNIQUE ("person_id"),
        CONSTRAINT "FK_employee_profiles_person_id"
          FOREIGN KEY ("person_id")
          REFERENCES "people"("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_employee_profiles_provider_id"
          FOREIGN KEY ("provider_id")
          REFERENCES "providers"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employee_profiles_person_id"
      ON "employee_profiles" ("person_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employee_profiles_provider_id"
      ON "employee_profiles" ("provider_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employee_profiles_status"
      ON "employee_profiles" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_employee_profiles_job_title"
      ON "employee_profiles" ("job_title")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employee_profiles_job_title"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employee_profiles_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employee_profiles_provider_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_employee_profiles_person_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employee_profiles"`);
  }
}