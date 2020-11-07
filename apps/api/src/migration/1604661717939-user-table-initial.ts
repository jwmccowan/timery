import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTableInitial1604661717939 implements MigrationInterface {
  name = 'userTableInitial1604661717939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "user" (
          "id" uuid NOT NULL,
          "name" character varying NOT NULL,
          "email" character varying NOT NULL,
          "isActive" boolean NOT NULL DEFAULT true,
          CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
          PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
