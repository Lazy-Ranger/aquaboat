import { Injectable } from "@nestjs/common";
import {
  ILoggedInResponse,
  ISessionCreateParams,
  IUserLoginParams,
  IUserRegisterParams
} from "../../contracts";
import { LoginUserUseCase, RegisterUserUseCase } from "../use-cases";
import { SessionService } from "./session.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly loginUserUC: LoginUserUseCase
  ) {}

  async register(params: IUserRegisterParams): Promise<ILoggedInResponse> {
    const loggedInResponse = await this.registerUserUC.execute(params);
    const sessionParams: ISessionCreateParams = {
      userId: loggedInResponse.user.id,
      jti: loggedInResponse.jti,
      accessToken: loggedInResponse.accessToken,
      refreshToken: loggedInResponse.refreshToken,
      idToken: loggedInResponse.idToken,
      ip: params.clientRequestInfo.ip,
      userAgent: params.clientRequestInfo.userAgent,
      email: loggedInResponse.user.email
    };

    await this.sessionService.create(sessionParams);

    return {
      accessToken: loggedInResponse.accessToken,
      idToken: loggedInResponse.idToken,
      refreshToken: loggedInResponse.refreshToken
    };
  }

  async login(params: IUserLoginParams): Promise<ILoggedInResponse> {
    const loggedInResponse = await this.loginUserUC.execute(params);

    const sessionParams: ISessionCreateParams = {
      userId: loggedInResponse.user.id,
      jti: loggedInResponse.jti,
      accessToken: loggedInResponse.accessToken,
      refreshToken: loggedInResponse.refreshToken,
      idToken: loggedInResponse.idToken,
      ip: params.clientRequestInfo.ip,
      userAgent: params.clientRequestInfo.userAgent,
      email: loggedInResponse.user.email
    };

    await this.sessionService.create(sessionParams);

    return {
      accessToken: loggedInResponse.accessToken,
      idToken: loggedInResponse.idToken,
      refreshToken: loggedInResponse.refreshToken
    };
  }
}
