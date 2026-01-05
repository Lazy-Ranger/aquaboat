import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UnauthorizedError } from "../errors";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      const unauthorizedError = new UnauthorizedError(err?.message);

      throw new UnauthorizedException(unauthorizedError);
    }
    return user;
  }
}
