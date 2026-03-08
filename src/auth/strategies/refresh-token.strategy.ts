import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IHttpRequest } from "src/common/interfaces";
import { JwtConfig } from "../../config/jwt.config";
import { RefreshTokenService } from "../application/services/refresh-token.service";
import { IUserRefreshTokenClaim } from "../contracts";
import { Strategy as JwtStrategy } from "./strategies.constants";

@Injectable()
export class JwtRefreshAccessTokenStrategy extends PassportStrategy(
  Strategy,
  JwtStrategy.JWT_REFRESH_TOKEN
) {
  constructor(
    configService: ConfigService<JwtConfig>,
    private readonly refreshTokenService: RefreshTokenService
  ) {
    const secret = configService.getOrThrow("jwt.refreshTokenSecret");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: IHttpRequest) => this.refreshTokenService.extractFromCookie(req)
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: configService.getOrThrow("jwt.issuer"),
      audience: configService.getOrThrow("jwt.audience")
    });
  }

  async validate(
    payload: IUserRefreshTokenClaim
  ): Promise<IUserRefreshTokenClaim> {
    return payload;
  }
}
