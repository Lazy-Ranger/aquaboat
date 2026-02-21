import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { ICacheService } from "../../application/ports/cache.port";
import { CACHE_SERVICE } from "../../tokens";
import { UnauthorizedError } from "../errors";
import { Strategy } from "../strategies/strategies.constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard(Strategy.JWT_ACCESS_TOKEN) {
  constructor(@Inject(CACHE_SERVICE) private readonly cache: ICacheService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;

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
      const unauthorizedError = new UnauthorizedError(err?.message);

      throw new UnauthorizedException(unauthorizedError);
    }
    return user;
  }
}
