import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Gender, IUser, UserStatus } from "../../../../contracts";
import { AddressDocument, AddressSchemaDef } from "./address.schema";

export type UserDocument = HydratedDocument<UserSchema>;

type IUserPersistence = Omit<IUser, "id">;

@Schema({
  timestamps: true,
  collection: "users",
})
export class UserSchema implements IUserPersistence {
  name: string; // virtual

  @Prop({ required: true, min: 2, max: 50 })
  firstName!: string;

  @Prop({
    min: 2,
    max: 50,
  })
  lastName?: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({
    required: true,
  })
  phone!: string;

  @Prop({ required: true, enum: Gender, type: String })
  gender: Gender;

  @Prop({})
  picture?: string;

  @Prop({
    default: UserStatus.ACTIVE,
    type: String,
    enum: Object.values(UserStatus),
  })
  status!: UserStatus;

  @Prop({
    type: AddressSchemaDef,
    required: true,
  })
  address!: AddressDocument;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;
}

export const UserSchemaDef = SchemaFactory.createForClass(UserSchema);

UserSchemaDef.virtual("name", function (this: UserSchema) {
  return `${this.firstName} ${this.lastName ?? ""}`;
});

export const USER_MODEL = UserSchema.name;
