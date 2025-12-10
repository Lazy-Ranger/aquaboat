export interface IAddress {
  line1: string;

  line2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;
}

export type IAddressCreateParams = IAddress;

export type IAddressUpdateParams = Partial<IAddress>;
