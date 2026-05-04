import {MigrationInterface, QueryRunner} from "typeorm";

export class update1677689264943 implements MigrationInterface {
    name = 'update1677689264943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_jp" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "description_tc" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "description_tc"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "tools"
            ALTER COLUMN "name_jp"
            SET NOT NULL
        `);
    }

}
