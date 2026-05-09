import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Session } from "../../../../domain/entities";
import { ISessionRepo } from "../../../../domain/repos";
import { AuthSessionMongoMapper } from "../mapper/session-mongo.mapper";
import { AUTH_SESSION_MODEL, AuthSessionDocument } from "../schemas";

@Injectable()
export class SessionMongoRepo implements ISessionRepo {
  constructor(
    @InjectModel(AUTH_SESSION_MODEL)
    private readonly authSessionModel: Model<AuthSessionDocument>,
    private readonly authSessionMapper: AuthSessionMongoMapper
  ) {}

  async create(session: Session): Promise<Session> {
    const createdAuthSession = await this.authSessionModel.create(session);

    return this.authSessionMapper.toDomain(createdAuthSession);
  }
}
