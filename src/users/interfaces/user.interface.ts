import { Address } from './address.interface';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  picture: string;
  status: string;
  address?: Address;
}
