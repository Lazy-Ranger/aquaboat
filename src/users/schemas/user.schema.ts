import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { USER_GENDER, UserStatus } from '../../constants';
import { AddressDocument, AddressSchemaDef } from './address.schema';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserSchema implements Omit<IUser, 'id'> {
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
    set: (value: string) => value?.trim(),
  })
  phone!: string;

  @Prop({ required: true, enum: Object.keys(USER_GENDER), type: String })
  gender: USER_GENDER;

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
}

export const UserSchemaDef = SchemaFactory.createForClass(UserSchema);

UserSchemaDef.virtual('name', function (this: UserSchema) {
  return `${this.firstName} ${this.lastName ?? null}`;
});

export const USER_MODEL = UserSchema.name;
