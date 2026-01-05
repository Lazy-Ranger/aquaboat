import { registerAs } from "@nestjs/config";

export interface BcryptConfig {
  "bcrypt.salt": number;
}

export const BCRYPT_CONFIG = registerAs("bcrypt", () => {
  return {
    salt: +(process.env.BCRYPT_SALT || "10")
  };
});
