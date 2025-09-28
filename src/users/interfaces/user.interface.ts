import { USER_STATUS } from '../constants/user.constants';
import { IAddress } from './address.interface';

export interface IUser {
  id: string;
  firstName: string;
  lastName?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  picture?: string;
  status: USER_STATUS;
  address: IAddress;
}
