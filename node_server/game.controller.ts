import { Request, Router } from "express";
import { GameService } from "./game.service";


export class GameController {
  router = Router();
  constructor(private gameService: GameService) {
    this.router.get("/gameRank", async (req, res, next) => {
      try {
        let json = await this.gameRank(req);
        res.json(json);
      } catch (error) {
        next(error);
      }
    });

    this.router.post("/gameResult", async (req, res, next) => {
      try {
        let json = await this.gameResult(req);
        res.json(json);
      } catch (error) {
        next(error);
      }
    });
  }

  async gameRank(req: Request) {
    let data = await this.gameService.gameRank();
    return data;
  }

  async gameResult(req: Request) {
    let { username, score } = req.query
    console.log({ username, score });
    if (!username || !score) {
      return {}
    }

    let data = await this.gameService.gameResult(username.toString(), +score);
    return data;
  }
}
////////////////////////////////////////////////////////////////////////////////
// json: http://localhost:8100/gameRank ?
////////////////////////////////////////////////////////////////////////////////
