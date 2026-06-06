import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeopleDomain1800000000212 implements MigrationInterface {
  name = 'CreatePeopleDomain1800000000212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await queryRunner.query(`
      CREATE TABLE "people" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "date_of_birth" date,
        "phone" text,
        "email" citext,
        "address" text,
        "city" text,
        "state" text DEFAULT 'TX',
        "zip" text,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_people_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_people_first_name" ON "people" ("first_name")`);
    await queryRunner.query(`CREATE INDEX "IDX_people_last_name" ON "people" ("last_name")`);
    await queryRunner.query(`CREATE INDEX "IDX_people_status" ON "people" ("status")`);

    await queryRunner.query(`
      CREATE TABLE "consumer_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "person_id" uuid NOT NULL,
        "medicaid_number" text,
        "level_of_need" text,
        "place_of_service" text,
        "service_group" text,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_consumer_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_consumer_profiles_person_id" UNIQUE ("person_id"),
        CONSTRAINT "FK_consumer_profiles_person_id"
          FOREIGN KEY ("person_id")
          REFERENCES "people"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_consumer_profiles_medicaid_number" ON "consumer_profiles" ("medicaid_number")`);
    await queryRunner.query(`CREATE INDEX "IDX_consumer_profiles_status" ON "consumer_profiles" ("status")`);

    await queryRunner.query(`
      CREATE TABLE "residential_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider_id" uuid NOT NULL,
        "location_id" uuid NOT NULL,
        "consumer_profile_id" uuid NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_residential_assignments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_residential_assignments_location_id"
          FOREIGN KEY ("location_id")
          REFERENCES "residential_locations"("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_residential_assignments_consumer_profile_id"
          FOREIGN KEY ("consumer_profile_id")
          REFERENCES "consumer_profiles"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_residential_assignments_provider_id" ON "residential_assignments" ("provider_id")`);
    await queryRunner.query(`CREATE INDEX "ix_res_assign_location" ON "residential_assignments" ("location_id")`);
    await queryRunner.query(`CREATE INDEX "ix_res_assign_consumer" ON "residential_assignments" ("consumer_profile_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_residential_assignments_status" ON "residential_assignments" ("status")`);

    await queryRunner.query(`
      CREATE TABLE "iss_consumer_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "consumer_profile_id" uuid NOT NULL,
        "iss_provider_id" integer NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_iss_consumer_assignments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_iss_assignments_consumer_profile_id"
          FOREIGN KEY ("consumer_profile_id")
          REFERENCES "consumer_profiles"("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_iss_assignments_iss_provider_id"
          FOREIGN KEY ("iss_provider_id")
          REFERENCES "iss_provider"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "ix_iss_assign_provider" ON "iss_consumer_assignments" ("iss_provider_id")`);
    await queryRunner.query(`CREATE INDEX "ix_iss_assign_consumer" ON "iss_consumer_assignments" ("consumer_profile_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_iss_consumer_assignments_status" ON "iss_consumer_assignments" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iss_consumer_assignments_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_iss_assign_consumer"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_iss_assign_provider"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "iss_consumer_assignments"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_residential_assignments_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_res_assign_consumer"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ix_res_assign_location"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_residential_assignments_provider_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "residential_assignments"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_consumer_profiles_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_consumer_profiles_medicaid_number"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consumer_profiles"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_people_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_people_last_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_people_first_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "people"`);
  }
}