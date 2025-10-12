import { registerAs } from "@nestjs/config";

export type AppEnv = "local" | "development" | "staging" | "production";

export interface AppConfig {
  "app.port": number;
  "app.env": AppEnv;
}

export const APP_CONFIG = registerAs("app", () => {
  const port = parseInt(process.env.APP_PORT || "3000");

  return {
    port,
    env: process.env.NODE_ENV || "local",
  };
});
