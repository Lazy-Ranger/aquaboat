import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { UserAlreadyExistsError } from "../../../user/errors";
import { IUserCreateParams } from "../../contracts";
import { User } from "../../domain/entities";

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(params: IUserCreateParams): Promise<User> {
    const userExists = await this.userService.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyExistsError(params.email, userExists.id);
    }

    const user = await this.userService.create(params);
    return new User(user);
  }
}
