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
import { AuthService } from "../../../application/services/auth.service";
import {
  CreateSessionUseCase,
  LoginUserUseCase,
  LogoutUserAllDeviceUseCase,
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
    private readonly authService: AuthService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshTokenUC: RefreshTokensUseCase,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly logoutUserAllDevice: LogoutUserAllDeviceUseCase
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
      return this.authService.register(userRegisterParams);
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
      return this.authService.login(loginParams);
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

  @Post("/logout-all")
  @UseInterceptors(ClearRefreshTokenInterceptor)
  @UseGuards(JwtAccessTokenGuard)
  logoutAll(@Req() req: IHttpRequest, @Principal() principal: IPrincipal) {
    try {
      return this.logoutUserAllDevice.execute(principal.id);
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
