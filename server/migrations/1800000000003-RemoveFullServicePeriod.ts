import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveFullServicePeriod1800000000003 implements MigrationInterface {
  name = 'RemoveFullServicePeriod1800000000003';

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
      )
      UPDATE iss_staff_log l
      SET
        header = jsonb_set(
          l.header,
          '{notes}',
          (
            SELECT COALESCE(
              jsonb_agg(
                CASE
                  WHEN (n.elem ? 'comment') THEN
                    jsonb_set(
                      n.elem,
                      '{comment}',
                      to_jsonb(
                        /* 1) remove phrase (case-insensitive)
                           2) collapse double spaces
                           3) trim spaces around punctuation artifacts */
                        btrim(
                          regexp_replace(
                            regexp_replace(
                              regexp_replace(
                                (n.elem->>'comment'),
                                '\\mfor\\s+the\\s+full\\s+service\\s+period\\M',
                                '',
                                'gi'
                              ),
                              '\\s{2,}',
                              ' ',
                              'g'
                            ),
                            '\\s+([\\.,;:])',
                            '\\1',
                            'g'
                          )
                        )
                      ),
                      true
                    )
                  ELSE n.elem
                END
              ORDER BY n.ord
              ),
              '[]'::jsonb
            )
            FROM jsonb_array_elements(COALESCE(l.header->'notes','[]'::jsonb)) WITH ORDINALITY AS n(elem, ord)
          ),
          true
        ),
        updated_at = now()
      WHERE l.iss_provider_id = (SELECT id FROM provider)
        AND l.consumer_id IN (SELECT consumer_id FROM target_consumers)
        AND l.service_date >= '2025-10-01'::date
        AND l.service_date <  '2026-01-01'::date
        AND (l.header->'notes') IS NOT NULL;
      `,
      ['311123'],
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op (text normalization)
  }
}
