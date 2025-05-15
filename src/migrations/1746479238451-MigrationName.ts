import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1746479238451 implements MigrationInterface {
  name = "MigrationName1746479238451";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "firstName" character varying, "lastName" character varying, "avatar" character varying, "isVerified" boolean NOT NULL DEFAULT false, "googleId" character varying, "facebookId" character varying, "githubId" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "xpReward" integer NOT NULL, "requirements" jsonb NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "userProgress" jsonb NOT NULL DEFAULT '{}', "tags" text array NOT NULL DEFAULT '{}', "requiredLevel" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a037497017b64f530fe09c75364" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "date" TIMESTAMP NOT NULL, "location" character varying NOT NULL, "coordinates" jsonb, "isPrivate" boolean NOT NULL DEFAULT false, "minLevel" integer NOT NULL DEFAULT '0', "maxAttendees" integer NOT NULL DEFAULT '0', "ticketTypes" jsonb, "imageUrls" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auctions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startingPrice" numeric(10,2) NOT NULL, "reservePrice" numeric(10,2), "currentPrice" numeric(10,2), "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "winnerId" character varying, "bids" jsonb NOT NULL DEFAULT '[]', "isInstantBuyEnabled" boolean NOT NULL DEFAULT false, "instantBuyPrice" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ticketId" uuid, CONSTRAINT "REL_fe6306cfdf68911c1cc945e578" UNIQUE ("ticketId"), CONSTRAINT "PK_87d2b34d4829f0519a5c5570368" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticketTypeId" character varying NOT NULL, "ticketData" jsonb NOT NULL, "encryptedData" text NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "usedAt" TIMESTAMP, "transferredFrom" character varying, "isTransferable" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "metadata" jsonb, "eventId" uuid, CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_quests" ("questsId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_250d2d9e7440bc6738e24ac3c3c" PRIMARY KEY ("questsId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0de695a6a9bcef83ccd1d1daa8" ON "user_quests" ("questsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f489a5a5d968cfb35e44815fbd" ON "user_quests" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "event_coordinators" ("eventsId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_69aaa6dd782e473fff4ca77693e" PRIMARY KEY ("eventsId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0de67d7f643615271aeab63490" ON "event_coordinators" ("eventsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7fc2f12f7335c98694002934c" ON "event_coordinators" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" ADD CONSTRAINT "FK_fe6306cfdf68911c1cc945e5787" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_8a101375d173c39a7c1d02c9d7d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quests" ADD CONSTRAINT "FK_0de695a6a9bcef83ccd1d1daa81" FOREIGN KEY ("questsId") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quests" ADD CONSTRAINT "FK_f489a5a5d968cfb35e44815fbd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_coordinators" ADD CONSTRAINT "FK_0de67d7f643615271aeab634908" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_coordinators" ADD CONSTRAINT "FK_f7fc2f12f7335c98694002934c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_coordinators" DROP CONSTRAINT "FK_f7fc2f12f7335c98694002934c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_coordinators" DROP CONSTRAINT "FK_0de67d7f643615271aeab634908"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quests" DROP CONSTRAINT "FK_f489a5a5d968cfb35e44815fbd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quests" DROP CONSTRAINT "FK_0de695a6a9bcef83ccd1d1daa81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_8a101375d173c39a7c1d02c9d7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctions" DROP CONSTRAINT "FK_fe6306cfdf68911c1cc945e5787"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7fc2f12f7335c98694002934c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0de67d7f643615271aeab63490"`,
    );
    await queryRunner.query(`DROP TABLE "event_coordinators"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f489a5a5d968cfb35e44815fbd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0de695a6a9bcef83ccd1d1daa8"`,
    );
    await queryRunner.query(`DROP TABLE "user_quests"`);
    await queryRunner.query(`DROP TABLE "tickets"`);
    await queryRunner.query(`DROP TABLE "auctions"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "quests"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
