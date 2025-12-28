import { IUser } from "../../contracts";
import { User } from "../../domain/entities";
import { AddressMapper } from "./address.mapper";

export class UserMapper {
  static toDto(user: User): IUser {
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
      address: AddressMapper.toDto(user.address),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      provider: user.provider,
      providerUserId: user.providerUserId,
      authId: user.authId
    };
  }

  static toDtos(users: User[]): IUser[] {
    return users.map(UserMapper.toDto);
  }
}
