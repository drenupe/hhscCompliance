import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFireDrillLogs1800000000210 implements MigrationInterface {
  name = 'CreateFireDrillLogs1800000000210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE fire_drill_logs (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        provider_id uuid NOT NULL
          REFERENCES providers(id)
          ON DELETE CASCADE,

        location_id uuid NOT NULL
          REFERENCES residential_locations(id)
          ON DELETE CASCADE,

        occurred_at timestamptz NOT NULL,

        sleeping_hours boolean NOT NULL DEFAULT false,

        staff_present text NOT NULL,

        evacuation_time_sec integer NULL,

        outcome text NOT NULL
          CHECK (outcome IN ('SUCCESS', 'ISSUES')),

        issues text NULL,

        corrective_action text NULL,

        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // Indexes for compliance queries
    await queryRunner.query(`
      CREATE INDEX idx_fire_drill_logs_location
      ON fire_drill_logs(location_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_fire_drill_logs_occurred_at
      ON fire_drill_logs(occurred_at DESC);
    `);

    // Auto-update updated_at
    await queryRunner.query(`
      CREATE TRIGGER fire_drill_logs_set_updated_at
      BEFORE UPDATE ON fire_drill_logs
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS fire_drill_logs`);
  }
}
