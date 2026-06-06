import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameConsumerProfileToConsumerRecord1800000000213
  implements MigrationInterface
{
  name = 'RenameConsumerProfileToConsumerRecord1800000000213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop assignment FKs first
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      DROP CONSTRAINT IF EXISTS "FK_residential_assignments_consumer_profile_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      DROP CONSTRAINT IF EXISTS "FK_iss_assignments_consumer_profile_id"
    `);

    // Drop old indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_res_assign_consumer"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_iss_assign_consumer"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_consumer_profiles_medicaid_number"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_consumer_profiles_status"`,
    );

    // Rename table
    await queryRunner.query(`
      ALTER TABLE "consumer_profiles"
      RENAME TO "consumer_records"
    `);

    // Rename primary/unique constraints
    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "PK_consumer_profiles_id"
      TO "PK_consumer_records_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "UQ_consumer_profiles_person_id"
      TO "UQ_consumer_records_person_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "FK_consumer_profiles_person_id"
      TO "FK_consumer_records_person_id"
    `);

    // Rename FK columns on assignment tables
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      RENAME COLUMN "consumer_profile_id"
      TO "consumer_record_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      RENAME COLUMN "consumer_profile_id"
      TO "consumer_record_id"
    `);

    // Add expanded ConsumerRecord fields
    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "enrollment_date" date
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "discharge_date" date
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "gender" text
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "preferred_language" text
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "has_guardian" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "requires_nursing" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "has_behavior_support_plan" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "medicaid_renewal_date" date
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      ADD COLUMN IF NOT EXISTS "medicaid_active" boolean NOT NULL DEFAULT true
    `);

    // Recreate indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_consumer_records_medicaid_number"
      ON "consumer_records" ("medicaid_number")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_consumer_records_status"
      ON "consumer_records" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "ix_res_assign_consumer_record"
      ON "residential_assignments" ("consumer_record_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "ix_iss_assign_consumer_record"
      ON "iss_consumer_assignments" ("consumer_record_id")
    `);

    // Recreate FKs
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      ADD CONSTRAINT "FK_residential_assignments_consumer_record_id"
      FOREIGN KEY ("consumer_record_id")
      REFERENCES "consumer_records"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      ADD CONSTRAINT "FK_iss_assignments_consumer_record_id"
      FOREIGN KEY ("consumer_record_id")
      REFERENCES "consumer_records"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new FKs
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      DROP CONSTRAINT IF EXISTS "FK_residential_assignments_consumer_record_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      DROP CONSTRAINT IF EXISTS "FK_iss_assignments_consumer_record_id"
    `);

    // Drop new indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_iss_assign_consumer_record"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_res_assign_consumer_record"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_consumer_records_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_consumer_records_medicaid_number"`,
    );

    // Drop expanded fields
    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "medicaid_active"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "medicaid_renewal_date"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "has_behavior_support_plan"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "requires_nursing"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "has_guardian"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "preferred_language"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "gender"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "discharge_date"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      DROP COLUMN IF EXISTS "enrollment_date"
    `);

    // Rename assignment FK columns back
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      RENAME COLUMN "consumer_record_id"
      TO "consumer_profile_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      RENAME COLUMN "consumer_record_id"
      TO "consumer_profile_id"
    `);

    // Rename constraints back
    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "FK_consumer_records_person_id"
      TO "FK_consumer_profiles_person_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "UQ_consumer_records_person_id"
      TO "UQ_consumer_profiles_person_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME CONSTRAINT "PK_consumer_records_id"
      TO "PK_consumer_profiles_id"
    `);

    // Rename table back
    await queryRunner.query(`
      ALTER TABLE "consumer_records"
      RENAME TO "consumer_profiles"
    `);

    // Recreate old indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_consumer_profiles_medicaid_number"
      ON "consumer_profiles" ("medicaid_number")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_consumer_profiles_status"
      ON "consumer_profiles" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "ix_res_assign_consumer"
      ON "residential_assignments" ("consumer_profile_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "ix_iss_assign_consumer"
      ON "iss_consumer_assignments" ("consumer_profile_id")
    `);

    // Recreate old FKs
    await queryRunner.query(`
      ALTER TABLE "residential_assignments"
      ADD CONSTRAINT "FK_residential_assignments_consumer_profile_id"
      FOREIGN KEY ("consumer_profile_id")
      REFERENCES "consumer_profiles"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "iss_consumer_assignments"
      ADD CONSTRAINT "FK_iss_assignments_consumer_profile_id"
      FOREIGN KEY ("consumer_profile_id")
      REFERENCES "consumer_profiles"("id")
      ON DELETE CASCADE
    `);
  }
}