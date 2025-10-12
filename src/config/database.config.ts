import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  "database.user": string;
  "database.password": string;
  "database.host": string;
  "database.db": string;
  "database.port": string;
  "database.url": string;
  "database.isLocal": boolean;
}

export const DATABASE_CONFIG = registerAs("database", () => {
  const userName = process.env.MONGO_DATABASE_USER;
  const password = process.env.MONGO_DATABASE_PASSWORD;
  const host = process.env.MONGO_DATABASE_HOST;
  const db = process.env.MONGO_DATABASE_NAME;
  const port = process.env.MONGO_DATABASE_PORT;

  return {
    user: userName,
    password,
    host,
    db,
    port,
    get url() {
      if (process.env["NODE_ENV"] === "local") {
        return {
          uri: `mongodb://localhost:27017/${db}`,
        };
      }

      return `mongodb+srv://${userName}:${password}@${host}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
    },
    get isLocal() {
      return process.env["DATABASE_HOST"]?.includes("localhost") ?? false;
    },
  };
});
