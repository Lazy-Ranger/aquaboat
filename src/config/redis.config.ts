import { registerAs } from "@nestjs/config";

export interface CacheConfig {
  "redis.url": number;
}

export const CACHE_CONFIG = registerAs("redis", () => {
  const url = process.env.REDIS_URL || "127.0.0.1:6379";
  return {
    url: url
  };
});
