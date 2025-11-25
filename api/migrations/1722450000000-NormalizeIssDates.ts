import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeIssDates1722450000000 implements MigrationInterface {
  name = 'NormalizeIssDates1722450000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Normalize header.notes[*].date → 'YYYY-MM-DD' (as JSON string)
    await queryRunner.query(
      `
      UPDATE "iss_staff_log" AS log
      SET "header" = jsonb_set(
        coalesce(log."header", '{}'::jsonb),
        '{notes}',
        (
          SELECT jsonb_agg(
                   jsonb_set(
                     note,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (note->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."header"->'notes', '[]'::jsonb)
               ) AS note
        )
      )
      FROM "consumer" c
      WHERE log."consumer_id" = c."id"
        AND (c."first_name", c."last_name") IN (
          ('Chris', 'Brown'),
          ('Paul', 'Sipes'),
          ('James', 'Harris'),
          ('Roy',   'Lemmond'),
          ('Stephanie', 'Trujillo')
        )
        AND log."header" ? 'notes';
      `,
    );

    // 2) Normalize service_week.[day][*].date → 'YYYY-MM-DD' (as JSON string)
    await queryRunner.query(
      `
      UPDATE "iss_staff_log" AS log
      SET "service_week" = jsonb_build_object(
        'monday', (
          SELECT jsonb_agg(
                   jsonb_set(
                     day_elem,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (day_elem->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."service_week"->'monday', '[]'::jsonb)
               ) AS day_elem
        ),
        'tuesday', (
          SELECT jsonb_agg(
                   jsonb_set(
                     day_elem,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (day_elem->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."service_week"->'tuesday', '[]'::jsonb)
               ) AS day_elem
        ),
        'wednesday', (
          SELECT jsonb_agg(
                   jsonb_set(
                     day_elem,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (day_elem->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."service_week"->'wednesday', '[]'::jsonb)
               ) AS day_elem
        ),
        'thursday', (
          SELECT jsonb_agg(
                   jsonb_set(
                     day_elem,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (day_elem->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."service_week"->'thursday', '[]'::jsonb)
               ) AS day_elem
        ),
        'friday', (
          SELECT jsonb_agg(
                   jsonb_set(
                     day_elem,
                     '{date}',
                     to_jsonb(
                       to_char(
                         (day_elem->>'date')::timestamp,
                         'YYYY-MM-DD'
                       )
                     )
                   )
                 )
          FROM jsonb_array_elements(
                 coalesce(log."service_week"->'friday', '[]'::jsonb)
               ) AS day_elem
        )
      )
      FROM "consumer" c
      WHERE log."consumer_id" = c."id"
        AND (c."first_name", c."last_name") IN (
          ('Chris', 'Brown'),
          ('Paul', 'Sipes'),
          ('James', 'Harris'),
          ('Roy',   'Lemmond'),
          ('Stephanie', 'Trujillo')
        )
        AND jsonb_typeof(log."service_week") = 'object';
      `,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op: normalization-only
  }
}
