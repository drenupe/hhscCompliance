// apps/api/src/migrations/1800000000201-AddComplianceResultsSubcategory.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComplianceResultsSubcategory1800000000201 implements MigrationInterface {
  name = 'AddComplianceResultsSubcategory1800000000201';

  public async up(q: QueryRunner): Promise<void> {
    // ✅ Add the missing column
    await q.query(`
      ALTER TABLE "compliance_results"
      ADD COLUMN IF NOT EXISTS "subcategory" text
    `);

    // ✅ (Optional) index for faster filtering
    await q.query(`
      CREATE INDEX IF NOT EXISTS "ix_compliance_results_subcategory"
      ON "compliance_results" ("subcategory")
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    // Drop index first (safe)
    await q.query(`
      DROP INDEX IF EXISTS "ix_compliance_results_subcategory"
    `);

    // Drop column
    await q.query(`
      ALTER TABLE "compliance_results"
      DROP COLUMN IF EXISTS "subcategory"
    `);
  }
}
