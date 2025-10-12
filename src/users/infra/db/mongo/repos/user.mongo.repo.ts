import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model } from "mongoose";
import {
  IOffsetPaginationResult,
  IUserSearchFilter,
} from "../../../../contracts";
import { User } from "../../../../domain/entities";
import { IUserRepo, IUserSearchParams } from "../../../../domain/repos";
import { UserMongoMapper } from "../mappers/user-mongo.mapper";
import { USER_MODEL, UserDocument } from "../schemas";

@Injectable()
export class UserMongoRepo implements IUserRepo {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly userMapper: UserMongoMapper,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);

    return this.userMapper.toDomain(createdUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    return user ? this.userMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async updateById(id: string, user: User): Promise<User | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });

    return updatedUser ? this.userMapper.toDomain(updatedUser) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async searchUsers(
    query: IUserSearchParams,
  ): Promise<IOffsetPaginationResult<User>> {
    const { page = 1, limit = 10 } = query;

    const { name, status, gender, address, createdAt } = JSON.parse(
      JSON.parse(query.filter ?? "{}"),
    ) as IUserSearchFilter;

    const findQuery: any = {};

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
      data: users.map((user) => this.userMapper.toDomain(user)),
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      limit: +limit,
      page: +page,
    };
  }
}
