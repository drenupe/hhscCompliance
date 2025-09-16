import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthChanges1758046837080 implements MigrationInterface {
  name = 'AddAuthChanges1758046837080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- refresh_tokens: remove legacy columns if present ---
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "prevId"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "ip"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "userAgent"`);

    // DO NOT drop the FK unless you re-add it later.
    // await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "FK_b25a58a00578bd1b7a01623d2dd"`);

    // Some setups may have created an index with this name; guard the drop.
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_refresh_tokens_userId"`);

    // Add updatedAt only if missing (your earlier migration already added it)
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()`,
    );

    // --- password_resets: remove legacy columns if present ---
    await queryRunner.query(`ALTER TABLE "password_resets" DROP COLUMN IF EXISTS "consumedAt"`);
    await queryRunner.query(`ALTER TABLE "password_resets" DROP COLUMN IF EXISTS "codeHash"`);

    // --- mfa_secrets: remove legacy column if present ---
    await queryRunner.query(`ALTER TABLE "mfa_secrets" DROP COLUMN IF EXISTS "backupCodesHash"`);

    // --- email_verifications: remove legacy columns if present ---
    await queryRunner.query(`ALTER TABLE "email_verifications" DROP COLUMN IF EXISTS "consumedAt"`);
    await queryRunner.query(`ALTER TABLE "email_verifications" DROP COLUMN IF EXISTS "codeHash"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Best-effort down; only re-create when missing (types match your earlier schema)
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "updatedAt"`,
    );

    await queryRunner.query(
      `ALTER TABLE "password_resets" ADD COLUMN IF NOT EXISTS "consumedAt" TIMESTAMPTZ`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_resets" ADD COLUMN IF NOT EXISTS "codeHash" text`,
    );

    await queryRunner.query(
      `ALTER TABLE "mfa_secrets" ADD COLUMN IF NOT EXISTS "backupCodesHash" text[]`,
    );

    await queryRunner.query(
      `ALTER TABLE "email_verifications" ADD COLUMN IF NOT EXISTS "consumedAt" TIMESTAMPTZ`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_verifications" ADD COLUMN IF NOT EXISTS "codeHash" text`,
    );
  }
}
