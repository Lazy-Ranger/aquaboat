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
  authId: string;
}

export type IUserSearchFilter = Pick<
  Partial<IUser>,
  "name" | "status" | "gender" | "address" | "createdAt"
>;

// export interface IUserSearchParams {
//   page?: number;
//   limit?: number;
//   filter?: string; // JSON stringified IUserSearchFilter
// }

export type IUserCreateParams = Omit<
  IUser,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
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
