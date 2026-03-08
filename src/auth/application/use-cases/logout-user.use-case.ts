import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { IUserLogoutParams } from "src/auth/contracts";
import { IPrincipal } from "src/common/interfaces";
import { CACHE_SERVICE } from "../../../tokens";

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(
    principal: IPrincipal,
    params: IUserLogoutParams
  ): Promise<boolean> {
    void principal;

    const { accessToken, refreshToken } = params;

    const accessTokenData = this.jwtService.decode(accessToken);
    const refreshTokenData = this.jwtService.decode(refreshToken) as {
      exp: number;
    };

    const nowInSeconds = Date.now() / 1000;

    if (accessTokenData.exp > nowInSeconds) {
      const ttl = refreshTokenData.exp - nowInSeconds;
      await this.cache.set(accessToken, 1, Math.floor(ttl));
    }

    if (refreshTokenData.exp > nowInSeconds) {
      const ttl = refreshTokenData.exp - nowInSeconds;
      await this.cache.set(refreshToken, 1, Math.floor(ttl));
    }

    return true;
  }
}
