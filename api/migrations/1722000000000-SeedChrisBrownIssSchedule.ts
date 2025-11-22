import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedChrisBrownIssSchedule1722000000000
  implements MigrationInterface
{
  name = 'SeedChrisBrownIssSchedule1722000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Ensure ISS provider: Ellis Works, license 311123
    const providerRows = await queryRunner.query(
      `
      INSERT INTO "iss_provider" (
        "name",
        "license_number",
        "created_at",
        "updated_at"
      )
      VALUES ($1, $2, now(), now())
      ON CONFLICT ("license_number")
      DO UPDATE SET "name" = EXCLUDED."name",
                    "updated_at" = now()
      RETURNING "id";
    `,
      ['Ellis Works', '311123'],
    );

    const issProviderId: number = providerRows[0].id;

    // 2) Ensure consumer Chris Brown assigned to Ellis Works
    const consumerRows = await queryRunner.query(
      `
      INSERT INTO "consumer" (
        "first_name",
        "last_name",
        "level_of_need",
        "place_of_service",
        "iss_provider_id",
        "created_at",
        "updated_at"
      )
      VALUES ($1, $2, $3, $4, $5, now(), now())
      ON CONFLICT ("first_name", "last_name", "iss_provider_id")
      DO UPDATE SET "level_of_need"   = EXCLUDED."level_of_need",
                    "place_of_service" = EXCLUDED."place_of_service",
                    "updated_at"       = now()
      RETURNING "id";
    `,
      ['Chris', 'Brown', 5, 'OFF_SITE', issProviderId],
    );

    const consumerId: number = consumerRows[0].id;

    // 3) Seed 52 weekly staff logs from 2025-09-29 to 2026-09-29 (Mondays)

    const effectiveFrom = '2025-09-29';
    const effectiveTo = '2026-09-29';

    // These JSON blobs align with your iss_staff_log columns:
    const header = {
      individualName: 'Chris Brown',
      lon: '5',
      levelOfNeed: 5,
      placeOfService: 'OFF_SITE',
      issProviderName: 'Ellis Works',
      issProviderLicense: '311123',
      staffNameTitle: 'ISS Direct Care Staff',
    };

    const serviceWeek = {
      monday:
        'Treasure hunt – vintage game stores and bar; watch games and appetizers.',
      tuesday:
        'AMC movies (member) and train ride to Dallas or Fort Worth; visiting downtown.',
      wednesday: 'Visit malls and low-cost arcades in the area.',
      thursday: 'Bowling in Duncanville and bingo in Duncanville.',
      friday: 'Food pantry and Walmart and Five Below.',
    };

    const weeklySections: any[] = []; // you can enrich later if needed
    const notes: any[] = [];

    await queryRunner.query(
      `
      WITH weeks AS (
        SELECT
          generate_series(
            $1::date,          -- first Monday
            $2::date,          -- last Monday
            INTERVAL '1 week'
          )::date AS svc_date
      )
      INSERT INTO "iss_staff_log" (
        "consumer_id",
        "iss_provider_id",
        "service_date",
        "header",
        "service_week",
        "weekly_sections",
        "notes",
        "created_at",
        "updated_at"
      )
      SELECT
        $3,              -- consumer_id
        $4,              -- iss_provider_id
        w.svc_date,      -- service_date (each Monday)
        $5::jsonb,       -- header
        $6::jsonb,       -- service_week
        $7::jsonb,       -- weekly_sections
        $8::jsonb,       -- notes
        now(),
        now()
      FROM weeks w;
    `,
      [
        effectiveFrom,
        effectiveTo,
        consumerId,
        issProviderId,
        JSON.stringify(header),
        JSON.stringify(serviceWeek),
        JSON.stringify(weeklySections),
        JSON.stringify(notes),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the seeded logs and consumer; leave provider if you want.
    await queryRunner.query(
      `
      DELETE FROM "iss_staff_log"
      WHERE "consumer_id" IN (
        SELECT "id" FROM "consumer"
        WHERE "first_name" = $1 AND "last_name" = $2
      );
    `,
      ['Chris', 'Brown'],
    );

    await queryRunner.query(
      `
      DELETE FROM "consumer"
      WHERE "first_name" = $1 AND "last_name" = $2;
    `,
      ['Chris', 'Brown'],
    );
    // Intentionally keep Ellis Works provider; comment this in if you ever want to drop it:
    // await queryRunner.query(
    //   'DELETE FROM "iss_provider" WHERE "license_number" = $1;',
    //   ['311123'],
    // );
  }
}
