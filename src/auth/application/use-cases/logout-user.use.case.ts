import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { CACHE_TOKEN } from "../../../infra/cache/cache.token";

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_TOKEN) private readonly redis: Redis
  ) {}

  async execute(token: string): Promise<boolean> {
    const user = this.jwtService.decode(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (user.exp > nowInSeconds) {
      const ttl = user.exp - nowInSeconds;
      await this.redis.set(token, 1, "EX", ttl);
    }

    return true;
  }
}
