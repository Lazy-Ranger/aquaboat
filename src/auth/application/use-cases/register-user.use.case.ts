import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { IUser } from "../../../user/contracts";
import { UserAlreadyExistsError } from "../../../user/errors";
import { IUserRegisterParams } from "../../contracts";

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(params: IUserRegisterParams): Promise<IUser> {
    const userExists = await this.userService.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyExistsError(params.email, userExists.id);
    }

    return await this.userService.create(params);
  }
}
