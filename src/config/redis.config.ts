import { registerAs } from "@nestjs/config";

export interface RedisConfig {
  "redis.url": number;
}

export const REDIS_CONFIG = registerAs("redis", () => {
  const url = process.env.REDIS_URL || "127.0.0.1:6379";
  return {
    url: url
  };
});
