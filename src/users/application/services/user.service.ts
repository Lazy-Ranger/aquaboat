import { Inject, Injectable } from "@nestjs/common";
import {
  IOffsetPaginationResult,
  IUser,
  IUserCreateParams,
  IUserSearchParams,
  IUserUpdateParams,
  RetrieveUserBy,
} from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserUpdateFailedError,
} from "../../errors";
import { USER_REPO } from "../../tokens";
import { UserMapper } from "../mappers";

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async create(params: IUserCreateParams): Promise<IUser> {
    const userExists = await this.userRepo.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyExistsError(params.email, userExists.id);
    }

    const user = new User(params);

    const createdUser = await this.userRepo.create(user);

    return UserMapper.toUserDto(createdUser);
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError(id, RetrieveUserBy.ID);
    }

    return UserMapper.toUserDto(user);
  }

  async updateUser(id: string, params: IUserUpdateParams) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError(id, RetrieveUserBy.ID);
    }

    Object.assign(user, params);

    const updatedUser = await this.userRepo.updateById(id, user);

    if (!updatedUser) {
      throw new UserUpdateFailedError(user.id);
    }

    return UserMapper.toUserDto(updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError(id, RetrieveUserBy.ID);
    }

    await this.userRepo.deleteById(id);

    return {
      id,
    };
  }

  async searchUsers(
    params: IUserSearchParams,
  ): Promise<IOffsetPaginationResult<IUser>> {
    const users = await this.userRepo.searchUsers(params);

    return {
      ...users,
      data: users.data.map(UserMapper.toUserDto),
    };
  }
}
