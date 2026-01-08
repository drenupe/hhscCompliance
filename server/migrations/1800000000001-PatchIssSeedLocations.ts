import { MigrationInterface, QueryRunner } from 'typeorm';

export class PatchIssSeedLocations1800000000001 implements MigrationInterface {
  name = 'PatchIssSeedLocations1800000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const baseServiceWeek = {
      monday:
        'Community outing at Black Dog Retro Arcade (Arlington Highlands area) focused on leisure skills, socialization, communication, and appropriate community behavior throughout the service period.',
      tuesday:
        'Community outing to the movies at AMC (Lancaster, TX) focused on social skills, following venue rules, decision-making, and appropriate behavior in a public entertainment setting.',
      wednesday:
        'Community outing for bingo at Bingo Hurst (Hurst, TX) focused on following directions, waiting skills, attention to task, and group participation throughout the service period.',
      thursday:
        'Community outing for bowling in Duncanville (Main St area) focused on turn-taking, following directions, stamina, and cooperative group participation throughout the service period.',
      friday:
        'Community outing using public transportation to complete functional shopping at Walmart and Dollar Tree focused on community navigation, safety skills, budgeting, and independence throughout the service period.',
    };

    const mondayComment =
      'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff facilitated a structured routine that included orientation to expectations, multiple activity rotations, and planned breaks to reinforce waiting skills, turn-taking, and coping with stimulation in a busy environment. Staff provided prompts for appropriate volume, respectful communication, and staying with the group during transitions. Individual remained engaged, accepted redirection when needed, and demonstrated appropriate community behavior with no incidents or safety concerns.';

    const tuesdayComment =
      'Individual participated in community-based ISS at a movie theater (AMC Lancaster, TX) for the full service period. Staff supported appropriate community behavior including waiting in line, maintaining appropriate volume, following theater rules, and remaining seated as expected. Staff reinforced social skills such as sharing space, responding appropriately to peers, and making choices related to concessions and seating. Breaks and transitions were used to review expectations and reinforce positive behavior. Individual tolerated the environment well, followed directions with prompts as needed, and no behavioral concerns were observed.';

    const wednesdayComment =
      'Individual participated in community-based ISS for bingo at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task, waiting skills, and following multi-step directions including obtaining materials, tracking game progression, and responding appropriately to outcomes. Staff provided prompts for appropriate reactions, respectful interaction with peers and community members, and staying engaged throughout the activity. Breaks were incorporated to support endurance and regulation. Individual demonstrated cooperative participation and completed the outing safely with no incidents.';

    const thursdayComment =
      'Individual participated in community-based ISS for bowling in Duncanville (Main St area) for the full service period. Staff facilitated repeated practice opportunities to reinforce turn-taking, following lane etiquette, and cooperative group participation. Staff provided prompts for emotional regulation, appropriate sportsmanship, and staying with the group during transitions between seating, lanes, and break areas. Individual demonstrated improved patience and stamina, participated appropriately throughout the day, and completed the activity safely with no injuries or incidents.';

    const fridayComment =
      'Individual participated in community-based ISS focused on public transportation training and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported community navigation and safety skills including route planning, reading signage, waiting appropriately, maintaining personal space, and remaining with the group during transitions. Staff reinforced budgeting, locating items, comparing choices, completing checkout routines, and organizing purchases for transport. Individual required occasional prompts to stay with the group and maintain appropriate behavior, engaged appropriately with staff and community members, and demonstrated progress toward independence and community-access goals with no adverse events.';

    await queryRunner.query(
      `
      WITH provider AS (
        SELECT id
        FROM iss_provider
        WHERE license_number = $1
        LIMIT 1
      ),
      target_consumers AS (
        SELECT c.id AS consumer_id
        FROM consumer c
        JOIN provider p ON p.id = c.iss_provider_id
        WHERE (c.first_name, c.last_name) IN (
          ('Chris','Brown'),
          ('Paul','Sipes'),
          ('James','Harris'),
          ('Roy','Lemmond'),
          ('Stephanie','Trujillo')
        )
      )
      UPDATE iss_staff_log l
      SET
        -- Update header.notes comments (Mon–Fri)
        header = jsonb_set(
          l.header,
          '{notes}',
          jsonb_build_array(
            jsonb_build_object(
              'date', l.service_date,
              'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
              'comment', $2::text
            ),
            jsonb_build_object(
              'date', (l.service_date + INTERVAL '1 day')::date,
              'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
              'comment', $3::text
            ),
            jsonb_build_object(
              'date', (l.service_date + INTERVAL '2 day')::date,
              'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
              'comment', $4::text
            ),
            jsonb_build_object(
              'date', (l.service_date + INTERVAL '3 day')::date,
              'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
              'comment', $5::text
            ),
            jsonb_build_object(
              'date', (l.service_date + INTERVAL '4 day')::date,
              'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
              'comment', $6::text
            )
          ),
          true
        ),

        -- Update service_week activity (supports both shapes: object OR array)
        service_week =
          CASE
            WHEN jsonb_typeof(l.service_week) = 'object' THEN
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    jsonb_set(
                      jsonb_set(
                        l.service_week,
                        '{monday,0,activity}'::text[],
                        to_jsonb($7::text),
                        true
                      ),
                      '{tuesday,0,activity}'::text[],
                      to_jsonb($8::text),
                      true
                    ),
                    '{wednesday,0,activity}'::text[],
                    to_jsonb($9::text),
                    true
                  ),
                  '{thursday,0,activity}'::text[],
                  to_jsonb($10::text),
                  true
                ),
                '{friday,0,activity}'::text[],
                to_jsonb($11::text),
                true
              )
            WHEN jsonb_typeof(l.service_week) = 'array' THEN
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    jsonb_set(
                      jsonb_set(
                        l.service_week,
                        '{0,0,activity}'::text[],
                        to_jsonb($7::text),
                        true
                      ),
                      '{1,0,activity}'::text[],
                      to_jsonb($8::text),
                      true
                    ),
                    '{2,0,activity}'::text[],
                    to_jsonb($9::text),
                    true
                  ),
                  '{3,0,activity}'::text[],
                  to_jsonb($10::text),
                  true
                ),
                '{4,0,activity}'::text[],
                to_jsonb($11::text),
                true
              )
            ELSE l.service_week
          END,

        updated_at = now()
      WHERE l.iss_provider_id = (SELECT id FROM provider)
        AND l.consumer_id IN (SELECT consumer_id FROM target_consumers)
        AND l.service_date >= '2025-09-29'::date
        AND l.service_date <  '2026-09-29'::date;
      `,
      [
        '311123',
        mondayComment,
        tuesdayComment,
        wednesdayComment,
        thursdayComment,
        fridayComment,
        baseServiceWeek.monday,
        baseServiceWeek.tuesday,
        baseServiceWeek.wednesday,
        baseServiceWeek.thursday,
        baseServiceWeek.friday,
      ],
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
