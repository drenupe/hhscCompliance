import { MigrationInterface, QueryRunner } from 'typeorm';

export class IssRotationOctDec20251800000000002 implements MigrationInterface {
  name = 'IssRotationOctDec20251800000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      ),
      base AS (
        SELECT
          l.id,
          l.service_date,
          (
            FLOOR(((l.service_date - DATE '2025-10-01')::int) / 7.0)::int % 13
          ) AS wk
        FROM iss_staff_log l
        WHERE l.iss_provider_id = (SELECT id FROM provider)
          AND l.consumer_id IN (SELECT consumer_id FROM target_consumers)
          AND l.service_date >= '2025-10-01'::date
          AND l.service_date <  '2026-01-01'::date
      )
      UPDATE iss_staff_log l
      SET
        header = jsonb_set(
          l.header,
          '{notes}',
          COALESCE(
            CASE base.wk

            /* =========================
               WEEK 0
               ========================= */
            WHEN 0 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff provided a structured routine with prompts for turn-taking, appropriate volume, and staying with the group during transitions. Individual remained engaged and demonstrated appropriate community behavior with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced waiting in line, following theater rules, and remaining seated as expected. Individual tolerated the environment well and interacted appropriately with peers.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task, waiting skills, and appropriate responses to game outcomes. Individual remained cooperative and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported lane etiquette, sportsmanship, and emotional regulation during transitions. Individual showed patience and appropriate group participation with no issues.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation training and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported route navigation, reading signage, maintaining personal space, and budgeting during purchases. Individual demonstrated progress toward independence and community-access goals with no adverse events.'
              )
            )

