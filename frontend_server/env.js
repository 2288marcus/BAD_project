import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export const env = {
  BACKEND_URL: "",
};

populateEnv(env, { mode: "halt" });
