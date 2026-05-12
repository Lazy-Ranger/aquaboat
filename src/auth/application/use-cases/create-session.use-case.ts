import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ICacheService } from "src/application/ports/cache.port";
import { JwtConfig } from "../../../config/jwt.config";
import { CACHE_SERVICE } from "../../../tokens";
import { ISessionCreateParams } from "../../contracts";
import { Session } from "../../domain/entities";
import { ISessionRepo } from "../../domain/repos";
import { SESSION_REPO } from "../../tokens";

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPO) private readonly sessionRepo: ISessionRepo,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
    private readonly config: ConfigService<JwtConfig>
  ) {}

  async execute(params: ISessionCreateParams): Promise<Session> {
    const session = new Session({
      ...params,
      userId: params.userId,
      jti: params.jti,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      ip: params.ip,
      userAgent: params.userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const cacheKey = `session_${params.userId}`;

    const sessionData = {
      [params.jti]: {
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        idToken: params.idToken
      }
    };

    const isDataExists = await this.cache.get(cacheKey);
    const ONE_YEAR_IN_SECONDS = 31536000;

    if (isDataExists) {
      const sessions = JSON.parse(isDataExists);

      sessions.push(sessionData);

      await this.cache.set(
        cacheKey,
        JSON.stringify(sessions),
        ONE_YEAR_IN_SECONDS
      );
    } else {
      await this.cache.set(
        cacheKey,
        JSON.stringify([sessionData]),
        ONE_YEAR_IN_SECONDS
      );
    }

    return this.sessionRepo.create(session);
  }
}
