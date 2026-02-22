import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ICacheService } from "../../application/ports/cache.port";
import { CACHE_SERVICE } from "../../tokens";
import { UnauthorizedError } from "../errors";
import { Strategy } from "../strategies/strategies.constants";

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(
  Strategy.JWT_REFRESH_TOKEN
) {
  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const token = request?.cookies?.refreshToken;

    const isTokenRevoked = await this.cache.exists(token);

    if (isTokenRevoked !== 0) {
      throw new UnauthorizedException(
        new UnauthorizedError("Token is expired")
      );
    }

    return true;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.log("Error in JWT Refresh Token Guard:", err, info);
      const unauthorizedError = new UnauthorizedError(err?.message);

      throw new UnauthorizedException(unauthorizedError);
    }
    return user;
  }
}
