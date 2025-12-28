import { Module } from "@nestjs/common";
import { UserDatabaseModule } from "../infra/db/user-database.module";
import servicesProviders from "./services/service.providers";
import useCasesProviders from "./use-cases/use-case.provider";

const PROVIDERS = [...servicesProviders, ...useCasesProviders];

@Module({
  imports: [UserDatabaseModule],
  providers: PROVIDERS,
  exports: [UserDatabaseModule, ...servicesProviders, ...useCasesProviders]
})
export class UserApplicationModule {}
