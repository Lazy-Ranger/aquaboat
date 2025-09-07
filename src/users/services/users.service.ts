import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { USER_MODEL, UserDocument } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  create = async (user: User) => {
    try {
      const newUser = await this.userModel.create(user);
      return newUser;
    } catch (err) {
      console.log(err);
    }
  };
}
