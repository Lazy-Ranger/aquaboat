import { IJwtDecodedPayload, IJwtRefreshTokenPayload } from "./auth.types";

export interface IRefreshTokenParams {
  refreshToken: string;

  user: IJwtRefreshTokenPayload & IJwtDecodedPayload;
}
