import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL, UserSchemaDef } from "./schemas";

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchemaDef,
  },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class UserMongoModule {}
