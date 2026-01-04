import { Module } from "@nestjs/common";
import { UserApplicationModule } from "./application/user-application.module";
import { UserHttpEntryPointModule } from "./entry-points/http/user-http-entry-point.module";

@Module({
  imports: [UserApplicationModule, UserHttpEntryPointModule],
  exports: [UserApplicationModule]
})
export class UserModule {}
