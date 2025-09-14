import { IUser } from 'src/users/interfaces/user.interface';
import { UserDocument } from 'src/users/schemas';
import { AddressMapper } from './address.mapper';

export class UserMapper {
  static toUserDto(user: UserDocument): IUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user?.lastName,
      name: user.name,
      email: user?.email,
      phone: user?.phone,
      gender: user?.gender,
      picture: user?.picture,
      status: user?.status,
      address: AddressMapper.toAddressDto(user.address),
    };
  }
}
