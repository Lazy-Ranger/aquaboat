import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RefreshTokenService } from "../application/services/refresh-token.service";
import { UnauthorizedError } from "../errors";
import { Strategy } from "../strategies/strategies.constants";

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(
  Strategy.JWT_REFRESH_TOKEN
) {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const token = request?.cookies?.refreshToken;

    if (await this.refreshTokenService.isTokenRevoked(token)) {
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
