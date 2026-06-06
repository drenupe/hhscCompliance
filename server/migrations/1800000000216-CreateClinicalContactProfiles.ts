import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClinicalContactProfiles1800000000216
  implements MigrationInterface
{
  name = 'CreateClinicalContactProfiles1800000000216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "clinical_contact_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "person_id" uuid NOT NULL,
        "provider_id" uuid NOT NULL,
        "type" text NOT NULL,
        "organization" text,
        "npi" text,
        "license_number" text,
        "phone" text,
        "fax" text,
        "status" text NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

        CONSTRAINT "PK_clinical_contact_profiles_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_clinical_contact_profiles_person_id"
          UNIQUE ("person_id"),

        CONSTRAINT "FK_clinical_contact_profiles_person_id"
          FOREIGN KEY ("person_id")
          REFERENCES "people"("id")
          ON DELETE CASCADE,

        CONSTRAINT "FK_clinical_contact_profiles_provider_id"
          FOREIGN KEY ("provider_id")
          REFERENCES "providers"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_person_id"
      ON "clinical_contact_profiles" ("person_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_provider_id"
      ON "clinical_contact_profiles" ("provider_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_type"
      ON "clinical_contact_profiles" ("type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_status"
      ON "clinical_contact_profiles" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_npi"
      ON "clinical_contact_profiles" ("npi")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_clinical_contact_profiles_license"
      ON "clinical_contact_profiles" ("license_number")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_license"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_npi"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_type"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_provider_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_clinical_contact_profiles_person_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "clinical_contact_profiles"
    `);
  }
}