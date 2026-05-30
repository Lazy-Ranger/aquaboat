import { Inject, Injectable } from "@nestjs/common";
import { ICacheService } from "src/application/ports/cache.port";
import { IssueTokenResponse } from "src/auth/contracts";
import { IRefreshTokenParams } from "src/auth/contracts/auth-params.types";
import { IPrincipal } from "src/common/interfaces";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";
import { UnauthorizedError } from "../../errors";
import { SessionService } from "../services/session.service";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
    private readonly sessionService: SessionService
  ) {}

  async execute(
    principal: IPrincipal,
    params: IRefreshTokenParams
  ): Promise<IssueTokenResponse> {
    const { jti } = params;

    const claim = principal.claim;
    const userId = principal.id;

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedError("User not found.");
    }

    const nowInSeconds = Date.now() / 1000;

    if (claim.exp > nowInSeconds) {
      await this.sessionService.destroy(jti, userId);
    }

    return await this.issueTokensUseCase.execute({
      user
    });
  }
}
