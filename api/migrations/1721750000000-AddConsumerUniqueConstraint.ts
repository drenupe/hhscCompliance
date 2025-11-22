
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConsumerUniqueConstraint1721750000000
  implements MigrationInterface
{
  name = 'AddConsumerUniqueConstraint1721750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "consumer"
      ADD CONSTRAINT "UQ_consumer_name_provider"
      UNIQUE ("first_name", "last_name", "iss_provider_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "consumer"
      DROP CONSTRAINT "UQ_consumer_name_provider";
    `);
  }
}
