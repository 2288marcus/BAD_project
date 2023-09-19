import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  let row = await knex("game").count("* as count").first();
  if (row!.count == 0) {
    await knex("game")
      .insert([
        { mode: "1Minute" },
        { mode: "5Cup" },
        { mode: "Practive" },
        { mode: "Challenge" },
      ])
      .returning("id");
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex("game").delete();
}
