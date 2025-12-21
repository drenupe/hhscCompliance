import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableExtensions1700000000000 implements MigrationInterface {
  name = 'EnableExtensions1700000000000';
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);
  }
  public async down(): Promise<void> {
    // usually keep extensions in place; do nothing on down
  }
}
