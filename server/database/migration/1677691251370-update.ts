import {MigrationInterface, QueryRunner} from "typeorm";

export class update1677691251370 implements MigrationInterface {
    name = 'update1677691251370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tools"
            ADD "description_jp" character varying(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ADD "image_url" character varying(500)
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_jp"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_tc" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_tc"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_jp" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools" DROP COLUMN "image_url"
        `);
        await queryRunner.query(`
            ALTER TABLE "tools" DROP COLUMN "description_jp"
        `);
    }

}
