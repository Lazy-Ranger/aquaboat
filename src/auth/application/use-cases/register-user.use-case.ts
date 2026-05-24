import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { IUserRegisterParams, IUserResponse } from "../../contracts";
import { UserAlreadyRegisteredError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase
  ) {}

  async execute(params: IUserRegisterParams): Promise<IUserResponse> {
    const userExists = await this.userService.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyRegisteredError(params.email);
    }

    const user = await this.userService.create(params);

    const { accessToken, refreshToken, idToken, jti } =
      await this.issueTokensUseCase.execute({
        user,
        clientRequestInfo: params.clientRequestInfo
      });

    return { accessToken, idToken, refreshToken, jti, user };
  }
}
