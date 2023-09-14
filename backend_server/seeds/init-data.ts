import knex, { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("game_record").del();
  await knex("game").del();

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
    { username: "Marcus", user_score: 150, game_id: gameIds[0].id },
    { username: "Kasey", user_score: 200, game_id: gameIds[0].id },
    { username: "Tevin-t", time_spending: 100, game_id: gameIds[1].id },
    { username: "Marcus-t", time_spending: 150, game_id: gameIds[1].id },
    { username: "Kasey-t", time_spending: 200, game_id: gameIds[1].id },
  ]);

  // Select data
  let result = await knex
    .select("username", "user_score", "game_id")
    .from("game_record");
}
