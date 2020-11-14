import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRefreshTokenToUserEntity1604997702864
  implements MigrationInterface {
  name = 'addRefreshTokenToUserEntity1604997702864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "currentRefreshTokenHash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "currentRefreshTokenHash"`,
    );
  }
}
