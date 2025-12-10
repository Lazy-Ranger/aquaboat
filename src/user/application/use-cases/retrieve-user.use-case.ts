import { Inject, Injectable } from "@nestjs/common";
import { IUserRetrieveParams, RetrieveUserBy } from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import { UserNotFoundError } from "../../errors";
import { USER_REPO } from "../../tokens";

@Injectable()
export class RetrieveUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async execute(params: IUserRetrieveParams): Promise<User> {
    const user = await this.findByCriteria(params);

    if (!user) {
      throw new UserNotFoundError(params.value, params.by);
    }

    return user;
  }

  private async findByCriteria(
    params: IUserRetrieveParams
  ): Promise<User | null> {
    switch (params.by) {
      case RetrieveUserBy.ID:
        return this.userRepo.findById(params.value);
      case RetrieveUserBy.EMAIL:
        return this.userRepo.findByEmail(params.value);

      default:
        return null;
    }
  }
}
