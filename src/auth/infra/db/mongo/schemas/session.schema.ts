import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IAuthSession } from "../../../../contracts";
import { UserAgentDocument } from "./auth-user.agent.schema";

export type AuthSessionDocument = HydratedDocument<AuthSessionSchema>;

export interface IAuthSessionPersistence extends Omit<IAuthSession, "id"> {}

@Schema({
  timestamps: true,
  collection: "auth_sessions"
})
export class AuthSessionSchema implements IAuthSessionPersistence {
  @Prop({ required: true, unique: true })
  jti!: string;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, index: true })
  email!: string;

  @Prop({ required: true })
  accessToken!: string;

  @Prop({ required: true })
  refreshToken!: string;

  @Prop({ type: [String], required: true })
  ip!: string[];

  @Prop({ required: true, type: Object })
  userAgent!: UserAgentDocument;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export const AuthSessionSchemaDef =
  SchemaFactory.createForClass(AuthSessionSchema);

export const AUTH_SESSION_MODEL = AuthSessionSchema.name;
