import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("game_record", (table) => {
    table.setNullable("user_score");
    table.integer("time_spending").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("game_record", (table) => {
    table.dropColumn("time_spending");
    table.dropNullable("user_score");
  });
}
