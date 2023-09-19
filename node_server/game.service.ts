import { Knex } from "knex";

export class GameService {
  constructor(private knex: Knex) {}
  async gameRank() {
    let result = await this.knex.raw(
      ` select * from game_record join game on game.id=game_record.game_id where mode='5Cup' order by user_score desc limit 10 ;`
    );
    let fiveCupdata = result.rows;

    let result2 = await this.knex.raw(
      ` select * from game_record join game on game.id=game_record.game_id where mode='1Minute' order by user_score desc limit 10 ;`
    );
    let oneMinuteData = result2.rows;

    return { fiveCupdata, oneMinuteData };
  }

  async gameResult(username: string, score: number) {
    let result = await this.knex("game_record").insert({
      username,
      user_score: score,
      game_id: 1,
    });

    return { result };
  }
}
