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
import { Request, Response } from "express";
import { ExtractJwt } from "passport-jwt";
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
  async register(
    @Body() registerUserReq: RegisterUserDto,
    @Res() res: Response
  ) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD
    };

    try {
      const data = await this.registerUserUseCase.execute(userRegisterParams);
      res.cookie("refreshToken", data.refreshToken);
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
  @UseGuards(JwtAccessTokenGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    const refreshToken = (req as any).cookies?.refreshToken as string;
    try {
      const data = await this.logoutUserUseCase.execute(
        accessToken,
        refreshToken
      );
      res.cookie("refreshToken", "");
      return data;
    } catch (err) {
      throw err;
    }
  }

  @Post("/refresh")
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.refreshTokenUC.execute(req);
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
