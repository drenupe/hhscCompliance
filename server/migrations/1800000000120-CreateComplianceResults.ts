import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplianceResults1800000000120 implements MigrationInterface {
  name = 'CreateComplianceResults1800000000120';

  public async up(q: QueryRunner): Promise<void> {
    // assumes uuid-ossp + set_updated_at_timestamp() already exist from your baseline migrations
    await q.query(`
      CREATE TABLE IF NOT EXISTS compliance_results (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
        location_id uuid NULL REFERENCES residential_locations(id) ON DELETE SET NULL,

        entity_type text NOT NULL,
        entity_id uuid NOT NULL,

        module text NOT NULL,
        rule_code text NOT NULL,

        status text NOT NULL,
        severity text NOT NULL,

        message text NULL,

        route_commands jsonb NULL,
        query_params jsonb NULL,

        last_checked_at timestamptz NULL,

        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // updated_at trigger
    await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_compliance_results_updated_at') THEN
          CREATE TRIGGER trg_compliance_results_updated_at
          BEFORE UPDATE ON compliance_results
          FOR EACH ROW
          EXECUTE FUNCTION set_updated_at_timestamp();
        END IF;
      END $$;
    `);

    // Unique + indexes
    await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ux_compliance_results_unique') THEN
          CREATE UNIQUE INDEX ux_compliance_results_unique
          ON compliance_results (provider_id, location_id, entity_type, entity_id, rule_code);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_compliance_results_location') THEN
          CREATE INDEX ix_compliance_results_location ON compliance_results (location_id);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_compliance_results_status') THEN
          CREATE INDEX ix_compliance_results_status ON compliance_results (status);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_compliance_results_module') THEN
          CREATE INDEX ix_compliance_results_module ON compliance_results (module);
        END IF;
      END $$;
    `);

    // CHECK constraints (safe)
    await q.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_compliance_results_status') THEN
          ALTER TABLE compliance_results
          ADD CONSTRAINT chk_compliance_results_status
          CHECK (status IN ('COMPLIANT','NON_COMPLIANT','UNKNOWN'));
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_compliance_results_severity') THEN
          ALTER TABLE compliance_results
          ADD CONSTRAINT chk_compliance_results_severity
          CHECK (severity IN ('LOW','MED','HIGH','CRITICAL'));
        END IF;
      END $$;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS compliance_results;`);
  }
}
