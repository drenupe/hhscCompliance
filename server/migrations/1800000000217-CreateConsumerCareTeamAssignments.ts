import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsumerCareTeamAssignments1800000000217
  implements MigrationInterface
{
  name = 'CreateConsumerCareTeamAssignments1800000000217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "consumer_care_team_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

        "consumer_record_id" uuid NOT NULL,

        "employee_profile_id" uuid,
        "clinical_contact_profile_id" uuid,

        "role" text NOT NULL,

        "start_date" date NOT NULL,
        "end_date" date,

        "status" text NOT NULL DEFAULT 'ACTIVE',

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_consumer_care_team_assignments_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_care_team_consumer_record"
          FOREIGN KEY ("consumer_record_id")
          REFERENCES "consumer_records"("id")
          ON DELETE CASCADE,

        CONSTRAINT "FK_care_team_employee_profile"
          FOREIGN KEY ("employee_profile_id")
          REFERENCES "employee_profiles"("id")
          ON DELETE CASCADE,

        CONSTRAINT "FK_care_team_clinical_contact"
          FOREIGN KEY ("clinical_contact_profile_id")
          REFERENCES "clinical_contact_profiles"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_care_team_consumer_record"
      ON "consumer_care_team_assignments" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_care_team_employee_profile"
      ON "consumer_care_team_assignments" ("employee_profile_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_care_team_clinical_contact"
      ON "consumer_care_team_assignments" ("clinical_contact_profile_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_care_team_role"
      ON "consumer_care_team_assignments" ("role")
    `);

    await queryRunner.query(`
      CREATE INDEX "ix_care_team_status"
      ON "consumer_care_team_assignments" ("status")
    `);

    // One ACTIVE role per consumer
    await queryRunner.query(`
      CREATE UNIQUE INDEX "ux_care_team_one_active_role"
      ON "consumer_care_team_assignments"
      ("consumer_record_id","role")
      WHERE status = 'ACTIVE'
    `);

    // Must reference exactly one profile type
    await queryRunner.query(`
      ALTER TABLE "consumer_care_team_assignments"
      ADD CONSTRAINT "CHK_care_team_one_profile"
      CHECK (
        (
          employee_profile_id IS NOT NULL
          AND clinical_contact_profile_id IS NULL
        )
        OR
        (
          employee_profile_id IS NULL
          AND clinical_contact_profile_id IS NOT NULL
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "consumer_care_team_assignments"
      DROP CONSTRAINT IF EXISTS "CHK_care_team_one_profile"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ux_care_team_one_active_role"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ix_care_team_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ix_care_team_role"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ix_care_team_clinical_contact"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ix_care_team_employee_profile"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "ix_care_team_consumer_record"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "consumer_care_team_assignments"
    `);
  }
}