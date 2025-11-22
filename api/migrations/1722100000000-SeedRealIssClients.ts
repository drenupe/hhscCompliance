import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRealIssClients1722100000000 implements MigrationInterface {
  name = 'SeedRealIssClients1722100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Ensure ISS provider exists
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

    // 2) Ensure the 5 real consumers exist and are linked to Ellis Works
    //    We rely on your unique constraint:
    //    UNIQUE (first_name, last_name, iss_provider_id)

    const consumers = [
      { firstName: 'Chris', lastName: 'Brown' },
      { firstName: 'Paul', lastName: 'Sipes' },
      { firstName: 'James', lastName: 'Harris' },
      { firstName: 'Roy', lastName: 'Lemmond' },
      { firstName: 'Stephanie', lastName: 'Trujillo' },
    ];

    const consumerIds: number[] = [];

    for (const c of consumers) {
      const rows = await queryRunner.query(
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
        [c.firstName, c.lastName, 5, 'OFF_SITE', issProviderId],
      );

      consumerIds.push(rows[0].id);
    }

    // 3) Seed 52 weekly staff logs (one per Monday) for ALL 5 consumers.
    //
    //    Dates: 2025-09-29 → 2026-09-29 (every Monday).

    const effectiveFrom = '2025-09-29';
    const effectiveTo = '2026-09-29';

    // Base JSON header; we’ll override individualName per consumer in SQL
    const baseHeader = {
      lon: '5',
      levelOfNeed: 5,
      placeOfService: 'OFF_SITE',
      issProviderName: 'Ellis Works',
      issProviderLicense: '311123',
      staffNameTitle: 'ISS Direct Care Staff',
    };

    // Weekly “base schedule” text (will be the same for all consumers)
    const baseServiceWeek = {
      monday:
        'Treasure hunt – vintage game stores and bar; watch games and appetizers.',
      tuesday:
        'AMC movies (member) and train ride to Dallas or Fort Worth; visiting downtown.',
      wednesday: 'Visit malls and low-cost arcades in the area.',
      thursday: 'Bowling in Duncanville and bingo in Duncanville.',
      friday: 'Food pantry and Walmart and Five Below.',
    };

    const weeklySections: any[] = []; // refine later if needed
    const notes: any[] = [];          // we can add per-week notes in another migration

    // Insert logs for all 5 consumers at once.
    //
    // We:
    //  - build a weeks table via generate_series
    //  - join it with the 5 consumers
    //  - create header JSON with individualName per consumer
    //  - reuse the same baseServiceWeek + weeklySections + notes for all

    await queryRunner.query(
      `
      WITH weeks AS (
        SELECT
          generate_series(
            $1::date,          -- first Monday
            $2::date,          -- last Monday
            INTERVAL '1 week'
          )::date AS svc_date
      ),
      target_consumers AS (
        SELECT
          c.id         AS consumer_id,
          c.first_name,
          c.last_name,
          c.iss_provider_id
        FROM "consumer" c
        WHERE c.iss_provider_id = $3
          AND (c.first_name, c.last_name) IN (
            ('Chris', 'Brown'),
            ('Paul', 'Sipes'),
            ('James', 'Harris'),
            ('Roy',   'Lemmond'),
            ('Stephanie', 'Trujillo')
          )
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
        tc.consumer_id,
        tc.iss_provider_id,
        w.svc_date,
        jsonb_set(
          $4::jsonb,
          '{individualName}',
          to_jsonb(tc.first_name || ' ' || tc.last_name)
        ) AS header,
        $5::jsonb  AS service_week,
        $6::jsonb  AS weekly_sections,
        $7::jsonb  AS notes,
        now(),
        now()
      FROM weeks w
      CROSS JOIN target_consumers tc;
    `,
      [
        effectiveFrom,
        effectiveTo,
        issProviderId,
        JSON.stringify(baseHeader),
        JSON.stringify(baseServiceWeek),
        JSON.stringify(weeklySections),
        JSON.stringify(notes),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete logs & consumers for ONLY these 5 people.
    await queryRunner.query(
      `
      DELETE FROM "iss_staff_log"
      WHERE "consumer_id" IN (
        SELECT "id" FROM "consumer"
        WHERE ( "first_name", "last_name" ) IN (
          ('Chris', 'Brown'),
          ('Paul', 'Sipes'),
          ('James', 'Harris'),
          ('Roy',   'Lemmond'),
          ('Stephanie', 'Trujillo')
        )
      );
    `,
    );

    await queryRunner.query(
      `
      DELETE FROM "consumer"
      WHERE ( "first_name", "last_name" ) IN (
        ('Chris', 'Brown'),
        ('Paul', 'Sipes'),
        ('James', 'Harris'),
        ('Roy',   'Lemmond'),
        ('Stephanie', 'Trujillo')
      );
    `,
    );
    // We intentionally KEEP the Ellis Works provider.
  }
}
