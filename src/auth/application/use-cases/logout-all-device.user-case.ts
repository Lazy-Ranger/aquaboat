import { Injectable } from "@nestjs/common";
import { UserService } from "../../../user/application/services";
import { SessionService } from "../../application/services/session.service";

@Injectable()
export class LogoutUserAllDeviceUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService
  ) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error("User not found.");
    }

    await this.sessionService.destroyAll(user.id);

    return true;
  }
}
