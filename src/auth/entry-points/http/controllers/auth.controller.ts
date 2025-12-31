import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import {
  UserAlreadyExistsError,
  UserNotFoundError
} from "../../../../user/errors";
import {
  GenerateToken,
  RegisterUserUseCase,
  ValidateUserUseCase
} from "../../../application/use-cases";
import { IncorrectPasswordError } from "../../../errors";
import { CreateUserDto, LoginUserDto } from "../dtos";
@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly generateTokenUseCase: GenerateToken,
    private readonly validateUserUseCase: ValidateUserUseCase
  ) {}

  @Post("/register")
  async register(@Body() body: CreateUserDto) {
    try {
      const user = await this.registerUserUseCase.execute(body);
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
      const user = await this.validateUserUseCase.execute(body);
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
