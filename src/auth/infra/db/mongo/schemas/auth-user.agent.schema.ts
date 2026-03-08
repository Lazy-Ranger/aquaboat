import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IUserAgent } from "../../../../../common/interfaces";

export type UserAgentDocument = HydratedDocument<IUserAgent>;

@Schema({
  _id: false
})
export class AuthUserAgent implements IUserAgent {
  @Prop({})
  browser!: string;

  @Prop({})
  device!: string;

  @Prop({})
  os!: string;

  @Prop({ type: [String], select: false })
  ip!: string[];

  @Prop({ required: true, unique: true })
  ua!: string;
}

export const AuthUserAgentSchemaDef =
  SchemaFactory.createForClass(AuthUserAgent);
