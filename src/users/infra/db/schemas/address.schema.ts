import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { COUNTRY } from '../../../constants';
import { IAddress } from '../../../interfaces/address.interface';
import { IsIn } from 'class-validator';

export type AddressDocument = HydratedDocument<AddressSchema>;

@Schema({
  _id: false,
})
export class AddressSchema implements IAddress {
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
    set: (value: string) => value?.toUpperCase(),
  })
  country: string;
}

export const AddressSchemaDef = SchemaFactory.createForClass(AddressSchema);
