import { Inject, Injectable } from "@nestjs/common";
import { IUserUpdateParams, RetrieveUserBy } from "../../contracts";
import { IUserRepo } from "../../domain/repos";
import { UserNotFoundError, UserUpdateFailedError } from "../../errors";
import { USER_REPO } from "../../tokens";
import { UserMapper } from "../mappers";

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

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
}
