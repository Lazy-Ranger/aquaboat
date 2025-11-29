import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Gender, IUser, Provider, UserStatus } from "../../../../contracts";
import { AddressDocument, AddressSchemaDef } from "./address.schema";

export type UserDocument = HydratedDocument<UserSchema>;

type IUserPersistence = Omit<IUser, "id" | "name">;

@Schema({
  timestamps: true,
  collection: "users",
})
export class UserSchema implements IUserPersistence {
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
    required: true,
    type: String,
    enum: UserStatus,
  })
  status!: UserStatus;

  @Prop({
    type: AddressSchemaDef,
    required: true,
  })
  address!: AddressDocument;

  @Prop({ min: 1, max: 30 })
  password!: string;

  @Prop({ required: true, enum: Provider, type: String })
  provider!: Provider;

  @Prop({ required: true })
  authId!: string;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;
}

export const UserSchemaDef = SchemaFactory.createForClass(UserSchema);

export const USER_MODEL = UserSchema.name;
