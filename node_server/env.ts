import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export const env = {
  NODE_ENV: "development",
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_NAME: "",
  DB_USERNAME: "",
  DB_PASSWORD: "",
  WEB_PORT: 8100,
};

populateEnv(env, { mode: "halt" });
