import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComplianceResultsPartialIndexes1800000000203 implements MigrationInterface {
  name = 'AddComplianceResultsPartialIndexes1800000000203';

  public async up(q: QueryRunner): Promise<void> {
    // ✅ Dashboard summary accelerator (only rows you actually query)
    // WHERE location_id = $1 AND status IN ('NON_COMPLIANT','UNKNOWN') GROUP BY module
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_cr_dash_loc_mod_updated_non_ok"
      ON "compliance_results" ("location_id", "module", "updated_at" DESC)
      WHERE "status" IN ('NON_COMPLIANT', 'UNKNOWN')
    `);

    // ✅ Message Center default view: NOT compliant (your service defaults to status != COMPLIANT)
    // also supports ordering by updatedAt (severity rank is computed)
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_cr_msg_loc_mod_updated_non_ok"
      ON "compliance_results" ("location_id", "module", "updated_at" DESC)
      WHERE "status" IN ('NON_COMPLIANT', 'UNKNOWN')
    `);

    // ✅ Message Center when subcategory filter is used (also only non-ok rows)
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_cr_msg_loc_mod_sub_updated_non_ok"
      ON "compliance_results" ("location_id", "module", "subcategory", "updated_at" DESC)
      WHERE "status" IN ('NON_COMPLIANT', 'UNKNOWN')
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP INDEX IF EXISTS "ix_cr_msg_loc_mod_sub_updated_non_ok"`);
    await q.query(`DROP INDEX IF EXISTS "ix_cr_msg_loc_mod_updated_non_ok"`);
    await q.query(`DROP INDEX IF EXISTS "ix_cr_dash_loc_mod_updated_non_ok"`);
  }
}
