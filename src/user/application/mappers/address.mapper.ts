import { IAddress } from "../../contracts";
import { Address } from "../../domain/value-objects/address.vo";

export class AddressMapper {
  static toDto(address: Address): IAddress {
    return {
      line1: address.line1,
      line2: address?.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country
    };
  }
}
