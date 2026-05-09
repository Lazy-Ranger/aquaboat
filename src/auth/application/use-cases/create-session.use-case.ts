import { Inject, Injectable } from "@nestjs/common";
import { ICacheService } from "src/application/ports/cache.port";
import { CACHE_SERVICE } from "../../../tokens";
import { ISessionCreateParams } from "../../contracts";
import { Session } from "../../domain/entities";
import { ISessionRepo } from "../../domain/repos";
import { SESSION_REPO } from "../../tokens";

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPO) private readonly sessionRepo: ISessionRepo,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService
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

    const cacheKey = params.userId;

    const sessionData = {
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      idToken: params.idToken,
      jti: params.jti
    };

    const isDataExists = await this.cache.get(cacheKey);
    if (isDataExists) {
      const sessions = isDataExists ? JSON.parse(isDataExists) : [];
      sessions.push(sessionData);
      await this.cache.set(cacheKey, JSON.stringify(sessions), null);
    } else {
      await this.cache.set(cacheKey, JSON.stringify([sessionData]), null);
    }

    return this.sessionRepo.create(session);
  }
}
