import { Injectable } from "@nestjs/common";
import { User } from "src/user/domain/entities";
import { IUserCreateParams, RetrieveUserBy } from "../../contracts";
import { CreateUserUseCase, RetrieveUserUseCase } from "../use-cases";

@Injectable()
export class UserService {
  constructor(
    private readonly retrieveUserUseCase: RetrieveUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = this.retrieveUserUseCase.execute({
      by: RetrieveUserBy.EMAIL,
      value: email
    });
    if (user) {
      return user;
    }
    return null;
  }

  async create(user: IUserCreateParams): Promise<User> {
    return this.createUserUseCase.execute(user);
  }
}
