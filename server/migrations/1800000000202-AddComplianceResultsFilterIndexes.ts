import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComplianceResultsFilterIndexes1800000000202 implements MigrationInterface {
  name = 'AddComplianceResultsFilterIndexes1800000000202';

  public async up(q: QueryRunner): Promise<void> {
    // Most common Message Center filter:
    // location + module + status, sorted by updated_at
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_compliance_results_loc_mod_status_updated"
      ON "compliance_results" ("location_id", "module", "status", "updated_at" DESC)
    `);

    // Helpful when filtering/grouping by severity + date
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_compliance_results_loc_mod_sev_updated"
      ON "compliance_results" ("location_id", "module", "severity", "updated_at" DESC)
    `);

    // If you frequently deep-link/search by rule code within a module/location
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_compliance_results_loc_mod_rule"
      ON "compliance_results" ("location_id", "module", "rule_code")
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP INDEX IF EXISTS "ix_compliance_results_loc_mod_rule"`);
    await q.query(`DROP INDEX IF EXISTS "ix_compliance_results_loc_mod_sev_updated"`);
    await q.query(`DROP INDEX IF EXISTS "ix_compliance_results_loc_mod_status_updated"`);
  }
}
