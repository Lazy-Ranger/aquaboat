import { Injectable } from "@nestjs/common";
import { IPrincipal } from "src/common/interfaces";
import { UserService } from "../../../user/application/services";
import { SessionService } from "../../application/services/session.service";
import { IUserLogoutAllDeviceParams } from "../../contracts/auth-params.types";

@Injectable()
export class LogoutUserAllDeviceUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  async execute(
    principal: IPrincipal,
    params: IUserLogoutAllDeviceParams
  ): Promise<boolean> {
    void principal;

    const userId = params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    await this.sessionService.destroyAll(userId);

    return true;
  }
}
