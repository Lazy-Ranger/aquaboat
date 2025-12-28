import { Inject, Injectable } from "@nestjs/common";
import { IUserCreateParams } from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import { USER_REPO } from "../../tokens";

@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async execute(params: IUserCreateParams): Promise<User> {
    const user = new User(params);

    return await this.userRepo.create(user);
  }
}
