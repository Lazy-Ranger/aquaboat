import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoggedInResponse, UserSession } from "../../contracts";
import { User } from "../../domain/entities";

@Injectable()
export class GenerateToken {
  constructor(private jwtService: JwtService) {}

  toJWTToken(user: User): UserSession {
    return {
      _id: user.id,
      email: user.email,
      profile: {
        name: user.firstName,
        picture: user.picture
      }
    };
  }

  async execute(params: User): Promise<LoggedInResponse> {
    const jwtPayload = this.toJWTToken(params);

    const token = await this.jwtService.signAsync(jwtPayload);
    console.log(token);
    return {
      accessToken: token
    };
  }
}
