import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Request, Response } from "express";
import * as ms from "ms";
import { StringValue } from "ms";
import { ICacheService } from "src/application/ports/cache.port";
import { CACHE_SERVICE } from "src/tokens";
import { AppConfig } from "../../../config/app.config";
import { JwtConfig } from "../../../config/jwt.config";
import { SessionService } from "./session.service";

@Injectable()
export class RefreshTokenService {
  private readonly refreshTokenCookieName: string;

  private readonly refreshTokenCookieOptions: CookieOptions;

  constructor(
    private readonly config: ConfigService<AppConfig & JwtConfig>,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
    private readonly sessionService: SessionService
  ) {
    const refreshTokenExpireTime = this.config.getOrThrow<StringValue>(
      "jwt.refreshTokenExpireTime"
    );

    this.refreshTokenCookieOptions = {
      httpOnly: true,
      secure: !this.config.getOrThrow<boolean>("app.isLocal"),
      sameSite: "strict" as const,
      maxAge: ms(refreshTokenExpireTime),
      path: "/auth"
    };

    this.refreshTokenCookieName = this.config.getOrThrow(
      "jwt.refreshTokenCookieName"
    );
  }

  public async isTokenRevoked(jti: string) {
    if (!jti) {
      return true;
    }

    return await this.sessionService.validate(jti);
  }

  public setRefreshToken(refreshToken: string, response: Response) {
    response.cookie(
      this.refreshTokenCookieName,
      refreshToken,
      this.refreshTokenCookieOptions
    );
  }

  public clearRefreshToken(response: Response) {
    response.cookie(
      this.refreshTokenCookieName,
      this.refreshTokenCookieOptions
    );
  }

  public extractFromCookie(request: Request): string | null {
    return request?.cookies?.[this.refreshTokenCookieName];
  }
}
