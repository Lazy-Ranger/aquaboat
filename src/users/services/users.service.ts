import {
  Injectable,
  BadGatewayException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { USER_MODEL, UserDocument } from '../schemas';
import { Model, FindQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { PaginableDto } from '../dto/paginable.dto';
import * as moment from 'moment';
import { IUser } from '../interfaces/user.interface';
import { UserMapper } from '../application/mappers';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<IUser> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const createdUser = await this.userModel.create(createUserDto);

    return UserMapper.toUserDto(createdUser);
  }

  getUserById = async (id: string) => {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toUserDto(user);
  };

  updateUser = async (id: string, updateUserDto: UpdateUserDTO) => {
    const userExists = await this.userModel.findById(id);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new InternalServerErrorException('Error updating user');
    }

    return UserMapper.toUserDto(updatedUser);
  };

  deleteUser = async (id: string) => {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deleteOne();

    return {
      id,
    };
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

    const findQuery: FindQuery<UserDocument> = {};

    if (name) {
      Object.assign(findQuery, {
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
        .limit(limit),
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
