import { Injectable } from "@nestjs/common";
import { IClientRequestInfo } from "src/common/interfaces";
import { IUser } from "src/user/contracts";
import {
  ILoggedInResponse,
  ISessionCreateParams,
  IssueTokenResponse,
  IUserLoginParams,
  IUserRegisterParams
} from "../../contracts";
import {
  IssueTokensUseCase,
  LoginUserUseCase,
  RegisterUserUseCase
} from "../use-cases";
import { SessionService } from "./session.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly registerUserUC: RegisterUserUseCase,
    private readonly loginUserUC: LoginUserUseCase,
    private readonly issueTokensUC: IssueTokensUseCase
  ) {}

  async register(params: IUserRegisterParams): Promise<ILoggedInResponse> {
    const user = await this.registerUserUC.execute(params);

    const issuedTokens = await this.issueTokensUC.execute({
      user
    });

    await this.createUserSession(user, issuedTokens, params.clientRequestInfo);

    return {
      accessToken: issuedTokens.accessToken,
      idToken: issuedTokens.idToken,
      refreshToken: issuedTokens.refreshToken
    };
  }

  async login(params: IUserLoginParams): Promise<ILoggedInResponse> {
    const { user, ...issuedTokens } = await this.loginUserUC.execute(params);

    await this.createUserSession(user, issuedTokens, params.clientRequestInfo);

    return {
      accessToken: issuedTokens.accessToken,
      idToken: issuedTokens.idToken,
      refreshToken: issuedTokens.refreshToken
    };
  }

  private async createUserSession(
    user: IUser,
    issuedTokens: IssueTokenResponse,
    clientRequestInfo: IClientRequestInfo
  ) {
    const sessionParams: ISessionCreateParams = {
      ...issuedTokens,
      userId: user.id,
      ip: clientRequestInfo.ip,
      userAgent: clientRequestInfo.userAgent,
      email: user.email
    };

    await this.sessionService.create(sessionParams);
  }
}
