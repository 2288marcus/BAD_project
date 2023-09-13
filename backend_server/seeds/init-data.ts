import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("game").del();
  await knex("game_record").del();

  // Inserts seed entries
  let gameIds = await knex("game")
    .insert([
      { mode: "1Minute" },
      { mode: "5Cup" },
      { mode: "Practive" },
      { mode: "Challenge" },
    ])
    .returning("id");

  await knex("game_record").insert([
    { username: "Tevin", user_score: 100, game_id: gameIds[0].id },
    { username: "Marcus", user_score: 150, game_id: gameIds[1].id },
    { username: "Kasey", user_score: 200, game_id: gameIds[2].id },
  ]);
}
