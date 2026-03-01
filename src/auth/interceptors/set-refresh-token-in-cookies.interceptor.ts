import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ms from "ms";
import { StringValue } from "ms";
import { Observable, tap } from "rxjs";
import { JwtConfig } from "../../config/jwt.config";

@Injectable()
export class SetRefreshTokenInCookiesInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService<JwtConfig>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const refreshTokenExpireTime = ms(
      this.config.getOrThrow<StringValue>("jwt.refreshTokenExpireTime")
    );

    return next.handle().pipe(
      tap((result) => {
        const { refreshToken } = result;
        if (refreshToken) {
          response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: refreshTokenExpireTime,
            path: "/auth"
          });
        }
      })
    );
  }
}
