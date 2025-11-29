import { Module } from "@nestjs/common";
import { UserDatabaseModule } from "../infra/db/user-database.module";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  RetrieveUserUseCase,
  UpdateUserUseCase,
} from "./use-cases";

const PROVIDERS = [
  DeleteUserUseCase,
  RetrieveUserUseCase,
  UpdateUserUseCase,
  CreateUserUseCase,
];

@Module({
  imports: [UserDatabaseModule],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class UserApplicationModule {}
