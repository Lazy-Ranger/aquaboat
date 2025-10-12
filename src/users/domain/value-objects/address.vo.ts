import { IAddress } from "../../contracts";

export type IAccountProps = IAddress;

export class Address implements IAddress {
  line1: string;

  line2?: string;

  state: string;

  postalCode!: string;

  country!: string;

  city!: string;

  constructor(props: IAccountProps) {
    this.line1 = props.line1;
    this.line2 = props.line2;
    this.state = props.state;
    this.postalCode = props.postalCode;
    this.country = props.country;
    this.city = props.city;
  }
}
