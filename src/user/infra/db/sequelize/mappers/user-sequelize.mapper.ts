import { Injectable } from "@nestjs/common";
import { User } from "../../../../domain/entities";
import { UserModel } from "../models";

@Injectable()
export class UserSequelizeMapper {
  public toDomain(user: UserModel): User {
    return new User({
      ...user,
      id: String(user.id),
      address: user.address,
    });
  }

  public toPersistence(user: User): UserModel {
    return {
      ...user,
      id: Number(user.id),
      addressId: user.address,
    } as unknown as UserModel;
  }
}
