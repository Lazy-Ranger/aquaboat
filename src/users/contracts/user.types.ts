import { IAddress, IAddressUpdateParams } from "./address.types";
import { Gender, Provider, UserStatus } from "./user.constants";

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
  password: string;
  provider: Provider;
  providerUserId?: string;
  authId: string;
}

export type IUserSearchFilter = Pick<
  Partial<IUser>,
  "name" | "status" | "gender" | "address" | "createdAt"
>;

export type IUserCreateParams = Omit<
  IUser,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
>;

export type IUserUpdateParams = Partial<Omit<IUserCreateParams, "address">> & {
  address?: IAddressUpdateParams;
};
