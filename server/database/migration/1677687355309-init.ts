import {MigrationInterface, QueryRunner} from "typeorm";

export class init1677687355309 implements MigrationInterface {
    name = 'init1677687355309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tools" (
                "id" SERIAL NOT NULL,
                "status" integer NOT NULL DEFAULT '1',
                "name_tc" character varying(255) NOT NULL,
                "name_jp" character varying(255) NOT NULL,
                "description_tc" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_e23d56734caad471277bad8bf85" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "tools"
        `);
    }

}
