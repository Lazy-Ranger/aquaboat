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
import { IJwtRefreshTokenPayload } from "src/auth/contracts";
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
import { ClearRefreshTokenInCookiesInterceptor } from "../../../interceptors/clear-refresh-token-in-cookies.interceptor";
import { SetRefreshTokenInCookiesInterceptor } from "../../../interceptors/set-refresh-token-in-cookies.interceptor";
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
  @UseInterceptors(SetRefreshTokenInCookiesInterceptor)
  async register(@Body() registerUserReq: RegisterUserDto) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      const data = await this.registerUserUseCase.execute(userRegisterParams);
      return data;
    } catch (err) {
      if (err instanceof UserAlreadyRegisteredError) {
        throw new ConflictException(err);
      }
      return err;
    }
  }

  @Post("/login")
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const data = await this.loginUserUseCase.execute(body);
      res.cookie("refreshToken", data.refreshToken);
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
  @UseInterceptors(ClearRefreshTokenInCookiesInterceptor)
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
      user: req.user as IJwtRefreshTokenPayload
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
