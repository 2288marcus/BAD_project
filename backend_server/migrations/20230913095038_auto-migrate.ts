import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("game", (table) => {
    table
      .enum("mode", ["1Minute", "5Cup", "Practive", "Challenge"])
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("game", (table) => {
    table.dropColumn("mode");
  });
}
