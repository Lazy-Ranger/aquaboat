import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ExtractJwt } from "passport-jwt";
import { RefreshTokenService } from "src/auth/application/services/refresh-token.service";
import { IRefreshTokenParams, IUserLoginParams } from "src/auth/contracts";
import { Principal } from "src/common/decorators";
import { IHttpRequest, IPrincipal } from "src/common/interfaces";
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
    private readonly refreshTokenUC: RefreshTokensUseCase,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  @Post("/register")
  @UseInterceptors(SetRefreshTokenInterceptor)
  async register(
    @Body() registerUserReq: RegisterUserDto,
    @Req() req: IHttpRequest
  ) {
    const userRegisterParams = {
      ...registerUserReq,
      provider: Provider.PASSWORD,
      clientRequestInfo: req.clientRequestInfo
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
  async login(@Body() loginUserReq: LoginUserDto, @Req() req: IHttpRequest) {
    const loginParams: IUserLoginParams = {
      ...loginUserReq,
      clientRequestInfo: req.clientRequestInfo
    };

    try {
      return await this.loginUserUseCase.execute(loginParams);
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
  logout(@Req() req: IHttpRequest, @Principal() principal: IPrincipal) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;

    const refreshToken = this.refreshTokenService.extractFromCookie(
      req
    ) as string;

    try {
      return this.logoutUserUseCase.execute(principal, {
        accessToken,
        refreshToken
      });
    } catch (err) {
      throw err;
    }
  }

  @Post("/refresh")
  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(SetRefreshTokenInterceptor)
  async refresh(@Req() req: IHttpRequest, @Principal() principal: IPrincipal) {
    const refreshToken = this.refreshTokenService.extractFromCookie(
      req
    ) as string;

    const refreshTokenParams: IRefreshTokenParams = {
      refreshToken,
      clientRequestInfo: req.clientRequestInfo
    };

    try {
      return this.refreshTokenUC.execute(principal, refreshTokenParams);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new UnauthorizedException(err);
      }
      throw err;
    }
  }
}
