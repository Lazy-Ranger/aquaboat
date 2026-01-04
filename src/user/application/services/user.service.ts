import { Injectable } from "@nestjs/common";
import { IUser, IUserCreateParams, RetrieveUserBy } from "../../contracts";
import { UserMapper } from "../mappers";
import { CreateUserUseCase, RetrieveUserUseCase } from "../use-cases";

@Injectable()
export class UserService {
  constructor(
    private readonly retrieveUserUseCase: RetrieveUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await this.retrieveUserUseCase.execute({
        by: RetrieveUserBy.EMAIL,
        value: email
      });

      return UserMapper.toDto(user);
    } catch (err) {
      return null;
    }
  }

  async create(params: IUserCreateParams): Promise<IUser> {
    const user = await this.createUserUseCase.execute(params);

    return UserMapper.toDto(user);
  }
}
