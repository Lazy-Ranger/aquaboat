import { IAddress } from "../../contracts";
import { AddressDocument } from "../../infra/db/mongo/schemas";

export class AddressMapper {
  static toAddressDto(address: AddressDocument): IAddress {
    return {
      line1: address.line1,
      line2: address?.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };
  }
}
