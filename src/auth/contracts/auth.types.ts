import { IUserCreateParams, Provider } from "../../user/contracts";

export type IRegisterUserRequest = Omit<
  IUserCreateParams,
  "provider" | "providerUserId"
>;

export type IUserRegisterParams = IRegisterUserRequest & {
  provider: Provider;
};

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
