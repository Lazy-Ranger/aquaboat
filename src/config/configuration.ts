import { APP_CONFIG } from "./app.config";
import { BCRYPT_CONFIG } from "./bcrypt.config";
import { DATABASE_CONFIG } from "./database.config";
import { JWT_CONFIG } from "./jwt.config";
import { REDIS_CONFIG } from "./redis.config";

export default [
  APP_CONFIG,
  DATABASE_CONFIG,
  JWT_CONFIG,
  BCRYPT_CONFIG,
  REDIS_CONFIG
];
