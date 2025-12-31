import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { UserNotFoundError } from "../../../user/errors";
import { LoginUserRequest } from "../../contracts";
import { User } from "../../domain/entities";
import { IncorrectPasswordError } from "../../errors";

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(params: LoginUserRequest): Promise<User> {
    const user = await this.userService.findByEmail(params.email);

    if (!user) {
      throw new UserNotFoundError(params.email);
    }

    if (params.password !== user.password) {
      throw new IncorrectPasswordError(params.email);
    }

    return new User(user);
  }
}
