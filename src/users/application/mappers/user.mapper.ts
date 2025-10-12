import { IUser } from "../../contracts";
import { UserDocument } from "../../infra/db/mongo/schemas";
import { AddressMapper } from "./address.mapper";

export class UserMapper {
  static toUserDto(user: UserDocument): IUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user?.lastName,
      name: user.name,
      email: user.email,
      phone: user?.phone,
      gender: user.gender,
      picture: user?.picture,
      status: user.status,
      address: AddressMapper.toAddressDto(user.address),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUserDtos(users: UserDocument[]): IUser[] {
    return users.map(UserMapper.toUserDto);
  }
}
