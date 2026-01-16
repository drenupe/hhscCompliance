import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoreProviders1800000000010 implements MigrationInterface {
  name = 'CoreProviders1800000000010';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await q.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    // shared updated_at function (idempotent)
    await q.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Providers = Tenants
    await q.query(`
      CREATE TABLE IF NOT EXISTS core_providers (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name CITEXT NOT NULL,
        license_number CITEXT,
        status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
        deleted_at TIMESTAMPTZ,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT uq_core_providers_name UNIQUE (name),
        CONSTRAINT uq_core_providers_license UNIQUE (license_number)
      );
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_core_providers_updated_at ON core_providers;`);
    await q.query(`
      CREATE TRIGGER trg_core_providers_updated_at
      BEFORE UPDATE ON core_providers
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp();
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_core_providers_name ON core_providers (name);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_core_providers_status ON core_providers (status);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_core_providers_deleted ON core_providers (deleted_at);`);

    // Audit log (enterprise staple)
    await q.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

        entity_type TEXT NOT NULL,
        entity_id uuid,
        action TEXT NOT NULL CHECK (action IN ('CREATE','UPDATE','DELETE','READ')),

        actor_user_id uuid,
        actor_email TEXT,
        actor_roles TEXT[],

        ip inet,
        user_agent TEXT,

        request_id TEXT,
        meta JSONB,

        before JSONB,
        after  JSONB,

        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await q.query(`CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor_user_id);`);
    await q.query(`CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE IF EXISTS audit_log;`);
    await q.query(`DROP TRIGGER IF EXISTS trg_core_providers_updated_at ON core_providers;`);
    await q.query(`DROP TABLE IF EXISTS core_providers;`);
  }
}
