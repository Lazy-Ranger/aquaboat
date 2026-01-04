import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { IUser } from "../../../user/contracts";
import { ILoggedInResponse } from "../../contracts";

@Injectable()
export class IssueTokensUseCase {
  constructor(private jwtService: JwtService) {}

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

  async execute(user: IUser): Promise<ILoggedInResponse> {
    const accessTokenPayload = this.createAccessTokenPayload(user);

    const idTokenPayload = this.createIdTokenPayload(user);

    const refreshToken = randomUUID();

    const jti = randomUUID();
    const iss = "https://nestjs.com";
    const aud = ["*"];

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

    return {
      accessToken,
      idToken,
      refreshToken
    };
  }
}
