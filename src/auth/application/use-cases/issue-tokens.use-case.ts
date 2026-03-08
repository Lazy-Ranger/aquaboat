import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { StringValue } from "ms";
import { JwtConfig } from "../../../config/jwt.config";
import { IUser } from "../../../user/contracts";
import {
  IIssueTokensParams,
  IJwtAccessTokenPayload,
  IJwtIdTokenPayload,
  IJwtRefreshTokenPayload,
  ILoggedInResponse
} from "../../contracts";

@Injectable()
export class IssueTokensUseCase {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService<JwtConfig>
  ) {}

  private createAccessTokenPayload(user: IUser): IJwtAccessTokenPayload {
    return {
      sub: user.id,
      email: user.email
    };
  }

  private createIdTokenPayload(user: IUser): IJwtIdTokenPayload {
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

  private createRefreshTokenPayload(user: IUser): IJwtRefreshTokenPayload {
    return {
      sub: user.id,
      email: user.email
    };
  }

  async execute(params: IIssueTokensParams): Promise<ILoggedInResponse> {
    const { user, clientRequestInfo } = params;

    const accessTokenPayload = this.createAccessTokenPayload(user);

    const idTokenPayload = this.createIdTokenPayload(user);

    const refreshTokenPayload = this.createRefreshTokenPayload(user);

    const jti = randomUUID();
    const iss = this.config.getOrThrow<string>("jwt.issuer");
    const aud = this.config.getOrThrow<string[]>("jwt.audience");

    const accessTokenSecret = this.config.getOrThrow<string>(
      "jwt.accessTokenSecret"
    );
    const accessTokenExpireTime = this.config.getOrThrow<StringValue>(
      "jwt.accessTokenExpireTime"
    );

    const refreshTokenSecret = this.config.getOrThrow<string>(
      "jwt.refreshTokenSecret"
    );
    const refreshTokenExpireTime = this.config.getOrThrow<StringValue>(
      "jwt.refreshTokenExpireTime"
    );

    const accessToken = await this.jwtService.signAsync(
      {
        ...accessTokenPayload,
        jti,
        iss,
        aud
      },
      {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpireTime
      }
    );

    const idToken = await this.jwtService.signAsync(
      {
        ...idTokenPayload,
        jti,
        iss,
        aud
      },
      {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpireTime
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        ...refreshTokenPayload,
        jti,
        iss,
        aud
      },
      {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpireTime
      }
    );

    return {
      accessToken,
      idToken,
      refreshToken
    };
  }
}
