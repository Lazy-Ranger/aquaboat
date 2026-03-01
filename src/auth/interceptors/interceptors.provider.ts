import { Provider } from "@nestjs/common";
import { ClearRefreshTokenInCookiesInterceptor } from "./clear-refresh-token-in-cookies.interceptor";
import { SetRefreshTokenInCookiesInterceptor } from "./set-refresh-token-in-cookies.interceptor";

export default [
  ClearRefreshTokenInCookiesInterceptor,
  SetRefreshTokenInCookiesInterceptor
] as Provider[];
