import { MigrationInterface, QueryRunner } from 'typeorm';

export class BikesTable1607345487938 implements MigrationInterface {
  name = 'BikesTable1607345487938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bike" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "color" character varying NOT NULL, "location" character varying NOT NULL, "rating" integer NOT NULL DEFAULT '0', "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_e4a433f76768045f7a2efca66e2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bike"`);
  }
}
