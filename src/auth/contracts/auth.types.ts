import { IUserCreateParams, Provider } from "../../user/contracts";

export type IRegisterUserRequest = Omit<
  IUserCreateParams,
  "provider" | "providerUserId"
>;

export type IUserRegisterParams = IRegisterUserRequest & {
  provider: Provider;
};
