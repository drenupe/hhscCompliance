import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAuth1755630176745 implements MigrationInterface {
  name = 'InitAuth1755630176745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "userAgent" text,
        "ip" inet,
        "revokedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_55fa4db8406ed66bc704432842"
      ON "user_sessions" ("userId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(320) NOT NULL,
        "passwordHash" text NOT NULL,
        "roles" text[] NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_97672ac88f789774dd47f7c8be"
      ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sessionId" uuid NOT NULL,
        "tokenHash" text NOT NULL,
        "prevId" uuid,
        "rotatedAt" TIMESTAMP WITH TIME ZONE,
        "revokedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_b25a58a00578bd1b7a01623d2d"
      ON "refresh_tokens" ("sessionId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "password_resets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "codeHash" text NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "consumedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4816377aa98211c1de34469e742" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_d95569f623f28a0bf034a55099"
      ON "password_resets" ("userId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "mfa_secrets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "type" text NOT NULL,
        "secret" text NOT NULL,
        "backupCodesHash" text[],
        "enabledAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e93337ad293b93b1084ffb04b4c" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_9adff2630422d0325ec3369f6e"
      ON "mfa_secrets" ("userId")
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "email_verifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "codeHash" text NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "consumedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_c1ea2921e767f83cd44c0af203f" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_4e63a91e0a684b31496bd50733"
      ON "email_verifications" ("userId")
    `);

    // FK add guarded (some PG versions don’t support IF NOT EXISTS on constraints)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_b25a58a00578bd1b7a01623d2dd'
        ) THEN
          ALTER TABLE "refresh_tokens"
          ADD CONSTRAINT "FK_b25a58a00578bd1b7a01623d2dd"
          FOREIGN KEY ("sessionId")
          REFERENCES "user_sessions"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "FK_b25a58a00578bd1b7a01623d2dd"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_4e63a91e0a684b31496bd50733"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "email_verifications"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_9adff2630422d0325ec3369f6e"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "mfa_secrets"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_d95569f623f28a0bf034a55099"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "password_resets"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_b25a58a00578bd1b7a01623d2d"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_97672ac88f789774dd47f7c8be"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_55fa4db8406ed66bc704432842"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_sessions"`);
  }
}
