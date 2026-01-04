import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import { Provider } from "../../../../user/contracts";
import {
  UserAlreadyExistsError,
  UserNotFoundError
} from "../../../../user/errors";
import {
  IssueTokensUseCase,
  LoginUserUseCase,
  RegisterUserUseCase
} from "../../../application/use-cases";
import { IncorrectPasswordError } from "../../../errors";
import { LoginUserDto, RegisterUserDto } from "../dtos";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly generateTokenUseCase: IssueTokensUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @Post("/register")
  async register(@Body() registerUserReq: RegisterUserDto) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      const user = await this.registerUserUseCase.execute(userRegisterParams);
      const token = await this.generateTokenUseCase.execute(user);
      return {
        ...token
      };
    } catch (err) {
      console.log(err);
      if (err instanceof UserAlreadyExistsError) {
        return new ConflictException(err);
      }
    }
  }

  @Post("/login")
  async login(@Body() body: LoginUserDto) {
    try {
      const user = await this.loginUserUseCase.execute(body);
      const token = await this.generateTokenUseCase.execute(user);
      return {
        ...token
      };
    } catch (err) {
      console.log(err);
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      }
      if (err instanceof IncorrectPasswordError) {
        throw new UnauthorizedException(err);
      }
    }
  }
}
