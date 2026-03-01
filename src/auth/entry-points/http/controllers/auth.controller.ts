import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Request, Response } from "express";
import { ExtractJwt } from "passport-jwt";
import { IUserRefreshTokenSession } from "src/auth/contracts";
import { Provider } from "../../../../user/contracts";
import { UserNotFoundError } from "../../../../user/errors";
import {
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshTokensUseCase,
  RegisterUserUseCase
} from "../../../application/use-cases";
import { UnauthorizedError, UserAlreadyRegisteredError } from "../../../errors";
import { JwtAccessTokenGuard } from "../../../guards/jwt-access-token.guard";
import { JwtRefreshTokenGuard } from "../../../guards/jwt-refresh-token.guard";
import { ClearRefreshTokenInterceptor } from "../../../interceptors/clear-refresh-token.interceptor";
import { SetRefreshTokenInterceptor } from "../../../interceptors/set-refresh-token.interceptor";
import { LoginUserDto, RegisterUserDto } from "../dtos";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshTokenUC: RefreshTokensUseCase
  ) {}

  @Post("/register")
  @UseInterceptors(SetRefreshTokenInterceptor)
  async register(@Body() registerUserReq: RegisterUserDto) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      return await this.registerUserUseCase.execute(userRegisterParams);
    } catch (err) {
      if (err instanceof UserAlreadyRegisteredError) {
        throw new ConflictException(err);
      }
      return err;
    }
  }

  @Post("/login")
  @UseInterceptors(SetRefreshTokenInterceptor)
  async login(@Body() body: LoginUserDto) {
    try {
      return await this.loginUserUseCase.execute(body);
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
  @UseInterceptors(ClearRefreshTokenInterceptor)
  @UseGuards(JwtAccessTokenGuard)
  async logout(@Req() req: Request) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    const refreshToken = (req as any).cookies?.refreshToken as string;
    try {
      const data = await this.logoutUserUseCase.execute(
        accessToken,
        refreshToken
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Post("/refresh")
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshTokenParams = {
      refreshToken: req.cookies?.refreshToken as string,
      user: req.user as IUserRefreshTokenSession
    };

    try {
      const data = await this.refreshTokenUC.execute(refreshTokenParams);

      res.cookie("refreshToken", data.refreshToken);

      res.send(data);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new UnauthorizedException(err);
      }
      throw err;
    }
  }
}
