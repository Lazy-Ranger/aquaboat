import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment";
import { FilterQuery, Model } from "mongoose";
import {
  IOffsetPaginationResult,
  IUser,
  IUserSearchFilter,
} from "../../contracts";
import { CreateUserDto, UpdateUserDto } from "../../entry-points/http/dtos";
import { SearchUsersDto } from "../../entry-points/http/dtos/search-users.dto";
import { USER_MODEL, UserDocument } from "../../infra/db/mongo/schemas";
import { UserMapper } from "../mappers";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const createdUser = await this.userModel.create(createUserDto);

    return UserMapper.toUserDto(createdUser);
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return UserMapper.toUserDto(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.userModel.findById(id);
    if (!userExists) {
      throw new NotFoundException("User not found");
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!updatedUser) {
      throw new InternalServerErrorException("Error updating user");
    }

    return UserMapper.toUserDto(updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.deleteOne();

    return {
      id,
    };
  }

  async searchUsers(
    query: SearchUsersDto,
  ): Promise<IOffsetPaginationResult<IUser>> {
    const { page = 1, limit = 10 } = query;

    const { name, status, gender, address, createdAt } = JSON.parse(
      query.filter || "{}",
    ) as IUserSearchFilter;

    const findQuery: FilterQuery<UserDocument> = {};

    // Search by name using $or
    if (name) {
      findQuery.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      findQuery.status = status;
    }

    // Filter by gender
    if (gender) {
      findQuery.gender = gender;
    }

    // Filter by country
    if (address?.country) {
      const country = address.country.toUpperCase();
      findQuery["address.country"] = country;
    }

    if (createdAt) {
      const startOfDay = moment
        .utc(createdAt, "YYYY-MM-DD")
        .startOf("day")
        .toDate();
      const endOfDay = moment
        .utc(createdAt, "YYYY-MM-DD")
        .endOf("day")
        .toDate();

      Object.assign(findQuery, {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    // Execute the query
    const [users, count] = await Promise.all([
      this.userModel
        .find(findQuery)
        .skip((page - 1) * limit)
        .limit(limit),
      this.userModel.countDocuments(findQuery),
    ]);

    return {
      data: UserMapper.toUserDtos(users),
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      limit: +limit,
      page: +page,
    };
  }
}
