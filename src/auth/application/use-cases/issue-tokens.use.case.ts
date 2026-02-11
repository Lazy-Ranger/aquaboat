import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { JwtConfig } from "src/config/jwt.config";
import { IUser } from "../../../user/contracts";
import { ILoggedInResponse } from "../../contracts";

@Injectable()
export class IssueTokensUseCase {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService<JwtConfig>
  ) {}

  private createAccessTokenPayload(user: IUser) {
    return {
      sub: user.id,
      email: user.email
    };
  }

  private createIdTokenPayload(user: IUser) {
    return {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      picture: user.picture,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender
    };
  }

  private createRefreshTokenPayload(user: IUser) {
    return {
      sub: user.id,
      email: user.email
    };
  }

  async execute(user: IUser): Promise<ILoggedInResponse> {
    const accessTokenPayload = this.createAccessTokenPayload(user);

    const idTokenPayload = this.createIdTokenPayload(user);

    const refreshTokenPayload = this.createRefreshTokenPayload(user);

    const jti = randomUUID();
    const iss = this.config.getOrThrow<string>("jwt.issuer");
    const aud = this.config.getOrThrow<string[]>("jwt.audience");

    const accessToken = await this.jwtService.signAsync({
      ...accessTokenPayload,
      jti,
      iss,
      aud
    });

    const idToken = await this.jwtService.signAsync({
      ...idTokenPayload,
      jti,
      iss,
      aud
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        ...refreshTokenPayload,
        jti,
        iss,
        aud
      },
      {
        expiresIn: "7d"
      }
    );

    return {
      accessToken,
      idToken,
      refreshToken
    };
  }
}
