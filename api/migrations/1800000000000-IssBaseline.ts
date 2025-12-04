import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssBaseline1800000000000 implements MigrationInterface {
  name = 'IssBaseline1800000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Core ISS tables
    // -------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "iss_provider" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "license_number" VARCHAR(64) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_iss_provider_license_number" UNIQUE ("license_number")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "consumer" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(100) NOT NULL,
        "last_name" VARCHAR(100) NOT NULL,
        "date_of_birth" DATE,
        "medicaid_number" VARCHAR(64),
        "level_of_need" VARCHAR(32),
        "place_of_service" VARCHAR(32),
        "iss_provider_id" INTEGER NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_consumer_iss_provider"
          FOREIGN KEY ("iss_provider_id")
          REFERENCES "iss_provider"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT "UQ_consumer_name_provider"
          UNIQUE ("first_name", "last_name", "iss_provider_id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "iss_staff_log" (
        "id" SERIAL PRIMARY KEY,
        "consumer_id" INTEGER NOT NULL,
        "iss_provider_id" INTEGER NOT NULL,
        "service_date" DATE NOT NULL,

        "header" JSONB NOT NULL,
        "service_week" JSONB NOT NULL,
        "weekly_sections" JSONB NOT NULL,
        "notes" JSONB NOT NULL,

        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

        CONSTRAINT "FK_iss_staff_log_consumer"
          FOREIGN KEY ("consumer_id")
          REFERENCES "consumer"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_iss_staff_log_iss_provider"
          FOREIGN KEY ("iss_provider_id")
          REFERENCES "iss_provider"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,

        -- *** KEY PIECE: prevent duplicate weeks per consumer ***
        CONSTRAINT "UQ_iss_staff_log_consumer_date"
          UNIQUE ("consumer_id", "service_date")
      );
    `);

    // 2) Indexes
    // -------------------------------------------------
    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_consumer_id"
      ON "iss_staff_log" ("consumer_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_service_date"
      ON "iss_staff_log" ("service_date");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_iss_staff_log_consumer_date"
      ON "iss_staff_log" ("consumer_id", "service_date");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_consumer_iss_provider_id"
      ON "consumer" ("iss_provider_id");
    `);

    // 3) Seed Ellis Works provider
    // -------------------------------------------------
    const providerRows = await queryRunner.query(
      `
      INSERT INTO "iss_provider" (
        "name",
        "license_number",
        "created_at",
        "updated_at"
      )
      VALUES ($1, $2, now(), now())
      RETURNING "id";
      `,
      ['Ellis Works', '311123'],
    );

    const issProviderId: number = providerRows[0].id;

    // 4) Seed five consumers
    // -------------------------------------------------
    const consumers = [
      { firstName: 'Chris', lastName: 'Brown' },
      { firstName: 'Paul', lastName: 'Sipes' },
      { firstName: 'James', lastName: 'Harris' },
      { firstName: 'Roy', lastName: 'Lemmond' },
      { firstName: 'Stephanie', lastName: 'Trujillo' },
    ];

    for (const c of consumers) {
      await queryRunner.query(
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
                      "updated_at"       = now();
        `,
        [c.firstName, c.lastName, 5, 'OFF_SITE', issProviderId],
      );
    }

    // 5) Seed weekly ISS logs for all 5 consumers, full shape
    // -------------------------------------------------
    const effectiveFrom = '2025-09-29';
    const effectiveTo = '2026-09-29';

    const baseServiceWeek = {
      monday:
        'Treasure hunt – vintage game stores and bar; watch games and appetizers.',
      tuesday:
        'AMC movies (member) and train ride to Dallas or Fort Worth; visiting downtown.',
      wednesday: 'Visit malls and low-cost arcades in the area.',
      thursday: 'Bowling in Duncanville and bingo in Duncanville.',
      friday: 'Food pantry and Walmart and Five Below.',
    };

    const initials = 'AM';

    const socializationRows = [
      {
        label: 'Communication',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Socialization Skills Development',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Group Activity',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Volunteer or Employment Skills Development',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Transportation',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
    ];

    const selfHelpRows = [
      {
        label: 'Personal Hygiene',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Eating',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Meal Preparation',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Cleaning',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Assistance with Medication',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
    ];

    const adaptiveRows = [
      {
        label: 'Ambulation and Mobility',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Reinforce Lessons',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
    ];

    const implementationRows = [
      {
        label: 'Other:',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Other:',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
    ];

    const communityRows = [
      {
        label: 'Community Location (describe location(s) in the comments)',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
      {
        label: 'Transportation',
        mon: initials,
        tue: initials,
        wed: initials,
        thu: initials,
        fri: initials,
      },
    ];

    const mondayComment =
      'Individual participated in community-based ISS from 9:00–3:00 at local vintage game store and restaurant. Staff provided prompts and modeling to increase socialization, communication, and money-handling skills during ordering food, paying at register, and interacting with staff/peers. Individual remained engaged for the majority of activities, required verbal prompts for turn-taking, and tolerated community setting without incident.';
    const tuesdayComment =
      'Individual attended ISS from 9:00–3:00 including train trip to Dallas/Fort Worth and movie outing. Staff provided step-by-step instruction and safety cues during public transportation, supported use of community resources (buying tickets, locating seats), and reinforced decision-making and social skills in group setting. Individual followed safety rules, responded to prompts, and no behavioral issues observed.';
    const wednesdayComment =
      'Individual participated in community ISS from 9:00–3:00 at local mall and low-cost arcade. Staff provided coaching on money management, appropriate boundaries, and self-advocacy (asking for assistance, making purchases). Individual required verbal prompts to remain on task, accepted redirection, and completed purchases with staff support. No health or safety concerns were noted.';
    const thursdayComment =
      'Individual attended ISS from 9:00–3:00 including bowling and bingo activities in the community. Staff supported group participation, turn-taking, and following multi-step directions. Individual demonstrated improved waiting skills and remained with group with minimal prompts. No incidents or injuries occurred and transportation to/from activities was completed safely.';
    const fridayComment =
      'Individual participated in ISS from 9:00–3:00 with activities at food pantry, Walmart, and Five Below. Staff supported community integration, functional shopping skills, and self-help tasks (identifying items, handling money, organizing purchases). Individual engaged with staff and peers, required prompts for staying with group and appropriate volume, and demonstrated progress toward PDP community-access goals. No adverse events occurred.';

    await queryRunner.query(
      `
      WITH weeks AS (
        SELECT
          generate_series(
            $1::date,
            $2::date,
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

        -- HEADER with weekly initials + notes baked in
        jsonb_build_object(
          'individualName',     tc.first_name || ' ' || tc.last_name,
          'date',               w.svc_date,
          'lon',                '5',
          'levelOfNeed',        5,
          'placeOfService',     'OFF_SITE',
          'provider',           'Ellis Works',
          'license',            '311123',
          'issProviderName',    'Ellis Works',
          'issProviderLicense', '311123',
          'staffNameTitle',     'ISS Direct Care Staff',
          'socialization',      $4::jsonb,
          'selfHelp',           $5::jsonb,
          'adaptive',           $6::jsonb,
          'implementation',     $7::jsonb,
          'community',          $8::jsonb,
          'notes',              jsonb_build_array(
            jsonb_build_object(
              'date',     w.svc_date,
              'initials', $9::text,
              'comment',  $10::text
            ),
            jsonb_build_object(
              'date',     w.svc_date + INTERVAL '1 day',
              'initials', $9::text,
              'comment',  $11::text
            ),
            jsonb_build_object(
              'date',     w.svc_date + INTERVAL '2 days',
              'initials', $9::text,
              'comment',  $12::text
            ),
            jsonb_build_object(
              'date',     w.svc_date + INTERVAL '3 days',
              'initials', $9::text,
              'comment',  $13::text
            ),
            jsonb_build_object(
              'date',     w.svc_date + INTERVAL '4 days',
              'initials', $9::text,
              'comment',  $14::text
            )
          )
        ) AS header,

        -- SERVICE WEEK (Mon–Fri, 9–3, off_site, 5 individuals, 1 staff)
        jsonb_build_object(
          'monday',   jsonb_build_array(
            jsonb_build_object(
              'date',              w.svc_date,
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          $15::jsonb ->> 'monday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'tuesday',  jsonb_build_array(
            jsonb_build_object(
              'date',              w.svc_date + INTERVAL '1 day',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          $15::jsonb ->> 'tuesday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'wednesday', jsonb_build_array(
            jsonb_build_object(
              'date',              w.svc_date + INTERVAL '2 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          $15::jsonb ->> 'wednesday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'thursday', jsonb_build_array(
            jsonb_build_object(
              'date',              w.svc_date + INTERVAL '3 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          $15::jsonb ->> 'thursday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'friday',   jsonb_build_array(
            jsonb_build_object(
              'date',              w.svc_date + INTERVAL '4 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          $15::jsonb ->> 'friday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          )
        ) AS service_week,

        '[]'::jsonb AS weekly_sections,
        '[]'::jsonb AS notes,
        now(),
        now()
      FROM weeks w
      CROSS JOIN target_consumers tc
      ON CONFLICT ("consumer_id", "service_date") DO NOTHING;
      `,
      [
        effectiveFrom,
        effectiveTo,
        issProviderId,
        JSON.stringify(socializationRows),
        JSON.stringify(selfHelpRows),
        JSON.stringify(adaptiveRows),
        JSON.stringify(implementationRows),
        JSON.stringify(communityRows),
        initials,
        mondayComment,
        tuesdayComment,
        wednesdayComment,
        thursdayComment,
        fridayComment,
        JSON.stringify(baseServiceWeek),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_consumer_iss_provider_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iss_staff_log_consumer_date";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iss_staff_log_service_date";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_iss_staff_log_consumer_id";`);

    await queryRunner.query(`DROP TABLE IF EXISTS "iss_staff_log";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "consumer";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "iss_provider";`);
  }
}
