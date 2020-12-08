import { MigrationInterface, QueryRunner } from 'typeorm';

export class BikeRentsAndRatings1607377636282 implements MigrationInterface {
  name = 'BikeRentsAndRatings1607377636282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bike_rent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "to" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "bikeId" uuid, "userId" uuid, CONSTRAINT "PK_db2499cf1c58787e622c87a5f7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bike_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" numeric NOT NULL DEFAULT '1', "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "bikeId" uuid, "userId" uuid, CONSTRAINT "PK_5da89e6b6ef3d03985886923d0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rent" ADD CONSTRAINT "FK_4afa54376e0b6f9fe0077ce73e1" FOREIGN KEY ("bikeId") REFERENCES "bike"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rent" ADD CONSTRAINT "FK_4b907fe1a01bcae05a0e6a7f353" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rating" ADD CONSTRAINT "FK_da7d3686746e82f379da82fb755" FOREIGN KEY ("bikeId") REFERENCES "bike"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rating" ADD CONSTRAINT "FK_6cde121e17d3b5277e8eb06aa55" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bike_rating" DROP CONSTRAINT "FK_6cde121e17d3b5277e8eb06aa55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rating" DROP CONSTRAINT "FK_da7d3686746e82f379da82fb755"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rent" DROP CONSTRAINT "FK_4b907fe1a01bcae05a0e6a7f353"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_rent" DROP CONSTRAINT "FK_4afa54376e0b6f9fe0077ce73e1"`,
    );
    await queryRunner.query(`DROP TABLE "bike_rating"`);
    await queryRunner.query(`DROP TABLE "bike_rent"`);
  }
}
