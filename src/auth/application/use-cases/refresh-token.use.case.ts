import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ICacheService } from "src/application/ports/cache.port";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";
import { UnauthorizedError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use.case";

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
    private readonly jwtService: JwtService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(req: Request) {
    const token = (req as any).cookies?.refreshToken as string;
    const userEmail = this.jwtService.decode(token) as {
      email: string;
      exp: number;
    };
    const user = await this.userService.findByEmail(userEmail.email);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }
    const nowInSeconds = Date.now() / 1000;
    if (userEmail.exp > nowInSeconds) {
      const ttl = userEmail.exp - nowInSeconds;
      await this.cache.set(token, 1, Math.floor(ttl));
    }

    return this.issueTokensUseCase.execute(user);
  }
}
