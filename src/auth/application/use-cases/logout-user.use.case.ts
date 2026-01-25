import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { CACHE_SERVICE } from "../../../tokens";

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(token: string): Promise<boolean> {
    const user = this.jwtService.decode(token);
    const nowInSeconds = Date.now() / 1000;
    if (user.exp > nowInSeconds) {
      const ttl = user.exp - nowInSeconds;
      await this.cache.set(token, 1, ttl);
    }

    return true;
  }
}
