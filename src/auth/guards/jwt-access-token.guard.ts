import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { ICacheService } from "../../application/ports/cache.port";
import { CACHE_SERVICE } from "../../tokens";
import { SessionService } from "../application/services/session.service";
import { UnauthorizedError } from "../errors";
import { Strategy } from "../strategies/strategies.constants";

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard(Strategy.JWT_ACCESS_TOKEN) {
  constructor(
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
    private readonly sessionService: SessionService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest<Request>();
    const userAccessTokenClaim = request.user as Record<string, string>;

    const jti = `revoked_${userAccessTokenClaim?.jti}`;

    const isTokenRevoked = await this.cache.exists(jti);

    if (isTokenRevoked !== 0) {
      throw new UnauthorizedException(
        new UnauthorizedError("Token is expired")
      );
    }

    request.user = {
      id: userAccessTokenClaim.email,
      claim: userAccessTokenClaim
    };

    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      const unauthorizedError = new UnauthorizedError(err?.message);

      throw new UnauthorizedException(unauthorizedError);
    }
    return user;
  }
}
