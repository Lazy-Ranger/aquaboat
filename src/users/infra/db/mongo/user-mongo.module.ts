import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_REPO } from "../../../tokens";
import { UserMongoMapper } from "./mappers/user-mongo.mapper";
import { UserMongoRepo } from "./repos/user.mongo.repo";
import { USER_MODEL, UserSchemaDef } from "./schemas";

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchemaDef,
  },
];

const PROVIDERS: Provider[] = [
  UserMongoMapper,
  {
    provide: USER_REPO,
    useClass: UserMongoRepo,
  },
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserMongoModule {}
