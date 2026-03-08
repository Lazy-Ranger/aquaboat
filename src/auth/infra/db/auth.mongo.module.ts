import { Module } from "@nestjs/common";
import { AuthMongoModule } from "./mongo/auth-mongo.module";

@Module({
  imports: [AuthMongoModule],
  exports: [AuthMongoModule]
})
export class AuthDatabaseModule {}
