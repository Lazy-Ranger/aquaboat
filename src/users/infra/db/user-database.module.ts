import { Module } from "@nestjs/common";
import { UserMongoModule } from "./mongo/user-mongo.module";

@Module({
  imports: [UserMongoModule],
  exports: [UserMongoModule],
})
export class UserDatabaseModule {}
