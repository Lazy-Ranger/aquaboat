import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthSession } from "../../../../domain/entities";
import { IAuthRepo } from "../../../../domain/repos";
import { AuthSessionMongoMapper } from "../mapper/auth.session-mongo.mapper";
import { AUTH_SESSION_MODEL, AuthSessionDocument } from "../schemas";

@Injectable()
export class AuthMongoRepo implements IAuthRepo {
  constructor(
    @InjectModel(AUTH_SESSION_MODEL)
    private readonly authSessionModel: Model<AuthSessionDocument>,
    private readonly authSessionMapper: AuthSessionMongoMapper
  ) {}

  async createSession(session: AuthSession): Promise<AuthSession> {
    const createdAuthSession = await this.authSessionModel.create(session);

    return this.authSessionMapper.toDomain(createdAuthSession);
  }
}
