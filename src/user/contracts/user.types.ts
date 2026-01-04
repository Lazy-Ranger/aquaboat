import { IAddress, IAddressUpdateParams } from "./address.types";
import { Gender, Provider, RetrieveUserBy, UserStatus } from "./user.constants";

export interface IUser {
  id: string;
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  picture?: string;
  status: UserStatus;
  address: IAddress;
  createdAt: Date;
  updatedAt: Date;
  provider: Provider;
  providerUserId?: string;
  authId?: string;
  password?: string;
}

export type IUserSearchFilter = Pick<
  Partial<IUser>,
  "name" | "status" | "gender" | "address" | "createdAt"
>;

export type IUserCreateParams = Omit<
  IUser,
  "id" | "name" | "status" | "createdAt" | "updatedAt" | "authId"
>;

export type IUserUpdateParams = Partial<Omit<IUserCreateParams, "address">> & {
  address?: IAddressUpdateParams;
};

export interface IUserRetrieveParams {
  by: RetrieveUserBy;
  value: string;
}

export interface IUserDeleteResult {
  id: string;
  deleted: boolean;
}
