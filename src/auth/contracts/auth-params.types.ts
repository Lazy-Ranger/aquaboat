import { IJwtRefreshTokenPayload } from "./auth.types";

export interface IRefreshTokenParams {
  refreshToken: string;

  user: IJwtRefreshTokenPayload;
}
