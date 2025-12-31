import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { LoggedInResponse, UserSession } from "../../contracts";
import { User } from "../../domain/entities";

@Injectable()
export class GenerateToken {
  constructor(private jwtService: JwtService) {}

  toJWTTokenPayload(user: User): UserSession {
    return {
      _id: user.id,
      email: user.email,
      profile: {
        name: user.firstName,
        picture: user.picture
      }
    };
  }

  toIdToken(): string {
    return uuidv4();
  }

  toRefreshToken(): string {
    return uuidv4();
  }

  async execute(params: User): Promise<LoggedInResponse> {
    const jwtPayload = this.toJWTTokenPayload(params);
    const token = await this.jwtService.signAsync(jwtPayload);
    const idToken = this.toIdToken();
    const refreshToken = this.toRefreshToken();

    return {
      accessToken: token,
      idToken,
      refreshToken
    };
  }
}
