import { Injectable } from "@nestjs/common";
import { IUser } from "src/user/contracts";
import { UserService } from "../../../user/application/services";
import { IUserRegisterParams } from "../../contracts";
import { UserAlreadyRegisteredError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase
  ) {}

  async execute(params: IUserRegisterParams): Promise<IUser> {
    const userExists = await this.userService.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyRegisteredError(params.email);
    }

    return await this.userService.create(params);
  }
}
