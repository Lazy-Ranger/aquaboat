import { IAddress } from "../contracts/address.interface";
import { UserStatus } from "../contracts/user.constants";

export interface IUser {
  id: string;
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  picture?: string;
  status: UserStatus;
  address: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserSearchFilter = Pick<
  Partial<IUser>,
  "name" | "status" | "gender" | "address" | "createdAt"
>;
