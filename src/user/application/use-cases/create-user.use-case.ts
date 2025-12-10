import { Inject, Injectable } from "@nestjs/common";
import { IUserCreateParams } from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import { UserAlreadyExistsError } from "../../errors";
import { USER_REPO } from "../../tokens";

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async execute(params: IUserCreateParams): Promise<User> {
    const userExists = await this.userRepo.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyExistsError(params.email, userExists.id);
    }

    const user = new User(params);

    return await this.userRepo.create(user);
  }
}
