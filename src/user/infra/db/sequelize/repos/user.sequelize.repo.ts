import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import moment from "moment";
import {
  IOffsetPaginationResult,
  IUserSearchFilter,
  IUserSearchParams
} from "../../../../contracts";
import { User } from "../../../../domain/entities";
import { IUserRepo } from "../../../../domain/repos";
import { UserSequelizeMapper } from "../mappers/user-sequelize.mapper";
import { UserModel } from "../models";

@Injectable()
export class UserSequelizeRepo implements IUserRepo {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    private readonly userMapper: UserSequelizeMapper
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);

    return this.userMapper.toDomain(createdUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { id: Number(id) } });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });

    return user ? this.userMapper.toDomain(user) : null;
  }

  async updateById(id: string, user: Partial<User>): Promise<User | null> {
    const [, updatedUser] = await this.userModel.update(user, {
      where: { id: Number(id) },
      returning: true
    });

    return updatedUser ? this.userMapper.toDomain(updatedUser[0]) : null;
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.destroy({ where: { id: Number(id) } });
  }

  async searchUsers(
    query: IUserSearchParams
  ): Promise<IOffsetPaginationResult<User>> {
    const { page = 1, limit = 10 } = query;

    const { name, status, gender, address, createdAt } = JSON.parse(
      query.filter || "{}"
    ) as IUserSearchFilter;

    const { Op } = require("sequelize");
    const where: any = {};
    const include: any[] = [];

    // Search by name using OR
    if (name) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${name}%` } },
        { lastName: { [Op.iLike]: `%${name}%` } }
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by gender
    if (gender) {
      where.gender = gender;
    }

    // Filter by createdAt
    if (createdAt) {
      const startOfDay = moment
        .utc(createdAt, "YYYY-MM-DD")
        .startOf("day")
        .toDate();
      const endOfDay = moment
        .utc(createdAt, "YYYY-MM-DD")
        .endOf("day")
        .toDate();
      where.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    // Filter by country (join Address)
    if (address?.country) {
      include.push({
        association: "address",
        where: { country: address.country.toUpperCase() },
        required: true
      });
    }

    // Execute the query
    const { rows: users, count } = await this.userModel.findAndCountAll({
      where,
      include,
      offset: (page - 1) * limit,
      limit
    });

    return {
      data: users.map((user) => this.userMapper.toDomain(user)),
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      limit: +limit,
      page: +page
    };
  }
}
