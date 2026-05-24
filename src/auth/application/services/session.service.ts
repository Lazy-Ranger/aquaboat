import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ICacheService } from "src/application/ports/cache.port";
import { JwtConfig } from "../../../config/jwt.config";
import { CACHE_SERVICE } from "../../../tokens";
import { ISessionCreateParams } from "../../contracts";
import { Session } from "../../domain/entities";
import { ISessionRepo } from "../../domain/repos";
import { SESSION_REPO } from "../../tokens";

@Injectable()
export class SessionService {
  private readonly sessionCacheKeyPrefix = `session_` as const;
  private readonly revokedCacheKeyPrefix = `revoked_` as const;

  constructor(
    @Inject(SESSION_REPO) private readonly sessionRepo: ISessionRepo,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<JwtConfig>
  ) {}

  private getSessionCacheKey(userId: string) {
    return `${this.sessionCacheKeyPrefix}${userId}`;
  }

  private getRevokedCacheKey(accessToken: string) {
    return `${this.revokedCacheKeyPrefix}${accessToken}`;
  }

  async create(params: ISessionCreateParams): Promise<Session> {
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

    const cacheKey = this.getSessionCacheKey(params.userId);

    const sessionData = {
      [params.jti]: {
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        idToken: params.idToken
      }
    };

    const isDataExists = await this.cache.get(cacheKey);

    if (isDataExists) {
      const sessions = JSON.parse(isDataExists);

      sessions.push(sessionData);

      await this.cache.set(cacheKey, JSON.stringify(sessions));
    } else {
      await this.cache.set(cacheKey, JSON.stringify([sessionData]));
    }

    return this.sessionRepo.create(session);
  }

  async validate(jti: string): Promise<boolean> {
    const key = this.getRevokedCacheKey(jti);
    const isDataExists = (await this.cache.get(key)) as unknown as number;

    if (isDataExists !== 0) {
      return true;
    }
    return false;
  }

  async destroy(accessToken: string, refreshToken: string, userId: string) {
    const accessTokenData = this.jwtService.decode(accessToken);
    const refreshTokenData = this.jwtService.decode(refreshToken) as {
      exp: number;
    };
    const jti = accessTokenData.jti;

    const cacheKey = userId;
    const revokedKey = this.getRevokedCacheKey(accessTokenData.jti);

    const isDataExists = await this.cache.get(cacheKey);

    if (isDataExists) {
      const sessions = JSON.parse(isDataExists)?.filter(
        (data) => Object.keys(data)[0] !== jti
      );
      await this.cache.set(cacheKey, JSON.stringify(sessions));
    }
    const nowInSeconds = Date.now() / 1000;

    const ttl = Math.floor(refreshTokenData.exp - nowInSeconds);

    await this.cache.set(
      revokedKey,
      JSON.stringify([accessToken, refreshToken]),
      ttl
    );
  }

  async destroyAll(userId: string) {
    const sessionKey = this.getSessionCacheKey(userId);
    const isSessionExists = await this.cache.get(sessionKey);

    if (!isSessionExists) {
      return false;
    }

    const sessions = JSON.parse(isSessionExists);

    sessions.forEach(async (session) => {
      const jti = Object.keys(session)[0];
      const revokedKey = this.getRevokedCacheKey(jti);
      const body = {
        ...session[jti]
      };
      await this.cache.set(revokedKey, JSON.stringify(body));
    });

    await this.cache.delete(sessionKey);
  }
}
