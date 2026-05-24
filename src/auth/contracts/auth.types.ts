import { IUser, IUserCreateParams } from "../../user/contracts";

export type IRegisterUserRequest = Omit<
  IUserCreateParams,
  "provider" | "providerUserId"
>;

export interface ILoginUserRequest {
  email: string;
  password: string;
}

export interface ILoggedInResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface IUserResponse extends ILoggedInResponse {
  jti: string;
  user: IUser;
}
