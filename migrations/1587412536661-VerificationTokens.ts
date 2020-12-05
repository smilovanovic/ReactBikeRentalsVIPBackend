import { MigrationInterface, QueryRunner } from 'typeorm';

export class VerificationTokens1587412536661 implements MigrationInterface {
  name = 'VerificationTokens1587412536661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "verification_token_type_enum" AS ENUM('email', 'reset_password')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "verification_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "verification_token_type_enum" NOT NULL DEFAULT 'email', "isUsed" boolean NOT NULL DEFAULT false, "token" character varying NOT NULL, "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP + (20 ||' minutes')::interval, "userId" uuid, CONSTRAINT "PK_74bc3066ea24f13f37d52a12c79" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_token" ADD CONSTRAINT "FK_0748c047a951e34c0b686bfadb2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_token" DROP CONSTRAINT "FK_0748c047a951e34c0b686bfadb2"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "verification_token"`, undefined);
    await queryRunner.query(
      `DROP TYPE "verification_token_type_enum"`,
      undefined,
    );
  }
}
