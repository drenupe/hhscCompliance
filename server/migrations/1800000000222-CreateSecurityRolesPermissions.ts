import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSecurityRolesPermissions1800000000222
  implements MigrationInterface
{
  name = 'CreateSecurityRolesPermissions1800000000222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL,
        "description" character varying(255),
        "status" character varying(32) NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_roles_status"
      ON "roles" ("status")
    `);

    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" character varying(150) NOT NULL,
        "module" character varying(100) NOT NULL,
        "description" character varying(255),
        "status" character varying(32) NOT NULL DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_permissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_permissions_code" UNIQUE ("code")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_permissions_module"
      ON "permissions" ("module")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_permissions_status"
      ON "permissions" ("status")
    `);

    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_role_permissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_role_permissions_role_permission"
          UNIQUE ("role_id", "permission_id"),
        CONSTRAINT "FK_role_permissions_role"
          FOREIGN KEY ("role_id")
          REFERENCES "roles"("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_role_permissions_permission"
          FOREIGN KEY ("permission_id")
          REFERENCES "permissions"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_role_permissions_role"
      ON "role_permissions" ("role_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_role_permissions_permission"
      ON "role_permissions" ("permission_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "user_permissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "permission_code" character varying(150) NOT NULL,
        "effect" character varying(16) NOT NULL DEFAULT 'ALLOW',
        "reason" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_permissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_permissions_user_permission"
          UNIQUE ("user_id", "permission_code")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_permissions_user"
      ON "user_permissions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_permissions_permission_code"
      ON "user_permissions" ("permission_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_permissions_permission_code"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_user_permissions_user"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "user_permissions"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_role_permissions_permission"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_role_permissions_role"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "role_permissions"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_permissions_status"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_permissions_module"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "permissions"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_roles_status"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "roles"
    `);
  }
}