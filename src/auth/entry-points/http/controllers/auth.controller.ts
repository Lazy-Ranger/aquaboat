import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
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
import { Response } from "express";
import { UnauthorizedError, UserAlreadyRegisteredError } from "../../../errors";
import { JwtAuthGuard } from "../../../guards/jwt-auth.guard";
import { JwtRefreshTokenGuard } from '../../../guards/jwt-refresh-token.guard';
import { LoginUserDto, RegisterUserDto } from "../dtos";


@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase
  ) { }

  @Post("/register")
  async register(@Body() registerUserReq: RegisterUserDto, @Res() res: Response) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      const data = await this.registerUserUseCase.execute(userRegisterParams);
      res.cookie('refreshToken', data.refreshToken);
      return res.send(data);
    } catch (err) {
      if (err instanceof UserAlreadyRegisteredError) {
        return new ConflictException(err);
      }
      return err;
    }
  }

  @Post("/login")
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const data = await this.loginUserUseCase.execute(body);
      res.cookie('refreshToken', data.refreshToken);
      return res.send(data);
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
  async logout(@Req() req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    try {
      const data = await this.logoutUserUseCase.execute(token);
      return data;
    } catch (err) {
      throw err;
    }
  }

  @Post("/refresh")
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: Request) {
    const RefreshToken = req;
    console.log(RefreshToken);
    try {
      return  true;
    } catch (err) {
      throw err;
    }
  }
}
