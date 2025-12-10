import { Injectable } from "@nestjs/common";
import { User } from "../../../../domain/entities";
import { UserDocument } from "../schemas";

@Injectable()
export class UserMongoMapper {
  public toDomain(userDoc: UserDocument): User {
    return new User({
      ...userDoc.toObject(),
      id: userDoc._id.toString(),
    });
  }

  public toPersistence(user: User): UserDocument {
    return {
      ...user,
      _id: user.id,
    } as unknown as UserDocument;
  }
}
