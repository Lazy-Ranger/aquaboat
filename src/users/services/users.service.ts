import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { USER_MODEL, UserDocument } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { PaginableDto } from '../dto/paginable.dto';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}
  create = async (user: CreateUserDTO): Promise<boolean> => {
    const userExists = await this.userModel.findOne({ email: user.email });
    if (userExists) {
      throw new BadGatewayException('User already exists');
    }

    const newUser = await this.userModel.create(user);
    return true;
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

  deleteUser = async (id: string) => {
    const userExists = await this.userModel.findById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    return deletedUser;
  };

  searchUsers = async (query: PaginableDto) => {
    const {
      page = 1,
      limit = 10,
      name,
      status,
      gender,
      country,
      createdAt,
    } = query;

    const conditions: any[] = [];

    if (name) {
      conditions.push({
        $or: [
          { firstName: { $regex: name, $options: 'i' } },
          { lastName: { $regex: name, $options: 'i' } },
        ],
      });
    }

    if (status) {
      conditions.push({ status });
    }

    if (gender) {
      conditions.push({ gender });
    }

    if (country) {
      conditions.push({ 'address.country': country });
    }

    if (createdAt) {
      const startOfDay = moment
        .utc(createdAt, 'YYYY-MM-DD')
        .startOf('day')
        .toDate();
      const endOfDay = moment
        .utc(createdAt, 'YYYY-MM-DD')
        .endOf('day')
        .toDate();

      conditions.push({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    const findQuery = conditions.length > 0 ? { $and: conditions } : {};

    const [users, count] = await Promise.all([
      this.userModel
        .find(findQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(findQuery),
    ]);

    return {
      data: users,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      limit: +limit,
      page: +page,
    };
  };
}
