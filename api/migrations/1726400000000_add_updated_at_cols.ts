import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedAtCols1726400000000 implements MigrationInterface {
  name = 'AddUpdatedAtCols1726400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // refresh_tokens.updatedAt (for UpdateDateColumn on RefreshToken)
    await queryRunner.query(`
      ALTER TABLE IF EXISTS refresh_tokens
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    `);

    // mfa_secrets.updatedAt (your MfaSecret entity also has UpdateDateColumn)
    await queryRunner.query(`
      ALTER TABLE IF EXISTS mfa_secrets
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE IF EXISTS mfa_secrets
      DROP COLUMN IF EXISTS "updatedAt"
    `);
    await queryRunner.query(`
      ALTER TABLE IF EXISTS refresh_tokens
      DROP COLUMN IF EXISTS "updatedAt"
    `);
  }
}
