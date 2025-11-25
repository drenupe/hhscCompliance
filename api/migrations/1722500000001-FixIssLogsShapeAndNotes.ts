import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixIssLogsShapeAndNotes1722500000001
  implements MigrationInterface
{
  name = 'FixIssLogsShapeAndNotes1722500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const initials = 'AM';

    // Weekly initials rows (match Angular form)
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

    // Your five billable comments (Mon–Fri), verbatim
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

    // Transform existing "string serviceWeek + empty notes" rows
    // into nested day-objects + header.weekly initials + billable notes.
    await queryRunner.query(
      `
      UPDATE "iss_staff_log" AS log
      SET
        -- 1) Enrich HEADER with weekly initials + billable notes
        "header" =
          coalesce(log."header", '{}'::jsonb) ||
          jsonb_build_object(
            'socialization',  $1::jsonb,
            'selfHelp',       $2::jsonb,
            'adaptive',       $3::jsonb,
            'implementation', $4::jsonb,
            'community',      $5::jsonb,
            'notes',          jsonb_build_array(
              jsonb_build_object(
                'date',     log.service_date,
                'initials', $6::text,
                'comment',  $7::text
              ),
              jsonb_build_object(
                'date',     log.service_date + INTERVAL '1 day',
                'initials', $6::text,
                'comment',  $8::text
              ),
              jsonb_build_object(
                'date',     log.service_date + INTERVAL '2 days',
                'initials', $6::text,
                'comment',  $9::text
              ),
              jsonb_build_object(
                'date',     log.service_date + INTERVAL '3 days',
                'initials', $6::text,
                'comment',  $10::text
              ),
              jsonb_build_object(
                'date',     log.service_date + INTERVAL '4 days',
                'initials', $6::text,
                'comment',  $11::text
              )
            )
          ),

        -- 2) Rewrite service_week from simple strings → full day objects
        "service_week" = jsonb_build_object(
          'monday',   jsonb_build_array(
            jsonb_build_object(
              'date',              log.service_date,
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          log."service_week"->>'monday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'tuesday',  jsonb_build_array(
            jsonb_build_object(
              'date',              log.service_date + INTERVAL '1 day',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          log."service_week"->>'tuesday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'wednesday', jsonb_build_array(
            jsonb_build_object(
              'date',              log.service_date + INTERVAL '2 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          log."service_week"->>'wednesday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'thursday', jsonb_build_array(
            jsonb_build_object(
              'date',              log.service_date + INTERVAL '3 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          log."service_week"->>'thursday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          ),
          'friday',   jsonb_build_array(
            jsonb_build_object(
              'date',              log.service_date + INTERVAL '4 days',
              'providerName',      'Andre McCaskill',
              'providerSignature', 'Andre McCaskill',
              'start',             '09:00',
              'end',               '15:00',
              'minutes',           360,
              'setting',           'off_site',
              'individualsCount',  5,
              'staffCount',        1,
              'activity',          log."service_week"->>'friday',
              'timeIn',            '09:00',
              'timeOut',           '15:00',
              'notes',             null
            )
          )
        ),

        -- 3) Keep the separate "notes" column as empty array; you are using header.notes in the app.
        "notes" = '[]'::jsonb

      FROM "consumer" c
      WHERE log."consumer_id" = c."id"
        AND (c."first_name", c."last_name") IN (
          ('Chris', 'Brown'),
          ('Paul', 'Sipes'),
          ('James', 'Harris'),
          ('Roy',   'Lemmond'),
          ('Stephanie', 'Trujillo')
        )
        -- Only touch rows that still have the old simple string service_week
        AND jsonb_typeof(log."service_week"->'monday') = 'string';
      `,
      [
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
      ],
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // No-op: we’re not trying to re-create the old broken shape.
    return;
  }
}
