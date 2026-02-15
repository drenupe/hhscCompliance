import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFireDrillsForm47191800000000211 implements MigrationInterface {
  name = 'CreateFireDrillsForm47191800000000211';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ✅ remove old unused table (fine)
    await q.query(`DROP TABLE IF EXISTS fire_drill_logs`);

    // ✅ IMPORTANT: drop legacy fire_drills so we can recreate it with Form 4719 schema
    await q.query(`DROP TABLE IF EXISTS fire_drills CASCADE`);

    await q.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // ✅ do NOT use IF NOT EXISTS here since we intentionally dropped it
    await q.query(`
      CREATE TABLE fire_drills (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        location_id uuid NOT NULL REFERENCES residential_locations(id) ON DELETE CASCADE,

        date_drill_conducted date NOT NULL,
        time_drill_conducted text NULL,
        shift text NOT NULL CHECK (shift IN ('DAY','EVENING','NIGHT')),

        simulated_situations jsonb NULL,
        simulated_other_text text NULL,

        locations jsonb NULL,
        location_other_text text NULL,

        fire_types jsonb NULL,
        fire_type_other_text text NULL,

        extent_of_fire jsonb NULL,
        extent_of_fire_other_text text NULL,

        extent_of_smoke jsonb NULL,
        extent_of_smoke_other_text text NULL,

        exits_used jsonb NULL,
        exit_other_text text NULL,

        rally_point text NULL,

        staff_used_proper_judgment text NULL CHECK (staff_used_proper_judgment IN ('YES','NO')),
        actions_taken text NULL,

        fire_department_called text NULL CHECK (fire_department_called IN ('YES','NO')),
        fire_department_called_time text NULL,
        fire_department_called_ampm text NULL CHECK (fire_department_called_ampm IN ('AM','PM')),

        residents_removed_to_safety text NULL CHECK (residents_removed_to_safety IN ('YES','NO')),
        egress_clear text NULL CHECK (egress_clear IN ('YES','NO')),
        corridor_doors_closed text NULL CHECK (corridor_doors_closed IN ('YES','NO')),

        who_responded_and_equipment text NULL,

        staff_monitored_exits text NULL CHECK (staff_monitored_exits IN ('YES','NO')),
        building_evacuated text NULL CHECK (building_evacuated IN ('YES','NO')),
        fire_extinguished text NULL CHECK (fire_extinguished IN ('YES','NO')),

        all_clear_by text NULL,
        all_clear_time text NULL,
        all_clear_ampm text NULL CHECK (all_clear_ampm IN ('AM','PM')),

        emergency_plan_executed_correctly text NULL CHECK (emergency_plan_executed_correctly IN ('YES','NO')),
        staff_carried_out_responsibilities text NULL CHECK (staff_carried_out_responsibilities IN ('YES','NO')),

        staff_areas_checks jsonb NULL,

        comments_problems text NULL,
        participants_names text NULL,

        report_completed_by text NULL,
        report_completed_by_title text NULL,

        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await q.query(`
      CREATE INDEX IF NOT EXISTS ix_fire_drills_location
      ON fire_drills(location_id);
    `);

    await q.query(`
      CREATE INDEX IF NOT EXISTS ix_fire_drills_date
      ON fire_drills(location_id, date_drill_conducted DESC);
    `);

    await q.query(`DROP TRIGGER IF EXISTS fire_drills_set_updated_at ON fire_drills`);
    await q.query(`
      CREATE TRIGGER fire_drills_set_updated_at
      BEFORE UPDATE ON fire_drills
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS fire_drills`);
  }
}
