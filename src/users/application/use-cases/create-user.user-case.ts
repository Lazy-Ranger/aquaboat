import { Inject, Injectable } from "@nestjs/common";
import { IUser, IUserCreateParams } from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import { UserAlreadyExistsError } from "../../errors";
import { USER_REPO } from "../../tokens";
import { UserMapper } from "../mappers";

@Injectable()
export class CreateUserUseCase {
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
}
