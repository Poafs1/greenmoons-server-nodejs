import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovieFavorite1696674866370 implements MigrationInterface {
  name = 'MovieFavorite1696674866370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_favorite" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "movie_id" integer NOT NULL, "user_id" character varying NOT NULL, "is_favorite" boolean NOT NULL, CONSTRAINT "PK_ad4d40fd1fba4f23df86f56dda3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb531f8fe123f00f9c45026a3f" ON "movie_favorite" ("movie_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_62a895dbc7d5b4b6f23e7adeb9" ON "movie_favorite" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "movie_favorite" ADD CONSTRAINT "FK_62a895dbc7d5b4b6f23e7adeb9c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_favorite" DROP CONSTRAINT "FK_62a895dbc7d5b4b6f23e7adeb9c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_62a895dbc7d5b4b6f23e7adeb9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fb531f8fe123f00f9c45026a3f"`);
    await queryRunner.query(`DROP TABLE "movie_favorite"`);
  }
}
