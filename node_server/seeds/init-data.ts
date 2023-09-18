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

    { username: "player1", user_score: 90, game_id: gameIds[0].id },
    { username: "player2", user_score: 80, game_id: gameIds[0].id },
    { username: "player3", user_score: 70, game_id: gameIds[0].id },

    { username: "player4", user_score: 60, game_id: gameIds[0].id },
    { username: "player5", user_score: 50, game_id: gameIds[0].id },
    { username: "player6", user_score: 40, game_id: gameIds[0].id },

    { username: "player7", user_score: 30, game_id: gameIds[0].id },
    { username: "player8", user_score: 20, game_id: gameIds[0].id },
    { username: "player9", user_score: 10, game_id: gameIds[0].id },

    { username: "Tevin-t", time_spending: 100, game_id: gameIds[1].id },
    { username: "Marcus-t", time_spending: 150, game_id: gameIds[1].id },
    { username: "Kasey-t", time_spending: 200, game_id: gameIds[1].id },

    { username: "player1t", time_spending: 250, game_id: gameIds[1].id },
    { username: "player2t", time_spending: 301, game_id: gameIds[1].id },
    { username: "player3t", time_spending: 350, game_id: gameIds[1].id },

    { username: "player4t", time_spending: 400, game_id: gameIds[1].id },
    { username: "player5t", time_spending: 450, game_id: gameIds[1].id },
    { username: "player6t", time_spending: 500, game_id: gameIds[1].id },

    { username: "player7t", time_spending: 550, game_id: gameIds[1].id },
    { username: "player8t", time_spending: 600, game_id: gameIds[1].id },
    { username: "player9t", time_spending: 650, game_id: gameIds[1].id },
  ]);

  // Select data
  let result = await knex
    .select("username", "user_score", "game_id")
    .from("game_record");
}
