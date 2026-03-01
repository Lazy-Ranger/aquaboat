import { registerAs } from "@nestjs/config";
import { getAppConfig } from "./app.config";
import { getPlatformConfig } from "./platform.config";

export interface JwtConfig {
  "jwt.accessTokenSecret": string;
  "jwt.refreshTokenSecret": string;
  "jwt.accessTokenExpireTime": string;
  "jwt.refreshTokenExpireTime": string;
  "jwt.refreshTokenCookieName": string;
  "jwt.issuer": string;
  "jwt.audience": string[];
}

export const getJwtConfig = () => {
  const appConfig = getAppConfig();
  const platformConfig = getPlatformConfig();

  return {
    accessTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    refreshTokenExpireTime: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    refreshTokenCookieName: `${platformConfig.name}-rt`, // <__secure-><org>-rt
    issuer: process.env.JWT_ISSUER || appConfig.host,
    audience: ["*"]
  };
};

export const JWT_CONFIG = registerAs("jwt", getJwtConfig);
