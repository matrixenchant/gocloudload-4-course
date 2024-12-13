import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734004273395 implements MigrationInterface {
    name = 'Migrations1734004273395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "payment_method" TO "payment_method2"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_method2"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_method" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_method2" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_method2"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_method2" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" RENAME COLUMN "payment_method2" TO "payment_method"`);
    }

}
