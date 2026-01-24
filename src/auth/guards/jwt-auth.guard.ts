import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import Redis from "ioredis";
import { ExtractJwt } from "passport-jwt";
import { CACHE_TOKEN } from "../../infra/cache/cache.token";
import { UnauthorizedError } from "../errors";
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(@Inject(CACHE_TOKEN) private readonly redis: Redis) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request) as string;

    const isTokenFound = await this.redis.exists(token);
    if (isTokenFound != 0) {
      throw new UnauthorizedException(
        new UnauthorizedError("Token not found or expired")
      );
    }

    return true;

    // return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      const unauthorizedError = new UnauthorizedError(err?.message);

      throw new UnauthorizedException(unauthorizedError);
    }
    return user;
  }
}
