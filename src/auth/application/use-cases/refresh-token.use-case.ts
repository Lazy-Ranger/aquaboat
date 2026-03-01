import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { ILoggedInResponse } from "src/auth/contracts";
import { IRefreshTokenParams } from "src/auth/contracts/auth-params.types";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";
import { UnauthorizedError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
    private readonly jwtService: JwtService,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(params: IRefreshTokenParams): Promise<ILoggedInResponse> {
    const { refreshToken, user: userSession } = params;

    const user = await this.userService.findByEmail(userSession.email);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    const nowInSeconds = Date.now() / 1000;

    if (userSession.exp > nowInSeconds) {
      const ttl = userSession.exp - nowInSeconds;
      await this.cache.set(refreshToken, 1, Math.floor(ttl));
    }

    return this.issueTokensUseCase.execute(user);
  }
}
