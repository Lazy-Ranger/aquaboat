import { Module } from "@nestjs/common";
import { UserDatabaseModule } from "../infra/db/user-database.module";
import { UserService } from "./services";

const PROVIDERS = [UserService];

@Module({
  imports: [UserDatabaseModule],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserApplicationModule {}
