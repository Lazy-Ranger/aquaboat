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
    if (user.exp > Date.now()) {
      const diff = Math.abs(user.exp - Date.now());
      await this.redis.set(user.email, token, "EX", diff);
    }

    return false;
  }
}
