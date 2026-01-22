import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtConfig } from "../../config/jwt.config";
import { IUserSession } from "../contracts";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<JwtConfig>) {
    const secret = configService.getOrThrow("jwt.secret");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: configService.getOrThrow("jwt.issuer"),
      audience: configService.getOrThrow("jwt.audience")
    });
  }

  async validate(payload: IUserSession): Promise<IUserSession> {
    return { ...payload };
  }
}
