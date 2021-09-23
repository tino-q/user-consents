import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1632388241609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "User" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" text NOT NULL,
        CONSTRAINT pk_user_id_email PRIMARY KEY ("id", "email")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "User";`);
  }
}
