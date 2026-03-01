import { IUserCreateParams, Provider } from "../../user/contracts";

export type IRegisterUserRequest = Omit<
  IUserCreateParams,
  "provider" | "providerUserId"
>;

export type IUserRegisterParams = IRegisterUserRequest & {
  provider: Provider;
};

export interface IJwtDecodedPayload {
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  aud: string | string[];
}

export interface IJwtAccessTokenPayload {
  sub: string;
  email: string;
}

export interface IJwtRefreshTokenPayload {
  sub: string;
  email: string;
}

export interface IJwtIdTokenPayload {
  sub: string;
  email: string;
  phone: string;
  picture?: string;
  name: string;
  firstName: string;
  lastName?: string;
  gender: string;
}

export type IUserSession = IJwtAccessTokenPayload & IJwtDecodedPayload;

export type IUserRefreshTokenSession = IJwtRefreshTokenPayload &
  IJwtDecodedPayload;

export interface ILoggedInResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface ILoginUserRequest {
  email: string;
  password: string;
}
