import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('JWT', () => {
  return {
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRY_TIME: process.env.EXPIRY_TIME,
  };
});
