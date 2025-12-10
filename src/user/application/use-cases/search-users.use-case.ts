import { Inject, Injectable } from "@nestjs/common";
import { IOffsetPaginationResult, IUserSearchParams } from "../../contracts";
import { User } from "../../domain/entities";
import { IUserRepo } from "../../domain/repos";
import { USER_REPO } from "../../tokens";

@Injectable()
export class SearchUsersUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  execute(params: IUserSearchParams): Promise<IOffsetPaginationResult<User>> {
    return this.userRepo.searchUsers(params);
  }
}
