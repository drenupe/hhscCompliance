import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuth1755747436628 implements MigrationInterface {
    name = 'InitAuth1755747436628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "login_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" citext, "ip" character varying(64), "succeeded" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_070e613c8f768b1a70742705c5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eacdd0de258a7f19e1a71a1b05" ON "login_attempts" ("ip", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_46dd77d64eb0ed0d65383ac4ed" ON "login_attempts" ("email", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_46dd77d64eb0ed0d65383ac4ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eacdd0de258a7f19e1a71a1b05"`);
        await queryRunner.query(`DROP TABLE "login_attempts"`);
    }

}
