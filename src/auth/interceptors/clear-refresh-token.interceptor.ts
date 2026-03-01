import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { RefreshTokenService } from "../application/services/refresh-token.service";

@Injectable()
export class ClearRefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(tap(() => this.refreshTokenService.clearRefreshToken(response)));
  }
}
