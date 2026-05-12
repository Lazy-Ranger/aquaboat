import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { IUserLogoutParams } from "src/auth/contracts";
import { IPrincipal } from "src/common/interfaces";
import { JwtConfig } from "../../../config/jwt.config";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService<JwtConfig>,
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
    const jti = accessTokenData.jti;
    const user = await this.userService.findByEmail(accessTokenData.email);

    if (!user) {
      throw new Error("User not found.");
    }

    const cacheKey = user.id;
    const revokedKey = `revoked_${accessTokenData.jti}`;

    const isDataExists = await this.cache.get(cacheKey);

    if (isDataExists) {
      const sessions = JSON.parse(isDataExists)?.filter(
        (data) => Object.keys(data)[0] !== jti
      );
      await this.cache.set(cacheKey, JSON.stringify(sessions));
    }
    const nowInSeconds = Date.now() / 1000;

    const ttl = Math.floor(refreshTokenData.exp - nowInSeconds);

    await this.cache.set(
      revokedKey,
      JSON.stringify([accessToken, refreshToken]),
      ttl
    );

    return true;
  }
}
