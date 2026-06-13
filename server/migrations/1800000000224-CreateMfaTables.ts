import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMfaTables1800000000224 implements MigrationInterface {
  name = 'CreateMfaTables1800000000224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_mfa_secrets" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "encrypted_secret" text NOT NULL,
        "is_enabled" boolean NOT NULL DEFAULT false,
        "status" character varying(32) NOT NULL DEFAULT 'PENDING',
        "enabled_at" TIMESTAMP,
        "disabled_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_mfa_secrets_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_mfa_secrets_user_id" UNIQUE ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_mfa_secrets_status"
      ON "user_mfa_secrets" ("status")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_mfa_backup_codes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "code_hash" text NOT NULL,
        "used_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_mfa_backup_codes_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_mfa_backup_codes_code_hash" UNIQUE ("code_hash")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_mfa_backup_codes_user_id"
      ON "user_mfa_backup_codes" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_mfa_backup_codes_used_at"
      ON "user_mfa_backup_codes" ("used_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_mfa_backup_codes_used_at"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_mfa_backup_codes_user_id"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "user_mfa_backup_codes"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_mfa_secrets_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_mfa_secrets"`);
  }
}