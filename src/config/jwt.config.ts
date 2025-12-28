import { registerAs } from "@nestjs/config";

export interface JwtConfig {
  "jwt.secret": string;
  "jwt.expireTime": string;
}

export const JWT_CONFIG = registerAs("jwt", () => {
  return {
    secret: process.env.JWT_SECRET,
    expireTime: process.env.JWT_EXPIRE_TIME
  };
});
