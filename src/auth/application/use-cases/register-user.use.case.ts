import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { IUserCreateParams, LoggedInResponse } from "../../contracts";
import { User } from "../../domain/entities";
import { UserAlreadyExistsError } from "../../errors";
import { GenerateToken } from "./generate-token";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly generateTokenUC: GenerateToken
  ) {}

  async execute(params: IUserCreateParams): Promise<LoggedInResponse> {
    const userExists = await this.userService.findByEmail(params.email);

    if (userExists) {
      throw new UserAlreadyExistsError(params.email, userExists.id);
    }

    const user = await this.userService.create(params);

    const tokens = await this.generateTokenUC.execute(new User(user));

    return {
      ...tokens
    };
  }
}
