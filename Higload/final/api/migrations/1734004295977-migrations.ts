import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734004295977 implements MigrationInterface {
    name = 'Migrations1734004295977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "payment_method2" TO "payment_method"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "payment_method" TO "payment_method2"`);
    }

}
