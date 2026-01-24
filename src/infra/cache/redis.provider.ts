import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { CacheConfig } from "../../config/redis.config";
import { CACHE_TOKEN } from "./cache.token";

export const redisProvider = {
  provide: CACHE_TOKEN,
  useFactory: (configService: ConfigService<CacheConfig>) => {
    const url = configService.getOrThrow<string>("redis.url");
    return new Redis(url);
  },
  inject: [ConfigService]
};
