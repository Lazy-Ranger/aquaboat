import { IClientRequestInfo } from "src/common/interfaces";
import { IUser, Provider } from "src/user/contracts";
import { ILoginUserRequest, IRegisterUserRequest } from "./auth.types";

export interface IRefreshTokenParams {
  refreshToken: string;

  clientRequestInfo: IClientRequestInfo;
}

export interface IIssueTokensParams {
  user: IUser;

  clientRequestInfo: IClientRequestInfo;
}

export interface IUserRegisterParams extends IRegisterUserRequest {
  provider: Provider;

  clientRequestInfo: IClientRequestInfo;
}

export interface IUserLoginParams extends ILoginUserRequest {
  clientRequestInfo: IClientRequestInfo;
}

export interface IUserLogoutParams {
  accessToken: string;
  refreshToken: string;
}
