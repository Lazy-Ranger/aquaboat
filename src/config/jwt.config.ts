import { registerAs } from "@nestjs/config";
import { getAppConfig } from "./app.config";

export interface JwtConfig {
  "jwt.secret": string;
  "jwt.accessExpireTime": string;
  "jwt.refreshExpireTime": string;
  "jwt.issuer": string;
  "jwt.audience": string[];
}

export const getJwtConfig = () => {
  const appConfig = getAppConfig();

  return {
    secret: process.env.JWT_SECRET,
    accessExpireTime: process.env.JWT_EXPIRE_TIME,
    refreshExpireTime: process.env.JWT_REFRESH_TIME,
    issuer: process.env.JWT_ISSUER || appConfig.host,
    audience: ["*"]
  };
};

export const JWT_CONFIG = registerAs("jwt", getJwtConfig);
