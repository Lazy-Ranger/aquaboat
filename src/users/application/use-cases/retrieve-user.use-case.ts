import { Inject, Injectable } from "@nestjs/common";
import {
  IOffsetPaginationResult,
  IUser,
  IUserSearchParams,
  RetrieveUserBy,
} from "../../contracts";
import { IUserRepo } from "../../domain/repos";
import { UserNotFoundError } from "../../errors";
import { USER_REPO } from "../../tokens";
import { UserMapper } from "../mappers";

@Injectable()
export class RetrieveUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError(id, RetrieveUserBy.ID);
    }

    return UserMapper.toUserDto(user);
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
