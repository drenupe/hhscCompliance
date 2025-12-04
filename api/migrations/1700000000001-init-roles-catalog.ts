// api/migrations/1700000000001-init-roles-catalog.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitRolesCatalog1700000000001 implements MigrationInterface {
  name = 'InitRolesCatalog1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles_catalog (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name CITEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS roles_catalog;`);
  }
}
