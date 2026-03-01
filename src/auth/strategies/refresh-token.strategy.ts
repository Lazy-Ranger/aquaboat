import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtConfig } from "../../config/jwt.config";
import { IUserRefreshTokenSession, IUserSession } from "../contracts";
import { Strategy as JwtStrategy } from "./strategies.constants";

@Injectable()
export class JwtRefreshAccessTokenStrategy extends PassportStrategy(
  Strategy,
  JwtStrategy.JWT_REFRESH_TOKEN
) {
  constructor(configService: ConfigService<JwtConfig>) {
    const secret = configService.getOrThrow("jwt.refreshTokenSecret");

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refreshToken
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: configService.getOrThrow("jwt.issuer"),
      audience: configService.getOrThrow("jwt.audience")
    });
  }

  async validate(payload: IUserSession): Promise<IUserRefreshTokenSession> {
    return payload;
  }
}
5;
