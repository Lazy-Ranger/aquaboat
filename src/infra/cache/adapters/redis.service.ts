import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { ICacheService } from "../../../application/ports/cache.port";
import { RedisConfig } from "../../../config/redis.config";

@Injectable()
export class RedisService implements ICacheService {
  private readonly redis: Redis;

  constructor(config: ConfigService<RedisConfig>) {
    const url = config.getOrThrow<string>("redis.url");
    this.redis = new Redis(url);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, "EX", ttl);
  }
}
