import { Injectable } from "@nestjs/common";
import { AuthSession } from "../../../../domain/entities";
import { AuthSessionDocument } from "../schemas";

@Injectable()
export class AuthSessionMongoMapper {
  public toDomain(session: AuthSessionDocument): AuthSession {
    return new AuthSession({
      ...session.toObject(),
      id: session._id.toString()
    });
  }

  public toPersistence(session: AuthSession): AuthSessionDocument {
    return {
      ...session,
      _id: session.id
    } as unknown as AuthSessionDocument;
  }
}
