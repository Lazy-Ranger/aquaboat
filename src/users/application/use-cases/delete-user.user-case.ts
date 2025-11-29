import { Inject, Injectable } from "@nestjs/common";
import { RetrieveUserBy } from "../../contracts";
import { IUserRepo } from "../../domain/repos";
import { UserNotFoundError } from "../../errors";
import { USER_REPO } from "../../tokens";

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepo) {}

  async deleteUser(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError(id, RetrieveUserBy.ID);
    }

    await this.userRepo.deleteById(id);

    return {
      id,
    };
  }
}
