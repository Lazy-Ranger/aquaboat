import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { USER_COUNTRY } from '../../constants';

export type AddressDocument = Address & Document;

@Schema({})
export class Address {
  @Prop({ required: true, min: 2, max: 100 })
  line1: string;

  @Prop({ min: 2, max: 100 })
  line2: string;

  @Prop({ required: true, min: 2, max: 50 })
  city: string;

  @Prop({ required: true, min: 2, max: 50 })
  state: string;

  @Prop({ required: true, min: 10, max: 10 })
  postalCode: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.keys(USER_COUNTRY),
    set: (value: string) => value?.toUpperCase(),
  })
  country: USER_COUNTRY;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
