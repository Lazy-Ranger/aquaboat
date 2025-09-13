import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { USER_MODEL, UserDocument } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  create = async (user: CreateUserDTO): Promise<UserDocument> => {
    const userExists = await this.userModel.findOne({ email: user.email });
    if (userExists) {
      throw new BadGatewayException('User already exists');
    }

    const newUser = await this.userModel.create(user);
    return newUser;
  };

  getUserById = async (id: string) => {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const data = {
      id: user._id,
      name: `${user?.firstName} ${user?.lastName ?? null}`,
      email: user?.email,
      phone: user?.phone,
      gender: user?.gender,
      picture: user?.picture,
      status: user?.status,
      address: {
        line1: user?.address?.line1,
        line2: user?.address?.line2,
        city: user?.address?.city,
        state: user?.address?.state,
        postalCode: user?.address?.postalCode,
        country: user?.address?.country,
      },
    };
    return data;
  };

  updateUser = async (id: string, user: UpdateUserDTO) => {
    const userExists = await this.userModel.findById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return updatedUser;
  };
}
