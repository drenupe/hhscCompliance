import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeAuthTimestamps1800000000009 implements MigrationInterface {
  name = 'NormalizeAuthTimestamps1800000000009';

  private async rename(q: QueryRunner, table: string, from: string, to: string) {
    // rename only if "from" exists and "to" does not
    await q.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = '${table}' AND column_name = '${from}'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = '${table}' AND column_name = '${to}'
        ) THEN
          EXECUTE 'ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}"';
        END IF;
      END $$;
    `);
  }

  public async up(q: QueryRunner): Promise<void> {
    const tables = [
      'users',
      'user_sessions',
      'refresh_tokens',
      'password_resets',
      'mfa_secrets',
      'email_verifications',
      'login_attempts',
    ];

    for (const t of tables) {
      await this.rename(q, t, 'createdAt', 'created_at');
      await this.rename(q, t, 'updatedAt', 'updated_at');
    }

    // ✅ ensure updated_at trigger function exists (your prereqs migration should already do this)
    await q.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // ✅ add updated_at triggers to tables that have updated_at
    for (const t of ['users', 'user_sessions']) {
      await q.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='${t}' AND column_name='updated_at') THEN
            EXECUTE 'DROP TRIGGER IF EXISTS trg_${t}_updated_at ON "${t}"';
            EXECUTE 'CREATE TRIGGER trg_${t}_updated_at
                     BEFORE UPDATE ON "${t}"
                     FOR EACH ROW EXECUTE PROCEDURE set_updated_at_timestamp()';
          END IF;
        END $$;
      `);
    }
  }

  public async down(q: QueryRunner): Promise<void> {
    // Usually no rollback needed—renaming back is risky once app depends on snake_case.
    // If you REALLY want it, I can provide the reverse rename.
    await q.query(`DROP TRIGGER IF EXISTS trg_users_updated_at ON "users";`);
    await q.query(`DROP TRIGGER IF EXISTS trg_user_sessions_updated_at ON "user_sessions";`);
  }
}
