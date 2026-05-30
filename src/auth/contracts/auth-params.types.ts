import { IClientRequestInfo } from "src/common/interfaces";
import { IUser, Provider } from "src/user/contracts";
import { ILoginUserRequest, IRegisterUserRequest } from "./auth.types";

export interface IRefreshTokenParams {
  jti: string;
}

export interface IIssueTokensParams {
  user: IUser;
}

export interface IUserRegisterParams extends IRegisterUserRequest {
  provider: Provider;

  clientRequestInfo: IClientRequestInfo;
}

export interface IUserLoginParams extends ILoginUserRequest {
  clientRequestInfo: IClientRequestInfo;
}

export interface IUserLogoutParams {
  jti: string;
  userId: string;
}

export type IUserLogoutAllDeviceParams = IUserLogoutParams;
