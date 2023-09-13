import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export const env = {
  NODE_ENV: "development",
  DB_HOST: "localhost",
  DB_PORT: 5432,
  DB_NAME: "m3project",
  DB_USERNAME: "USERNAME",
  DB_PASSWORD: "PASSWORD",
};

populateEnv(env, { mode: "halt" });
