import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsentChangeEventTable1632697903203
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE consent AS ENUM ('sms_notifications', 'email_notifications');
      CREATE TABLE "UserConsentChangedEvent" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "enabled" boolean NOT NULL,
        "consent_id" consent NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT pk_UserConsentChangedEvent_id PRIMARY KEY ("id")
      );
      CREATE INDEX UserConsentChangedEvent_created_at_idx ON "UserConsentChangedEvent" (created_at);
      CREATE INDEX UserConsentChangedEvent_user_id_at_idx ON "UserConsentChangedEvent" (user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX UserConsentChangedEvent_user_id_at_idx;
      DROP INDEX UserConsentChangedEvent_created_at_idx;
      DROP TABLE "UserConsentChangedEvent";
      DROP TYPE consent;
    `);
  }
}
