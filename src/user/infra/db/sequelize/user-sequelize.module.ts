import { Module, Provider } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { USER_REPO } from "../../../tokens";
import { UserSequelizeMapper } from "./mappers/user-sequelize.mapper";
import { UserModel } from "./models";
import { UserSequelizeRepo } from "./repos/user.sequelize.repo";

const MODELS = [UserModel];

const PROVIDERS: Provider[] = [
  UserSequelizeMapper,
  {
    provide: USER_REPO,
    useClass: UserSequelizeRepo,
  },
];

@Module({
  imports: [SequelizeModule.forFeature(MODELS)],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserSequelizeModule {}
