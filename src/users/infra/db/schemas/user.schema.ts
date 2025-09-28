import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GENDER, USER_STATUS } from '../../../constants';
import { AddressDocument, AddressSchemaDef } from './address.schema';
import { IUser } from '../../../interfaces/user.interface';

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

  @Prop({ required: true, enum: Object.values(GENDER), type: String })
  gender: GENDER;

  @Prop({
    isUrl: true,
  })
  picture?: string;

  @Prop({
    default: USER_STATUS.ACTIVE,
    type: String,
    enum: Object.values(USER_STATUS),
  })
  status!: USER_STATUS;

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
