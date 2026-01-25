import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { ExtractJwt } from "passport-jwt";
import { Provider } from "../../../../user/contracts";
import { UserNotFoundError } from "../../../../user/errors";
import {
  LoginUserUseCase,
  LogoutUserUseCase,
  RegisterUserUseCase
} from "../../../application/use-cases";
import { UnauthorizedError, UserAlreadyRegisteredError } from "../../../errors";
import { JwtAuthGuard } from "../../../guards/jwt-auth.guard";
import { LoginUserDto, RegisterUserDto } from "../dtos";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
  ) {}

  @Post("/register")
  async register(@Body() registerUserReq: RegisterUserDto) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      return this.registerUserUseCase.execute(userRegisterParams);
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
      return this.loginUserUseCase.execute(body);
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

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    try {
      return this.logoutUserUseCase.execute(token);
    } catch (err) {
      throw err;
    }
  }
}
