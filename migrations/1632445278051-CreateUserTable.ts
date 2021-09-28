import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1632445278051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE "User" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" text NOT NULL UNIQUE,
        CONSTRAINT pk_user_id PRIMARY KEY ("id")
      );
      CREATE UNIQUE INDEX user_email_idx ON "User" (email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX user_email_idx;
      DROP TABLE "User";
    `);
  }
}