            /* =========================
               WEEK 1
               ========================= */
            WHEN 1 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff provided ongoing cues for appropriate voice level, turn-taking, and remaining with the group during movement through the venue. Individual stayed engaged and accepted redirection when needed without incident.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff reinforced appropriate community behavior including waiting appropriately, respecting shared space, and following posted theater expectations. Individual remained regulated and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported sustained attention, appropriate reactions, and respectful interaction with peers and community members during gameplay. Individual participated cooperatively and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff reinforced turn-taking and lane etiquette and supported coping skills during waiting periods. Individual demonstrated appropriate sportsmanship and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS using public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported community navigation, safety awareness, and budgeting while completing purchases and organizing items for transport. Individual remained with the group and demonstrated appropriate community behavior.'
              )
            )

            /* =========================
               WEEK 2
               ========================= */
            WHEN 2 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff used structured prompts to reinforce social communication, appropriate volume, and turn-taking during repeated activities. Individual remained engaged and transitioned with the group appropriately.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff supported appropriate waiting, following theater rules, and respectful use of shared space. Individual tolerated the environment and maintained appropriate behavior throughout.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff reinforced multi-step directions related to materials and gameplay and supported appropriate responses to outcomes. Individual remained cooperative with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported patience, turn-taking, and emotional regulation during waiting and transitions. Individual demonstrated safe participation and appropriate sportsmanship.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported route planning, reading signage, and budgeting at checkout. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 3
               ========================= */
            WHEN 3 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff reinforced coping with stimulation, waiting for turns, and respectful communication with staff and peers. Individual remained engaged and accepted redirection appropriately.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff supported decision-making related to seating/concessions, appropriate volume, and remaining seated as expected. Individual followed expectations with prompts and no behavioral concerns.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff provided prompts for attention to task, waiting appropriately, and respectful interaction. Individual participated cooperatively and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff reinforced lane etiquette, turn-taking, and coping skills during delays. Individual demonstrated safe participation with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS utilizing public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported community navigation, maintaining personal space, and organizing purchases for transport. Individual remained regulated and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 4
               ========================= */
            WHEN 4 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff structured activities to promote socialization, appropriate communication, and turn-taking across repeated rotations. Individual stayed engaged and maintained appropriate behavior.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced waiting skills, following venue rules, and respectful shared-space behavior. Individual tolerated the environment and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported multi-step directions and appropriate responses to winning/losing outcomes. Individual remained cooperative and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported emotional regulation and appropriate sportsmanship while practicing turn-taking. Individual demonstrated patience and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported route navigation, safety awareness, and budgeting skills during purchases. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 5
               ========================= */
            WHEN 5 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff provided prompts to support appropriate volume, waiting skills, and respectful communication during activity rotations. Individual remained engaged and transitioned safely with the group.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff reinforced community expectations including waiting appropriately and following posted theater rules. Individual tolerated the setting and followed directions with prompts.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task, appropriate reactions, and respectful interaction throughout gameplay. Individual participated cooperatively and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported lane etiquette, turn-taking, and coping strategies during waiting periods. Individual demonstrated appropriate sportsmanship and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS utilizing public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported reading signage, maintaining personal space, and budgeting at checkout. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 6
               ========================= */
            WHEN 6 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff implemented structured prompts for turn-taking, coping with stimulation, and respectful communication. Individual stayed engaged and demonstrated appropriate behavior with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced appropriate waiting, shared space skills, and following theater expectations. Individual tolerated the environment and maintained appropriate behavior throughout.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported multi-step directions and appropriate reactions to outcomes. Individual participated cooperatively and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff reinforced lane etiquette, sportsmanship, and emotional regulation during transitions. Individual demonstrated patience and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported route planning, safety skills, and budgeting while completing purchases. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 7
               ========================= */
            WHEN 7 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff supported appropriate communication, turn-taking, and staying with the group during transitions within the venue. Individual remained engaged and regulated with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff reinforced theater expectations, appropriate volume, and remaining seated as required. Individual followed directions with prompts and no behavioral concerns were observed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task, waiting appropriately, and respectful interaction with peers/community members. Individual participated cooperatively and completed the activity safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported turn-taking, lane etiquette, and coping skills during waiting periods. Individual demonstrated appropriate sportsmanship and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS using public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported community navigation, reading signage, and budgeting at checkout. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 8
               ========================= */
            WHEN 8 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff used structured activity rotations to reinforce waiting skills, turn-taking, and coping with stimulation. Individual remained engaged and demonstrated appropriate community behavior throughout.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced appropriate community behavior including waiting appropriately, following theater rules, and maintaining acceptable volume. Individual tolerated the environment and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported sustained attention, multi-step directions, and appropriate reactions to outcomes. Individual participated cooperatively and completed the outing safely with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported lane etiquette, turn-taking, and emotional regulation during transitions. Individual demonstrated patience, stamina, and safe participation with no concerns.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported navigation and safety skills and reinforced budgeting and checkout routines. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 9
               ========================= */
            WHEN 9 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff reinforced respectful communication and turn-taking during repeated activity participation. Individual remained engaged, accepted redirection as needed, and demonstrated appropriate community behavior.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff supported appropriate community behavior including waiting in line, maintaining appropriate volume, and following posted rules. Individual tolerated the setting well and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task, waiting appropriately, and responding appropriately to outcomes. Individual participated cooperatively and completed the outing safely with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff reinforced lane etiquette, cooperative participation, and emotional regulation during waiting and transitions. Individual demonstrated appropriate sportsmanship and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS using public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported route navigation, safety awareness, and budgeting during purchases and organization for transport. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 10
               ========================= */
            WHEN 10 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff supported coping with stimulation, waiting for turns, and appropriate communication with peers and staff. Individual remained engaged and demonstrated appropriate community behavior with no concerns.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced waiting appropriately, following theater rules, and remaining seated as expected. Individual tolerated the environment well and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported multi-step directions, attention to task, and appropriate reactions to game outcomes. Individual participated cooperatively and completed the outing safely.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported turn-taking, lane etiquette, and emotional regulation during transitions. Individual demonstrated patience and appropriate sportsmanship with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported reading signage, maintaining personal space, and budgeting at checkout. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 11
               ========================= */
            WHEN 11 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff reinforced appropriate volume, respectful communication, and turn-taking throughout activity rotations. Individual stayed engaged and transitioned with the group appropriately with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at AMC Lancaster, TX for the full service period. Staff supported appropriate community behavior including waiting in line, following posted rules, and remaining seated as expected. Individual tolerated the environment well and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported sustained attention, waiting skills, and appropriate responses to game outcomes. Individual participated cooperatively and completed the outing safely with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff supported lane etiquette and coping skills during waiting periods and transitions. Individual demonstrated appropriate sportsmanship and safe participation.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual engaged in community-based ISS using public transportation and shopping at Walmart and Dollar Tree for the full service period. Staff supported route navigation, safety awareness, and budgeting during purchases and organization for transport. Individual remained with the group and completed tasks safely.'
              )
            )

            /* =========================
               WEEK 12 (final week in rotation)
               ========================= */
            WHEN 12 THEN jsonb_build_array(
              jsonb_build_object(
                'date', l.service_date,
                'initials', COALESCE(l.header->'notes'->0->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Black Dog Retro Arcade (Arlington Highlands area) for the full service period. Staff supported community participation by reinforcing turn-taking, waiting appropriately, and respectful interaction. Individual remained engaged throughout the outing and demonstrated appropriate behavior with no safety concerns.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '1 day')::date,
                'initials', COALESCE(l.header->'notes'->1->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during a movie outing at AMC Lancaster, TX for the full service period. Staff reinforced appropriate community behavior including waiting appropriately, maintaining appropriate volume, and following theater rules. Individual tolerated the setting and followed directions with prompts as needed.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '2 day')::date,
                'initials', COALESCE(l.header->'notes'->2->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS at Bingo Hurst (Hurst, TX) for the full service period. Staff supported attention to task and multi-step directions and reinforced appropriate responses to outcomes. Individual participated cooperatively and completed the outing safely with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '3 day')::date,
                'initials', COALESCE(l.header->'notes'->3->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS during bowling in Duncanville (Main St area) for the full service period. Staff reinforced lane etiquette, emotional regulation, and appropriate sportsmanship during transitions and waiting periods. Individual demonstrated patience and safe participation with no incidents.'
              ),
              jsonb_build_object(
                'date', (l.service_date + INTERVAL '4 day')::date,
                'initials', COALESCE(l.header->'notes'->4->>'initials','AM'),
                'comment', 'Individual participated in community-based ISS focused on public transportation training and functional shopping at Walmart and Dollar Tree for the full service period. Staff supported navigation, safety skills, budgeting, and checkout routines. Individual remained with the group and demonstrated progress toward community-access goals with no adverse events.'
              )
            )

            ELSE (l.header->'notes')
            END,
            (l.header->'notes')
          ),
          true
        ),
        updated_at = now()
      FROM base
      WHERE l.id = base.id;
      `,
      ['311123'],
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op (data patch)
  }
}
