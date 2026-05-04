import {MigrationInterface, QueryRunner} from "typeorm";

export class addTable1678385215490 implements MigrationInterface {
    name = 'addTable1678385215490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "movies" (
                "id" SERIAL NOT NULL,
                "status" integer NOT NULL DEFAULT '1',
                "publish_date" character varying(255),
                "name_tc" character varying(255) NOT NULL,
                "name_jp" character varying(255),
                "description_tc" character varying(255),
                "description_jp" character varying(255),
                "image_url" character varying(500),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_bdc19e5c6bd2e5ad705723c185c" UNIQUE ("name_tc"),
                CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "movies"
        `);
    }

}
