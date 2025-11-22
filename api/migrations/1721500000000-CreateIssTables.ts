import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIssTables1721500000000 implements MigrationInterface {
  name = 'CreateIssTables1721500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) ISS Provider table
    await queryRunner.query(`
      CREATE TABLE "iss_provider" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "license_number" VARCHAR(64) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_iss_provider_license_number" UNIQUE ("license_number")
      );
    `);

    // 2) Consumer table
    await queryRunner.query(`
      CREATE TABLE "consumer" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(100) NOT NULL,
        "last_name" VARCHAR(100) NOT NULL,
        "date_of_birth" DATE,
        "medicaid_number" VARCHAR(64),
        "level_of_need" VARCHAR(32),
        "place_of_service" VARCHAR(32),
        "iss_provider_id" INTEGER NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_consumer_iss_provider"
          FOREIGN KEY ("iss_provider_id")
          REFERENCES "iss_provider"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      );
    `);

    // 3) ISS Staff Log (8615) table
    await queryRunner.query(`
      CREATE TABLE "iss_staff_log" (
        "id" SERIAL PRIMARY KEY,
        "consumer_id" INTEGER NOT NULL,
        "iss_provider_id" INTEGER NOT NULL,
        "service_date" DATE NOT NULL,

        -- JSON blobs to hold the Angular form structure
        "header" JSONB NOT NULL,
        "service_week" JSONB NOT NULL,
        "weekly_sections" JSONB NOT NULL,
        "notes" JSONB NOT NULL,

        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT "FK_iss_staff_log_consumer"
          FOREIGN KEY ("consumer_id")
          REFERENCES "consumer"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_iss_staff_log_iss_provider"
          FOREIGN KEY ("iss_provider_id")
          REFERENCES "iss_provider"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "iss_staff_log";`);
    await queryRunner.query(`DROP TABLE "consumer";`);
    await queryRunner.query(`DROP TABLE "iss_provider";`);
  }
}
