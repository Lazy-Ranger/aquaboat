import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { IUserLoginParams, IUserResponse } from "../../contracts";
import { UnauthorizedError } from "../../errors";
import { IssueTokensUseCase } from "./issue-tokens.use-case";

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly issueTokensUseCase: IssueTokensUseCase
  ) {}

  async execute(params: IUserLoginParams): Promise<IUserResponse> {
    const { email, password } = params;

    const user = await this.userService.validateByEmailAndPassword(
      email,
      password
    );

    if (!user) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }

    const { accessToken, refreshToken, idToken, jti } =
      await this.issueTokensUseCase.execute({
        user,
        clientRequestInfo: params.clientRequestInfo
      });

    return { accessToken, idToken, refreshToken, jti, user };
  }
}
