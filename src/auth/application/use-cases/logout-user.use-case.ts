import { Injectable } from "@nestjs/common";
import { IUserLogoutParams } from "src/auth/contracts";
import { IPrincipal } from "src/common/interfaces";
import { SessionService } from "../../application/services/session.service";

@Injectable()
export class LogoutUserUseCase {
  constructor(private readonly sessionService: SessionService) {}

  async execute(
    principal: IPrincipal,
    params: IUserLogoutParams
  ): Promise<boolean> {
    void principal;

    const { accessToken, refreshToken } = params;

    await this.sessionService.destroy(accessToken, refreshToken, principal.id);

    return true;
  }
}
