import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnforceLocationCapacity1800000000008 implements MigrationInterface {
  name = 'EnforceLocationCapacity1800000000008';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE OR REPLACE FUNCTION enforce_location_capacity()
      RETURNS TRIGGER AS $$
      DECLARE
        cap INT;
        cnt INT;
      BEGIN
        IF NEW."locationId" IS NULL THEN
          RETURN NEW;
        END IF;

        SELECT capacity INTO cap
        FROM locations
        WHERE id = NEW."locationId";

        IF cap IS NULL THEN
          RETURN NEW;
        END IF;

        SELECT COUNT(*) INTO cnt
        FROM consumers c
        WHERE c."locationId" = NEW."locationId"
          AND c.active = true
          AND (TG_OP <> 'UPDATE' OR c.id <> NEW.id);

        IF cnt >= cap THEN
          RAISE EXCEPTION 'Location % is at capacity (%).', NEW."locationId", cap
            USING ERRCODE = '23514';
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await q.query(`DROP TRIGGER IF EXISTS trg_enforce_location_capacity ON consumers;`);
    await q.query(`
      CREATE TRIGGER trg_enforce_location_capacity
      BEFORE INSERT OR UPDATE OF "locationId", active ON consumers
      FOR EACH ROW EXECUTE PROCEDURE enforce_location_capacity();
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TRIGGER IF EXISTS trg_enforce_location_capacity ON consumers;`);
    await q.query(`DROP FUNCTION IF EXISTS enforce_location_capacity;`);
  }
}
