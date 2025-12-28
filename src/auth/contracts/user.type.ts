import { Gender, IAddress, Provider, UserStatus } from "../../user/contracts";

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

export type IUserCreateParams = Omit<
  IUser,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
>;
