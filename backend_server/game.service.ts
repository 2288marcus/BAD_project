import { Knex } from "knex";

export class GameService {
  constructor(private knex: Knex) {}
  async gameRank() {
    try {
      let result = await this.knex.raw(
        ` select * from game_record join game on game.id=game_record.game_id where mode='5Cup' order by user_score desc limit 10 ;`
      );
      let fiveCupdata = result.rows;

      let result2 = await this.knex.raw(
        ` select * from game_record join game on game.id=game_record.game_id where mode='1Minute' order by user_score desc limit 10 ;`
      );
      let oneMinuteData = result2.rows;

      return { fiveCupdata, oneMinuteData };
    } catch (error) {
      console.log(error);
    }
  }

  async gameResult() {
    try {
      let result = await this.knex.raw(
        ` INSERT * into game_record join game on game.id=game_record.game_id where mode='5Cup' order by user_score ;`
        //game_id, username, score
      );
      let fiveCupdata = result.rows;

      let result2 = await this.knex.raw(
        ` INSERT * into game_record join game on game.id=game_record.game_id where mode='1Minute' order by user_score ;`
        //game_id, username, time_spending
      );
      let oneMinuteData = result2.rows;

      return { fiveCupdata, oneMinuteData };
    } catch (error) {
      console.log(error);
    }
  }
}