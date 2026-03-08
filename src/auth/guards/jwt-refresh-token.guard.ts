import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
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
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.refreshTokenService.extractFromCookie(request);

    if (!token || (await this.refreshTokenService.isTokenRevoked(token))) {
      throw new UnauthorizedException(
        new UnauthorizedError("Token is expired")
      );
    }

    const userRefreshTokenClaim = request.user; // decoded via passport

    request.user = {
      id: token,
      claim: userRefreshTokenClaim
    };

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
