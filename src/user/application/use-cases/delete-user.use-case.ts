import { Inject, Injectable } from "@nestjs/common";
import { IUserDeleteResult, RetrieveUserBy } from "../../contracts";
import { IUserRepo } from "../../domain/repos";
import { USER_REPO } from "../../tokens";
import { RetrieveUserUseCase } from "./retrieve-user.use-case";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPO) private readonly userRepo: IUserRepo,
    private readonly retrieveUserUC: RetrieveUserUseCase
  ) {}

  async execute(id: string): Promise<IUserDeleteResult> {
    await this.retrieveUserUC.execute({
      by: RetrieveUserBy.ID,
      value: id
    });

    await this.userRepo.deleteById(id);

    return {
      id,
      deleted: true
    };
  }
}
