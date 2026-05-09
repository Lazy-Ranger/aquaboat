import { Injectable } from "@nestjs/common";
import { Session } from "../../../../domain/entities";
import { AuthSessionDocument } from "../schemas";

@Injectable()
export class AuthSessionMongoMapper {
  public toDomain(session: AuthSessionDocument): Session {
    return new Session({
      ...session.toObject(),
      id: session._id.toString()
    });
  }

  public toPersistence(session: Session): AuthSessionDocument {
    return {
      ...session,
      _id: session.id
    } as unknown as AuthSessionDocument;
  }
}
