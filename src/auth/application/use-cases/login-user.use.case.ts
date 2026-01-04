import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { IUser } from "../../../user/contracts";
import { UserNotFoundError } from "../../../user/errors";
import { ILoginUserRequest } from "../../contracts";
import { IncorrectPasswordError } from "../../errors";

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(params: ILoginUserRequest): Promise<IUser> {
    const user = await this.userService.findByEmail(params.email);

    if (!user) {
      throw new UserNotFoundError(params.email);
    }

    if (params.password !== user.password) {
      throw new IncorrectPasswordError(params.email);
    }

    return user;
  }
}
