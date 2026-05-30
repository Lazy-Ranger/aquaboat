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

interface ICachedSession {
  jti: string;
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

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
      userAgent: params.userAgent
    });

    const savedSession = await this.sessionRepo.create(session);

    const cacheKey = this.getSessionCacheKey(params.userId);

    const sessionData: ICachedSession = {
      jti: params.jti,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      idToken: params.idToken
    };

    const isSessionExists = await this.cache.get(cacheKey);

    if (isSessionExists) {
      const sessions: ICachedSession[] = JSON.parse(isSessionExists);

      sessions.push(sessionData);

      await this.cache.set(cacheKey, JSON.stringify(sessions));
    } else {
      await this.cache.set(cacheKey, JSON.stringify([sessionData]));
    }

    return savedSession;
  }

  async validate(jti: string): Promise<boolean> {
    const key = this.getRevokedCacheKey(jti);
    const isRevokedToken = (await this.cache.get(key)) as unknown as number;

    if (isRevokedToken !== 0) {
      return true;
    }
    return false;
  }

  async destroy(jti: string, userId: string) {
    const sessionsKey = this.getSessionCacheKey(userId);

    const isSessionExists = await this.cache.get(sessionsKey);

    if (!isSessionExists) {
      return;
    }

    const sessions: ICachedSession[] = JSON.parse(isSessionExists || "[]");

    const session = sessions.find((session) => session.jti === jti);

    if (!session) {
      return;
    }

    const { accessToken, refreshToken } = session;

    const decodedRefreshToken = this.jwtService.decode(refreshToken) as {
      exp: number;
    };

    const nowInSeconds = Date.now() / 1000;

    const ttl = Math.floor(decodedRefreshToken.exp - nowInSeconds);

    const revokedKey = this.getRevokedCacheKey(jti);

    await this.cache.set(
      revokedKey,
      JSON.stringify([accessToken, refreshToken]),
      ttl
    );

    const liveSessions = sessions.filter((session) => session.jti !== jti);

    if (liveSessions && liveSessions.length) {
      await this.cache.set(sessionsKey, JSON.stringify(liveSessions));
    }
  }

  async destroyAll(userId: string) {
    const sessionKey = this.getSessionCacheKey(userId);
    const areSessionsExists = await this.cache.get(sessionKey);

    if (!areSessionsExists) {
      return false;
    }

    const sessions: ICachedSession[] = JSON.parse(areSessionsExists);

    for (const session of sessions) {
      this.destroy(session.jti, userId).catch((err) => {
        console.log("cannot destroy session", err);
      });
    }

    await this.cache.delete(sessionKey);
  }
}
