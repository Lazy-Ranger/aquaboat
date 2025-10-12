import { IUser } from "../../contracts";
import { User } from "../../domain/entities";
import { AddressMapper } from "./address.mapper";

export class UserMapper {
  static toUserDto(user: User): IUser {
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

  static toUserDtos(users: User[]): IUser[] {
    return users.map(UserMapper.toUserDto);
  }
}
