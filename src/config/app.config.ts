import { registerAs } from "@nestjs/config";

export type AppEnv = "local" | "development" | "staging" | "production";

export interface AppConfig {
  "app.port": number;
  "app.env": AppEnv;
  "app.host": string;
}

export const getAppConfig = () => {
  const port = parseInt(process.env.APP_PORT || "3000");

  return {
    port,
    env: process.env.NODE_ENV || "local",
    host: process.env.APP_ENDPOINT || `http://localhost:${port}`
  };
};

export const APP_CONFIG = registerAs("app", getAppConfig);
