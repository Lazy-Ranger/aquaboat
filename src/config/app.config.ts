import { registerAs } from "@nestjs/config";

export type AppEnv = "local" | "development" | "staging" | "production";

export interface AppConfig {
  "app.port": number;
  "app.env": AppEnv;
  "app.host": string;
  "app.isLocal": boolean;
  "app.isDev": boolean;
  "app.isStaging": boolean;
  "app.isProd": boolean;
}

export const getAppConfig = () => {
  const port = parseInt(process.env.APP_PORT || "3000");

  return {
    port,
    env: process.env.NODE_ENV || "local",
    host: process.env.APP_ENDPOINT || `http://localhost:${port}`,
    get isLocal() {
      return this.env === "local";
    },
    get isDev() {
      return this.env === "development";
    },
    get isStaging() {
      return this.env === "staging";
    },
    get isProd() {
      return this.env === "production";
    }
  };
};

export const APP_CONFIG = registerAs("app", getAppConfig);
