import { generateId } from "../../../helpers";
import { Gender, IUser, UserStatus } from "../../contracts";
import { Address } from "../value-objects/address.vo";

export type IUserProps = Omit<
  IUser,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
> & {
  id?: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User implements IUser {
  readonly id!: string;

  firstName: string;

  lastName?: string;

  email!: string;

  phone!: string;

  gender!: Gender;

  picture?: string;

  status!: UserStatus;

  address!: Address;

  readonly createdAt: Date;

  updatedAt!: Date;

  constructor(props: IUserProps) {
    this.id = props.id ?? generateId();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
    this.gender = props.gender;
    this.picture = props.picture;
    this.status = props.status ?? UserStatus.ACTIVE;
    this.address = new Address(props.address);
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  get name(): string {
    return `${this.firstName} ${this.lastName ?? ""}`;
  }
}
