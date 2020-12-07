import { MigrationInterface, QueryRunner } from 'typeorm';

export class BikeRatingsTable1607346871798 implements MigrationInterface {
  name = 'BikeRatingsTable1607346871798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bike_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL DEFAULT '0', "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "bikeId" uuid, CONSTRAINT "PK_5da89e6b6ef3d03985886923d0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rating" ADD CONSTRAINT "FK_da7d3686746e82f379da82fb755" FOREIGN KEY ("bikeId") REFERENCES "bike"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bike_rating" DROP CONSTRAINT "FK_da7d3686746e82f379da82fb755"`,
    );
    await queryRunner.query(`DROP TABLE "bike_rating"`);
  }
}
