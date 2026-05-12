import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { JwtConfig } from "../../../config/jwt.config";
import { CACHE_SERVICE } from "../../../tokens";
import { UserService } from "../../../user/application/services";

@Injectable()
export class LogoutUserAllDeviceUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService<JwtConfig>,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
  ) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error("User not found.");
    }

    const cacheKey = `session_${user.id}`;
    const isDataExists = await this.cache.get(cacheKey);

    if (!isDataExists) {
      return false;
    }

    const sessions = JSON.parse(isDataExists);

    sessions.forEach(async (session) => {
      const jti = Object.keys(session)[0];
      const revokedKey = `revoked_${jti}`;
      const body = {
        ...session[jti]
      };
      await this.cache.set(revokedKey, JSON.stringify(body));
    });

    await this.cache.delete(cacheKey);

    return true;
  }
}
