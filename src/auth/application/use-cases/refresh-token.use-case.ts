import { Inject, Injectable } from "@nestjs/common";
import { ICacheService } from "src/application/ports/cache.port";
import { ILoggedInResponse } from "src/auth/contracts";
import { IRefreshTokenParams } from "src/auth/contracts/auth-params.types";
import { IPrincipal } from "src/common/interfaces";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";
import { UnauthorizedError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(
    principal: IPrincipal,
    params: IRefreshTokenParams
  ): Promise<ILoggedInResponse> {
    const { refreshToken } = params;

    const claim = principal.claim;

    const user = await this.userService.findByEmail(claim.email);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    const nowInSeconds = Date.now() / 1000;

    if (claim.exp > nowInSeconds) {
      const ttl = claim.exp - nowInSeconds;
      await this.cache.set(refreshToken, 1, Math.floor(ttl));
    }

    return this.issueTokensUseCase.execute({
      user,
      clientRequestInfo: params.clientRequestInfo
    });
  }
}
