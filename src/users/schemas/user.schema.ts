import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { USER_GENDER, USER_STATUS } from '../../constants';
import { Address, AddressSchema } from './address.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, min: 2, max: 50 })
  firstName: string;

  @Prop({
    min: 2,
    max: 50,
  })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: true,
    set: (value: string) => value?.trim(),
  })
  phone: string;

  @Prop({ required: true, enum: Object.keys(USER_GENDER), type: String })
  gender: USER_GENDER;

  @Prop({})
  picture: string;

  @Prop({
    required: true,
    default: 'ACTIVE',
    type: String,
    enum: Object.keys(USER_STATUS),
  })
  status: USER_STATUS;

  @Prop({
    type: AddressSchema,
    required: true,
  })
  address?: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_MODEL = User.name;
