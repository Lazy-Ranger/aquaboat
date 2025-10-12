import { Module, Provider } from "@nestjs/common";
import { UserService } from "./application/services/user.service";
import { UserController } from "./entry-points/http/controllers/user.controller";
import { UserDatabaseModule } from "./infra/db/user-database.module";

const PROVIDERS: Provider[] = [UserService];

@Module({
  imports: [UserDatabaseModule],
  controllers: [UserController],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserModule {}
