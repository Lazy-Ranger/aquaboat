import { UserMapper } from "../../../application/mappers";
import { IUser } from "../../../contracts";
import { User } from "../../../domain/entities";

export class UserHttpMapper {
  static toDto(user: User): IUser {
    return UserMapper.toDto(user);
  }

  static toDtos(users: User[]): IUser[] {
    return users.map(UserHttpMapper.toDto);
  }
}
