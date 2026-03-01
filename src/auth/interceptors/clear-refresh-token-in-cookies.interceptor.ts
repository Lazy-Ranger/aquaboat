import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class ClearRefreshTokenInCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        response.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          path: "/auth"
        });

        return data;
      })
    );
  }
}
