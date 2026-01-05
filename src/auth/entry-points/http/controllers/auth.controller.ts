import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import { Provider } from "../../../../user/contracts";
import { UserNotFoundError } from "../../../../user/errors";
import {
  LoginUserUseCase,
  RegisterUserUseCase
} from "../../../application/use-cases";
import { UnauthorizedError, UserAlreadyRegisteredError } from "../../../errors";
import { LoginUserDto, RegisterUserDto } from "../dtos";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @Post("/register")
  async register(@Body() registerUserReq: RegisterUserDto) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      const tokens = await this.registerUserUseCase.execute(userRegisterParams);
      return {
        ...tokens
      };
    } catch (err) {
      if (err instanceof UserAlreadyRegisteredError) {
        throw new ConflictException(err);
      }

      throw err;
    }
  }

  @Post("/login")
  async login(@Body() body: LoginUserDto) {
    try {
      const tokens = await this.loginUserUseCase.execute(body);
      return {
        ...tokens
      };
    } catch (err) {
      if (err instanceof UserNotFoundError) {
        throw new NotFoundException(err);
      }
      if (err instanceof UnauthorizedError) {
        throw new UnauthorizedException(err);
      }

      throw err;
    }
  }
}
